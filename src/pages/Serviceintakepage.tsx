import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
    ChevronLeft, ChevronRight, Check, Upload, X, FileText,
    Clock, Shield, CheckCircle, AlertCircle, Loader2,
    Building2, User, Phone, Mail, MapPin, Hash, ArrowLeft
} from 'lucide-react'

// ==================== SERVICE DATA ====================

interface ServiceOption {
    id: string
    slug: string
    title: string
    description: string
    category: string
    price: string
    timeline: string
    icon: string
    documents: string[]
}

const SERVICES: ServiceOption[] = [
    {
        id: 'gst', slug: 'gst',
        title: 'GST Registration',
        description: 'Get your GST number for tax compliance and start billing legally.',
        category: 'Tax & Compliance', price: '₹1,499', timeline: '3-7 working days', icon: '📊',
        documents: ['PAN Card of Business/Owner', 'Aadhaar Card', 'Proof of Business Address', 'Bank Statement / Cancelled Cheque', 'Photograph of Proprietor', 'Business Registration Certificate']
    },
    {
        id: 'pf-esi', slug: 'pf-esi',
        title: 'PF/ESI Registration',
        description: 'Employee benefits registration for companies with 10+ employees.',
        category: 'Compliance', price: '₹1,999', timeline: '5-10 working days', icon: '👥',
        documents: ['PAN Card of Establishment', 'Certificate of Incorporation', 'Address Proof', 'Bank Account Details', 'Employee Details (Aadhaar, PAN)', 'Salary Register']
    },
    {
        id: 'trade-license', slug: 'trade-license',
        title: 'Trade License',
        description: 'Municipal permission to carry out business in your locality.',
        category: 'Licenses', price: '₹1,999', timeline: '15-30 working days', icon: '🏪',
        documents: ['Identity Proof of Owner', 'Address Proof of Premises', 'Rent Agreement / Ownership Proof', 'Passport size photographs', 'NOC from Landlord', 'PAN Card']
    },
    {
        id: 'payroll', slug: 'payroll',
        title: 'Payroll Management',
        description: 'Complete payroll management including salary processing and compliance.',
        category: 'HR & Payroll', price: '₹2,499/mo', timeline: 'Ongoing service', icon: '📋',
        documents: ['Employee Master Data', 'Attendance Records', 'Salary Structure', 'Bank Account Details', 'PF/ESI Registration Details', 'TDS Deduction Details']
    },
    {
        id: 'income-tax', slug: 'income-tax',
        title: 'Income Tax Filing',
        description: 'Professional ITR filing for individuals and businesses.',
        category: 'Tax & Compliance', price: '₹999', timeline: '2-5 working days', icon: '💰',
        documents: ['PAN Card', 'Aadhaar Card', 'Form 16/16A', 'Bank Statements', 'Investment Proofs', 'Previous Year ITR']
    },
    {
        id: 'fssai', slug: 'fssai',
        title: 'FSSAI Registration',
        description: 'Food safety license required for all food businesses in India.',
        category: 'Licenses', price: '₹2,999', timeline: '7-15 working days', icon: '🍽️',
        documents: ['Identity Proof (Aadhaar/PAN)', 'Passport size photograph', 'Proof of Business Premises', 'List of Food Products', 'Food Safety Management Plan', 'NOC from Municipality']
    },
    {
        id: 'labour-audit', slug: 'labour-audit',
        title: 'Labour Law Audits',
        description: 'Comprehensive audits to mitigate legal risks and ensure safety standards.',
        category: 'Compliance', price: 'Contact Us', timeline: 'Custom timeline', icon: '⚖️',
        documents: ['Employee records', 'Wage registers', 'Leave records', 'Safety inspection reports', 'Current compliance certificates', 'Previous audit reports']
    },
    {
        id: 'policy-drafting', slug: 'policy-drafting',
        title: 'Policy Drafting',
        description: 'Customized HR policies — handbooks, NDA, Code of Conduct and more.',
        category: 'HR & Payroll', price: '₹4,999', timeline: '10-15 working days', icon: '📝',
        documents: ['Company structure details', 'Existing policy documents', 'Industry-specific requirements', 'Employee handbook (if any)', 'Compliance requirements list', 'Organizational chart']
    }
]

// ==================== TYPES ====================

interface BusinessDetails {
    fullName: string
    email: string
    phone: string
    companyName: string
    gstNumber: string
    address: string
    city: string
    state: string
    pincode: string
    additionalNotes: string
}

interface UploadedFile {
    id: string
    name: string
    size: string
    type: string
    file: File
}

type Step = 1 | 2 | 3 | 4

// ==================== COMPONENT ====================

export default function ServiceIntakePage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const preselectedType = searchParams.get('type') || ''

    // State
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedType)
    const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
        companyName: user?.user_metadata?.company_name || '',
        gstNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        additionalNotes: ''
    })
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submittedId, setSubmittedId] = useState<string>('')

    // Auto-advance if service pre-selected
    useEffect(() => {
        if (preselectedType && SERVICES.find(s => s.slug === preselectedType)) {
            setSelectedServiceId(preselectedType)
            setCurrentStep(2)
        }
    }, [preselectedType])

    // Pre-fill from user metadata
    useEffect(() => {
        if (user) {
            setBusinessDetails(prev => ({
                ...prev,
                fullName: prev.fullName || user.user_metadata?.full_name || '',
                email: prev.email || user.email || '',
                phone: prev.phone || user.user_metadata?.phone || '',
                companyName: prev.companyName || user.user_metadata?.company_name || ''
            }))
        }
    }, [user])

    const selectedService = SERVICES.find(s => s.id === selectedServiceId)

    // ==================== STEP NAVIGATION ====================

    const steps = [
        { num: 1, label: 'Select Service' },
        { num: 2, label: 'Business Details' },
        { num: 3, label: 'Documents' },
        { num: 4, label: 'Review & Submit' }
    ]

    const validateStep = (step: Step): boolean => {
        const newErrors: Record<string, string> = {}

        if (step === 1) {
            if (!selectedServiceId) newErrors.service = 'Please select a service'
        }

        if (step === 2) {
            if (!businessDetails.fullName.trim()) newErrors.fullName = 'Full name is required'
            if (!businessDetails.email.trim()) newErrors.email = 'Email is required'
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessDetails.email)) newErrors.email = 'Invalid email address'
            if (!businessDetails.phone.trim()) newErrors.phone = 'Phone number is required'
            else if (!/^[0-9]{10}$/.test(businessDetails.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter a valid 10-digit number'
            if (!businessDetails.companyName.trim()) newErrors.companyName = 'Company name is required'
            if (!businessDetails.city.trim()) newErrors.city = 'City is required'
            if (!businessDetails.state.trim()) newErrors.state = 'State is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const goNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4) as Step)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const goBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1) as Step)
        setErrors({})
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ==================== FILE HANDLING ====================

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newFiles: UploadedFile[] = Array.from(files).map(file => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size < 1024 * 1024
                ? (file.size / 1024).toFixed(1) + ' KB'
                : (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            type: file.name.split('.').pop()?.toLowerCase() || 'file',
            file
        }))

        setUploadedFiles(prev => [...prev, ...newFiles])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeFile = (fileId: string) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    }

    const getFileIconColor = (type: string) => {
        const colors: Record<string, string> = {
            pdf: 'bg-red-100 text-red-600',
            docx: 'bg-blue-100 text-blue-600',
            doc: 'bg-blue-100 text-blue-600',
            xlsx: 'bg-green-100 text-green-600',
            xls: 'bg-green-100 text-green-600',
            png: 'bg-purple-100 text-purple-600',
            jpg: 'bg-purple-100 text-purple-600',
            jpeg: 'bg-purple-100 text-purple-600',
            zip: 'bg-yellow-100 text-yellow-600'
        }
        return colors[type] || 'bg-gray-100 text-gray-600'
    }

    // ==================== SUBMIT ====================

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return
        if (!selectedService || !user) return

        setIsSubmitting(true)
        try {
            // Get actual service UUID from DB using slug
            const { data: serviceRecord, error: serviceError } = await supabase
                .from('services')
                .select('id')
                .eq('slug', selectedService.slug)
                .single()
                
            if (serviceError || !serviceRecord) {
                console.error("Service not found in database. You might need to seed the database first!", serviceError)
                throw new Error("Service not configured in database yet.")
            }

            // Insert service request into Supabase using correct schema
            const { data, error } = await supabase
                .from('service_requests')
                .insert({
                    client_id: user.id,
                    service_id: serviceRecord.id,
                    status: 'submitted',
                    form_data: {
                        full_name: businessDetails.fullName,
                        email: businessDetails.email,
                        phone: businessDetails.phone,
                        company_name: businessDetails.companyName,
                        gst_number: businessDetails.gstNumber || null,
                        address: businessDetails.address || null,
                        city: businessDetails.city,
                        state: businessDetails.state,
                        pincode: businessDetails.pincode || null,
                        additional_notes: businessDetails.additionalNotes || null,
                        documents_count: uploadedFiles.length,
                    }
                })
                .select('id')
                .single()

            if (error) throw error

            // Upload files to Supabase Storage
            if (uploadedFiles.length > 0) {
                for (const uploadedFile of uploadedFiles) {
                    const filePath = `${user.id}/${data.id}/${uploadedFile.name}`
                    const { error: uploadError } = await supabase.storage
                        .from('service-documents')
                        .upload(filePath, uploadedFile.file)
                    
                    if (uploadError) throw uploadError
                }
            }

            setSubmittedId(data.id)
            setIsSubmitted(true)
        } catch (err) {
            console.error('Submission error:', err)
            // Removed the fake success fallback. Now we alert the error
            alert(err instanceof Error ? err.message : 'Error submitting request. Check the console.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // ==================== RENDER: SUCCESS ====================

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-2xl mx-auto px-6 py-16">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Service Request Submitted!</h1>
                        <p className="text-lg text-gray-600 mb-2">
                            Your request for <span className="font-semibold text-primary">{selectedService?.title}</span> has been received.
                        </p>
                        <p className="text-sm text-gray-500 mb-8">
                            Reference ID: <span className="font-mono font-semibold text-gray-700">{submittedId}</span>
                        </p>

                        <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                What happens next?
                            </h3>
                            <ul className="space-y-2.5">
                                <li className="flex items-start gap-3 text-sm text-gray-700">
                                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                    Our team will review your request within 24 hours.
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-700">
                                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                    You'll receive a confirmation email at <span className="font-medium">{businessDetails.email}</span>.
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-700">
                                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                    A dedicated consultant will be assigned to handle your case.
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-700">
                                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                                    Track progress from your dashboard anytime.
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    setIsSubmitted(false)
                                    setCurrentStep(1)
                                    setSelectedServiceId('')
                                    setBusinessDetails({
                                        fullName: user?.user_metadata?.full_name || '',
                                        email: user?.email || '',
                                        phone: '', companyName: '', gstNumber: '',
                                        address: '', city: '', state: '', pincode: '', additionalNotes: ''
                                    })
                                    setUploadedFiles([])
                                    setErrors({})
                                }}
                                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Submit Another Request
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // ==================== RENDER: FORM ====================

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Back to dashboard */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Start a New Service</h1>
                    <p className="text-gray-600">Complete the form below to submit your service request. Our team will get back to you within 24 hours.</p>
                </div>

                {/* Step Indicator */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.num} className="flex items-center flex-1">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep > step.num
                                                ? 'bg-green-500 text-white'
                                                : currentStep === step.num
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >
                                        {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className={`text-sm font-semibold ${currentStep >= step.num ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                            {step.label}
                                        </div>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-4 rounded ${currentStep > step.num ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    {/* ====== STEP 1: Select Service ====== */}
                    {currentStep === 1 && (
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Choose a Service</h2>
                            <p className="text-gray-600 mb-6">Select the compliance service you need help with.</p>
                            {errors.service && (
                                <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 px-4 py-2 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.service}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {SERVICES.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => {
                                            setSelectedServiceId(service.id)
                                            setErrors({})
                                        }}
                                        className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${selectedServiceId === service.id
                                                ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                                                : 'border-gray-200 hover:border-primary/40'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                                {service.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-bold text-gray-900">{service.title}</h3>
                                                    {selectedServiceId === service.id && (
                                                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {service.timeline}
                                                    </span>
                                                    <span className="font-semibold text-primary">{service.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ====== STEP 2: Business Details ====== */}
                    {currentStep === 2 && (
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Business Details</h2>
                            <p className="text-gray-600 mb-6">Provide your business information for the {selectedService?.title} service.</p>

                            <div className="space-y-6">
                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            icon={<User className="w-4 h-4" />}
                                            label="Full Name"
                                            required
                                            value={businessDetails.fullName}
                                            error={errors.fullName}
                                            onChange={v => setBusinessDetails(p => ({ ...p, fullName: v }))}
                                            placeholder="Enter your full name"
                                        />
                                        <InputField
                                            icon={<Mail className="w-4 h-4" />}
                                            label="Email Address"
                                            required
                                            type="email"
                                            value={businessDetails.email}
                                            error={errors.email}
                                            onChange={v => setBusinessDetails(p => ({ ...p, email: v }))}
                                            placeholder="you@company.com"
                                        />
                                        <InputField
                                            icon={<Phone className="w-4 h-4" />}
                                            label="Phone Number"
                                            required
                                            type="tel"
                                            value={businessDetails.phone}
                                            error={errors.phone}
                                            onChange={v => setBusinessDetails(p => ({ ...p, phone: v }))}
                                            placeholder="10-digit mobile number"
                                        />
                                        <InputField
                                            icon={<Building2 className="w-4 h-4" />}
                                            label="Company / Business Name"
                                            required
                                            value={businessDetails.companyName}
                                            error={errors.companyName}
                                            onChange={v => setBusinessDetails(p => ({ ...p, companyName: v }))}
                                            placeholder="Your business name"
                                        />
                                    </div>
                                </div>

                                {/* Business Info */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Business Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            icon={<Hash className="w-4 h-4" />}
                                            label="GST Number"
                                            value={businessDetails.gstNumber}
                                            onChange={v => setBusinessDetails(p => ({ ...p, gstNumber: v }))}
                                            placeholder="Optional — if already registered"
                                        />
                                        <InputField
                                            icon={<MapPin className="w-4 h-4" />}
                                            label="Business Address"
                                            value={businessDetails.address}
                                            onChange={v => setBusinessDetails(p => ({ ...p, address: v }))}
                                            placeholder="Street address"
                                        />
                                        <InputField
                                            icon={<MapPin className="w-4 h-4" />}
                                            label="City"
                                            required
                                            value={businessDetails.city}
                                            error={errors.city}
                                            onChange={v => setBusinessDetails(p => ({ ...p, city: v }))}
                                            placeholder="City"
                                        />
                                        <InputField
                                            icon={<MapPin className="w-4 h-4" />}
                                            label="State"
                                            required
                                            value={businessDetails.state}
                                            error={errors.state}
                                            onChange={v => setBusinessDetails(p => ({ ...p, state: v }))}
                                            placeholder="State"
                                        />
                                        <InputField
                                            icon={<Hash className="w-4 h-4" />}
                                            label="PIN Code"
                                            value={businessDetails.pincode}
                                            onChange={v => setBusinessDetails(p => ({ ...p, pincode: v }))}
                                            placeholder="6-digit PIN code"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Additional Notes</h3>
                                    <textarea
                                        rows={3}
                                        value={businessDetails.additionalNotes}
                                        onChange={e => setBusinessDetails(p => ({ ...p, additionalNotes: e.target.value }))}
                                        placeholder="Any specific requirements, questions, or details you'd like to share..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ====== STEP 3: Document Upload ====== */}
                    {currentStep === 3 && (
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Documents</h2>
                            <p className="text-gray-600 mb-6">
                                Upload the required documents for your {selectedService?.title} application.
                                You can also upload them later from your dashboard.
                            </p>

                            {/* Required Documents List */}
                            {selectedService && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
                                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Required Documents for {selectedService.title}
                                    </h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {selectedService.documents.map((doc, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-amber-700">
                                                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                                                {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Upload Area */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileUpload}
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 bg-gray-100 group-hover:bg-primary/10 rounded-full flex items-center justify-center mb-3 transition-colors">
                                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload files</p>
                                    <p className="text-xs text-gray-500">PDF, DOC, XLS, PNG, JPG, ZIP — up to 10 MB each</p>
                                </div>
                            </button>

                            {/* Uploaded Files */}
                            {uploadedFiles.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-700">
                                        Uploaded ({uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''})
                                    </h3>
                                    {uploadedFiles.map(file => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileIconColor(file.type)}`}>
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{file.size} • {file.type.toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5" />
                                Your documents are encrypted and securely stored. You can also upload them later from your dashboard.
                            </p>
                        </div>
                    )}

                    {/* ====== STEP 4: Review & Submit ====== */}
                    {currentStep === 4 && (
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Submit</h2>
                            <p className="text-gray-600 mb-6">Please review your information before submitting.</p>

                            <div className="space-y-6">
                                {/* Service Summary */}
                                <ReviewSection
                                    title="Selected Service"
                                    onEdit={() => setCurrentStep(1)}
                                >
                                    {selectedService && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                                                {selectedService.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{selectedService.title}</h4>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <span>{selectedService.category}</span>
                                                    <span>•</span>
                                                    <span className="font-semibold text-primary">{selectedService.price}</span>
                                                    <span>•</span>
                                                    <span>{selectedService.timeline}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </ReviewSection>

                                {/* Business Details Summary */}
                                <ReviewSection
                                    title="Business Details"
                                    onEdit={() => setCurrentStep(2)}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <ReviewItem label="Full Name" value={businessDetails.fullName} />
                                        <ReviewItem label="Email" value={businessDetails.email} />
                                        <ReviewItem label="Phone" value={businessDetails.phone} />
                                        <ReviewItem label="Company" value={businessDetails.companyName} />
                                        {businessDetails.gstNumber && <ReviewItem label="GST Number" value={businessDetails.gstNumber} />}
                                        <ReviewItem label="Location" value={`${businessDetails.city}, ${businessDetails.state}${businessDetails.pincode ? ' - ' + businessDetails.pincode : ''}`} />
                                        {businessDetails.address && <ReviewItem label="Address" value={businessDetails.address} />}
                                    </div>
                                    {businessDetails.additionalNotes && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <ReviewItem label="Notes" value={businessDetails.additionalNotes} />
                                        </div>
                                    )}
                                </ReviewSection>

                                {/* Documents Summary */}
                                <ReviewSection
                                    title="Documents"
                                    onEdit={() => setCurrentStep(3)}
                                >
                                    {uploadedFiles.length > 0 ? (
                                        <div className="space-y-2">
                                            {uploadedFiles.map(file => (
                                                <div key={file.id} className="flex items-center gap-3 text-sm">
                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-700">{file.name}</span>
                                                    <span className="text-gray-400">({file.size})</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No documents uploaded — you can upload them later from your dashboard.</p>
                                    )}
                                </ReviewSection>

                                {/* Terms */}
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-gray-600">
                                            By submitting this request, you confirm that the information provided is accurate.
                                            Our team will review your application and reach out within <strong>24 hours</strong>.
                                            Your data is protected under our privacy policy.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-100">
                        <button
                            onClick={goBack}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-colors ${currentStep === 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>

                        {currentStep < 4 ? (
                            <button
                                onClick={goNext}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Submit Request
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

// ==================== SUB-COMPONENTS ====================

function Header() {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">HV Consultancy</span>
                </Link>
                <Link
                    to="/dashboard"
                    className="px-5 py-2 text-primary border border-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                    Dashboard
                </Link>
            </div>
        </header>
    )
}

function InputField({
    icon, label, value, onChange, placeholder, required, error, type = 'text'
}: {
    icon: React.ReactNode
    label: string
    value: string
    onChange: (v: string) => void
    placeholder: string
    required?: boolean
    error?: string
    type?: string
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                />
            </div>
            {error && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
        </div>
    )
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
    return (
        <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">{title}</h3>
                <button
                    onClick={onEdit}
                    className="text-sm text-primary font-semibold hover:underline"
                >
                    Edit
                </button>
            </div>
            {children}
        </div>
    )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
            <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
        </div>
    )
}
