import { useParams, Link, useNavigate } from 'react-router-dom'
import { Clock, FileText, CheckCircle, ChevronRight, Shield, Users, Award } from 'lucide-react'

interface ServiceInfo {
  slug: string
  title: string
  description: string
  longDescription: string
  category: string
  price: number | 'contact'
  timeline: string
  documents: string[]
  process: { step: number; title: string; description: string }[]
  benefits: string[]
  faq: { question: string; answer: string }[]
}

const servicesData: Record<string, ServiceInfo> = {
  gst: {
    slug: 'gst',
    title: 'GST Registration',
    description: 'Fast-track your tax registration with end-to-end expert assistance.',
    longDescription: 'Get your business GST registered quickly and efficiently. Our experts handle the entire process from document collection to certificate issuance, ensuring full compliance with government regulations.',
    category: 'Tax',
    price: 49,
    timeline: '3-7 working days',
    documents: [
      'PAN Card of Business/Owner',
      'Aadhaar Card of Proprietor/Partners/Directors',
      'Proof of Business Address',
      'Bank Account Statement/Cancelled Cheque',
      'Photograph of Proprietor/Partners/Directors',
      'Business Registration Certificate (if applicable)'
    ],
    process: [
      { step: 1, title: 'Submit Documents', description: 'Upload all required documents through our secure portal' },
      { step: 2, title: 'Application Filing', description: 'Our experts file your GST application with accurate details' },
      { step: 3, title: 'Verification', description: 'Track ARN status and respond to any queries' },
      { step: 4, title: 'Certificate Issued', description: 'Receive your GSTIN and registration certificate' }
    ],
    benefits: [
      'Legal recognition for your business',
      'Input Tax Credit eligibility',
      'Expand business across India',
      'Build credibility with customers',
      'Access to government tenders'
    ],
    faq: [
      { question: 'Who needs GST Registration?', answer: 'Businesses with turnover exceeding ₹40 lakhs (₹20 lakhs for services) or those involved in inter-state supply must register for GST.' },
      { question: 'What is the validity of GST Registration?', answer: 'GST Registration is valid until cancelled. However, you must file regular returns to keep it active.' },
      { question: 'Can I register voluntarily?', answer: 'Yes, even if your turnover is below the threshold, you can voluntarily register to claim Input Tax Credit.' }
    ]
  },
  fssai: {
    slug: 'fssai',
    title: 'FSSAI Registration',
    description: 'Food safety certification for your food business.',
    longDescription: 'Obtain your FSSAI license to legally operate your food business. We help you determine the right type of license and handle the complete registration process.',
    category: 'Licensing',
    price: 65,
    timeline: '7-15 working days',
    documents: [
      'Identity Proof (Aadhaar/PAN)',
      'Passport size photograph',
      'Proof of Business Premises',
      'List of Food Products',
      'Food Safety Management Plan',
      'NOC from Municipality (if applicable)'
    ],
    process: [
      { step: 1, title: 'Determine License Type', description: 'We assess whether you need Basic, State, or Central license' },
      { step: 2, title: 'Document Collection', description: 'Gather and verify all required documents' },
      { step: 3, title: 'Application Submission', description: 'File application on FSSAI portal' },
      { step: 4, title: 'License Issued', description: 'Receive your 14-digit FSSAI license number' }
    ],
    benefits: [
      'Legal compliance for food business',
      'Consumer trust and credibility',
      'Access to larger markets',
      'Avoid hefty penalties',
      'Required for food product labeling'
    ],
    faq: [
      { question: 'Which license do I need?', answer: 'Basic registration for turnover up to ₹12 lakhs, State license for ₹12-20 crores, Central license for above ₹20 crores.' },
      { question: 'How long is FSSAI license valid?', answer: 'FSSAI license is valid for 1-5 years based on your choice at the time of application.' },
      { question: 'Can I operate without FSSAI?', answer: 'No, operating a food business without FSSAI license can result in penalties up to ₹5 lakhs.' }
    ]
  },
  'pf-esi': {
    slug: 'pf-esi',
    title: 'PF/ESI Registration',
    description: 'Employee benefits registration for your workforce.',
    longDescription: 'Register your establishment for Provident Fund and Employee State Insurance to provide social security benefits to your employees while staying compliant with labor laws.',
    category: 'Labour',
    price: 79,
    timeline: '5-10 working days',
    documents: [
      'PAN Card of Establishment',
      'Certificate of Incorporation',
      'Address Proof of Establishment',
      'Bank Account Details',
      'Employee Details (Aadhaar, PAN)',
      'Salary Register'
    ],
    process: [
      { step: 1, title: 'Eligibility Check', description: 'Verify if your establishment requires PF/ESI registration' },
      { step: 2, title: 'Document Preparation', description: 'Collect and organize all required documents' },
      { step: 3, title: 'Online Registration', description: 'Complete registration on EPFO and ESIC portals' },
      { step: 4, title: 'Codes Allotted', description: 'Receive your PF and ESI establishment codes' }
    ],
    benefits: [
      'Legal compliance with labor laws',
      'Retirement security for employees',
      'Medical benefits through ESI',
      'Attract and retain talent',
      'Avoid penalties and legal issues'
    ],
    faq: [
      { question: 'When is PF registration mandatory?', answer: 'Establishments with 20 or more employees must register for PF.' },
      { question: 'What is the ESI threshold?', answer: 'ESI applies to employees earning up to ₹21,000/month in establishments with 10+ employees.' },
      { question: 'What are the contribution rates?', answer: 'PF: 12% each from employer and employee. ESI: 3.25% employer + 0.75% employee.' }
    ]
  },
  'trade-license': {
    slug: 'trade-license',
    title: 'Trade License',
    description: 'Get your business license for legal operation.',
    longDescription: 'Obtain a trade license from your local municipal corporation to legally operate your business. We handle the complete process including document preparation and follow-ups.',
    category: 'Licensing',
    price: 120,
    timeline: '15-30 working days',
    documents: [
      'Identity Proof of Owner',
      'Address Proof of Business Premises',
      'Rent Agreement/Ownership Proof',
      'Passport size photographs',
      'NOC from Landlord',
      'PAN Card'
    ],
    process: [
      { step: 1, title: 'Application Preparation', description: 'Complete application form with accurate details' },
      { step: 2, title: 'Document Submission', description: 'Submit documents to municipal office' },
      { step: 3, title: 'Inspection', description: 'Municipal inspector verifies business premises' },
      { step: 4, title: 'License Issued', description: 'Collect your trade license certificate' }
    ],
    benefits: [
      'Legal authorization to operate',
      'Avoid fines and business closure',
      'Required for bank loans',
      'Build business credibility',
      'Necessary for other registrations'
    ],
    faq: [
      { question: 'Is trade license mandatory?', answer: 'Yes, every business operating within municipal limits needs a valid trade license.' },
      { question: 'What is the validity period?', answer: 'Trade license is typically valid for 1 year and needs annual renewal.' },
      { question: 'What happens without a license?', answer: 'Operating without a license can result in fines, penalties, and business closure.' }
    ]
  },
  'income-tax': {
    slug: 'income-tax',
    title: 'Income Tax Filing',
    description: 'Accurate and timely tax filing for businesses.',
    longDescription: 'Let our tax experts handle your income tax filing with precision. We ensure maximum deductions, timely filing, and complete compliance with income tax regulations.',
    category: 'Tax',
    price: 150,
    timeline: '2-5 working days',
    documents: [
      'PAN Card',
      'Aadhaar Card',
      'Form 16/16A',
      'Bank Statements',
      'Investment Proofs',
      'Previous Year ITR (if applicable)'
    ],
    process: [
      { step: 1, title: 'Document Collection', description: 'Gather all income and deduction proofs' },
      { step: 2, title: 'Computation', description: 'Calculate taxable income and applicable deductions' },
      { step: 3, title: 'Filing', description: 'E-file your return on the income tax portal' },
      { step: 4, title: 'Acknowledgment', description: 'Receive ITR-V and filing confirmation' }
    ],
    benefits: [
      'Avoid penalties for late filing',
      'Claim all eligible deductions',
      'Maintain financial records',
      'Easy loan and visa processing',
      'Carry forward losses'
    ],
    faq: [
      { question: 'What is the due date for filing?', answer: 'July 31st for individuals, October 31st for businesses requiring audit.' },
      { question: 'Which ITR form should I use?', answer: 'It depends on your income sources. Our experts will determine the correct form for you.' },
      { question: 'Can I revise my return?', answer: 'Yes, returns can be revised within the specified time limit if you discover any errors.' }
    ]
  },
  'payroll': {
    slug: 'payroll',
    title: 'Payroll Management',
    description: 'Automated payroll processing for your team.',
    longDescription: 'Streamline your payroll with our comprehensive management service. From salary computation to statutory compliance, we handle everything so you can focus on growing your business.',
    category: 'HR',
    price: 99,
    timeline: 'Monthly service',
    documents: [
      'Employee Master Data',
      'Attendance Records',
      'Salary Structure',
      'Bank Account Details',
      'PF/ESI Registration Details',
      'TDS Deduction Details'
    ],
    process: [
      { step: 1, title: 'Setup', description: 'Configure your company payroll structure' },
      { step: 2, title: 'Monthly Processing', description: 'Calculate salaries, deductions, and net pay' },
      { step: 3, title: 'Compliance', description: 'Handle PF, ESI, TDS deposits and returns' },
      { step: 4, title: 'Reports', description: 'Generate payslips and compliance reports' }
    ],
    benefits: [
      'Error-free salary processing',
      'Automatic statutory compliance',
      'Time savings for HR team',
      'Employee self-service portal',
      'Detailed payroll analytics'
    ],
    faq: [
      { question: 'How many employees can you handle?', answer: 'We can manage payroll for businesses of any size, from 5 to 5000+ employees.' },
      { question: 'Is data secure?', answer: 'Yes, we use bank-grade encryption and follow strict data protection protocols.' },
      { question: 'What about statutory compliance?', answer: 'We handle all statutory filings including PF, ESI, PT, and TDS automatically.' }
    ]
  }
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const service = slug ? servicesData[slug] : null

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <Link to="/services" className="text-primary font-semibold hover:underline">
            ← Back to Services
          </Link>
        </div>
      </div>
    )
  }

  const handleStartService = () => {
    // Redirect to login with return URL to service intake
    navigate(`/login`, { state: { from: `/dashboard/services/new?type=${service.slug}` } })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">HV Consultancy</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
              <Link to="/services" className="text-primary font-semibold">Services</Link>
              <a href="#" className="text-gray-700 hover:text-primary font-medium">About</a>
              <a href="#" className="text-gray-700 hover:text-primary font-medium">Contact</a>
            </nav>
          </div>
          <Link 
            to="/login"
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/services" className="hover:text-primary">Services</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{service.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {service.category}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{service.longDescription}</p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{service.timeline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">100% Compliance Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Expert Support</span>
                </div>
              </div>

              <button
                onClick={handleStartService}
                className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
              >
                Start This Service →
              </button>
            </div>

            {/* Pricing Card */}
            <div className="lg:w-80">
              <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white">
                <div className="text-sm font-medium opacity-80 mb-2">Starting at</div>
                {service.price === 'contact' ? (
                  <div className="text-3xl font-bold mb-4">Contact Us</div>
                ) : (
                  <div className="text-4xl font-bold mb-4">₹{service.price}<span className="text-lg font-normal opacity-80">/service</span></div>
                )}
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Expert Assistance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Document Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Status Tracking</span>
                  </li>
                </ul>
                <button
                  onClick={handleStartService}
                  className="w-full py-3 bg-white text-primary rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {service.process.map((step, index) => (
              <div key={step.step} className="relative">
                {index < service.process.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2"></div>
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Documents Required */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              Documents Required
            </h2>
            <ul className="space-y-3">
              {service.documents.map((doc, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-primary" />
              Benefits
            </h2>
            <ul className="space-y-3">
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {service.faq.map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Join hundreds of businesses who have simplified their compliance with HV Consultancy.
          </p>
          <button
            onClick={handleStartService}
            className="px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
          >
            Start {service.title} Now →
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <span className="font-bold text-gray-900">HV Consultancy</span>
            </div>
            <p className="text-sm text-gray-500">© 2026 HV Consultancy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
