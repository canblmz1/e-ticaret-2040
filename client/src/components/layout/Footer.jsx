import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Categories',
      links: [
        { name: 'Electronics', href: '/products?category=electronics' },
        { name: 'Fashion', href: '/products?category=fashion' },
        { name: 'Home & Garden', href: '/products?category=home' },
        { name: 'Sports', href: '/products?category=sports' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Privacy Policy', href: '/privacy' }
      ]
    }
  ]
  
  const socialLinks = [
    { name: 'Twitter', href: '#', icon: '𝕏' },
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'LinkedIn', href: '#', icon: '💼' }
  ]
  
  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-br from-cyber-blue to-neon-purple rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-bold text-lg">E</span>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyber-blue to-neon-purple bg-clip-text text-transparent">
                E-Commerce 2040
              </span>
            </Link>
            
            <p className="text-gray-400 mb-6 text-sm">
              Experience the future of shopping with our cutting-edge e-commerce platform. 
              AI-powered recommendations, AR product views, and seamless transactions.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPinIcon className="w-4 h-4" />
                <span>123 Future Street, Tech City 2040</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <PhoneIcon className="w-4 h-4" />
                <span>+1 (555) 2040-TECH</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <EnvelopeIcon className="w-4 h-4" />
                <span>hello@ecommerce2040.com</span>
              </div>
            </div>
          </div>
          
          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-cyber-blue transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-white font-semibold mb-2">
                Stay Updated with Future Tech
              </h3>
              <p className="text-gray-400 text-sm">
                Get the latest product launches and exclusive offers delivered to your inbox.
              </p>
            </div>
            
            <form className="flex gap-2 w-full lg:w-auto min-w-[300px]">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-cyber-blue to-neon-purple text-white rounded-lg font-medium hover:from-cyber-blue/80 hover:to-neon-purple/80 transition-all"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© {currentYear} E-Commerce 2040. Made with</span>
              <HeartIcon className="w-4 h-4 text-red-400" />
              <span>for the future.</span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-gray-800/50 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  aria-label={social.name}
                >
                  <span className="text-sm">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
