"use client"

import { 
  Zap, 
  Leaf, 
  MapPin, 
  TrendingUp, 
  Globe, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Factory
} from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Total Production Capacity",
      value: "5.8 GW",
      change: "+15.2%",
      trend: "up",
      icon: Zap,
      color: "primary",
      description: "Annual hydrogen production across India"
    },
    {
      title: "Carbon Reduction",
      value: "4.2M tons",
      change: "+18.3%",
      trend: "up",
      icon: Leaf,
      color: "green",
      description: "CO2 emissions avoided annually"
    },
    {
      title: "Active Plants",
      value: "67",
      change: "+8",
      trend: "up",
      icon: MapPin,
      color: "blue",
      description: "Operational hydrogen facilities"
    },
    {
      title: "Network Efficiency",
      value: "92.4%",
      change: "+3.1%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
      description: "Overall system performance"
    },
    {
      title: "States Covered",
      value: "18",
      change: "+3",
      trend: "up",
      icon: Globe,
      color: "orange",
      description: "Indian states with infrastructure"
    },
    {
      title: "Industrial Integration",
      value: "85.7%",
      change: "+2.3%",
      trend: "up",
      icon: Factory,
      color: "red",
      description: "Heavy industry adoption rate"
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'text-primary'
      case 'green':
        return 'text-green-400'
      case 'blue':
        return 'text-blue-400'
      case 'purple':
        return 'text-purple-400'
      case 'orange':
        return 'text-orange-400'
      case 'red':
        return 'text-red-400'
      default:
        return 'text-primary'
    }
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
          {/* Header with Icon and Trend */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color)} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {stat.change}
            </div>
          </div>
          
          {/* Main Value */}
          <div className="mb-2">
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <h3 className="text-lg font-semibold text-white">{stat.title}</h3>
          </div>
          
          {/* Description */}
          <p className="text-sm text-white/80 leading-relaxed">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  )
}
