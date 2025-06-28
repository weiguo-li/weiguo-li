import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

const Blog = () => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  })

  const [selectedCategory, setSelectedCategory] = useState('all')

  const blogPosts = [
    {
      id: 1,
      title: 'Building Scalable React Applications: A Complete Guide',
      excerpt: 'Learn how to structure and build React applications that can grow with your business needs. From component architecture to state management.',
      category: 'development',
      readTime: 8,
      date: '2024-01-15',
      image: '/images/backgrounds/coding-bg.jpg',
      tags: ['React', 'JavaScript', 'Architecture']
    },
    {
      id: 2,
      title: 'My Journey Through Southeast Asia: A Digital Nomad\'s Tale',
      excerpt: 'Working remotely while exploring the beautiful countries of Southeast Asia. From co-working spaces in Bangkok to beach offices in Bali.',
      category: 'travel',
      readTime: 6,
      date: '2024-01-10',
      image: '/images/travel/travel-pins.jpg',
      tags: ['Travel', 'Remote Work', 'Lifestyle']
    },
    {
      id: 3,
      title: 'The Future of Web Development: Trends to Watch in 2024',
      excerpt: 'Exploring emerging technologies and trends that are shaping the future of web development, from AI integration to progressive web apps.',
      category: 'technology',
      readTime: 5,
      date: '2024-01-05',
      image: '/images/tech/tech-bg.jpg',
      tags: ['Technology', 'Trends', 'Future']
    },
    {
      id: 4,
      title: 'Creating Beautiful User Interfaces with CSS Grid and Flexbox',
      excerpt: 'Master the art of CSS layout with practical examples and real-world applications of Grid and Flexbox for modern web design.',
      category: 'design',
      readTime: 7,
      date: '2023-12-28',
      image: '/images/backgrounds/workspace.jpg',
      tags: ['CSS', 'Design', 'Layout']
    },
    {
      id: 5,
      title: 'Remote Work Tips: Staying Productive While Traveling',
      excerpt: 'Essential tips and tools for maintaining productivity and work-life balance while working as a digital nomad around the world.',
      category: 'lifestyle',
      readTime: 4,
      date: '2023-12-20',
      image: '/images/backgrounds/workspace.jpg',
      tags: ['Productivity', 'Remote Work', 'Tips']
    },
    {
      id: 6,
      title: 'Docker Containerization: From Development to Production',
      excerpt: 'A comprehensive guide to containerizing applications with Docker, from local development to production deployment strategies.',
      category: 'devops',
      readTime: 10,
      date: '2023-12-15',
      image: '/images/tech/tech-bg.jpg',
      tags: ['Docker', 'DevOps', 'Deployment']
    }
  ]

  const categories = [
    { key: 'all', label: 'All Posts', icon: '📚' },
    { key: 'development', label: 'Development', icon: '💻' },
    { key: 'travel', label: 'Travel', icon: '✈️' },
    { key: 'technology', label: 'Technology', icon: '🚀' },
    { key: 'design', label: 'Design', icon: '🎨' },
    { key: 'lifestyle', label: 'Lifestyle', icon: '🌟' },
    { key: 'devops', label: 'DevOps', icon: '⚙️' }
  ]

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section id="blog" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      
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
              Blog & Insights
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Thoughts, experiences, and insights from my journey in technology and travel
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={itemVariants}
        >
          {categories.map((category) => (
            <motion.button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category.key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <motion.div
            className="mb-16"
            variants={itemVariants}
          >
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    className="w-full h-80 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold rounded-full">
                    Featured
                  </div>
                </div>
                
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <span>{formatDate(filteredPosts[0].date)}</span>
                    <span>•</span>
                    <span>{filteredPosts[0].readTime} min read</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {filteredPosts[0].title}
                  </h3>
                  
                  <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {filteredPosts[0].tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <motion.button
                    className="self-start px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read More
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <motion.div
          key={selectedCategory}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPosts.slice(1).map((post, index) => (
            <motion.article
              key={post.id}
              className="group bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-400/50 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              {/* Post Image */}
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-400 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <motion.button
                  className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-300 flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
              Subscribe to get notified about new blog posts and insights on technology, travel, and development.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Blog
