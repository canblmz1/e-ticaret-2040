import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  RocketLaunchIcon, 
  GlobeAltIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

const AboutPage = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Shopping',
      description: 'Our advanced AI algorithms learn your preferences and provide personalized recommendations that evolve with your tastes.'
    },
    {
      icon: BeakerIcon,
      title: 'Cutting-Edge Technology',
      description: 'Experience products through AR visualization, VR try-ons, and neural interface previews before you buy.'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Quantum Delivery',
      description: 'Revolutionary quantum transport technology enables instant delivery to your location within minutes.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Neural Security',
      description: 'Your data is protected by quantum encryption and neural backup systems ensuring complete privacy.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Ecosystem',
      description: 'Connected to a worldwide network of smart cities and IoT devices for seamless integration.'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Driven',
      description: 'Join millions of future-forward users shaping the next generation of commerce and technology.'
    }
  ]
  
  const stats = [
    { number: '2M+', label: 'Active Users' },
    { number: '50K+', label: 'Products' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'AI Support' }
  ]
  
  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Technology Officer',
      bio: 'Neural interface pioneer with 15 years in quantum computing',
      avatar: '/api/placeholder/150/150'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of AI Development',
      bio: 'Machine learning expert focusing on personalized commerce',
      avatar: '/api/placeholder/150/150'
    },
    {
      name: 'Aisha Patel',
      role: 'Director of User Experience',
      bio: 'AR/VR specialist creating immersive shopping experiences',
      avatar: '/api/placeholder/150/150'
    }
  ]
  
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 to-neon-purple/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyber-blue to-neon-purple bg-clip-text text-transparent">
                About the Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              We're not just an e-commerce platform. We're architects of tomorrow's shopping experience, 
              building the bridge between today's needs and future possibilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 text-center"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyber-blue to-neon-purple bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                In 2040, shopping isn't just about transactions—it's about experiences that transcend 
                physical boundaries. We envision a world where AI understands your desires before you 
                do, where products come alive through augmented reality, and where every purchase 
                contributes to a sustainable, interconnected future.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Our platform leverages quantum computing, neural interfaces, and advanced AI to create 
                a shopping ecosystem that's not just convenient, but transformative. We're building 
                tomorrow's commerce, today.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-cyber-blue/20 to-neon-purple/20 rounded-2xl flex items-center justify-center">
                <div className="text-8xl">🚀</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 to-transparent rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We're not just selling products—we're delivering experiences that redefine what shopping means
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-cyber-blue/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-cyber-blue to-neon-purple rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Meet the Visionaries
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our team of innovators, dreamers, and technologists working to shape the future of commerce
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-700">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-cyber-blue font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Us in Building Tomorrow
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Be part of the revolution that's transforming how the world shops, connects, and experiences technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyber-blue to-neon-purple text-white font-medium rounded-lg hover:from-cyber-blue/80 hover:to-neon-purple/80 transition-all"
              >
                Get in Touch
              </motion.a>
              <motion.a
                href="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 border border-cyber-blue text-cyber-blue font-medium rounded-lg hover:bg-cyber-blue hover:text-white transition-all"
              >
                Explore Products
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
