import { Navbar } from "@/components/navbar"
import { 
  Leaf, 
  Zap, 
  Globe, 
  Users, 
  Award, 
  Target, 
  TrendingUp, 
  Lightbulb,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Github,
  ArrowRight,
  CheckCircle
} from "lucide-react"

export default function AboutPage() {
  // Mock company data
  const companyStats = [
    { name: "Years Experience", value: "8+", icon: Award },
    { name: "Projects Completed", value: "150+", icon: CheckCircle },
    { name: "Team Members", value: "45+", icon: Users },
    { name: "Countries Served", value: "12+", icon: Globe }
  ]

  const coreValues = [
    {
      title: "Sustainability First",
      description: "Committed to accelerating the transition to clean, renewable energy sources",
      icon: Leaf
    },
    {
      title: "Innovation Driven",
      description: "Leveraging cutting-edge technology to solve complex energy challenges",
      icon: Lightbulb
    },
    {
      title: "Global Impact",
      description: "Working towards a sustainable future for generations to come",
      icon: Globe
    },
    {
      title: "Excellence",
      description: "Delivering the highest quality solutions with precision and care",
      icon: Award
    }
  ]

  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Technology Officer",
      expertise: "AI & Machine Learning",
      avatar: "/placeholder-user.jpg"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Operations",
      expertise: "Infrastructure & Logistics",
      avatar: "/placeholder-user.jpg"
    },
    {
      name: "Dr. Emily Watson",
      role: "Lead Scientist",
      expertise: "Renewable Energy Systems",
      avatar: "/placeholder-user.jpg"
    },
    {
      name: "David Kim",
      role: "Director of Engineering",
      expertise: "Systems Integration",
      avatar: "/placeholder-user.jpg"
    }
  ]

  const milestones = [
    {
      year: "2016",
      title: "Company Founded",
      description: "Started with a vision to revolutionize hydrogen infrastructure"
    },
    {
      year: "2018",
      title: "First Major Project",
      description: "Successfully deployed solar-hydrogen plant in California"
    },
    {
      year: "2020",
      title: "AI Integration",
      description: "Launched AI-powered optimization platform"
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Extended operations to 12 countries worldwide"
    },
    {
      year: "2024",
      title: "Industry Leader",
      description: "Recognized as top hydrogen infrastructure company"
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
              About <span className="gradient-text">OptiH2</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Pioneering the future of sustainable energy through innovative hydrogen infrastructure 
              solutions and cutting-edge optimization technology
            </p>
          </div>

          {/* Company Stats */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companyStats.map((stat, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.name}</p>
                </div>
              ))}
            </div>
          </section>

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

          {/* Core Values */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Core Values</h2>
              <p className="text-xl text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Company Timeline */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
              <p className="text-xl text-muted-foreground">
                Key milestones in our company's growth and development
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-px w-0.5 h-full bg-primary/20"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}>
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    
                    {/* Content */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="glass-card p-6 rounded-2xl">
                        <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Leadership Team</h2>
              <p className="text-xl text-muted-foreground">
                Meet the experts driving innovation and growth
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.expertise}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="mb-16">
            <div className="glass-card p-8 rounded-2xl">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
                <p className="text-xl text-muted-foreground">
                  Ready to start your hydrogen infrastructure journey?
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>123 Innovation Drive, Tech City, TC 12345</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>info@optih2.com</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <a
                  href="/optimize"
                  className="glass-button px-8 py-4 rounded-2xl text-lg font-semibold inline-flex items-center gap-3 hover:scale-105 transition-transform"
                >
                  Start Your Project
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
