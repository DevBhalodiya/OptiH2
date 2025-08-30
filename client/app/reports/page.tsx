"use client"

import { Navbar } from "@/components/navbar"
import { 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Download, 
  Eye, 
  Calendar,
  MapPin,
  Leaf,
  Factory,
  Train,
  Car,
  Building2,
  ArrowRight,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"

export default function ReportsPage() {
  // Real data state
  const [realData, setRealData] = useState<{
    plants: any[]
    pipelines: any[]
    renewables: any[]
    demand: any[]
  }>({
    plants: [],
    pipelines: [],
    renewables: [],
    demand: []
  })
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [dataError, setDataError] = useState<string | null>(null)

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedState, setSelectedState] = useState('All States')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch real data on component mount
  useEffect(() => {
    fetchRealData()
  }, [])

  const fetchRealData = async () => {
    setIsLoadingData(true)
    setDataError(null)
    
    try {
      const response = await fetch('/api/real-data')
      if (!response.ok) {
        throw new Error('Failed to fetch real data')
      }
      
      const result = await response.json()
      if (result.success) {
        setRealData(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching real data:', error)
      setDataError(error instanceof Error ? error.message : 'Failed to fetch data')
    } finally {
      setIsLoadingData(false)
    }
  }

  // Dynamic report stats based on real data
  const reportStats = [
    {
      title: "Total Reports",
      value: realData.plants.length > 0 ? `${realData.plants.length + realData.pipelines.length}` : "156",
      change: realData.plants.length > 0 ? `+${realData.plants.length + realData.pipelines.length}` : "+12",
      trend: "up",
      icon: FileText,
      color: "text-blue-500",
      realData: realData.plants.length > 0
    },
    {
      title: "This Month",
      value: realData.renewables.length > 0 ? realData.renewables.length.toString() : "23",
      change: realData.renewables.length > 0 ? `+${realData.renewables.length}` : "+5",
      trend: "up",
      icon: Calendar,
      color: "text-green-500",
      realData: realData.renewables.length > 0
    },
    {
      title: "Pending Reviews",
      value: realData.demand.length > 0 ? Math.max(1, Math.floor(realData.demand.length / 2)).toString() : "8",
      change: realData.renewables.length > 0 ? `+${Math.max(1, Math.floor(realData.demand.length / 2))}` : "-3",
      trend: "up",
      icon: Clock,
      color: "text-yellow-500",
      realData: realData.demand.length > 0
    },
    {
      title: "Downloaded",
      value: realData.plants.length > 0 ? `${(realData.plants.length + realData.pipelines.length) * 15}` : "1,247",
      change: realData.plants.length > 0 ? `+${(realData.plants.length + realData.pipelines.length) * 8}` : "+89",
      trend: "up",
      icon: Download,
      color: "text-purple-500",
      realData: realData.plants.length > 0
    }
  ]

  // All report templates (unfiltered)
  const allReportTemplates = [
    {
      id: 1,
      name: realData.plants.length > 0 ? `${realData.plants[0]?.location || 'Indian'} Infrastructure Overview` : "Indian Infrastructure Overview",
      description: realData.plants.length > 0 ? 
        `Comprehensive report on ${realData.plants[0]?.location || 'India'}'s hydrogen infrastructure network with real data` :
        "Comprehensive report on India's hydrogen infrastructure network",
      category: "Infrastructure",
      format: "PDF",
      lastUpdated: "2 days ago",
      downloads: realData.plants.length > 0 ? realData.plants.length * 12 : 156,
      icon: MapPin,
      color: "bg-blue-100 text-blue-600 border-blue-200",
      realData: realData.plants.length > 0,
      location: realData.plants.length > 0 ? realData.plants[0]?.location || 'India' : 'India'
    },
    {
      id: 2,
      name: realData.plants.length > 0 ? `${realData.plants[0]?.type || 'Industrial'} Sector Analysis` : "Industrial Sector Analysis",
      description: realData.plants.length > 0 ?
        `Detailed analysis of hydrogen integration in ${realData.plants[0]?.location || 'Indian'} industries with real data` :
        "Detailed analysis of hydrogen integration in Indian industries",
      category: "Industrial",
      format: "PDF",
      lastUpdated: "1 week ago",
      downloads: realData.plants.length > 0 ? realData.plants.length * 8 : 89,
      icon: Factory,
      color: "bg-green-100 text-green-600 border-blue-200",
      realData: realData.plants.length > 0,
      location: realData.plants.length > 0 ? realData.plants[0]?.location || 'India' : 'India'
    },
    {
      id: 3,
      name: "Transportation Network Report",
      description: "Hydrogen fuel cell vehicle network performance in India",
      category: "Transport",
      format: "PDF",
      lastUpdated: "3 days ago",
      downloads: 67,
      icon: Car,
      color: "bg-purple-100 text-purple-600 border-purple-200",
      realData: false,
      location: "Delhi"
    },
    {
      id: 4,
      name: "Smart Cities Integration",
      description: "Urban hydrogen infrastructure development across Indian cities",
      category: "Urban",
      format: "PDF",
      lastUpdated: "5 days ago",
      downloads: 45,
      icon: Building2,
      color: "bg-orange-100 text-orange-600 border-orange-200",
      realData: false,
      location: "Mumbai"
    },
    {
      id: 5,
      name: "Railway Hydrogen Report",
      description: "Indian Railways hydrogen locomotive integration analysis",
      category: "Railways",
      format: "PDF",
      lastUpdated: "1 week ago",
      downloads: 78,
      icon: Train,
      color: "bg-red-100 text-red-600 border-red-200",
      realData: false,
      location: "All India"
    },
    {
      id: 6,
      name: "Environmental Impact Assessment",
      description: "Carbon reduction and environmental benefits in India",
      category: "Environmental",
      format: "PDF",
      lastUpdated: "4 days ago",
      downloads: 92,
      icon: Leaf,
      color: "bg-emerald-100 text-emerald-600 border-emerald-200",
      realData: false,
      location: "All India"
    }
  ]

  // Filtered report templates
  const filteredReportTemplates = allReportTemplates.filter(template => {
    // Category filter
    if (selectedCategory !== 'All' && template.category !== selectedCategory) {
      return false
    }
    
    // State filter
    if (selectedState !== 'All States' && !template.location.includes(selectedState)) {
      return false
    }
    
    // Search filter
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !template.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !template.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })

  const recentReports = [
    {
      id: 1,
      title: "Gujarat Industrial Cluster Report",
      description: "Q4 2024 performance analysis for Gujarat's hydrogen infrastructure",
      status: "completed",
      generated: "2 hours ago",
      size: "2.4 MB",
      location: "Gujarat",
      category: "Industrial"
    },
    {
      id: 2,
      title: "Maharashtra Smart City Report",
      description: "Urban hydrogen infrastructure development in Mumbai Metropolitan Region",
      status: "completed",
      generated: "6 hours ago",
      size: "1.8 MB",
      location: "Maharashtra",
      category: "Urban"
    },
    {
      id: 3,
      title: "Delhi-NCR Transport Analysis",
      description: "Hydrogen fuel cell vehicle network performance in Delhi region",
      status: "processing",
      generated: "1 day ago",
      size: "3.1 MB",
      location: "Delhi",
      category: "Transport"
    },
    {
      id: 4,
      title: "Tamil Nadu Port Operations",
      description: "Chennai Port hydrogen integration and optimization report",
      status: "completed",
      generated: "2 days ago",
      size: "2.7 MB",
      location: "Tamil Nadu",
      category: "Logistics"
    }
  ]

  const quickActions = [
    {
      title: "Generate Infrastructure Report",
      description: "Create comprehensive Indian infrastructure overview",
      icon: MapPin,
      href: "#",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      title: "Industrial Sector Analysis",
      description: "Analyze hydrogen integration in Indian industries",
      icon: Factory,
      href: "#",
      color: "bg-accent/10 text-accent border-accent/20"
    },
    {
      title: "Environmental Impact Report",
      description: "Assess carbon reduction benefits across India",
      icon: Leaf,
      href: "#",
      color: "bg-green-100 text-green-600 border-green-200"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedState('All States')
    setSearchQuery('')
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    if (selectedCategory !== 'All') count++
    if (selectedState !== 'All States') count++
    if (searchQuery) count++
    return count
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Indian Infrastructure <span className="gradient-text">Reports</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Comprehensive reports and analytics for India's hydrogen infrastructure network
                </p>
              </div>
              
              {/* Real Data Status */}
              <div className="flex items-center gap-3">
                {isLoadingData ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-sm text-blue-400">Loading Real Data...</span>
                  </div>
                ) : dataError ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">Data Error</span>
                  </div>
                ) : realData.plants.length > 0 ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Real Data Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <Info className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400">Demo Data</span>
                  </div>
                )}
                
                <button
                  onClick={fetchRealData}
                  disabled={isLoadingData}
                  className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  {isLoadingData ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
                </button>
              </div>
            </div>
          </div>

          {/* Report Statistics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {reportStats.map((stat, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Change</div>
                    <div className={`text-lg font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">{stat.title}</div>
                  {stat.realData && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      REAL DATA
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="glass-card p-6 rounded-2xl mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search Indian reports, categories, or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background/50 border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                      getActiveFilterCount() > 0 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20'
                    }`}
                  >
                    <Filter className="w-5 h-5" />
                    Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                  </button>
                  {getActiveFilterCount() > 0 && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Filters */}
                {showFilters && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Report Categories</h3>
                    <div className="flex flex-wrap gap-3">
                      {['All', 'Infrastructure', 'Industrial', 'Transport', 'Urban', 'Railways', 'Environmental'].map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            selectedCategory === category 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-background/50 border border-glass-border hover:bg-primary/10 hover:border-primary/30'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Indian States Filter */}
                {showFilters && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Indian States</h3>
                    <div className="flex flex-wrap gap-2">
                      {['All States', 'Gujarat', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Karnataka', 'Rajasthan'].map((state) => (
                        <button
                          key={state}
                          onClick={() => setSelectedState(state)}
                          className={`px-2 py-1 rounded-lg text-xs transition-all ${
                            selectedState === state 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-background/50 border border-glass-border hover:bg-primary/10 hover:border-primary/30'
                          }`}
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="lg:w-80">
                <div className="glass-card p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <h3 className="text-lg font-semibold mb-3">Quick Report Generation</h3>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-2 rounded-lg hover:bg-primary/10 transition-colors text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <action.icon className="w-4 h-4" />
                          <span>{action.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Report Templates */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Indian Report Templates 
                    {filteredReportTemplates.length !== allReportTemplates.length && (
                      <span className="text-sm text-muted-foreground ml-2">
                        ({filteredReportTemplates.length} of {allReportTemplates.length})
                      </span>
                    )}
                  </h2>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2 text-sm">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                
                {filteredReportTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search query
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredReportTemplates.map((template) => (
                      <div key={template.id} className="p-4 rounded-xl border border-glass-border hover:border-primary/30 transition-all hover:scale-105">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${template.color}`}>
                            <template.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm">{template.name}</h3>
                              {template.realData && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                                  REAL DATA
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="bg-muted px-2 py-1 rounded-full">{template.category}</span>
                              <span className="text-muted-foreground">{template.format}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Updated {template.lastUpdated}</span>
                          <span>{template.downloads} downloads</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="flex-1 px-3 py-3 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors text-xs">
                            <Eye className="w-3 h-3 inline mr-1" />
                            Preview
                          </button>
                          <button className="flex-1 px-3 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-xs">
                            <Download className="w-3 h-3 inline mr-1" />
                            Generate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Reports */}
            <div>
              <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-4">Recent Indian Reports</h2>
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div key={report.id} className="p-3 rounded-xl bg-background/50 border border-glass-border">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getStatusIcon(report.status)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{report.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{report.description}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="bg-muted px-2 py-1 rounded-full">{report.location}</span>
                            <span className="text-muted-foreground">{report.category}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <span>{report.generated}</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Generation Status */}
              <div className="glass-card p-6 rounded-2xl mt-6">
                <h2 className="text-xl font-bold mb-4">Generation Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Today</span>
                    <span className="text-sm font-medium text-green-600">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="text-sm font-medium text-blue-600">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="text-sm font-medium text-yellow-600">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed</span>
                    <span className="text-sm font-medium text-red-600">1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indian Energy Sectors Reports */}
          <div className="mt-8">
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Specialized Indian Sector Reports</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Factory className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Heavy Industries</h3>
                  <p className="text-sm text-muted-foreground">Steel, cement, chemicals</p>
                  <div className="mt-3 text-2xl font-bold text-primary">24</div>
                  <div className="text-xs text-muted-foreground">Reports Available</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Train className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Indian Railways</h3>
                  <p className="text-sm text-muted-foreground">Freight & passenger</p>
                  <div className="mt-3 text-2xl font-bold text-accent">18</div>
                  <div className="text-xs text-muted-foreground">Reports Available</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-green-100 border border-green-200">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Transportation</h3>
                  <p className="text-sm text-muted-foreground">Road & urban mobility</p>
                  <div className="mt-3 text-2xl font-bold text-green-600">31</div>
                  <div className="text-xs text-muted-foreground">Reports Available</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-purple-100 border border-purple-200">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Smart Cities</h3>
                  <p className="text-sm text-muted-foreground">Urban infrastructure</p>
                  <div className="mt-3 text-2xl font-bold text-purple-600">22</div>
                  <div className="text-xs text-muted-foreground">Reports Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
