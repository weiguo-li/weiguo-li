import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

const Skills = () => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  })

  const [activeCategory, setActiveCategory] = useState('ai')

  const skillCategories = {
    ai: {
      title: 'AI',
      icon: '🎨',
      skills: [
        { name: 'PyTorch', level: 90, color: 'from-blue-400 to-blue-600' },
        { name: 'Python', level: 95, color: 'from-blue-500 to-blue-700' },
        { name: 'AI Agents', level: 85, color: 'from-gray-600 to-gray-800' },
        { name: 'C++', level: 75, color: 'from-cyan-400 to-cyan-600' },
        { name: 'Machine Learning', level: 80, color: 'from-green-400 to-green-600' },
        { name: 'LLMs', level: 85, color: 'from-yellow-400 to-yellow-600' },
      ]
    }
    // backend: {
    //   title: 'Full stack  Development',
    //   icon: '⚙️',
    //   skills: [
    //     { name: 'Node.js', level: 90, color: 'from-green-500 to-green-700' },
    //     { name: 'Python', level: 88, color: 'from-yellow-500 to-yellow-700' },
    //     { name: 'PostgreSQL', level: 85, color: 'from-blue-600 to-blue-800' },
    //     { name: 'MongoDB', level: 82, color: 'from-green-600 to-green-800' },
    //     { name: 'Redis', level: 78, color: 'from-red-500 to-red-700' },
    //     { name: 'GraphQL', level: 80, color: 'from-pink-500 to-pink-700' },
    //   ]
    // },
    // devops: {
    //   title: 'DevOps & Cloud',
    //   icon: '☁️',
    //   skills: [
    //     { name: 'AWS', level: 85, color: 'from-orange-400 to-orange-600' },
    //     { name: 'Docker', level: 88, color: 'from-blue-500 to-blue-700' },
    //     { name: 'Kubernetes', level: 75, color: 'from-blue-600 to-blue-800' },
    //     { name: 'CI/CD', level: 82, color: 'from-purple-500 to-purple-700' },
    //     { name: 'Terraform', level: 70, color: 'from-purple-600 to-purple-800' },
    //     { name: 'Monitoring', level: 80, color: 'from-green-500 to-green-700' },
    //   ]
    // },
    // design: {
    //   title: 'Design & UX',
    //   icon: '🎯',
    //   skills: [
    //     { name: 'Figma', level: 88, color: 'from-purple-400 to-purple-600' },
    //     { name: 'Adobe XD', level: 85, color: 'from-pink-500 to-pink-700' },
    //     { name: 'UI/UX Design', level: 90, color: 'from-indigo-500 to-indigo-700' },
    //     { name: 'Prototyping', level: 87, color: 'from-cyan-500 to-cyan-700' },
    //     { name: 'User Research', level: 80, color: 'from-teal-500 to-teal-700' },
    //     { name: 'Design Systems', level: 85, color: 'from-blue-500 to-blue-700' },
    //   ]
    // }
  }

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

  return (
    <section id="skills" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url('/images/tech/tech-bg.jpg')`
        }}
      />

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
              Skills & Expertise
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive overview of my technical skills and areas of expertise
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={itemVariants}
        >
          {Object.entries(skillCategories).map(([key, category]) => (
            <motion.button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{category.icon}</span>
              {category.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Content */}
        <motion.div
          key={activeCategory}
          className="grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {skillCategories[activeCategory as keyof typeof skillCategories].skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                <span className="text-blue-400 font-bold">{skill.level}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{ 
                    duration: 1.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/30">
            <h3 className="text-2xl font-bold text-white mb-4">Continuous Learning</h3>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Technology evolves rapidly, and I'm committed to staying at the forefront. 
              I regularly explore new frameworks, attend tech conferences, and contribute to open-source projects.
            </p>
            
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-6"
              variants={containerVariants}
            >
              {['Learning', 'Experimenting', 'Building', 'Sharing'].map((item, index) => (
                <motion.div
                  key={item}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full text-blue-300 font-medium"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Skills
