"use client"

import { Navbar } from "@/components/navbar"
import { 
  TrendingUp, 
  Zap, 
  Leaf, 
  MapPin, 
  Activity, 
  Calendar,
  Clock,
  Target,
  BarChart3,
  Globe,
  Building2,
  Factory,
  Train,
  Car,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"

export default function DashboardPage() {
  // Mock data for Indian dashboard
  const performanceMetrics = [
    {
      title: "Total Production",
      value: "5.8 GW",
      change: "+15.2%",
      trend: "up",
      icon: Zap,
      color: "text-green-500"
    },
    {
      title: "Carbon Reduction",
      value: "4.2M tons",
      change: "+18.3%",
      trend: "up",
      icon: Leaf,
      color: "text-emerald-500"
    },
    {
      title: "Network Efficiency",
      value: "92.4%",
      change: "+3.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-500"
    },
    {
      title: "States Covered",
      value: "18",
      change: "+3",
      trend: "up",
      icon: MapPin,
      color: "text-purple-500"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "commissioned",
      title: "Gujarat Green H2 Plant",
      description: "100 MW solar-powered hydrogen plant commissioned successfully",
      time: "2 hours ago",
      status: "completed",
      location: "Gujarat"
    },
    {
      id: 2,
      type: "optimization",
      title: "Maharashtra Energy Hub",
      description: "Network optimization completed, efficiency improved by 12%",
      time: "4 hours ago",
      status: "completed",
      location: "Maharashtra"
    },
    {
      id: 3,
      type: "maintenance",
      title: "Rajasthan Solar Station",
      description: "Scheduled maintenance alert - plant will be offline for 6 hours",
      time: "6 hours ago",
      status: "warning",
      location: "Rajasthan"
    },
    {
      id: 4,
      type: "planned",
      title: "Tamil Nadu Coastal Hub",
      description: "New 80 MW offshore wind-hydrogen project approved",
      time: "1 day ago",
      status: "planned",
      location: "Tamil Nadu"
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "National Hydrogen Mission Review",
      date: "Dec 15, 2024",
      time: "10:00 AM",
      type: "meeting",
      participants: "Ministry Officials, Industry Leaders"
    },
    {
      id: 2,
      title: "Karnataka Smart Grid Commissioning",
      date: "Dec 18, 2024",
      time: "2:00 PM",
      type: "commissioning",
      participants: "State Officials, Technical Team"
    },
    {
      id: 3,
      title: "Steel Industry Hydrogen Integration Workshop",
      date: "Dec 20, 2024",
      time: "11:00 AM",
      type: "workshop",
      participants: "Industry Experts, Policy Makers"
    }
  ]

  const quickActions = [
    {
      title: "Run Network Optimization",
      description: "Optimize hydrogen network for Indian cities",
      icon: Zap,
      href: "/optimize",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      title: "Generate Indian Report",
      description: "Create comprehensive report for stakeholders",
      icon: BarChart3,
      href: "/reports",
      color: "bg-accent/10 text-accent border-accent/20"
    },
    {
      title: "View Infrastructure Map",
      description: "Explore Indian hydrogen infrastructure",
      icon: MapPin,
      href: "/map",
      color: "bg-green-100 text-green-600 border-green-200"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'planned':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="w-5 h-5 text-blue-500" />
      case 'commissioning':
        return <Zap className="w-5 h-5 text-green-500" />
      case 'workshop':
        return <Target className="w-5 h-5 text-purple-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
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
              Indian Infrastructure <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Monitor and manage India's hydrogen infrastructure network in real-time
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center`}>
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
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Recent Indian Activities</h2>
                  <a href="/map" className="text-primary hover:underline flex items-center gap-2 text-sm">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-glass-border hover:bg-background/80 transition-colors">
                      <div className="mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{activity.title}</h3>
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">{activity.location}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 rounded-xl bg-background/50 border border-glass-border">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {event.date} at {event.time}
                            </div>
                            <div className="text-xs">{event.participants}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6 rounded-2xl mt-6">
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
            </div>
          </div>

          {/* Indian Energy Sectors Overview */}
          <div className="mt-8">
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Powering India's Key Sectors</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Factory className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Steel & Cement</h3>
                  <p className="text-sm text-muted-foreground">Decarbonizing heavy industries</p>
                  <div className="mt-3 text-2xl font-bold text-primary">85.7%</div>
                  <div className="text-xs text-muted-foreground">Integration Rate</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Train className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Indian Railways</h3>
                  <p className="text-sm text-muted-foreground">Hydrogen-powered locomotives</p>
                  <div className="mt-3 text-2xl font-bold text-accent">12</div>
                  <div className="text-xs text-muted-foreground">Active Routes</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-green-100 border border-green-200">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Transportation</h3>
                  <p className="text-sm text-muted-foreground">Fuel cell vehicles & buses</p>
                  <div className="mt-3 text-2xl font-bold text-green-600">2,450</div>
                  <div className="text-xs text-muted-foreground">Active Vehicles</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-purple-100 border border-purple-200">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Smart Cities</h3>
                  <p className="text-sm text-muted-foreground">Urban energy infrastructure</p>
                  <div className="mt-3 text-2xl font-bold text-purple-600">8</div>
                  <div className="text-xs text-muted-foreground">Cities Integrated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
