-- ============================================================
-- HV Consultancy – Supabase Database Schema
-- Roles: admin | client
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. PROFILES (extends auth.users)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  email       TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT        NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─────────────────────────────────────────────
-- 2. SERVICES CATALOGUE (Admin-managed list)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        UNIQUE NOT NULL,
  name        TEXT        NOT NULL,
  description TEXT,
  category    TEXT,
  icon        TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────────
-- 3. SERVICE REQUESTS (Client submissions)
-- ─────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.request_status AS ENUM (
    'submitted',
    'in_review',
    'in_progress',
    'completed',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.service_requests (
  id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID           NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id   UUID           NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  status       request_status NOT NULL DEFAULT 'submitted',
  form_data    JSONB          NOT NULL DEFAULT '{}'::jsonb,
  notes        TEXT,
  admin_notes  TEXT,                          -- only visible to admin
  assigned_to  UUID           REFERENCES public.profiles(id),  -- admin assigned
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─────────────────────────────────────────────
-- 4. DOCUMENTS (files uploaded per request)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.documents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID        NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  uploaded_by UUID        NOT NULL REFERENCES public.profiles(id),
  file_name   TEXT        NOT NULL,
  file_url    TEXT        NOT NULL,
  file_type   TEXT,
  file_size   BIGINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────────
-- 5. MESSAGES (per-request thread)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID        NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL REFERENCES public.profiles(id),
  content     TEXT        NOT NULL,
  is_internal BOOLEAN     NOT NULL DEFAULT FALSE,  -- admin-only notes
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ── PROFILES ──
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());


-- ── SERVICES ──
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Only admins can insert services"
  ON public.services FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update services"
  ON public.services FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Only admins can delete services"
  ON public.services FOR DELETE
  USING (public.is_admin());


-- ── SERVICE REQUESTS ──
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own requests"
  ON public.service_requests FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Admins can view all requests"
  ON public.service_requests FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Clients can create own requests"
  ON public.service_requests FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own pending requests"
  ON public.service_requests FOR UPDATE
  USING (auth.uid() = client_id AND status = 'submitted');

CREATE POLICY "Admins can update any request"
  ON public.service_requests FOR UPDATE
  USING (public.is_admin());


-- ── DOCUMENTS ──
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view docs on own requests"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.service_requests r
      WHERE r.id = request_id AND r.client_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all documents"
  ON public.documents FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Users can upload to own requests"
  ON public.documents FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (
      SELECT 1 FROM public.service_requests r
      WHERE r.id = request_id AND r.client_id = auth.uid()
    )
  );

CREATE POLICY "Admins can upload to any request"
  ON public.documents FOR INSERT
  WITH CHECK (public.is_admin());


-- ── MESSAGES ──
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view non-internal messages on own requests"
  ON public.messages FOR SELECT
  USING (
    is_internal = FALSE AND
    EXISTS (
      SELECT 1 FROM public.service_requests r
      WHERE r.id = request_id AND r.client_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Users can send messages on own requests"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    is_internal = FALSE AND
    EXISTS (
      SELECT 1 FROM public.service_requests r
      WHERE r.id = request_id AND r.client_id = auth.uid()
    )
  );

CREATE POLICY "Admins can send any message"
  ON public.messages FOR INSERT
  WITH CHECK (public.is_admin() AND auth.uid() = sender_id);


-- ============================================================
-- SEED: Default admin user (update email after first login)
-- ============================================================
-- After running this schema, create the admin user via Supabase Auth UI
-- then run this to promote them:
--
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
--
-- ============================================================
