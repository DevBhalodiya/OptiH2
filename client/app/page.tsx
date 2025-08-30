'use client';

import { Navbar } from "@/components/navbar"
import { StatsCards } from "@/components/stats-cards"
import { EarthBackground } from "@/components/earth-background"
import { MapPin, Zap, FileText, Leaf, TrendingUp, BarChart3, ArrowRight, Globe, Building2, Factory, Train, Car } from "lucide-react"

export default function Page() {
  return (
    <>
      <EarthBackground />
      <Navbar />
      
            {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-end overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 text-right max-w-4xl px-8 mr-8 md:mr-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="text-white">OptiH2</span>
          </h1>
          
          <div className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl ml-auto leading-relaxed">
            <p className="mb-2">Accelerating India's transition to sustainable energy</p>
            <p className="mb-2">with advanced hydrogen infrastructure</p>
            <p><span className="text-white font-semibold">planning and optimization</span> for a net-zero future</p>
          </div>
        
          <div className="flex flex-col sm:flex-row gap-4 items-end justify-end">
            <a
              href="/map"
              className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold flex items-center gap-3 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <Globe className="w-5 h-5" />
              Explore Indian Infrastructure
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/optimize"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold flex items-center gap-3 hover:bg-white/20 hover:scale-105 transition-all duration-300"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Powering India's <span className="text-white">Energy Revolution</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Comprehensive tools designed for India's unique energy landscape and sustainability goals
            </p>
          </div>
          
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                 <MapPin className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-2xl font-bold mb-4 text-white">Indian Infrastructure Mapping</h3>
               <p className="text-white/80 leading-relaxed">
                 Visualize hydrogen infrastructure across Indian states with real-time data and comprehensive analytics
               </p>
             </div>
            
                         <div className="p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                 <Zap className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-2xl font-bold mb-4 text-white">Smart Optimization</h3>
               <p className="text-white/80 leading-relaxed">
                 AI-powered algorithms to optimize hydrogen networks for Indian cities and industrial clusters
               </p>
             </div>
            
                         <div className="p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                 <BarChart3 className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-2xl font-bold mb-4 text-white">Real-time Analytics</h3>
               <p className="text-white/80 leading-relaxed">
                 Monitor performance metrics and track progress towards India's 2070 net-zero target
               </p>
             </div>
            
                         <div className="p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                 <FileText className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-2xl font-bold mb-4 text-white">Comprehensive Reports</h3>
               <p className="text-white/80 leading-relaxed">
                 Generate detailed reports for Indian stakeholders, policymakers, and investors
               </p>
             </div>
            
                         <div className="p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                 <TrendingUp className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-2xl font-bold mb-4 text-white">Performance Tracking</h3>
               <p className="text-white/80 leading-relaxed">
                 Track KPIs aligned with India's National Hydrogen Mission and sustainability goals
               </p>
             </div>
            
                         <div className="p-8 rounded-3xl hover:scale-105 transition-all duration-300 group">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                 <Leaf className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-2xl font-bold mb-4 text-white">Environmental Impact</h3>
               <p className="text-white/80 leading-relaxed">
                 Calculate and visualize environmental benefits for India's climate action commitments
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
                     <div className="p-8 rounded-3xl">
             <div className="text-center mb-8">
               <h3 className="text-3xl font-bold mb-4 text-white">Ready to Transform India's Energy Future?</h3>
               <p className="text-white/80 text-lg">
                 Choose your path to accelerate India's hydrogen revolution
               </p>
             </div>
            
            <div className="grid md:grid-cols-3 gap-6">
                             <a
                 href="/map"
                 className="group p-6 rounded-2xl hover:scale-105 transition-all duration-300 text-center"
               >
                 <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                 <h4 className="text-xl font-semibold mb-2 text-white">View Indian Infrastructure</h4>
                 <p className="text-white/80 text-sm">Explore existing hydrogen infrastructure across Indian states</p>
               </a>
              
                             <a
                 href="/optimize"
                 className="group p-6 rounded-2xl hover:scale-105 transition-all duration-300 text-center"
               >
                 <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                 <h4 className="text-xl font-semibold mb-2 text-white">Run Optimization</h4>
                 <p className="text-white/80 text-sm">Optimize your hydrogen network for maximum efficiency</p>
               </a>
              
                             <a
                 href="/reports"
                 className="group p-6 rounded-2xl hover:scale-105 transition-all duration-300 text-center"
               >
                 <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                 <h4 className="text-xl font-semibold mb-2 text-white">Generate Reports</h4>
                 <p className="text-white/80 text-sm">Create comprehensive reports for Indian stakeholders</p>
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Indian Hydrogen Plants */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Recent <span className="text-white">Indian Hydrogen Plants</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Latest additions to India's hydrogen infrastructure network
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                         {/* Plant 1 */}
             <div className="p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                 <Leaf className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-white">Gujarat Green H2</h3>
               <p className="text-sm text-white/80 mb-3">Solar-powered electrolysis plant</p>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-primary font-medium">100 MW</span>
                 <span className="text-white/80">Gujarat</span>
               </div>
             </div>

                         {/* Plant 2 */}
             <div className="p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                 <Zap className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-white">Maharashtra Energy Hub</h3>
               <p className="text-sm text-white/80 mb-3">Wind-hydrogen integration</p>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-primary font-medium">75 MW</span>
                 <span className="text-white/80">Maharashtra</span>
               </div>
             </div>

                         {/* Plant 3 */}
             <div className="p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                 <MapPin className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-white">Rajasthan Solar Station</h3>
               <p className="text-sm text-white/80 mb-3">Desert solar power plant</p>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-primary font-medium">150 MW</span>
                 <span className="text-white/80">Rajasthan</span>
               </div>
             </div>

                         {/* Plant 4 */}
             <div className="p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                 <TrendingUp className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-white">Tamil Nadu Coastal Hub</h3>
               <p className="text-sm text-white/80 mb-3">Offshore wind integration</p>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-primary font-medium">80 MW</span>
                 <span className="text-white/80">Tamil Nadu</span>
               </div>
             </div>

                         {/* Plant 5 */}
             <div className="p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                 <BarChart3 className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-white">Karnataka Smart Grid</h3>
               <p className="text-sm text-white/80 mb-3">Smart grid integration</p>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-primary font-medium">60 MW</span>
                 <span className="text-white/80">Karnataka</span>
               </div>
             </div>
          </div>
          
                     <div className="text-center mt-8">
             <a
               href="/map"
               className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:bg-white/20 hover:scale-105 transition-all duration-300"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Powering India's <span className="text-white">Key Sectors</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Hydrogen infrastructure optimization for India's major industries and transportation
            </p>
          </div>
          
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Factory className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-xl font-bold mb-2 text-white">Steel & Cement</h3>
               <p className="text-white/80 text-sm">Decarbonizing heavy industries</p>
             </div>
            
                         <div className="p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Train className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-xl font-bold mb-2 text-white">Railways</h3>
               <p className="text-white/80 text-sm">Hydrogen-powered locomotives</p>
             </div>
            
                         <div className="p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Car className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-xl font-bold mb-2 text-white">Transportation</h3>
               <p className="text-white/80 text-sm">Fuel cell vehicles & buses</p>
             </div>
            
                         <div className="p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Building2 className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-xl font-bold mb-2 text-white">Smart Cities</h3>
               <p className="text-white/80 text-sm">Urban energy infrastructure</p>
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
