import { Navbar } from "@/components/navbar"
import { ReportsTable } from "@/components/reports/reports-table"
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Plus, 
  Filter,
  Search,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Zap,
  Leaf,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export default function ReportsPage() {
  // Mock report templates
  const reportTemplates = [
    {
      id: 1,
      name: "Monthly Performance Report",
      description: "Comprehensive overview of network performance and KPIs",
      category: "Performance",
      icon: BarChart3,
      lastGenerated: "2 days ago",
      status: "available"
    },
    {
      id: 2,
      name: "Environmental Impact Assessment",
      description: "Carbon reduction metrics and sustainability analysis",
      category: "Environmental",
      icon: Leaf,
      lastGenerated: "1 week ago",
      status: "available"
    },
    {
      id: 3,
      name: "Network Optimization Results",
      description: "Detailed analysis of optimization algorithms and outcomes",
      category: "Optimization",
      icon: TrendingUp,
      lastGenerated: "3 days ago",
      status: "available"
    },
    {
      id: 4,
      name: "Infrastructure Status Report",
      description: "Current status of all plants and facilities",
      category: "Infrastructure",
      icon: Globe,
      lastGenerated: "1 day ago",
      status: "available"
    },
    {
      id: 5,
      name: "Cost Analysis Report",
      description: "Financial performance and cost optimization insights",
      category: "Financial",
      icon: TrendingUp,
      lastGenerated: "5 days ago",
      status: "available"
    },
    {
      id: 6,
      name: "Custom Analytics Report",
      description: "Build your own report with custom parameters",
      category: "Custom",
      icon: Plus,
      lastGenerated: "Never",
      status: "template"
    }
  ]

  const recentReports = [
    {
      id: 1,
      name: "November Performance Report",
      type: "Monthly Performance",
      generated: "2 days ago",
      size: "2.4 MB",
      status: "completed",
      downloads: 12
    },
    {
      id: 2,
      name: "Q4 Optimization Analysis",
      type: "Network Optimization",
      generated: "1 week ago",
      size: "1.8 MB",
      status: "completed",
      downloads: 8
    },
    {
      id: 3,
      name: "Environmental Impact Q4",
      type: "Environmental Assessment",
      generated: "2 weeks ago",
      size: "3.2 MB",
      status: "completed",
      downloads: 15
    }
  ]

  const reportStats = [
    {
      name: "Total Reports",
      value: "156",
      change: "+12",
      trend: "up",
      icon: FileText
    },
    {
      name: "This Month",
      value: "23",
      change: "+5",
      trend: "up",
      icon: Calendar
    },
    {
      name: "Downloads",
      value: "1,247",
      change: "+89",
      trend: "up",
      icon: Download
    },
    {
      name: "Active Users",
      value: "89",
      change: "+12",
      trend: "up",
      icon: Users
    }
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Reports & <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Generate comprehensive reports, export data, and gain insights into your hydrogen infrastructure
            </p>
          </div>

          {/* Report Stats */}
          <section className="mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportStats.map((stat, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-muted-foreground text-sm">{stat.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Report Templates */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Report Templates</h2>
              <button className="glass-button px-4 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
                Create Custom Report
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTemplates.map((template) => (
                <div key={template.id} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <template.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {template.status === 'available' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <AlertCircle className="w-3 h-3 inline mr-1" />}
                      {template.status}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-primary font-medium">{template.category}</span>
                    <span className="text-muted-foreground">Last: {template.lastGenerated}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      Generate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Reports */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Reports</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-10 pr-4 py-2 bg-background/50 border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                  />
                </div>
                <button className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl">
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-glass-border hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.type} • {report.size}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Generated {report.generated}</div>
                        <div className="text-sm text-muted-foreground">{report.downloads} downloads</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-100 border border-red-200 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Reports Table */}
          <section className="glass-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">All Reports</h2>
            <ReportsTable />
          </section>

          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <div className="inline-flex gap-4">
              <a
                href="/dashboard"
                className="glass-button px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <BarChart3 className="w-4 h-4" />
                View Dashboard
              </a>
              <a
                href="/map"
                className="glass-button px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Globe className="w-4 h-4" />
                Explore Map
              </a>
              <a
                href="/optimize"
                className="glass-button px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Zap className="w-4 h-4" />
                Run Optimization
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
