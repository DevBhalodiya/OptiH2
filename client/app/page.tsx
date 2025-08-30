'use client';

import { Navbar } from "@/components/navbar"
import { StatsCards } from "@/components/stats-cards"
import { MapPin, Zap, FileText, Leaf, TrendingUp, BarChart3, ArrowRight, Globe, Building2, Factory, Train, Car } from "lucide-react"

export default function Page() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">OptiH2</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Accelerating India's transition to sustainable energy with advanced hydrogen infrastructure 
            <span className="text-primary font-semibold"> planning and optimization</span> for a net-zero future
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/map"
              className="group glass-button px-8 py-4 rounded-2xl text-lg font-semibold flex items-center gap-3 hover:scale-105 transition-transform duration-300"
            >
              <Globe className="w-5 h-5" />
              Explore Indian Infrastructure
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/optimize"
              className="glass-button px-8 py-4 rounded-2xl text-lg font-semibold flex items-center gap-3 hover:scale-105 transition-transform duration-300"
            >
              <Zap className="w-5 h-5" />
              Run Optimization
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powering India's <span className="gradient-text">Energy Revolution</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed for India's unique energy landscape and sustainability goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Indian Infrastructure Mapping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize hydrogen infrastructure across Indian states with real-time data and comprehensive analytics
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Optimization</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI-powered algorithms to optimize hydrogen networks for Indian cities and industrial clusters
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor performance metrics and track progress towards India's 2070 net-zero target
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Comprehensive Reports</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate detailed reports for Indian stakeholders, policymakers, and investors
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Performance Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track KPIs aligned with India's National Hydrogen Mission and sustainability goals
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Environmental Impact</h3>
              <p className="text-muted-foreground leading-relaxed">
                Calculate and visualize environmental benefits for India's climate action commitments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-8 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Ready to Transform India's Energy Future?</h3>
              <p className="text-muted-foreground text-lg">
                Choose your path to accelerate India's hydrogen revolution
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="/map"
                className="group p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 text-center"
              >
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">View Indian Infrastructure</h4>
                <p className="text-muted-foreground text-sm">Explore existing hydrogen infrastructure across Indian states</p>
              </a>
              
              <a
                href="/optimize"
                className="group p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 text-center"
              >
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Run Optimization</h4>
                <p className="text-muted-foreground text-sm">Optimize your hydrogen network for maximum efficiency</p>
              </a>
              
              <a
                href="/reports"
                className="group p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 text-center"
              >
                <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Generate Reports</h4>
                <p className="text-muted-foreground text-sm">Create comprehensive reports for Indian stakeholders</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Indian Hydrogen Plants */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Recent <span className="gradient-text">Indian Hydrogen Plants</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Latest additions to India's hydrogen infrastructure network
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Plant 1 */}
            <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Gujarat Green H2</h3>
              <p className="text-sm text-muted-foreground mb-3">Solar-powered electrolysis plant</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary font-medium">100 MW</span>
                <span className="text-muted-foreground">Gujarat</span>
              </div>
            </div>

            {/* Plant 2 */}
            <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Maharashtra Energy Hub</h3>
              <p className="text-sm text-muted-foreground mb-3">Wind-hydrogen integration</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary font-medium">75 MW</span>
                <span className="text-muted-foreground">Maharashtra</span>
              </div>
            </div>

            {/* Plant 3 */}
            <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Rajasthan Solar Station</h3>
              <p className="text-sm text-muted-foreground mb-3">Desert solar power plant</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary font-medium">150 MW</span>
                <span className="text-muted-foreground">Rajasthan</span>
              </div>
            </div>

            {/* Plant 4 */}
            <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Tamil Nadu Coastal Hub</h3>
              <p className="text-sm text-muted-foreground mb-3">Offshore wind integration</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary font-medium">80 MW</span>
                <span className="text-muted-foreground">Tamil Nadu</span>
              </div>
            </div>

            {/* Plant 5 */}
            <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Karnataka Smart Grid</h3>
              <p className="text-sm text-muted-foreground mb-3">Smart grid integration</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary font-medium">60 MW</span>
                <span className="text-muted-foreground">Karnataka</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <a
              href="/map"
              className="glass-button px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              View All Indian Plants
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Indian Energy Sectors */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powering India's <span className="gradient-text">Key Sectors</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hydrogen infrastructure optimization for India's major industries and transportation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Factory className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Steel & Cement</h3>
              <p className="text-muted-foreground text-sm">Decarbonizing heavy industries</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Train className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Railways</h3>
              <p className="text-muted-foreground text-sm">Hydrogen-powered locomotives</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Transportation</h3>
              <p className="text-muted-foreground text-sm">Fuel cell vehicles & buses</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Cities</h3>
              <p className="text-muted-foreground text-sm">Urban energy infrastructure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <StatsCards />
        </div>
      </section>
    </>
  )
}
