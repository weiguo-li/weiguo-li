import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
// import Globe3D from './Globe3D'

import { travelDestinations } from './Globe3D'


const Travel = () => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  })

  const [selectedDestination, setSelectedDestination] = useState<any>(null)
  const [highlightFilter, setHighlightFilter] = useState('all')

  const handleDestinationClick = (destination: any) => {
    setSelectedDestination(destination)
  }

  const visitedCount = travelDestinations.filter(d => d.visited).length
  const plannedCount = travelDestinations.filter(d => !d.visited).length

  const filteredDestinations = travelDestinations.filter(dest => {
    if (highlightFilter === 'visited') return dest.visited
    if (highlightFilter === 'planned') return !dest.visited
    return true
  })

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
    <section id="travel" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/images/backgrounds/stars-bg.jpg')`
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
              Travel Adventures
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Exploring the world, one destination at a time. Rotate and zoom the 3D globe to discover my journey.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mt-6"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive World Map */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Interactive 3D Globe</h3>

              {/* <Globe3D
                selectedDestination={selectedDestination}
                onDestinationClick={handleDestinationClick}
                highlightFilter={highlightFilter}
              /> */}

              {/* Controls */}
              <div className="flex justify-center gap-4 mt-6">
                {['all', 'visited', 'planned'].map((filter) => (
                  <motion.button
                    key={filter}
                    onClick={() => setHighlightFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      highlightFilter === filter
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </motion.button>
                ))}
              </div>

              <p className="text-gray-400 text-sm text-center mt-4">
                Rotate the globe, zoom in/out, and click markers to explore destinations
              </p>
            </div>
          </motion.div>

          {/* Destination Info */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-400/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{visitedCount}</div>
                <div className="text-gray-400">Visited</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-400/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">{plannedCount}</div>
                <div className="text-gray-400">Planned</div>
              </div>
            </div>

            {/* Selected Destination Info */}
            {selectedDestination ? (
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedDestination.color }}
                  />
                  <h3 className="text-xl font-bold text-white">
                    {selectedDestination.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedDestination.visited
                      ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                      : 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
                  }`}>
                    {selectedDestination.visited ? 'Visited' : 'Planned'}
                  </span>
                </div>
                <p className="text-gray-400">
                  {selectedDestination.description}
                </p>
              </motion.div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
                <p className="text-gray-400">
                  Click on a marker to learn more about that destination
                </p>
              </div>
            )}

            {/* Destinations List */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">All Destinations</h3>
              <div className="space-y-3">
                {filteredDestinations.map((destination, index) => (
                  <motion.div
                    key={destination.name}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedDestination?.name === destination.name
                        ? 'bg-blue-500/20 border border-blue-400/30'
                        : 'hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleDestinationClick(destination)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: destination.color }}
                      />
                      <span className="text-white font-medium">{destination.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      destination.visited
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {destination.visited ? '✓' : '○'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default Travel