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
  Info
} from "lucide-react"

export default function ReportsPage() {
  // Mock data for Indian reports
  const reportStats = [
    {
      title: "Total Reports",
      value: "156",
      change: "+12",
      trend: "up",
      icon: FileText,
      color: "text-blue-500"
    },
    {
      title: "This Month",
      value: "23",
      change: "+5",
      trend: "up",
      icon: Calendar,
      color: "text-green-500"
    },
    {
      title: "Pending Reviews",
      value: "8",
      change: "-3",
      trend: "down",
      icon: Clock,
      color: "text-yellow-500"
    },
    {
      title: "Downloaded",
      value: "1,247",
      change: "+89",
      trend: "up",
      icon: Download,
      color: "text-purple-500"
    }
  ]

  const reportTemplates = [
    {
      id: 1,
      name: "Indian Infrastructure Overview",
      description: "Comprehensive report on India's hydrogen infrastructure network",
      category: "Infrastructure",
      format: "PDF",
      lastUpdated: "2 days ago",
      downloads: 156,
      icon: MapPin,
      color: "bg-blue-100 text-blue-600 border-blue-200"
    },
    {
      id: 2,
      name: "Industrial Sector Analysis",
      description: "Detailed analysis of hydrogen integration in Indian industries",
      category: "Industrial",
      format: "PDF",
      lastUpdated: "1 week ago",
      downloads: 89,
      icon: Factory,
      color: "bg-green-100 text-green-600 border-green-200"
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
      color: "bg-purple-100 text-purple-600 border-purple-200"
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
      color: "bg-orange-100 text-orange-600 border-orange-200"
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
      color: "bg-red-100 text-red-600 border-red-200"
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
      color: "bg-emerald-100 text-emerald-600 border-emerald-200"
    }
  ]

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Indian Infrastructure <span className="gradient-text">Reports</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive reports and analytics for India's hydrogen infrastructure network
            </p>
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
                <div className="text-muted-foreground">{stat.title}</div>
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
                      className="w-full pl-10 pr-4 py-3 bg-background/50 border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                  </div>
                  <button className="px-6 py-3 bg-primary/10 border border-primary/20 text-primary rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </button>
                </div>

                {/* Category Filters */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Report Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {['All', 'Infrastructure', 'Industrial', 'Transport', 'Urban', 'Railways', 'Environmental'].map((category) => (
                      <button
                        key={category}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          category === 'All' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-background/50 border border-glass-border hover:bg-primary/10 hover:border-primary/30'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Indian States Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Indian States</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All States', 'Gujarat', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Karnataka', 'Rajasthan'].map((state) => (
                      <button
                        key={state}
                        className={`px-2 py-1 rounded-lg text-xs transition-all ${
                          state === 'All States' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-background/50 border border-glass-border hover:bg-primary/10 hover:border-primary/30'
                        }`}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </div>
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
                  <h2 className="text-2xl font-bold">Indian Report Templates</h2>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2 text-sm">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="p-4 rounded-xl border border-glass-border hover:border-primary/30 transition-all hover:scale-105">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${template.color}`}>
                          <template.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
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
                        <button className="flex-1 px-3 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors text-xs">
                          <Eye className="w-3 h-3 inline mr-1" />
                          Preview
                        </button>
                        <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-xs">
                          <Download className="w-3 h-3 inline mr-1" />
                          Generate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
