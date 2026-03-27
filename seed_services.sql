INSERT INTO public.services (name, slug, description, price, category, is_active) VALUES
('GST Registration', 'gst', 'Get your GST number for tax compliance and start billing legally.', 1499.00, 'Tax & Compliance', true),
('PF/ESI Registration', 'pf-esi', 'Employee benefits registration for companies with 10+ employees.', 1999.00, 'Compliance', true),
('Trade License', 'trade-license', 'Municipal permission to carry out business in your locality.', 1999.00, 'Licenses', true),
('Payroll Management', 'payroll', 'Complete payroll management including salary processing and compliance.', 2499.00, 'HR & Payroll', true),
('Income Tax Filing', 'income-tax', 'Professional ITR filing for individuals and businesses.', 999.00, 'Tax & Compliance', true),
('FSSAI Registration', 'fssai', 'Food safety license required for all food businesses in India.', 2999.00, 'Licenses', true),
('Labour Law Audits', 'labour-audit', 'Comprehensive audits to mitigate legal risks and ensure safety standards.', 0.00, 'Compliance', true),
('Policy Drafting', 'policy-drafting', 'Customized HR policies — handbooks, NDA, Code of Conduct and more.', 4999.00, 'HR & Payroll', true)
ON CONFLICT (slug) DO NOTHING;
