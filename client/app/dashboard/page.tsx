import { Navbar } from "@/components/navbar"
import { StatsCards } from "@/components/stats-cards"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Leaf, 
  MapPin, 
  BarChart3, 
  Clock,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

export default function DashboardPage() {
  // Mock data for dashboard
  const recentActivities = [
    {
      id: 1,
      type: "Plant Commissioned",
      plant: "Green Valley H2",
      location: "California, USA",
      time: "2 hours ago",
      status: "success",
      icon: CheckCircle
    },
    {
      id: 2,
      type: "Optimization Complete",
      plant: "Coastal Energy Hub",
      location: "Texas, USA",
      time: "4 hours ago",
      status: "success",
      icon: CheckCircle
    },
    {
      id: 3,
      type: "Maintenance Alert",
      plant: "Desert Sun Station",
      location: "Arizona, USA",
      time: "6 hours ago",
      status: "warning",
      icon: AlertCircle
    },
    {
      id: 4,
      type: "Production Peak",
      plant: "Mountain Peak H2",
      location: "Colorado, USA",
      time: "8 hours ago",
      status: "success",
      icon: TrendingUp
    }
  ]

  const performanceMetrics = [
    {
      name: "Total Production",
      value: "2.4 TWh",
      change: "+12.5%",
      trend: "up",
      icon: Zap
    },
    {
      name: "Efficiency Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Target
    },
    {
      name: "Carbon Reduction",
      value: "1.8M tons",
      change: "+18.3%",
      trend: "up",
      icon: Leaf
    },
    {
      name: "Uptime",
      value: "98.7%",
      change: "-0.3%",
      trend: "down",
      icon: Activity
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Plant Maintenance",
      plant: "Urban Green Hub",
      date: "Tomorrow",
      time: "09:00 AM",
      type: "maintenance"
    },
    {
      id: 2,
      title: "Optimization Run",
      plant: "Green Valley H2",
      date: "Dec 2",
      time: "02:00 PM",
      type: "optimization"
    },
    {
      id: 3,
      title: "Performance Review",
      plant: "All Plants",
      date: "Dec 5",
      time: "10:00 AM",
      type: "review"
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
              Dashboard <span className="gradient-text">Overview</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Monitor your hydrogen infrastructure performance and track key metrics
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-12">
            <StatsCards />
          </div>

          {/* Performance Metrics */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Performance Metrics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <metric.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {metric.change}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                  <p className="text-muted-foreground text-sm">{metric.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <section className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Activities</h2>
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-glass-border">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{activity.type}</h4>
                      <p className="text-sm text-muted-foreground">{activity.plant} • {activity.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Events */}
            <section className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-glass-border">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.type === 'maintenance' ? 'bg-blue-100 text-blue-600' : 
                      event.type === 'optimization' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {event.type === 'maintenance' ? <Clock className="w-5 h-5" /> :
                       event.type === 'optimization' ? <Zap className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.plant}</p>
                      <p className="text-xs text-muted-foreground mt-1">{event.date} at {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Quick Actions */}
          <section className="mt-12">
            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-center mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <a
                  href="/map"
                  className="group p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 text-center hover:scale-105"
                >
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">View Map</h3>
                  <p className="text-muted-foreground text-sm">Explore infrastructure locations and status</p>
                </a>
                
                <a
                  href="/optimize"
                  className="group p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 text-center hover:scale-105"
                >
                  <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Run Optimization</h3>
                  <p className="text-muted-foreground text-sm">Optimize your hydrogen network</p>
                </a>
                
                <a
                  href="/reports"
                  className="group p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 text-center hover:scale-105"
                >
                  <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Generate Reports</h3>
                  <p className="text-muted-foreground text-sm">Create detailed performance reports</p>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
