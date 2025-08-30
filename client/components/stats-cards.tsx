"use client"

import { 
  Zap, 
  Leaf, 
  MapPin, 
  TrendingUp, 
  Globe, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Total Production",
      value: "2.4 TWh",
      change: "+12.5%",
      trend: "up",
      icon: Zap,
      color: "primary",
      description: "Annual hydrogen production capacity"
    },
    {
      title: "Carbon Reduction",
      value: "1.8M tons",
      change: "+18.3%",
      trend: "up",
      icon: Leaf,
      color: "green",
      description: "CO2 emissions avoided annually"
    },
    {
      title: "Active Plants",
      value: "41",
      change: "+3",
      trend: "up",
      icon: MapPin,
      color: "blue",
      description: "Operational hydrogen facilities"
    },
    {
      title: "Network Efficiency",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
      description: "Overall system performance"
    },
    {
      title: "Geographic Coverage",
      value: "12 States",
      change: "+2",
      trend: "up",
      icon: Globe,
      color: "orange",
      description: "States with infrastructure"
    },
    {
      title: "Uptime",
      value: "98.7%",
      change: "-0.3%",
      trend: "down",
      icon: Activity,
      color: "red",
      description: "System availability"
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'green':
        return 'bg-green-100 text-green-600 border-green-200'
      case 'blue':
        return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'purple':
        return 'bg-purple-100 text-purple-600 border-purple-200'
      case 'orange':
        return 'bg-orange-100 text-orange-600 border-orange-200'
      case 'red':
        return 'bg-red-100 text-red-600 border-red-200'
      default:
        return 'bg-primary/10 text-primary border-primary/20'
    }
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
          {/* Header with Icon and Trend */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getColorClasses(stat.color)} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {stat.change}
            </div>
          </div>
          
          {/* Main Value */}
          <div className="mb-2">
            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            <h3 className="text-lg font-semibold text-foreground">{stat.title}</h3>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {stat.description}
          </p>
          
          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      ))}
    </div>
  )
}
