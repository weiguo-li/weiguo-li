
import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Travel destinations data with 3D coordinates
export const travelDestinations = [
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, visited: true, color: '#00ff88', description: 'Amazing culture and technology hub' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060, visited: true, color: '#0088ff', description: 'The city that never sleeps' },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522, visited: true, color: '#ff8800', description: 'City of lights and romance' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, visited: true, color: '#ff0088', description: 'Historic and modern blend' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, visited: true, color: '#8800ff', description: 'Garden city of Asia' },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, visited: true, color: '#00ffff', description: 'Beautiful harbor city' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, visited: true, color: '#ffff00', description: 'Modern architectural marvel' },
  { name: 'Barcelona, Spain', lat: 41.3851, lng: 2.1734, visited: false, color: '#ff4444', description: 'Next destination - Art and architecture' },
  { name: 'Reykjavik, Iceland', lat: 64.1466, lng: -21.9426, visited: false, color: '#44ff44', description: 'Northern lights adventure' },
  { name: 'Bali, Indonesia', lat: -8.3405, lng: 115.0920, visited: false, color: '#4444ff', description: 'Tropical paradise getaway' },
]

// Convert latitude and longitude to 3D coordinates on a sphere
const latLngToVector3 = (lat: number, lng: number, radius: number = 2) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  
  return new THREE.Vector3(x, y, z)
}

// Destination Marker Component
const DestinationMarker = ({ destination, onClick, isSelected }: any) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const position = latLngToVector3(destination.lat, destination.lng, 2.05)
  
  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      // Gentle pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      const baseScale = isSelected ? 1.8 : 1.2
      meshRef.current.scale.setScalar(scale * baseScale)
      
      // Glow effect
      glowRef.current.scale.setScalar(scale * baseScale * 1.5)
      
      // Rotate markers slightly
      meshRef.current.rotation.y += 0.01
    }
  })
  
  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh
        ref={glowRef}
        onClick={() => onClick(destination)}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color={destination.color}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Main marker */}
      <mesh
        ref={meshRef}
        onClick={() => onClick(destination)}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={destination.color}
          emissive={destination.color}
          emissiveIntensity={destination.visited ? 0.5 : 0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Connection line to globe surface */}
      <mesh position={[0, 0, -0.05]}>
        <cylinderGeometry args={[0.005, 0.01, 0.1, 8]} />
        <meshStandardMaterial 
          color={destination.color} 
          emissive={destination.color} 
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Pulse ring for visited destinations */}
      {destination.visited && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
          <ringGeometry args={[0.08, 0.12, 16]} />
          <meshBasicMaterial
            color={destination.color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Label for selected destination */}
      {isSelected && (
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          maxWidth={2}
        >
          {destination.name}
        </Text>
      )}
    </group>
  )
}

// Earth Globe Component with realistic materials
const EarthGlobe = ({ selectedDestination, onDestinationClick, highlightFilter }: any) => {
  const globeRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  
  // Create highly realistic Earth texture with accurate geography
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 4096
    canvas.height = 2048
    const ctx = canvas.getContext('2d')!
    
    // Deep ocean base
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, 2048)
    oceanGradient.addColorStop(0, '#1e3a8a') // Deep ocean blue
    oceanGradient.addColorStop(0.5, '#1e40af') // Medium ocean blue
    oceanGradient.addColorStop(1, '#1e3a8a') // Deep ocean blue
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, 4096, 2048)
    
    // Accurate continental shapes based on real geography
    const drawContinent = (points: number[][], color: string, shadowColor?: string) => {
      if (points.length < 3) return
      
      // Draw shadow/depth first
      if (shadowColor) {
        ctx.fillStyle = shadowColor
        ctx.beginPath()
        ctx.moveTo(points[0][0] + 3, points[0][1] + 3)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0] + 3, points[i][1] + 3)
        }
        ctx.closePath()
        ctx.fill()
      }
      
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1])
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1])
      }
      ctx.closePath()
      ctx.fill()
    }
    
    // North America (more accurate shape)
    const northAmerica = [
      [150, 200], [300, 180], [450, 200], [600, 250], [650, 300],
      [620, 400], [580, 500], [550, 600], [500, 650], [400, 680],
      [300, 650], [200, 600], [150, 500], [120, 400], [130, 300]
    ]
    drawContinent(northAmerica, '#228B22', '#1a5f1a')
    
    // South America (distinctive shape)
    const southAmerica = [
      [400, 700], [500, 680], [550, 750], [580, 850], [570, 950],
      [550, 1100], [520, 1200], [480, 1300], [440, 1350], [400, 1380],
      [360, 1350], [340, 1250], [350, 1150], [370, 1050], [380, 950],
      [390, 850], [395, 750]
    ]
    drawContinent(southAmerica, '#32CD32', '#228B22')
    
    // Europe (complex coastline)
    const europe = [
      [1000, 180], [1100, 160], [1200, 180], [1250, 220], [1230, 280],
      [1200, 320], [1150, 350], [1100, 370], [1050, 380], [1000, 370],
      [950, 350], [920, 320], [930, 280], [950, 240], [980, 200]
    ]
    drawContinent(europe, '#9ACD32', '#7BA428')
    
    // Africa (recognizable shape)
    const africa = [
      [1050, 400], [1150, 380], [1250, 420], [1300, 500], [1320, 600],
      [1330, 700], [1340, 800], [1350, 900], [1360, 1000], [1350, 1100],
      [1320, 1200], [1280, 1250], [1200, 1280], [1100, 1290], [1000, 1280],
      [950, 1250], [920, 1200], [900, 1100], [910, 1000], [930, 900],
      [950, 800], [970, 700], [990, 600], [1010, 500], [1030, 450]
    ]
    drawContinent(africa, '#DAA520', '#B8860B')
    
    // Asia (massive continent)
    const asia = [
      [1200, 100], [1400, 80], [1600, 100], [1800, 120], [2000, 150],
      [2200, 180], [2400, 220], [2500, 300], [2480, 400], [2450, 500],
      [2400, 600], [2300, 700], [2200, 750], [2000, 780], [1800, 790],
      [1600, 780], [1400, 750], [1300, 700], [1250, 600], [1200, 500],
      [1180, 400], [1170, 300], [1180, 200], [1190, 150]
    ]
    drawContinent(asia, '#228B22', '#1a5f1a')
    
    // Australia
    const australia = [
      [2200, 1400], [2400, 1380], [2500, 1420], [2520, 1480], [2500, 1520],
      [2450, 1540], [2350, 1550], [2250, 1540], [2200, 1520], [2180, 1480],
      [2190, 1440]
    ]
    drawContinent(australia, '#CD853F', '#A0522D')
    
    // Antarctica
    const antarctica = [
      [0, 1700], [4096, 1700], [4096, 2048], [0, 2048]
    ]
    drawContinent(antarctica, '#F0F8FF', '#E6E6FA')
    
    // Add realistic details
    
    // Mountain ranges
    const addMountains = (basePoints: number[][], color: string) => {
      ctx.fillStyle = color
      basePoints.forEach(([x, y]) => {
        for (let i = 0; i < 8; i++) {
          const mx = x + (Math.random() - 0.5) * 100
          const my = y + (Math.random() - 0.5) * 50
          const radius = Math.random() * 15 + 5
          ctx.beginPath()
          ctx.arc(mx, my, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }
    
    // Add mountain ranges
    addMountains([[400, 400], [500, 350], [600, 300]], '#006400') // Rocky Mountains
    addMountains([[450, 800], [500, 850]], '#006400') // Andes
    addMountains([[1600, 300], [1700, 350], [1800, 400]], '#006400') // Himalayas
    
    // Major rivers (thin blue lines)
    ctx.strokeStyle = '#4169E1'
    ctx.lineWidth = 3
    
    // Amazon River
    ctx.beginPath()
    ctx.moveTo(350, 800)
    ctx.quadraticCurveTo(450, 820, 550, 810)
    ctx.stroke()
    
    // Nile River
    ctx.beginPath()
    ctx.moveTo(1150, 600)
    ctx.lineTo(1180, 800)
    ctx.stroke()
    
    // Mississippi River
    ctx.beginPath()
    ctx.moveTo(450, 300)
    ctx.quadraticCurveTo(480, 400, 500, 600)
    ctx.stroke()
    
    // Major deserts (sandy color)
    ctx.fillStyle = '#F4A460'
    
    // Sahara Desert
    ctx.fillRect(950, 500, 400, 200)
    
    // Gobi Desert
    ctx.fillRect(1800, 400, 200, 100)
    
    // Great lakes and major water bodies
    ctx.fillStyle = '#4682B4'
    
    // Great Lakes
    ctx.beginPath()
    ctx.arc(500, 350, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(520, 340, 12, 0, Math.PI * 2)
    ctx.fill()
    
    // Caspian Sea
    ctx.beginPath()
    ctx.arc(1400, 450, 25, 0, Math.PI * 2)
    ctx.fill()
    
    // Black Sea
    ctx.beginPath()
    ctx.arc(1200, 400, 15, 0, Math.PI * 2)
    ctx.fill()
    
    // Mediterranean Sea
    ctx.fillRect(1000, 420, 300, 50)
    
    // Add archipelagos and island chains
    const addIslands = (centerX: number, centerY: number, count: number, spread: number) => {
      ctx.fillStyle = '#228B22'
      for (let i = 0; i < count; i++) {
        const x = centerX + (Math.random() - 0.5) * spread
        const y = centerY + (Math.random() - 0.5) * spread * 0.5
        const radius = Math.random() * 8 + 3
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Major island chains
    addIslands(2300, 800, 30, 300) // Indonesia/Southeast Asia
    addIslands(550, 500, 20, 150) // Caribbean
    addIslands(1050, 420, 15, 100) // Mediterranean islands
    addIslands(3200, 1000, 25, 400) // Pacific islands
    addIslands(1200, 200, 10, 80) // British Isles
    addIslands(2800, 600, 15, 100) // Japan
    
    // Add realistic cloud cover
    ctx.globalAlpha = 0.25
    ctx.fillStyle = '#FFFFFF'
    
    // Weather patterns and cloud formations
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 4096
      const y = Math.random() * 2048
      const width = Math.random() * 200 + 100
      const height = Math.random() * 80 + 40
      const rotation = Math.random() * Math.PI * 2
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.beginPath()
      ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    
    // Polar ice caps with more opacity
    ctx.globalAlpha = 0.4
    ctx.fillStyle = '#FFFFFF'
    
    // Arctic ice cap
    ctx.beginPath()
    ctx.arc(2048, 100, 300, 0, Math.PI * 2)
    ctx.fill()
    
    // Antarctic ice (already drawn as continent, add ice effect)
    ctx.fillRect(0, 1600, 4096, 448)
    
    ctx.globalAlpha = 1.0
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    return texture
  }, [])
  
  // Slow rotation animation
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001
    }
  })
  
  // Filter destinations based on filter
  const filteredDestinations = travelDestinations.filter(dest => {
    if (highlightFilter === 'visited') return dest.visited
    if (highlightFilter === 'planned') return !dest.visited
    return true
  })
  
  return (
    <group>
      {/* Main Earth Sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.95}
          metalness={0.0}
          bumpMap={earthTexture}
          bumpScale={0.05}
        />
      </mesh>
      
      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Cloud layer */}
      <mesh>
        <sphereGeometry args={[2.02, 32, 32]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Destination Markers */}
      {filteredDestinations.map((destination, index) => (
        <DestinationMarker
          key={index}
          destination={destination}
          onClick={onDestinationClick}
          isSelected={selectedDestination?.name === destination.name}
        />
      ))}
      
      {/* Connection lines between visited destinations */}
      {selectedDestination && selectedDestination.visited && (
        <>
          {travelDestinations
            .filter(dest => dest.visited && dest.name !== selectedDestination.name)
            .map((dest, index) => {
              const start = latLngToVector3(selectedDestination.lat, selectedDestination.lng, 2.1)
              const end = latLngToVector3(dest.lat, dest.lng, 2.1)
              const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5).normalize().multiplyScalar(2.3)
              
              return (
                <group key={index}>
                  <mesh>
                    <tubeGeometry args={[
                      new THREE.CatmullRomCurve3([start, mid, end]),
                      20,
                      0.005,
                      8
                    ]} />
                    <meshBasicMaterial
                      color={selectedDestination.color}
                      transparent
                      opacity={0.5}
                    />
                  </mesh>
                </group>
              )
            })}
        </>
      )}
    </group>
  )
}

// Animated stars background
const Stars = () => {
  const starsRef = useRef<THREE.Points>(null)
  
  const starsGeometry = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])
  
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.0001
      starsRef.current.rotation.y += 0.0001
    }
  })
  
  return (
    <points ref={starsRef} geometry={starsGeometry}>
      <pointsMaterial size={0.05} color="white" />
    </points>
  )
}

// Main 3D Globe Component
const Globe3D = ({ selectedDestination, onDestinationClick, highlightFilter }: any) => {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#4444ff" />
        <hemisphereLight skyColor="#87ceeb" groundColor="#654321" intensity={0.3} />
        
        {/* Stars background */}
        <Stars />
        
        {/* Earth Globe with Markers */}
        <EarthGlobe
          selectedDestination={selectedDestination}
          onDestinationClick={onDestinationClick}
          highlightFilter={highlightFilter}
        />
        
        {/* Orbit Controls for zoom and rotation */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          autoRotate={!selectedDestination}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 text-white text-xs bg-black/50 p-3 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <span>🖱️</span>
          <span>Drag to rotate</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span>🔍</span>
          <span>Scroll to zoom</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span>Click markers for info</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-black/50 p-3 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="text-white text-xs">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-400"></div>
          <span className="text-white text-xs">Planned</span>
        </div>
      </div>
    </div>
  )
}

export default Globe3D
