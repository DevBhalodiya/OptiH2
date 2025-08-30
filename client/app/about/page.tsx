import { Navbar } from "@/components/navbar"
import { 
  MapPin, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Leaf,
  Factory,
  Train,
  Car,
  Building2,
  ArrowRight,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  TrendingUp,
  Zap,
  BarChart3
} from "lucide-react"

export default function AboutPage() {
  // Mock data for Indian company
  const companyStats = [
    {
      title: "Indian States Covered",
      value: "18",
      icon: MapPin,
      color: "text-blue-500"
    },
    {
      title: "Team Members",
      value: "45+",
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Projects Completed",
      value: "156",
      icon: Target,
      color: "text-purple-500"
    },
    {
      title: "Years Experience",
      value: "8+",
      icon: Award,
      color: "text-orange-500"
    }
  ]



  const teamMembers = [
    {
      name: "Darshit Paghdar",
      role: "Frontend Developer",
      expertise: "React, Next.js, TypeScript",
      location: "Gujarat, India",
      avatar: "DP"
    },
    {
      name: "Chirag Marvaniya",
      role: "Frontend Developer",
      expertise: "React, Next.js, UI/UX Design",
      location: "Gujarat, India",
      avatar: "CM"
    },
    {
      name: "Yash Bhalodiya",
      role: "Backend Developer",
      expertise: "Node.js, Express, MongoDB",
      location: "Gujarat, India",
      avatar: "YB"
    },
    {
      name: "Dev Bhalodiya",
      role: "Backend Developer",
      expertise: "Node.js, Python, Database Design",
      location: "Gujarat, India",
      avatar: "DB"
    }
  ]

  const milestones = [
    {
      year: "2016",
      title: "Company Founded",
      description: "Established with a mission to revolutionize clean energy infrastructure through hydrogen technology"
    },
    {
      year: "2018",
      title: "First Major Project",
      description: "Successfully implemented hydrogen optimization for Gujarat's industrial sector, reducing costs by 27%"
    },
    {
      year: "2020",
      title: "AI Integration",
      description: "Integrated machine learning algorithms to enhance optimization accuracy by 40%"
    },
    {
      year: "2022",
      title: "National Expansion",
      description: "Expanded operations to 18 states and secured partnerships with 5 major energy corporations"
    },
    {
      year: "2024",
      title: "Global Recognition",
      description: "Awarded 'Most Innovative Energy Solution' at the Global Clean Energy Summit"
    }
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="gradient-text">OptiH2 India</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Leading India's transition to sustainable energy through advanced hydrogen infrastructure 
              optimization and AI-powered solutions
            </p>
          </div>

          {/* Company Statistics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {companyStats.map((stat, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.title}</div>
              </div>
            ))}
          </div>

          {/* Mission & Vision */}
          <section className="mb-16">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass-card p-8 rounded-2xl">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To accelerate the global transition to sustainable energy by developing and deploying 
                  cutting-edge hydrogen infrastructure solutions that are efficient, reliable, and environmentally responsible.
                </p>
              </div>
              
              <div className="glass-card p-8 rounded-2xl">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A world where clean, renewable hydrogen energy powers our communities, industries, 
                  and transportation systems, creating a sustainable future for generations to come.
                </p>
              </div>
            </div>
          </section>



          {/* Performance Metrics Graph */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Transforming India's energy landscape through hydrogen innovation
              </p>
            </div>
            
            <div className="h-80 w-full bg-gradient-to-b from-primary/5 to-transparent rounded-xl p-6">
              <div className="h-full flex items-end gap-8">
                {[
                  { label: '2020', value: 35, color: 'bg-blue-500' },
                  { label: '2021', value: 52, color: 'bg-green-500' },
                  { label: '2022', value: 78, color: 'bg-purple-500' },
                  { label: '2023', value: 65, color: 'bg-amber-500' },
                  { label: '2024', value: 95, color: 'bg-teal-500' },
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full ${item.color} rounded-t-md transition-all duration-500`}
                      style={{ height: `${item.value}%` }}
                    ></div>
                    <div className="mt-2 text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.value}%</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Year-over-year growth in hydrogen infrastructure optimization efficiency
              </div>
            </div>
          </div>

          {/* Company Timeline */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-xl text-muted-foreground">
                Key milestones in advancing hydrogen infrastructure
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20"></div>
                
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative flex items-start gap-6">
                      {/* Timeline Dot */}
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-4 border-background relative z-10">
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-2">
                        <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>



          {/* Development Team */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Our Development Team</h2>
              <p className="text-xl text-muted-foreground">
                Skilled developers building innovative hydrogen infrastructure solutions
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-primary">
                    {member.avatar}
                  </div>
                                     <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                   <div className="text-primary font-medium mb-2">{member.role}</div>
                   <p className="text-sm text-muted-foreground mb-2">{member.expertise}</p>
                   <div className="text-xs text-muted-foreground">
                     <div>{member.location}</div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="glass-card p-8 rounded-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-xl text-muted-foreground">
                Ready to transform India's energy future? Let's discuss your hydrogen infrastructure needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Head Office</h3>
                    <p className="text-muted-foreground">New Delhi, India</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">info@optih2india.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">+91 11 2345 6789</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <a
                  href="/map"
                  className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all group"
                >
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Explore Indian Infrastructure</div>
                    <div className="text-sm text-muted-foreground">View our interactive map</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform ml-auto" />
                </a>
                
                <a
                  href="/optimize"
                  className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-all group"
                >
                  <Zap className="w-5 h-5 text-accent" />
                  <div>
                    <div className="font-medium">Run Optimization</div>
                    <div className="text-sm text-muted-foreground">Optimize your network</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform ml-auto" />
                </a>
                
                <a
                  href="/reports"
                  className="flex items-center gap-3 p-4 rounded-xl bg-green-100 border border-green-200 hover:bg-green-200 transition-all group"
                >
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Generate Reports</div>
                    <div className="text-sm text-muted-foreground">Create comprehensive reports</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform ml-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
