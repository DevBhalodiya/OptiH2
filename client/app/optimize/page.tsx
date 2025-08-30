"use client"

import { Navbar } from "@/components/navbar"
import { 
  Zap, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  MapPin,
  Leaf,
  Factory,
  Train,
  Car,
  Building2,
  ArrowRight,
  Play,
  Settings,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"

export default function OptimizePage() {
  // Mock data for Indian optimization scenarios
  const optimizationScenarios = [
    {
      id: 1,
      name: "Gujarat Industrial Cluster",
      description: "Optimize hydrogen distribution for steel and cement industries",
      type: "Industrial",
      status: "completed",
      efficiency: "94.2%",
      savings: "₹2.8 Cr/year",
      location: "Gujarat",
      icon: Factory
    },
    {
      id: 2,
      name: "Mumbai Metropolitan Region",
      description: "Smart city hydrogen infrastructure optimization",
      type: "Urban",
      status: "running",
      efficiency: "89.7%",
      savings: "₹1.5 Cr/year",
      location: "Maharashtra",
      icon: Building2
    },
    {
      id: 3,
      name: "Delhi-NCR Transport Hub",
      description: "Hydrogen fuel cell vehicle network optimization",
      type: "Transport",
      status: "planned",
      efficiency: "87.3%",
      savings: "₹3.2 Cr/year",
      location: "Delhi",
      icon: Car
    },
    {
      id: 4,
      name: "Chennai Port Complex",
      description: "Port operations hydrogen integration optimization",
      type: "Logistics",
      status: "completed",
      efficiency: "91.8%",
      savings: "₹1.9 Cr/year",
      location: "Tamil Nadu",
      icon: MapPin
    }
  ]

  const optimizationMetrics = [
    {
      title: "Network Efficiency",
      value: "92.4%",
      change: "+3.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Cost Savings",
      value: "₹9.4 Cr",
      change: "+18.2%",
      trend: "up",
      icon: Target,
      color: "text-blue-500"
    },
    {
      title: "Carbon Reduction",
      value: "4.2M tons",
      change: "+15.7%",
      trend: "up",
      icon: Leaf,
      color: "text-emerald-500"
    },
    {
      title: "Active Optimizations",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Zap,
      color: "text-purple-500"
    }
  ]

  const quickActions = [
    {
      title: "Industrial Cluster Optimization",
      description: "Optimize heavy industries in Gujarat and Maharashtra",
      icon: Factory,
      href: "#",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      title: "Smart City Integration",
      description: "Optimize urban hydrogen infrastructure",
      icon: Building2,
      href: "#",
      color: "bg-accent/10 text-accent border-accent/20"
    },
    {
      title: "Transportation Network",
      description: "Optimize hydrogen fuel cell vehicle networks",
      icon: Car,
      href: "#",
      color: "bg-green-100 text-green-600 border-green-200"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'running':
        return <Play className="w-5 h-5 text-blue-500" />
      case 'planned':
        return <Info className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
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
              Indian Network <span className="gradient-text">Optimization</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-powered optimization for India's hydrogen infrastructure networks
            </p>
          </div>

          {/* Optimization Controls */}
          <div className="glass-card p-6 rounded-2xl mb-8">
            <h2 className="text-2xl font-bold mb-6">Optimization Parameters</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Optimization Type</label>
                <select className="w-full p-3 bg-background/50 border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40">
                  <option>Industrial Clusters</option>
                  <option>Urban Infrastructure</option>
                  <option>Transportation Networks</option>
                  <option>Port Operations</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Time Horizon</label>
                <select className="w-full p-3 bg-background/50 border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40">
                  <option>1 Year</option>
                  <option>3 Years</option>
                  <option>5 Years</option>
                  <option>10 Years</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select className="w-full p-3 bg-background/50 border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40">
                  <option>Cost Efficiency</option>
                  <option>Carbon Reduction</option>
                  <option>Network Reliability</option>
                  <option>Balanced Approach</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Geographic Scope</label>
                <select className="w-full p-3 bg-background/50 border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40">
                  <option>All India</option>
                  <option>North India</option>
                  <option>South India</option>
                  <option>East India</option>
                  <option>West India</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <button className="glass-button px-8 py-3 rounded-xl text-lg font-semibold flex items-center gap-3 hover:scale-105 transition-transform">
                <Play className="w-5 h-5" />
                Run Optimization
              </button>
              <button className="px-8 py-3 bg-background/50 border border-glass-border text-foreground rounded-xl text-lg font-semibold flex items-center gap-3 hover:bg-background/80 transition-colors">
                <Settings className="w-5 h-5" />
                Advanced Settings
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {optimizationMetrics.map((metric, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Change</div>
                    <div className="text-lg font-semibold text-green-600">{metric.change}</div>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                <div className="text-muted-foreground">{metric.title}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Optimizations */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Recent Indian Optimizations</h2>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2 text-sm">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="space-y-4">
                  {optimizationScenarios.map((scenario) => (
                    <div key={scenario.id} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-glass-border hover:bg-background/80 transition-colors">
                      <div className="mt-1">
                        {getStatusIcon(scenario.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{scenario.name}</h3>
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">{scenario.location}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{scenario.type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="font-medium">{scenario.efficiency}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{scenario.savings}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <a
                      key={index}
                      href={action.href}
                      className="flex items-center gap-3 p-3 rounded-xl border hover:scale-105 transition-all duration-300 group"
                      style={{ 
                        backgroundColor: action.color.split(' ')[0].replace('bg-', ''),
                        borderColor: action.color.split(' ')[2]?.replace('border-', '') || 'transparent'
                      }}
                    >
                      <action.icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs opacity-80">{action.description}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Performance vs Targets */}
              <div className="glass-card p-6 rounded-2xl mt-6">
                <h2 className="text-xl font-bold mb-4">Performance vs Targets</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network Efficiency</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">92.4%</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '92.4%' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">95%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost Reduction</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">18.2%</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '18.2%' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">25%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Carbon Reduction</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">15.7%</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15.7%' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indian Energy Sectors */}
          <div className="mt-8">
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Optimizing India's Energy Sectors</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Factory className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Heavy Industries</h3>
                  <p className="text-sm text-muted-foreground">Steel, cement, chemicals</p>
                  <div className="mt-3 text-2xl font-bold text-primary">85.7%</div>
                  <div className="text-xs text-muted-foreground">Optimization Rate</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Train className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Railways</h3>
                  <p className="text-sm text-muted-foreground">Freight & passenger</p>
                  <div className="mt-3 text-2xl font-bold text-accent">78.3%</div>
                  <div className="text-xs text-muted-foreground">Optimization Rate</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-green-100 border border-green-200">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Transportation</h3>
                  <p className="text-sm text-muted-foreground">Road & urban mobility</p>
                  <div className="mt-3 text-2xl font-bold text-green-600">82.1%</div>
                  <div className="text-xs text-muted-foreground">Optimization Rate</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-purple-100 border border-purple-200">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Smart Cities</h3>
                  <p className="text-sm text-muted-foreground">Urban infrastructure</p>
                  <div className="mt-3 text-2xl font-bold text-purple-600">76.9%</div>
                  <div className="text-xs text-muted-foreground">Optimization Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
