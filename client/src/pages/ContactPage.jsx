import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

import Button from '../components/ui/Button'
import Input, { TextArea } from '../components/ui/Input'
import useUIStore from '../store/uiStore'

const ContactPage = () => {
  const { showSuccess, showError } = useUIStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Get help from our AI-powered support team',
      value: 'hello@ecommerce2040.com',
      action: 'mailto:hello@ecommerce2040.com'
    },
    {
      icon: PhoneIcon,
      title: 'Neural Hotline',
      description: '24/7 quantum-encrypted voice support',
      value: '+1 (555) 2040-TECH',
      action: 'tel:+15552040TECH'
    },
    {
      icon: MapPinIcon,
      title: 'Headquarters',
      description: 'Visit our innovation center',
      value: '123 Future Street, Tech City 2040',
      action: 'https://maps.google.com'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Neural Chat',
      description: 'Instant AI assistant available',
      value: 'Start Chat',
      action: '#'
    }
  ]
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      showError('Please fill in all required fields')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      showSuccess('Message sent successfully! We\'ll get back to you within 24 hours.')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      showError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
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
                Get in Touch
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              Connect with our team of future commerce experts. We're here to help you 
              navigate tomorrow's shopping experience today.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Methods */}
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
              Multiple Ways to Connect
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose your preferred method of communication and we'll respond faster than quantum travel
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.action}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-cyber-blue/50 transition-all duration-300 block"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-cyber-blue to-neon-purple rounded-xl flex items-center justify-center mb-6">
                  <method.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{method.description}</p>
                <p className="text-cyber-blue font-medium">{method.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      name="name"
                      type="text"
                      label="Full Name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    
                    <Input
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                      required
                    />
                  </div>
                  
                  <Input
                    name="subject"
                    type="text"
                    label="Subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  
                  <TextArea
                    name="message"
                    label="Message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                  
                  <Button
                    type="submit"
                    className="w-full"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </motion.div>
            
            {/* Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Why Contact Us?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-cyber-blue/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-cyber-blue text-lg">💡</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Product Inquiries</h4>
                      <p className="text-gray-400 text-sm">
                        Questions about our futuristic products, features, or compatibility
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-neon-purple/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-neon-purple text-lg">🤝</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Partnership Opportunities</h4>
                      <p className="text-gray-400 text-sm">
                        Interested in collaborating with us or becoming a vendor
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-400 text-lg">🚀</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Technical Support</h4>
                      <p className="text-gray-400 text-sm">
                        Get help with your orders, account, or technical issues
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-yellow-400 text-lg">💬</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Feedback & Suggestions</h4>
                      <p className="text-gray-400 text-sm">
                        Help us improve by sharing your thoughts and ideas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Response Time */}
              <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ClockIcon className="w-6 h-6 text-cyber-blue" />
                  <h4 className="text-white font-semibold">Response Time</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email Support:</span>
                    <span className="text-white">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Live Chat:</span>
                    <span className="text-white">Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone Support:</span>
                    <span className="text-white">24/7 Available</span>
                  </div>
                </div>
              </div>
              
              {/* Office Hours */}
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <GlobeAltIcon className="w-6 h-6 text-neon-purple" />
                  <h4 className="text-white font-semibold">Global Presence</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Our team spans across multiple time zones to provide round-the-clock support. 
                  No matter where you are in the world, we're here to help.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Preview */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Need Quick Answers?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Check out our comprehensive FAQ section for instant answers to common questions
            </p>
            <Button variant="outline" size="lg">
              Visit FAQ Section
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
