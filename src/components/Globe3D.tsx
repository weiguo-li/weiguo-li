
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
  
  // Create Earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Create a simple Earth-like texture
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)
    gradient.addColorStop(0, '#87CEEB') // Sky blue for oceans
    gradient.addColorStop(0.3, '#4682B4') // Steel blue
    gradient.addColorStop(0.7, '#228B22') // Forest green for land
    gradient.addColorStop(1, '#8B4513') // Saddle brown
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 512)
    
    // Add some continent-like shapes
    ctx.fillStyle = '#228B22'
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1024
      const y = Math.random() * 512
      const radius = Math.random() * 100 + 20
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    
    return new THREE.CanvasTexture(canvas)
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
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.1}
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
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4444ff" />
        
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
