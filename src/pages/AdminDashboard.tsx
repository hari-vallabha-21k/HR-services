import { useState, useEffect } from 'react'
import { 
  Users, FileCheck, AlertCircle, MoreHorizontal, 
  Search, Download, FileText, CheckCircle, X, Calendar, Building2, Settings, LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface DashboardStats {
  activeClients: number
  clientsTrend: number
  pendingReviews: number
  reviewsTrend: number
  overdueTasks: number
  tasksTrend: number
  healthScore: number
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    activeClients: 0,
    clientsTrend: 0,
    pendingReviews: 0,
    reviewsTrend: 0,
    overdueTasks: 0,
    tasksTrend: 0,
    healthScore: 100
  })

  // Using any here temporarily to bypass complex join typing
  const [tasks, setTasks] = useState<any[]>([])
  
  // View State
  const [searchQuery, setSearchQuery] = useState('')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [showAll, setShowAll] = useState(false)
  
  // Profile Menu State
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { signOut } = useAuth()
  
  // Modal State
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [requestDocs, setRequestDocs] = useState<any[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  
  // Clients Modal State
  const [clientsList, setClientsList] = useState<any[]>([])
  const [showClientsModal, setShowClientsModal] = useState(false)
  const [clientSearchQuery, setClientSearchQuery] = useState('')
  const [selectedClientDetail, setSelectedClientDetail] = useState<any | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // 1. Fetch total clients and their details
      const { data: clientsData, count: clientsCount, error: clientsError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, created_at', { count: 'exact' })
        .eq('role', 'client')
        
      if (clientsError) throw clientsError
      setClientsList(clientsData || [])

      // 2. Fetch all service requests
      const { data: requests, error } = await supabase
        .from('service_requests')
        .select(`
          id,
          status,
          created_at,
          form_data,
          client_id,
          profiles:client_id (full_name, email, phone),
          services:service_id (name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Calculate stats based on real data
      const pendingReviews = requests?.filter(r => r.status === 'in_review').length || 0
      
      // For now, consider 'submitted' older than 3 days as 'overdue' (mock calculation)
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      const overdueTasks = requests?.filter(r => 
        (r.status === 'submitted' || r.status === 'in_progress') && 
        new Date(r.created_at) < threeDaysAgo
      ).length || 0

      // Calculate heath score (completed / total * 100)
      const completed = requests?.filter(r => r.status === 'completed').length || 0
      const total = requests?.length || 0
      const healthScore = total > 0 ? Math.round((completed / total) * 100) : 0

      setStats(prev => ({
        ...prev,
        activeClients: clientsCount || 0,
        pendingReviews,
        overdueTasks,
        healthScore
      }))

      setTasks(requests || [])

    } catch (err) {
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = async (task: any) => {
    setSelectedRequest(task)
    setLoadingDocs(true)
    try {
      // List all files in the request's folder
      const { data: files, error } = await supabase.storage
        .from('service-documents')
        .list(`${task.client_id}/${task.id}`)
      
      if (error) throw error
      setRequestDocs(files || [])
    } catch (err) {
      console.error('Error fetching documents:', err)
      setRequestDocs([])
    } finally {
      setLoadingDocs(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!selectedRequest) return
    setUpdatingStatus(true)
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', selectedRequest.id)
        
      if (error) throw error
      
      // Update local state
      setTasks(tasks.map(t => t.id === selectedRequest.id ? { ...t, status: newStatus } : t))
      setSelectedRequest({ ...selectedRequest, status: newStatus })
      fetchDashboardData() // refresh stats
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const downloadDocument = async (fileName: string) => {
    if (!selectedRequest) return
    try {
      const { data, error } = await supabase.storage
        .from('service-documents')
        .download(`${selectedRequest.client_id}/${selectedRequest.id}/${fileName}`)
      
      if (error) throw error
      
      // Create a download link
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading document', err)
      alert('Error downloading document')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      submitted: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Submitted' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
      in_review: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Reviewing' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
    }
    return styles[status as keyof typeof styles] || styles.submitted
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.substring(0, 2).toUpperCase()
    if (email) return email.substring(0, 2).toUpperCase()
    return 'CL'
  }

  const getDisplayName = (name?: string, email?: string) => {
    if (name && name.trim() !== '') return name
    if (email) return email
    return 'Unknown Client'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              H
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">HV Consultancy</h1>
              <p className="text-xs text-gray-500">Admin Console</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 pl-4 ms-2 hover:bg-gray-50 p-2 rounded-xl transition-colors text-left"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-900">Admin</div>
                  <div className="text-xs text-gray-500 uppercase">Super Admin</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  AU
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button 
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Real-time overview of compliance health across {stats.activeClients.toLocaleString()} active client portfolios.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Active Clients */}
          <div 
            onClick={() => {
              setShowClientsModal(true)
              setSelectedClientDetail(null)
              setClientSearchQuery('')
            }}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1 group-hover:text-primary transition-colors">Total Clients</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {stats.activeClients.toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Users className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">Click to view directory &rarr;</p>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.pendingReviews}</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stalled Tasks (&gt;3 days)</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.overdueTasks}</h3>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.healthScore}%</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`bg-gradient-to-r ${stats.healthScore > 80 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'} h-full rounded-full transition-all`}
                style={{ width: `${stats.healthScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Recent Compliance Tasks */}
          <div className="col-span-3 bg-white rounded-xl border border-gray-200 flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50/50 rounded-t-xl">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Service Requests</h2>
                <div className="h-6 w-px bg-gray-300 mx-1"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search requests..."
                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary w-64 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
                {(() => {
                  const uniqueServices = Array.from(new Set(tasks.map(t => Array.isArray(t.services) ? t.services[0]?.name : t.services?.name).filter(Boolean)))
                  return (
                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      className="py-2 pl-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer outline-none"
                    >
                      <option value="all">All Services</option>
                      {uniqueServices.map(service => (
                        <option key={service as string} value={service as string}>{service as string}</option>
                      ))}
                    </select>
                  )
                })()}
              </div>
              <button 
                onClick={() => setShowAll(!showAll)}
                className="text-primary font-semibold text-sm hover:underline bg-blue-50 px-4 py-2 rounded-lg"
              >
                {showAll ? 'Collapse List' : 'View All'}
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(() => {
                    // Filter tasks
                    const filteredTasks = tasks.filter((t) => {
                      const clientName = Array.isArray(t.profiles) ? t.profiles[0]?.full_name : t.profiles?.full_name
                      const serviceName = Array.isArray(t.services) ? t.services[0]?.name : t.services?.name
                      const textToSearch = [clientName, serviceName, t.status, t.id].join(' ').toLowerCase()
                      
                      const matchesSearch = textToSearch.includes(searchQuery.toLowerCase())
                      const matchesService = serviceFilter === 'all' || serviceName === serviceFilter
                      
                      return matchesSearch && matchesService
                    })
                    
                    // Limit tasks
                    const displayedTasks = showAll ? filteredTasks : filteredTasks.slice(0, 5)

                    if (displayedTasks.length === 0) {
                      return (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            {searchQuery ? 'No matching requests found.' : 'No service requests found.'}
                          </td>
                        </tr>
                      )
                    }

                    return displayedTasks.map((task) => {
                      const statusInfo = getStatusBadge(task.status)
                      const profile = Array.isArray(task.profiles) ? task.profiles[0] : task.profiles
                      const service = Array.isArray(task.services) ? task.services[0] : task.services
                      
                      const clientName = getDisplayName(profile?.full_name, profile?.email)
                      const clientInitials = getInitials(profile?.full_name, profile?.email)
                      
                      return (
                        <tr key={task.id} onClick={() => handleRowClick(task)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {clientInitials}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{clientName}</span>
                                {profile?.email && profile.full_name && (
                                  <span className="text-xs text-gray-500">{profile.email}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-medium">{service?.name || 'Unknown Service'}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">
                            {new Date(task.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusInfo.bg} ${statusInfo.text}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <MoreHorizontal className="w-5 h-5 text-gray-500" />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  })()}
                </tbody>
              </table>
            </div>
          </div>


        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Last Update</p>
              <p className="text-sm font-semibold text-gray-900">Today, 2:45 PM</p>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Sync Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-semibold text-gray-900">All Systems Live</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </main>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-primary">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {Array.isArray(selectedRequest.services) ? selectedRequest.services[0]?.name : selectedRequest.services?.name || 'Service Request'}
                  </h2>
                  <p className="text-sm text-gray-500 font-mono mt-1">ID: {selectedRequest.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-8">
                
                {/* Left Column: Form Data & Client Details */}
                <div className="col-span-2 space-y-8">
                  
                  {/* Client Info Card */}
                  <div className="bg-white border text-sm border-gray-100 rounded-xl p-5 shadow-sm">
                    <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Client Profile
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-medium mb-1">Full Name</p>
                        <p className="text-gray-900 font-medium">{Array.isArray(selectedRequest.profiles) ? selectedRequest.profiles[0]?.full_name : selectedRequest.profiles?.full_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-medium mb-1">Email</p>
                        <p className="text-gray-900 font-medium">{Array.isArray(selectedRequest.profiles) ? selectedRequest.profiles[0]?.email : selectedRequest.profiles?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-medium mb-1">Submitted On</p>
                        <p className="text-gray-900 font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(selectedRequest.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Data / Business Details */}
                  {selectedRequest.form_data && Object.keys(selectedRequest.form_data).length > 0 && (
                    <div>
                      <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        Business Details Submitted
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <table className="w-full text-sm">
                          <tbody>
                            {Object.entries(selectedRequest.form_data).map(([key, value]) => {
                              // Skip internal mapping keys or nulls
                              if (value === null || value === '' || key === 'documents_count') return null;
                              return (
                                <tr key={key} className="border-b border-gray-100 last:border-0 hover:bg-gray-100/50">
                                  <td className="py-3 px-4 text-gray-500 font-medium capitalize w-1/3 align-top">
                                    {key.replace(/_/g, ' ')}
                                  </td>
                                  <td className="py-3 px-4 text-gray-900 font-medium">
                                    {String(value)}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Status & Documents */}
                <div className="space-y-6">
                  
                  {/* Status Manager */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                    <h3 className="text-gray-900 font-semibold mb-3">Workflow Status</h3>
                    <div className="space-y-2">
                      {['submitted', 'in_progress', 'in_review', 'completed', 'cancelled'].map((status) => {
                        const styleInfo = getStatusBadge(status)
                        const isActive = selectedRequest.status === status
                        return (
                          <button
                            key={status}
                            disabled={updatingStatus}
                            onClick={() => updateStatus(status)}
                            className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-semibold transition-all flex items-center justify-between ${
                              isActive 
                                ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500' 
                                : 'bg-transparent border-transparent hover:bg-black/5 text-gray-600'
                            }`}
                          >
                            <span className={isActive ? styleInfo.text : ''}>{styleInfo.label}</span>
                            {isActive && <CheckCircle className={`w-4 h-4 ${styleInfo.text}`} />}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Documents Vault */}
                  <div className="border border-gray-200 rounded-xl p-5">
                    <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Attached Documents
                    </h3>
                    
                    {loadingDocs ? (
                      <div className="flex justify-center py-6">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : requestDocs.length > 0 ? (
                      <div className="space-y-3">
                        {requestDocs.map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors group">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-red-500 border border-red-100 shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <p className="text-sm font-medium text-gray-700 truncate" title={doc.name}>
                                {doc.name}
                              </p>
                            </div>
                            <button 
                              onClick={() => downloadDocument(doc.name)}
                              className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-md opacity-0 group-hover:opacity-100 transition-all shrink-0"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500">No documents attached.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clients Directory Modal */}
      {showClientsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedClientDetail ? 'Client Profile' : 'Client Directory'}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    {selectedClientDetail ? selectedClientDetail.full_name : `${clientsList.length} Total Registered Clients`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedClientDetail && (
                  <button 
                    onClick={() => setSelectedClientDetail(null)}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    &larr; Back to Directory
                  </button>
                )}
                <button 
                  onClick={() => setShowClientsModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-white p-6">
              
              {!selectedClientDetail ? (
                /* List View */
                <div className="space-y-6">
                  {/* Search */}
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder="Search clients by name, email, or phone..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm"
                      value={clientSearchQuery}
                      onChange={(e) => setClientSearchQuery(e.target.value)}
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>

                  {/* Clients Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {clientsList
                      .filter(c => {
                        const searchStr = `${c.full_name} ${c.email} ${c.phone}`.toLowerCase()
                        return searchStr.includes(clientSearchQuery.toLowerCase())
                      })
                      .map((client) => (
                        <div 
                          key={client.id}
                          onClick={() => setSelectedClientDetail(client)}
                          className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md hover:bg-blue-50/30 transition-all cursor-pointer group"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg group-hover:scale-105 transition-transform">
                            {getInitials(client.full_name, client.email)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-900 font-semibold truncate group-hover:text-primary transition-colors">
                              {getDisplayName(client.full_name, client.email)}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">{client.email}</p>
                            {client.phone && <p className="text-xs text-gray-400 mt-0.5">{client.phone}</p>}
                          </div>
                          <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            &rarr;
                          </div>
                        </div>
                      ))}
                    
                    {clientsList.length > 0 && clientsList.filter(c => `${c.full_name} ${c.email} ${c.phone}`.toLowerCase().includes(clientSearchQuery.toLowerCase())).length === 0 && (
                      <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        No clients matching your search.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Detail View */
                <div className="space-y-8">
                  {/* Client Info Block */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Full Name</p>
                      <p className="text-gray-900 font-medium">{getDisplayName(selectedClientDetail.full_name, selectedClientDetail.email)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Email</p>
                      <p className="text-gray-900 font-medium">{selectedClientDetail.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Phone</p>
                      <p className="text-gray-900 font-medium">{selectedClientDetail.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Joined</p>
                      <p className="text-gray-900 font-medium">{new Date(selectedClientDetail.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Total Requests</p>
                      <p className="text-primary font-bold text-lg">
                        {tasks.filter(t => t.client_id === selectedClientDetail.id).length}
                      </p>
                    </div>
                  </div>

                  {/* Client's Service Requests */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-gray-400" />
                      Service Request History
                    </h3>
                    
                    {(() => {
                      const clientTasks = tasks.filter(t => t.client_id === selectedClientDetail.id)
                      if (clientTasks.length === 0) {
                        return (
                          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500">This client has not submitted any service requests yet.</p>
                          </div>
                        )
                      }
                      
                      return (
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-semibold">
                              <tr>
                                <th className="px-5 py-3">Service</th>
                                <th className="px-5 py-3">Date</th>
                                <th className="px-5 py-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {clientTasks.map(task => {
                                const statusInfo = getStatusBadge(task.status)
                                const service = Array.isArray(task.services) ? task.services[0] : task.services
                                
                                return (
                                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4 font-medium text-gray-900">{service?.name || 'Unknown'}</td>
                                    <td className="px-5 py-4 text-gray-500">{new Date(task.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-4">
                                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusInfo.bg} ${statusInfo.text}`}>
                                        {statusInfo.label}
                                      </span>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}