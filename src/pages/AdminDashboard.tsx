import React, { useState } from 'react'
import { 
  Users, FileCheck, AlertCircle, Activity, MoreHorizontal, 
  TrendingUp, TrendingDown, Search, Plus, Filter, Download, FileText
} from 'lucide-react'

interface DashboardStats {
  activeClients: number
  clientsTrend: number
  pendingReviews: number
  reviewsTrend: number
  overdueTasks: number
  tasksTrend: number
  healthScore: number
}

interface Task {
  id: string
  clientInitials: string
  clientName: string
  module: string
  assignedTo: string
  status: 'in_progress' | 'reviewing' | 'completed' | 'overdue'
}

interface ActivityData {
  day: string
  completed: number
  pending: number
}

export default function AdminDashboard() {
  const [stats] = useState<DashboardStats>({
    activeClients: 1284,
    clientsTrend: 12,
    pendingReviews: 42,
    reviewsTrend: 5,
    overdueTasks: 7,
    tasksTrend: -2,
    healthScore: 94
  })

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      clientInitials: 'NL',
      clientName: 'NexGen Labs',
      module: 'GDPR Audit',
      assignedTo: 'S. Thompson',
      status: 'in_progress'
    },
    {
      id: '2',
      clientInitials: 'BS',
      clientName: 'BlueSky Fintech',
      module: 'ISO 27001',
      assignedTo: 'A. Rivera',
      status: 'reviewing'
    },
    {
      id: '3',
      clientInitials: 'VE',
      clientName: 'Velo Energy',
      module: 'KYC Validation',
      assignedTo: 'M. Chen',
      status: 'completed'
    },
    {
      id: '4',
      clientInitials: 'SR',
      clientName: 'Solaris Retail',
      module: 'VAT Filing',
      assignedTo: 'J. Doe',
      status: 'overdue'
    }
  ])

  const [activityData] = useState<ActivityData[]>([
    { day: 'MON', completed: 840, pending: 444 },
    { day: 'TUE', completed: 960, pending: 540 },
    { day: 'WED', completed: 1020, pending: 480 },
    { day: 'THU', completed: 1040, pending: 520 },
    { day: 'FRI', completed: 1080, pending: 460 },
    { day: 'SAT', completed: 1120, pending: 440 },
    { day: 'SUN', completed: 1150, pending: 444 }
  ])

  const getStatusBadge = (status: string) => {
    const styles = {
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
      reviewing: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Reviewing' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' }
    }
    return styles[status as keyof typeof styles] || styles.in_progress
  }

  const maxActivity = Math.max(...activityData.map(d => d.completed + d.pending))

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

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search clients, tasks, or IDs..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:bg-white"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-primary border border-primary rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Assign
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Update
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Review
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500 uppercase">Super Admin</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                AU
              </div>
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
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Clients</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {stats.activeClients.toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">+{stats.clientsTrend}%</span>
              <span className="text-gray-500">from last month</span>
            </div>
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
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">+{stats.reviewsTrend}%</span>
              <span className="text-gray-500">workflow load</span>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overdue Tasks</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.overdueTasks}</h3>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-red-600 font-semibold">{stats.tasksTrend}%</span>
              <span className="text-gray-500">critical alerts</span>
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Health Score</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.healthScore}%</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all"
                style={{ width: `${stats.healthScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Recent Compliance Tasks */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Compliance Tasks</h2>
              <button className="text-primary font-semibold text-sm hover:underline">
                View All Tasks
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks.map((task) => {
                    const statusInfo = getStatusBadge(task.status)
                    return (
                      <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {task.clientInitials}
                            </div>
                            <span className="font-medium text-gray-900">{task.clientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{task.module}</td>
                        <td className="px-6 py-4 text-gray-700">{task.assignedTo}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusInfo.bg} ${statusInfo.text}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Platform Activity */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Platform Activity</h2>
              <p className="text-sm text-gray-600">
                Completed vs Pending <span className="font-semibold">Last 7 Days</span>
              </p>
            </div>

            {/* Chart */}
            <div className="space-y-3 mb-6">
              {activityData.map((data) => {
                const total = data.completed + data.pending
                const completedPercent = (data.completed / maxActivity) * 100
                const pendingPercent = (data.pending / maxActivity) * 100

                return (
                  <div key={data.day} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                      <span>{data.day}</span>
                      <span>{total}</span>
                    </div>
                    <div className="flex gap-1 h-8">
                      <div 
                        className="bg-primary rounded"
                        style={{ width: `${completedPercent}%` }}
                      ></div>
                      <div 
                        className="bg-gray-200 rounded"
                        style={{ width: `${pendingPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-gray-600">Completed (840)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-600">Pending (444)</span>
              </div>
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
    </div>
  )
}