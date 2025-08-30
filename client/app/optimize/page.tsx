import { Navbar } from "@/components/navbar"
import { OptimizationPanel } from "@/components/optimization/optimization-panel"
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Calculator,
  Lightbulb
} from "lucide-react"

export default function OptimizePage() {
  // Mock optimization scenarios
  const optimizationScenarios = [
    {
      id: 1,
      name: "Production Efficiency",
      description: "Optimize hydrogen production across all plants",
      status: "completed",
      improvement: "+15.2%",
      duration: "2h 34m",
      icon: TrendingUp
    },
    {
      id: 2,
      name: "Distribution Network",
      description: "Optimize pipeline routing and storage allocation",
      status: "running",
      improvement: "+8.7%",
      duration: "1h 12m",
      icon: Target
    },
    {
      id: 3,
      name: "Renewable Integration",
      description: "Maximize renewable energy utilization",
      status: "queued",
      improvement: "+12.1%",
      duration: "3h 45m",
      icon: Lightbulb
    }
  ]

  const optimizationMetrics = [
    {
      name: "Current Efficiency",
      value: "87.3%",
      target: "95.0%",
      progress: 87.3,
      color: "primary"
    },
    {
      name: "Production Capacity",
      value: "2.4 GW",
      target: "3.0 GW",
      progress: 80.0,
      color: "accent"
    },
    {
      name: "Carbon Reduction",
      value: "1.8M tons",
      target: "2.5M tons",
      progress: 72.0,
      color: "green"
    },
    {
      name: "Cost Efficiency",
      value: "$0.42/kWh",
      target: "$0.35/kWh",
      progress: 83.3,
      color: "purple"
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
              Network <span className="gradient-text">Optimization</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Advanced algorithms to optimize hydrogen production, distribution, and storage networks
            </p>
          </div>

          {/* Optimization Controls */}
          <div className="glass-card p-6 rounded-2xl mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Controls */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Optimization Engine</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Optimization Type
                      </label>
                      <select className="w-full px-4 py-3 bg-background/50 border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all">
                        <option>Production Efficiency</option>
                        <option>Distribution Network</option>
                        <option>Renewable Integration</option>
                        <option>Cost Optimization</option>
                        <option>Custom Scenario</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Time Horizon
                      </label>
                      <select className="w-full px-4 py-3 bg-background/50 border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all">
                        <option>24 Hours</option>
                        <option>7 Days</option>
                        <option>30 Days</option>
                        <option>90 Days</option>
                        <option>1 Year</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Optimization Level
                      </label>
                      <select className="w-full px-4 py-3 bg-background/50 border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all">
                        <option>Conservative</option>
                        <option>Balanced</option>
                        <option>Aggressive</option>
                        <option>Maximum</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Constraints
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-glass-border" />
                          <span className="text-sm">Budget Limits</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-glass-border" />
                          <span className="text-sm">Safety Requirements</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-glass-border" />
                          <span className="text-sm">Environmental Impact</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
                    <Play className="w-5 h-5" />
                    Start Optimization
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-colors font-medium">
                    <Pause className="w-5 h-5" />
                    Pause
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-colors font-medium">
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="lg:w-80 space-y-4">
                <div className="glass-card p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <h3 className="text-lg font-semibold mb-2">Current Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engine Status:</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Run:</span>
                      <span className="font-medium">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Scheduled:</span>
                      <span className="font-medium">Tomorrow 2:00 AM</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <h3 className="text-lg font-semibold mb-2">Performance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="text-green-600 font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Improvement:</span>
                      <span className="text-green-600 font-medium">+12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Time:</span>
                      <span className="font-medium">2.1 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Metrics */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Current Performance vs Targets</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {optimizationMetrics.map((metric, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{metric.name}</h3>
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">Target: {metric.target}</div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.color === 'primary' ? 'bg-primary' :
                        metric.color === 'accent' ? 'bg-accent' :
                        metric.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${metric.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {metric.progress.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Optimizations */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Recent Optimizations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {optimizationScenarios.map((scenario) => (
                <div key={scenario.id} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <scenario.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      scenario.status === 'completed' ? 'bg-green-100 text-green-700' :
                      scenario.status === 'running' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {scenario.status === 'completed' ? <CheckCircle className="w-3 h-3 inline mr-1" /> :
                       scenario.status === 'running' ? <Clock className="w-3 h-3 inline mr-1" /> :
                       <AlertCircle className="w-3 h-3 inline mr-1" />}
                      {scenario.status}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{scenario.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {scenario.improvement}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {scenario.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Optimization Panel */}
          <section className="glass-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Advanced Optimization Tools</h2>
            <OptimizationPanel />
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
                href="/reports"
                className="glass-button px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Info className="w-4 h-4" />
                Generate Report
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
