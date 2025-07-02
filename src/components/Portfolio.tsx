import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

const Portfolio = () => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  })

  const [filter, setFilter] = useState('all')

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      category: 'fullstack',
      description: 'A modern e-commerce solution built with React, Node.js, and PostgreSQL featuring real-time inventory management and payment processing.',
      image: import.meta.env.BASE_URL + 'images/backgrounds/coding-bg.jpg',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker'],
      github: '#',
      live: '#',
      featured: true
    },
    {
      id: 2,
      title: 'Travel Planning App',
      category: 'mobile',
      description: 'An intuitive mobile app for planning travel itineraries with interactive maps, weather integration, and social sharing features.',
      image: import.meta.env.BASE_URL + 'images/travel/travel-pins.jpg',
      technologies: ['React Native', 'Firebase', 'Google Maps API', 'Redux'],
      github: '#',
      live: '#',
      featured: true
    },
    {
      id: 3,
      title: 'Data Visualization Dashboard',
      category: 'frontend',
      description: 'Interactive dashboard for analyzing complex datasets with real-time charts, filters, and export capabilities.',
      image: import.meta.env.BASE_URL + 'images/tech/tech-bg.jpg',
      technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI', 'WebSockets'],
      github: '#',
      live: '#',
      featured: false
    },
    {
      id: 4,
      title: 'AI Chatbot Platform',
      category: 'ai',
      description: 'Intelligent chatbot platform with natural language processing and machine learning capabilities for customer support.',
      image: import.meta.env.BASE_URL + 'images/backgrounds/workspace.jpg',
      technologies: ['Python', 'TensorFlow', 'React', 'WebSockets', 'Docker'],
      github: '#',
      live: '#',
      featured: true
    },
    {
      id: 5,
      title: 'Cloud Infrastructure Manager',
      category: 'devops',
      description: 'Comprehensive tool for managing cloud resources across multiple providers with cost optimization and monitoring.',
      image: import.meta.env.BASE_URL + 'images/backgrounds/coding-bg.jpg',
      technologies: ['Go', 'Kubernetes', 'AWS', 'Terraform', 'Prometheus'],
      github: '#',
      live: '#',
      featured: false
    },
    {
      id: 6,
      title: 'Design System Library',
      category: 'design',
      description: 'Comprehensive design system with reusable components, documentation, and design tokens for consistent UI development.',
      image: import.meta.env.BASE_URL + 'images/backgrounds/workspace.jpg',
      technologies: ['Storybook', 'React', 'TypeScript', 'Figma', 'CSS-in-JS'],
      github: '#',
      live: '#',
      featured: false
    }
  ]

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'fullstack', label: 'Full Stack' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'ai', label: 'AI/ML' },
    { key: 'devops', label: 'DevOps' },
    { key: 'design', label: 'Design' }
  ]

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  }

  return (
    <section id="portfolio" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>
      
      <motion.div
        ref={ref}
        className="relative z-10 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Section Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              My Portfolio
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A showcase of my recent projects and creative solutions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={itemVariants}
        >
          {filters.map((filterItem) => (
            <motion.button
              key={filterItem.key}
              onClick={() => setFilter(filterItem.key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                filter === filterItem.key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filterItem.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          key={filter}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 ${
                project.featured ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-80"></div>
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold rounded-full">
                    Featured
                  </div>
                )}

                {/* Overlay with Links */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-4">
                    <motion.a
                      href={project.github}
                      className="px-6 py-3 bg-gray-800/90 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      GitHub
                    </motion.a>
                    <motion.a
                      href={project.live}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Live Demo
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          variants={itemVariants}
        >
          <motion.div
            className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/30"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Interested in Working Together?
            </h3>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
              I'm always excited to take on new challenges and collaborate on innovative projects.
            </p>
            <motion.button
              onClick={() => {
                const element = document.getElementById('contact')
                if (element) element.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Let's Talk
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Portfolio
