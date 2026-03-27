import React, { useState, useEffect } from 'react'
import { LogIn, ShieldCheck, Lock, Mail, ArrowRight, X, User, Building2, Eye, EyeOff } from 'lucide-react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { z } from 'zod'

// Zod validation schemas
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters')
})

const signUpSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  companyName: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUpLoading, setIsSignUpLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [emailLoginLoading, setEmailLoginLoading] = useState(false)
  
  // Field-level validation errors
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({})
  const [signUpErrors, setSignUpErrors] = useState<{ fullName?: string; email?: string; password?: string; confirmPassword?: string }>({})
  
  // Form states
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  })
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { user, role, loading } = useAuth()
  
  // Redirect if already logged in (wait for role to load if it's not present yet)
  useEffect(() => {
    if (user && !loading && role !== undefined) {
      // If there's a specific "from" location saved in state, go there
      const savedFrom = (location.state as { from?: string })?.from
      
      if (savedFrom) {
        // If an admin tries to access a client-only route, redirect to admin dashboard
        if (role === 'admin' && savedFrom.startsWith('/dashboard')) {
          navigate('/admin', { replace: true })
        } else {
          navigate(savedFrom, { replace: true })
        }
      } else {
        // Otherwise use role-based default routing
        navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true })
      }
    }
  }, [user, role, loading, navigate, location.state])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Store the return URL for after OAuth redirect
      const savedFrom = (location.state as { from?: string })?.from || '/dashboard'
      const redirectUrl = savedFrom.startsWith('/') ? `${window.location.origin}${savedFrom}` : `${window.location.origin}/dashboard`
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      })
      
      if (error) {
        throw error
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google')
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoginErrors({})

    // Validate with Zod
    const validationResult = loginSchema.safeParse({
      email: loginEmail,
      password: loginPassword
    })

    if (!validationResult.success) {
      const fieldErrors: { email?: string; password?: string } = {}
      validationResult.error.issues.forEach((err) => {
        const field = err.path[0] as 'email' | 'password'
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message
        }
      })
      setLoginErrors(fieldErrors)
      return
    }

    setEmailLoginLoading(true)

    try {
      console.log('Attempting login with:', loginEmail)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validationResult.data.email,
        password: validationResult.data.password
      })

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        // Provide more helpful error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials or sign up for a new account.')
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in. Check your inbox for a verification link.')
        } else {
          throw new Error(error.message)
        }
      }
      
      if (data.user) {
        // We don't navigate immediately here. We wait for AuthContext to fetch the role 
        // and trigger the useEffect above which handles the intelligent routing.
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign in. Please try again.')
    } finally {
      setEmailLoginLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError(null)
    setSignUpErrors({})
    setSignUpSuccess(false)

    // Validate with Zod
    const validationResult = signUpSchema.safeParse(signUpData)

    if (!validationResult.success) {
      const fieldErrors: { fullName?: string; email?: string; password?: string; confirmPassword?: string } = {}
      validationResult.error.issues.forEach((err) => {
        const field = err.path[0] as 'fullName' | 'email' | 'password' | 'confirmPassword'
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message
        }
      })
      setSignUpErrors(fieldErrors)
      return
    }

    setIsSignUpLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
            company_name: signUpData.companyName
          }
        }
      })

      if (error) {
        throw error
      }

      // If user is returned and session exists, auto sign-in worked
      if (data.user && data.session) {
        // User is automatically signed in, wait for AuthContext to route
        return
      }

      // If no session but user exists, try to sign in
      if (data.user && !data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: signUpData.email,
          password: signUpData.password
        })

        if (!signInError) {
          // We don't navigate immediately here. We wait for AuthContext to fetch the role 
      // and trigger the useEffect above which handles the intelligent routing.
          return
        }
      }

      setSignUpSuccess(true)
      setSignUpData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: ''
      })
    } catch (err) {
      setSignUpError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setIsSignUpLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsSignUpLoading(true)
    setSignUpError(null)
    
    try {
      // Store the return URL for after OAuth redirect
      const savedFrom = (location.state as { from?: string })?.from || '/dashboard'
      const redirectUrl = savedFrom.startsWith('/') ? `${window.location.origin}${savedFrom}` : `${window.location.origin}/dashboard`
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      })
      
      if (error) {
        throw error
      }
    } catch (err) {
      setSignUpError(err instanceof Error ? err.message : 'Failed to sign up with Google')
      setIsSignUpLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col font-['Manrope']">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <Link to="/" className="flex items-center gap-4 text-primary">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <h2 className="text-gray-900 text-xl font-bold tracking-tight">HV Consultancy</h2>
        </Link>
        <button 
          onClick={() => setShowSignUpModal(true)}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
        >
          Sign Up
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[480px] flex flex-col items-center animate-fade-in">
          {/* Headline */}
          <h1 className="text-gray-900 text-4xl font-bold text-center mb-3">
            Welcome back
          </h1>
          <p className="text-gray-600 text-lg text-center mb-10">
            Digital Compliance Management for Business Owners
          </p>

          {/* Login Card */}
          <div className="w-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-gray-100">
            {/* Icon and Title */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                <LogIn className="w-8 h-8" />
              </div>
              <h3 className="text-gray-900 text-2xl font-bold text-center">
                Login to HV Consultancy
              </h3>
              <p className="text-gray-500 text-sm text-center">
                Manage your compliance effortlessly
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 h-12 px-6 bg-primary text-white rounded-lg font-bold text-base hover:bg-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {/* Email Login Form */}
            {showEmailLogin ? (
              <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value)
                      if (loginErrors.email) setLoginErrors({ ...loginErrors, email: undefined })
                    }}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 rounded-lg border ${loginErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} text-gray-900 focus:ring-2 focus:outline-none`}
                  />
                  {loginErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{loginErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value)
                        if (loginErrors.password) setLoginErrors({ ...loginErrors, password: undefined })
                      }}
                      placeholder="Enter your password"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${loginErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} text-gray-900 focus:ring-2 focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{loginErrors.password}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={emailLoginLoading}
                  className="flex w-full items-center justify-center gap-3 h-12 px-6 bg-primary text-white rounded-lg font-bold text-base hover:bg-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {emailLoginLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Login</span>
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowEmailLogin(false)}
                  className="text-gray-500 text-sm font-semibold hover:text-primary transition-colors"
                >
                  Back to other options
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setShowEmailLogin(true)}
                className="text-primary text-sm font-semibold hover:underline transition-colors flex items-center justify-center gap-2"
              >
                Use email and password
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <button 
                onClick={() => setShowSignUpModal(true)}
                className="text-primary font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-gray-50/50 p-4 items-center transition-all hover:bg-gray-50 hover:border-gray-200">
                <ShieldCheck className="text-primary w-6 h-6" />
                <h4 className="text-gray-900 text-xs font-bold text-center">Secure Login</h4>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-gray-50/50 p-4 items-center transition-all hover:bg-gray-50 hover:border-gray-200">
                <Lock className="text-primary w-6 h-6" />
                <h4 className="text-gray-900 text-xs font-bold text-center">Privacy Guaranteed</h4>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <footer className="mt-8 flex flex-wrap justify-center gap-6 px-4">
            <a href="#" className="text-gray-500 text-xs hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 text-xs hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 text-xs hover:text-primary transition-colors">
              Contact Support
            </a>
          </footer>
        </div>
      </main>

      {/* Background Gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-64 -z-10 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
      
      {/* Floating Shapes */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-10 -z-10 animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-10 -z-10 animate-pulse delay-75"></div>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowSignUpModal(false)
              setSignUpError(null)
              setSignUpSuccess(false)
            }}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowSignUpModal(false)
                setSignUpError(null)
                setSignUpSuccess(false)
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-gray-900 text-2xl font-bold text-center">
                  Create an Account
                </h3>
                <p className="text-gray-500 text-sm text-center">
                  Join HV Consultancy and simplify your compliance
                </p>
              </div>

              {/* Success Message */}
              {signUpSuccess && (
                <div className="w-full p-4 mb-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
                  <p className="font-semibold">Account created successfully!</p>
                  <p className="mt-1">Please check your email to verify your account.</p>
                </div>
              )}

              {/* Error Message */}
              {signUpError && (
                <div className="w-full p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                  {signUpError}
                </div>
              )}

              {!signUpSuccess && (
                <>
                  {/* Google Sign Up Button */}
                  <button
                    onClick={handleGoogleSignUp}
                    disabled={isSignUpLoading}
                    className="flex w-full items-center justify-center gap-3 h-12 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-bold text-base hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {isSignUpLoading ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span>Sign up with Google</span>
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-4 py-4">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">or</span>
                    <div className="h-px flex-1 bg-gray-200"></div>
                  </div>

                  {/* Sign Up Form */}
                  <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={signUpData.fullName}
                          onChange={(e) => {
                            setSignUpData({ ...signUpData, fullName: e.target.value })
                            if (signUpErrors.fullName) setSignUpErrors({ ...signUpErrors, fullName: undefined })
                          }}
                          placeholder="John Doe"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${signUpErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} text-gray-900 focus:ring-2 focus:outline-none`}
                        />
                      </div>
                      {signUpErrors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{signUpErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={signUpData.companyName}
                          onChange={(e) => setSignUpData({ ...signUpData, companyName: e.target.value })}
                          placeholder="Your Company"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={signUpData.email}
                          onChange={(e) => {
                            setSignUpData({ ...signUpData, email: e.target.value })
                            if (signUpErrors.email) setSignUpErrors({ ...signUpErrors, email: undefined })
                          }}
                          placeholder="you@example.com"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${signUpErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} text-gray-900 focus:ring-2 focus:outline-none`}
                        />
                      </div>
                      {signUpErrors.email && (
                        <p className="mt-1 text-sm text-red-500">{signUpErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          value={signUpData.password}
                          onChange={(e) => {
                            setSignUpData({ ...signUpData, password: e.target.value })
                            if (signUpErrors.password) setSignUpErrors({ ...signUpErrors, password: undefined })
                          }}
                          placeholder="Min. 6 characters"
                          className={`w-full pl-10 pr-12 py-3 rounded-lg border ${signUpErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} text-gray-900 focus:ring-2 focus:outline-none`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {signUpErrors.password && (
                        <p className="mt-1 text-sm text-red-500">{signUpErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={signUpData.confirmPassword}
                          onChange={(e) => {
                            setSignUpData({ ...signUpData, confirmPassword: e.target.value })
                            if (signUpErrors.confirmPassword) setSignUpErrors({ ...signUpErrors, confirmPassword: undefined })
                          }}
                          placeholder="Confirm your password"
                          className={`w-full pl-10 pr-12 py-3 rounded-lg border ${signUpErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} text-gray-900 focus:ring-2 focus:outline-none`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {signUpErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{signUpErrors.confirmPassword}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSignUpLoading}
                      className="flex w-full items-center justify-center gap-3 h-12 px-6 bg-primary text-white rounded-lg font-bold text-base hover:bg-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {isSignUpLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </form>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{' '}
                    <button 
                      onClick={() => {
                        setShowSignUpModal(false)
                        setSignUpError(null)
                      }}
                      className="text-primary font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </>
              )}

              {signUpSuccess && (
                <button
                  onClick={() => {
                    setShowSignUpModal(false)
                    setSignUpSuccess(false)
                  }}
                  className="flex w-full items-center justify-center gap-3 h-12 px-6 bg-primary text-white rounded-lg font-bold text-base hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
                >
                  Continue to Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}