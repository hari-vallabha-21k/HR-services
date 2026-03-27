import React, { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Upload, Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  FileText, Download, CheckCircle, AlertTriangle, Clock, FolderOpen,
  LogOut, Bell, Settings, Search, Plus, X, User, HelpCircle, Trash2
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { z } from 'zod'

// ==================== ZOD SCHEMAS ====================

const ServiceStatusSchema = z.enum(['approved', 'filed', 'pending'])
const EventStatusSchema = z.enum(['pending', 'completed'])
const DocumentTypeSchema = z.enum(['pdf', 'docx', 'xlsx', 'zip'])
const EventColorSchema = z.enum(['orange', 'green', 'blue', 'gray'])
const ServiceCategorySchema = z.enum(['Tax & Compliance', 'Licenses', 'Compliance', 'HR & Payroll'])

const ActiveServiceSchema = z.object({
  id: z.string().min(1, 'Service ID is required'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  status: ServiceStatusSchema,
  updatedAt: z.string(),
  image: z.string()
})

const CalendarEventSchema = z.object({
  id: z.string().min(1, 'Event ID is required'),
  date: z.number().min(1).max(31),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long'),
  status: EventStatusSchema,
  color: EventColorSchema
})

const DocumentSchema = z.object({
  id: z.string().min(1, 'Document ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  uploadedAt: z.string(),
  size: z.string(),
  type: DocumentTypeSchema
})

const DashboardServiceSchema = z.object({
  id: z.string().min(1, 'Service ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: ServiceCategorySchema,
  price: z.string().min(1, 'Price is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  icon: z.string().min(1, 'Icon is required')
})

// Type exports from schemas
type ActiveService = z.infer<typeof ActiveServiceSchema>
type CalendarEvent = z.infer<typeof CalendarEventSchema>
type Document = z.infer<typeof DocumentSchema>
type DashboardService = z.infer<typeof DashboardServiceSchema>

// ==================== VALIDATED DATA ====================

const validateAndFilterServices = (services: unknown[]): DashboardService[] => {
  return services.filter((service): service is DashboardService => {
    const result = DashboardServiceSchema.safeParse(service)
    if (!result.success) {
      console.warn('Invalid service data:', result.error.issues)
    }
    return result.success
  })
}

// Raw services data - will be validated
const rawDashboardServices = [
  {
    id: 'gst',
    title: 'GST Registration',
    description: 'Get your GST number for tax compliance and start billing legally.',
    category: 'Tax & Compliance',
    price: '₹1,499',
    timeline: '3-5 working days',
    icon: '📊',
  },
  {
    id: 'fssai',
    title: 'FSSAI License',
    description: 'Food safety license required for all food businesses in India.',
    category: 'Licenses',
    price: '₹2,999',
    timeline: '7-10 working days',
    icon: '🍽️',
  },
  {
    id: 'pf-esi',
    title: 'PF & ESI Registration',
    description: 'Employee benefits registration for companies with 10+ employees.',
    category: 'Compliance',
    price: '₹1,999',
    timeline: '5-7 working days',
    icon: '👥',
  },
  {
    id: 'trade-license',
    title: 'Trade License',
    description: 'Municipal permission to carry out business in your locality.',
    category: 'Licenses',
    price: '₹1,999',
    timeline: '7-14 working days',
    icon: '🏪',
  },
  {
    id: 'income-tax',
    title: 'Income Tax Filing',
    description: 'Professional ITR filing for individuals and businesses.',
    category: 'Tax & Compliance',
    price: '₹999',
    timeline: '1-2 working days',
    icon: '💰',
  },
  {
    id: 'payroll',
    title: 'Payroll Services',
    description: 'Complete payroll management including salary processing and compliance.',
    category: 'HR & Payroll',
    price: '₹2,499/month',
    timeline: 'Ongoing service',
    icon: '📋',
  },
]

// Validated services
const dashboardServices = validateAndFilterServices(rawDashboardServices)

// Dashboard Services View Component
function DashboardServicesView({ onStartService }: { onStartService: (serviceId: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Tax & Compliance', 'Licenses', 'Compliance', 'HR & Payroll']

  const filteredServices = selectedCategory === 'All' 
    ? dashboardServices 
    : dashboardServices.filter(s => s.category === selectedCategory)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
        <p className="text-gray-600">Choose a service to get started with your compliance needs.</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-primary/30">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                {service.icon}
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                {service.category}
              </span>
            </div>
            
            <h3 className="font-bold text-gray-900 text-lg mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{service.timeline}</span>
              </div>
              <span className="font-semibold text-primary">{service.price}</span>
            </div>
            
            <button
              onClick={() => onStartService(service.id)}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Start Service
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ClientDashboard() {
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().getDate())
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [uploadingFile, setUploadingFile] = useState(false)
  
  // Alias for calendar display
  const currentMonth = currentDate
  
  // Redirect if not logged in - handled by ProtectedRoute component
  // This is a fallback for edge cases
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Get user display info
  const getUserDisplayName = () => {
    if (!user) return 'User'
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getUserEmail = () => {
    return user?.email || ''
  }

  const getCompanyName = () => {
    return user?.user_metadata?.company_name || 'Business Owner'
  }

  // Start with empty state — data will come from Supabase
  const [activeServices, setActiveServices] = useState<ActiveService[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [documents, setDocuments] = useState<Document[]>([])

  // ==================== CRUD OPERATIONS ====================

  // Remove active service
  const removeActiveService = useCallback((serviceId: string) => {
    setActiveServices(prev => prev.filter(s => s.id !== serviceId))
  }, [])

  // Remove calendar event
  const removeCalendarEvent = useCallback((eventId: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== eventId))
  }, [])

  // Add document with validation
  const addDocument = useCallback((docData: Omit<Document, 'id'>) => {
    const newDoc = { ...docData, id: Date.now().toString() }
    const result = DocumentSchema.safeParse(newDoc)
    if (result.success) {
      setDocuments(prev => [result.data, ...prev])
      return { success: true, data: result.data }
    }
    console.error('Invalid document data:', result.error.issues)
    return { success: false, errors: result.error.issues }
  }, [])

  // Remove document
  const removeDocument = useCallback((docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId))
  }, [])

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      filed: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700'
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const getFileIcon = (type: string) => {
    const colors = {
      pdf: 'bg-red-100 text-red-600',
      docx: 'bg-blue-100 text-blue-600',
      xlsx: 'bg-green-100 text-green-600',
      zip: 'bg-purple-100 text-purple-600'
    }
    return colors[type as keyof typeof colors] || colors.pdf
  }

  const renderCalendar = () => {
    const days = []
    const totalSlots = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7

    for (let i = 0; i < totalSlots; i++) {
      const dayNumber = i - firstDayOfMonth + 1
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth
      const hasEvent = calendarEvents.some(e => e.date === dayNumber)
      const isSelected = dayNumber === selectedDate

      days.push(
        <div
          key={i}
          className={`
            aspect-square flex items-center justify-center text-sm relative
            ${!isValidDay ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'}
            ${isSelected ? 'bg-blue-500 text-white rounded-lg font-semibold' : ''}
            ${hasEvent && !isSelected ? 'border-2 border-orange-400 rounded-lg font-semibold' : ''}
          `}
          onClick={() => isValidDay && setSelectedDate(dayNumber)}
        >
          {isValidDay ? dayNumber : ''}
          {hasEvent && !isSelected && (
            <div className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full"></div>
          )}
        </div>
      )
    }
    return days
  }

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }



  // Handle logout
  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  // Handle file upload with validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingFile(true)
      // Simulate upload
      setTimeout(() => {
        const fileExt = file.name.split('.').pop()?.toLowerCase()
        const validTypes = ['pdf', 'docx', 'xlsx', 'zip']
        const docType = validTypes.includes(fileExt || '') ? fileExt as Document['type'] : 'pdf'
        
        const result = addDocument({
          name: file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name,
          uploadedAt: 'Just now',
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          type: docType
        })
        
        if (!result.success) {
          console.error('Failed to add document:', result.errors)
        }
        setUploadingFile(false)
      }, 1500)
    }
  }

  // Mark event as complete
  const markEventComplete = (eventId: string) => {
    setCalendarEvents(calendarEvents.map(event =>
      event.id === eventId ? { ...event, status: 'completed' as const } : event
    ))
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">HV Consultancy</h1>
            <p className="text-xs text-gray-500">Digital Compliance</p>
          </div>
        </Link>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search filings, documents, or help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:bg-white"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="p-8 text-center text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button 
            onClick={() => alert('Settings page coming soon!')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</div>
                <div className="text-xs text-gray-500">{getCompanyName()}</div>
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {getUserInitials()}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-14 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{getUserDisplayName()}</p>
                  <p className="text-sm text-gray-500">{getUserEmail()}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => {
                      setShowUserMenu(false)
                      alert('Profile settings coming soon!')
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button 
                    onClick={() => {
                      setShowUserMenu(false)
                      alert('Settings page coming soon!')
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button 
                    onClick={() => {
                      setShowUserMenu(false)
                      alert('Help center coming soon!')
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help & Support
                  </button>
                </div>
                <div className="p-2 border-t border-gray-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Click outside to close menus */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false)
            setShowNotifications(false)
          }}
        ></div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 min-h-screen p-4">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${activeTab === 'dashboard' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${activeTab === 'services' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
              Services
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${activeTab === 'documents' ? 'bg-blue-50 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <FileText className="w-5 h-5" />
              Documents
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${activeTab === 'calendar' ? 'bg-blue-50 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <CalendarIcon className="w-5 h-5" />
              Calendar
            </button>
            <button 
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${activeTab === 'support' ? 'bg-blue-50 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              Support
            </button>
          </nav>

          <Link 
            to="/dashboard/services/new"
            className="w-full mt-8 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
            Start New Filing
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {getUserDisplayName().split(' ')[0]}</h1>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Your compliance score is looking great!</span>
                </div>
              </div>

              {/* Active Services Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Active Services</h2>
                  <button 
                    onClick={() => setActiveTab('services')}
                    className="text-primary font-semibold text-sm hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeServices.map((service) => (
                    <div key={service.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow relative group">
                      {/* Delete button */}
                      <button
                        onClick={() => removeActiveService(service.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove service"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mb-4 flex items-center justify-center">
                        {service.image === 'building' && (
                          <div className="w-16 h-16 bg-blue-200 rounded-lg"></div>
                        )}
                        {service.image === 'document' && (
                          <FileText className="w-16 h-16 text-blue-300" />
                        )}
                        {service.image === 'abstract' && (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-400 rounded-lg"></div>
                        )}
                      </div>
                      
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{service.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadge(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      
                      {service.updatedAt && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          Updated {service.updatedAt}
                        </div>
                      )}
                      
                      {service.status === 'pending' && (
                        <div className="flex items-center gap-2 mt-3 text-orange-600 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium">Action required: Sign Doc</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Empty state when no active services */}
                  {activeServices.length === 0 && (
                    <div className="col-span-full bg-white rounded-xl p-8 border border-gray-200 border-dashed text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">No active services</h3>
                      <p className="text-sm text-gray-500 mb-4">Start a new service to see it here</p>
                      <button
                        onClick={() => setActiveTab('services')}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Browse Services
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compliance Calendar */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Compliance Calendar</h2>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={goToPreviousMonth}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button 
                          onClick={goToNextMonth}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                      <div key={day} className="text-xs font-semibold text-gray-500 text-center py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {renderCalendar()}
                  </div>

                  {/* Calendar Events */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    {calendarEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-4 group">
                        <div className={`font-bold text-sm px-3 py-1 rounded ${
                          event.color === 'orange' ? 'text-orange-600 bg-orange-50' :
                          event.color === 'green' ? 'text-green-600 bg-green-50' :
                          event.color === 'blue' ? 'text-blue-600 bg-blue-50' :
                          'text-gray-600 bg-gray-50'
                        }`}>
                          {currentMonth.toLocaleString('default', { month: 'short' }).toUpperCase()} {event.date}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => markEventComplete(event.id)}
                            className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                              event.status === 'completed' 
                                ? 'bg-green-100 text-green-700 cursor-default' 
                                : 'text-primary hover:bg-blue-50'
                            }`}
                            disabled={event.status === 'completed'}
                          >
                            {event.status === 'completed' ? '✓ Done' : 'Mark Done'}
                          </button>
                          <button 
                            onClick={() => removeCalendarEvent(event.id)}
                            className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Empty state for events */}
                    {calendarEvents.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
                    )}
                  </div>
                </div>

                {/* Quick Vault */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Quick Vault</h2>
                    <FolderOpen className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-3">
                    {documents
                      .filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((doc) => (
                      <div key={doc.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileIcon(doc.type)}`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{doc.name}</h4>
                          <p className="text-xs text-gray-500">Uploaded {doc.uploadedAt} • {doc.size}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => alert(`Downloading ${doc.name}...`)}
                            className="text-gray-400 hover:text-primary flex-shrink-0 p-1"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeDocument(doc.id)}
                            className="text-gray-400 hover:text-red-500 flex-shrink-0 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {documents.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No documents found</p>
                    )}
                  </div>

                  <label className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-primary hover:text-primary hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    {uploadingFile ? 'Uploading...' : 'Upload Document'}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          {activeTab === 'services' && (
            <DashboardServicesView onStartService={(serviceId) => navigate(`/dashboard/services/new?type=${serviceId}`)} />
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Documents</h1>
              <p className="text-gray-600">Your document management section. Coming soon with full features.</p>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Calendar</h1>
              <p className="text-gray-600">Your compliance calendar. Coming soon with full features.</p>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Support</h1>
              <p className="text-gray-600">Need help? Contact our support team. Coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}