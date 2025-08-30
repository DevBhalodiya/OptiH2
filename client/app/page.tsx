'use client';

import { Navbar } from "@/components/navbar"
import { MapPin, Zap, Globe, BarChart, BarChart3, TrendingUp, ArrowRight, Leaf, Clock, FileText } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-emerald-500" />,
      title: "Interactive Map",
      description: "Visualize hydrogen infrastructure with our intuitive mapping tool"
    },
    {
      icon: <Zap className="w-8 h-8 text-emerald-500" />,
      title: "Smart Optimization",
      description: "Optimize hydrogen production and distribution networks"
    },
    {
      icon: <Globe className="w-8 h-8 text-emerald-500" />,
      title: "Global Data",
      description: "Access comprehensive hydrogen infrastructure data"
    },
    {
      icon: <BarChart className="w-8 h-8 text-emerald-500" />,
      title: "Analytics Dashboard",
      description: "Track performance metrics and KPIs in real-time"
    },
    {
      icon: <Leaf className="w-8 h-8 text-emerald-500" />,
      title: "Sustainability",
      description: "Reduce carbon footprint with data-driven decisions"
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-500" />,
      title: "24/7 Monitoring",
      description: "Continuous tracking of your hydrogen infrastructure"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Powering the Future with 
            <span className="bg-gradient-to-r from-emerald-500 to-sky-600 text-transparent bg-clip-text">
              {' '}Green Hydrogen
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Optimizing hydrogen infrastructure for a sustainable, net-zero future through advanced analytics and smart planning.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/map"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-sky-600 text-white font-medium rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Explore the Map
            </Link>
            <Link 
              href="/optimize"
              className="px-8 py-4 border-2 border-emerald-500 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-all"
            >
              Start Optimization
            </Link>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-0 w-96 h-96 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to Optimize Hydrogen Infrastructure
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Our platform provides comprehensive tools for hydrogen infrastructure planning and optimization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-sky-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Hydrogen Infrastructure?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join leading organizations in optimizing their hydrogen networks for a sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/map"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-sky-600 text-white font-medium rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started for Free
            </Link>
            <Link 
              href="/about"
              className="px-8 py-4 border-2 border-emerald-500 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-emerald-600 mb-2">100+</div>
              <div className="text-gray-600">Projects Optimized</div>
            </div>
            <div className="p-8 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-emerald-600 mb-2">50+</div>
              <div className="text-gray-600">Global Partners</div>
            </div>
            <div className="p-8 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-emerald-600 mb-2">1M+</div>
              <div className="text-gray-600">Tons CO₂ Reduced</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Quick Actions</h3>
              <p className="text-muted-foreground text-lg">
                Get started with these quick actions
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/map"
                className="group p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 text-center"
              >
                <MapPin className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">View Infrastructure</h4>
                <p className="text-muted-foreground text-sm">Explore existing hydrogen infrastructure and identify opportunities</p>
              </Link>
              
              <Link
                href="/optimize"
                className="group p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 text-center"
              >
                <Zap className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Run Optimization</h4>
                <p className="text-muted-foreground text-sm">Optimize your hydrogen network for maximum efficiency</p>
              </Link>
              
              <Link
                href="/reports"
                className="group p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 text-center"
              >
                <FileText className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Generate Reports</h4>
                <p className="text-muted-foreground text-sm">Create comprehensive reports and export your data</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Plants Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Hydrogen Plants</h2>
            <p className="text-xl text-gray-600">Latest additions to our hydrogen infrastructure network</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {/* Plant 1 */}
              <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Green Valley H2</h3>
                <p className="text-sm text-muted-foreground mb-3">Solar-powered electrolysis plant</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary font-medium">50 MW</span>
                  <span className="text-muted-foreground">Active</span>
                </div>
              </div>

              {/* Plant 2 */}
              <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Coastal Energy Hub</h3>
                <p className="text-sm text-muted-foreground mb-3">Offshore wind integration</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary font-medium">75 MW</span>
                  <span className="text-muted-foreground">Active</span>
                </div>
              </div>

              {/* Plant 3 */}
              <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Desert Sun Station</h3>
                <p className="text-sm text-muted-foreground mb-3">Concentrated solar power</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary font-medium">100 MW</span>
                  <span className="text-muted-foreground">Active</span>
                </div>
              </div>

              {/* Plant 4 */}
              <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Mountain Peak H2</h3>
                <p className="text-sm text-muted-foreground mb-3">Hydroelectric integration</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary font-medium">60 MW</span>
                  <span className="text-muted-foreground">Active</span>
                </div>
              </div>

              {/* Plant 5 */}
              <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Urban Green Hub</h3>
                <p className="text-sm text-muted-foreground mb-3">Smart grid integration</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary font-medium">40 MW</span>
                  <span className="text-muted-foreground">Active</span>
                </div>
              </div>
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/map"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors gap-2 hover:scale-105"
            >
              View All Plants
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
