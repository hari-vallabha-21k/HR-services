import { useState } from 'react'
import { Search, Grid, List, ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Service {
  id: string
  slug: string
  title: string
  description: string
  category: 'tax' | 'labour' | 'licensing' | 'hr'
  price: number | 'contact'
  features: string[]
  popular?: boolean
  image: string
}

export default function ServicesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', label: 'All Services', icon: '📋', count: 12 },
    { id: 'labour', label: 'Labour', icon: '👥', count: 3 },
    { id: 'tax', label: 'Tax', icon: '💼', count: 4 },
    { id: 'licensing', label: 'Licensing', icon: '⚖️', count: 3 },
    { id: 'hr', label: 'HR', icon: '🏢', count: 2 }
  ]

  const services: Service[] = [
    {
      id: '1',
      slug: 'gst',
      title: 'GST Registration',
      description: 'Fast-track your tax registration with end-to-end expert assistance and documentation.',
      category: 'tax',
      price: 49,
      features: ['Expert assistance', 'Fast processing', 'Documentation support'],
      popular: true,
      image: 'gradient-purple'
    },
    {
      id: '2',
      slug: 'pf-esi',
      title: 'PF/ESI Registration',
      description: 'Ensure your tax benefits are fully compliant with current labour laws and regulations.',
      category: 'labour',
      price: 79,
      features: ['Full compliance', 'Expert guidance', 'Quick setup'],
      image: 'gradient-teal'
    },
    {
      id: '3',
      slug: 'trade-license',
      title: 'Trade License',
      description: 'Get your business license without the paperwork headache. Local municipal coverage included.',
      category: 'licensing',
      price: 120,
      features: ['Municipal coverage', 'Quick approval', 'Documentation handled'],
      image: 'gradient-green'
    },
    {
      id: '4',
      slug: 'payroll',
      title: 'Payroll Management',
      description: 'Automated and compliant payroll for your growing team. Includes tax withholding.',
      category: 'hr',
      price: 99,
      features: ['Automated payroll', 'Tax compliance', 'Employee portal'],
      popular: true,
      image: 'gradient-mint'
    },
    {
      id: '5',
      slug: 'income-tax',
      title: 'Income Tax Filing',
      description: 'Accurate and timely filing for your business entity. Maximize your eligible deductions.',
      category: 'tax',
      price: 150,
      features: ['Accurate filing', 'Deduction optimization', 'Expert review'],
      image: 'gradient-cyan'
    },
    {
      id: '6',
      slug: 'labour-audit',
      title: 'Labour Law Audits',
      description: 'Comprehensive audits to mitigate legal risks and ensure workplace safety standards.',
      category: 'labour',
      price: 'contact',
      features: ['Risk mitigation', 'Safety compliance', 'Expert audit'],
      image: 'gradient-blue'
    },
    {
      id: '7',
      slug: 'fssai',
      title: 'FSSAI Registration',
      description: 'Food safety certification for your startup venture. Essential for any F&B business.',
      category: 'licensing',
      price: 65,
      features: ['Food safety cert', 'Quick processing', 'Compliance support'],
      image: 'gradient-lime'
    },
    {
      id: '8',
      slug: 'policy-drafting',
      title: 'Policy Drafting',
      description: 'Customized HR policies for a better workplace. Handbooks, NDA, and Code of Conduct.',
      category: 'hr',
      price: 200,
      features: ['Custom policies', 'Legal compliance', 'Professional templates'],
      image: 'gradient-navy'
    }
  ]

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (category: string) => {
    const colors = {
      tax: 'bg-purple-100 text-purple-700',
      labour: 'bg-teal-100 text-teal-700',
      licensing: 'bg-green-100 text-green-700',
      hr: 'bg-blue-100 text-blue-700'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getImageGradient = (image: string) => {
    const gradients = {
      'gradient-purple': 'from-purple-400 to-purple-600',
      'gradient-teal': 'from-teal-400 to-cyan-600',
      'gradient-green': 'from-green-400 to-emerald-600',
      'gradient-mint': 'from-cyan-300 to-teal-500',
      'gradient-cyan': 'from-cyan-400 to-blue-500',
      'gradient-blue': 'from-blue-400 to-indigo-600',
      'gradient-lime': 'from-lime-400 to-green-500',
      'gradient-navy': 'from-blue-600 to-purple-700'
    }
    return gradients[image as keyof typeof gradients] || gradients['gradient-purple']
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Public Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
              <Link to="/services" className="text-primary font-semibold border-b-2 border-primary pb-4 -mb-4">Services</Link>
              <a href="#" className="text-gray-700 hover:text-primary font-medium">About</a>
              <a href="#" className="text-gray-700 hover:text-primary font-medium">Contact</a>
            </nav>
          </div>
          <Link 
            to="/login" 
            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Browse Compliance Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Everything you need to launch and scale your business. Choose from our curated list of professional services designed for modern entrepreneurs and startups.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-6 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
                ${selectedCategory === cat.id 
                  ? 'bg-primary text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
              {cat.id !== 'all' && (
                <span className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-100'}
                `}>
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search and Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for compliance service"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            </div>
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>

            <div className="flex items-center gap-1 ml-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
          {filteredServices.map((service) => (
            <Link
              to={`/services/${service.slug}`}
              key={service.id} 
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group block"
            >
              <div className={`h-40 bg-gradient-to-br ${getImageGradient(service.image)} relative`}>
                {service.popular && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold text-gray-900">Popular</span>
                  </div>
                )}
                <div className={`absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-semibold uppercase ${getCategoryColor(service.category)}`}>
                  {service.category}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-baseline gap-1 mb-4">
                  {typeof service.price === 'number' ? (
                    <>
                      <span className="text-xs text-gray-500">Starts at</span>
                      <span className="text-2xl font-bold text-primary">₹{service.price}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">Contact Us</span>
                  )}
                </div>

                <div className="w-full px-4 py-2.5 border-2 border-primary text-primary rounded-lg font-semibold group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center gap-2">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors inline-flex items-center gap-2">
            View All Services
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg"></div>
                <span className="text-lg font-bold">HV Consultancy</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                The digital-first compliance platform for the next generation of businesses. Making legal easy for startups worldwide.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-4 text-gray-300">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Our Services</a></li>
                <li><a href="#" className="hover:text-white">Get Started</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-4 text-gray-300">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Labour Compliance</a></li>
                <li><a href="#" className="hover:text-white">Tax Advisory</a></li>
                <li><a href="#" className="hover:text-white">Trade Licensing</a></li>
                <li><a href="#" className="hover:text-white">HR Management</a></li>
                <li><a href="#" className="hover:text-white">Compliance Audit</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-4 text-gray-300">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Our Team</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Support Center</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex items-center justify-between text-sm text-gray-400">
            <p>© 2024 HV Consultancy Services Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}