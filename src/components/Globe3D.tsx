import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
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
  const position = latLngToVector3(destination.lat, destination.lng, 2.05)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.scale.setScalar(scale * (isSelected ? 1.5 : 1))
    }
  })
  
  return (
    <group position={position}>
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
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={destination.color}
          emissive={destination.color}
          emissiveIntensity={destination.visited ? 0.3 : 0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Connection line to globe surface */}
      <mesh position={[0, 0, -0.05]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
        <meshStandardMaterial color={destination.color} emissive={destination.color} emissiveIntensity={0.2} />
      </mesh>
      
      {/* Label for selected destination */}
      {isSelected && (
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {destination.name}
        </Text>
      )}
    </group>
  )
}

// Earth Globe Component
const EarthGlobe = ({ selectedDestination, onDestinationClick, highlightFilter }: any) => {
  const globeRef = useRef<THREE.Mesh>(null)
  
  // Slow rotation animation
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002
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
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#1E40AF"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Continents as simple geometry */}
      <mesh ref={globeRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshStandardMaterial
          color="#2E5C3A"
          roughness={0.9}
          transparent
          opacity={0.8}
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
    </group>
  )
}

// Main 3D Globe Component
const Globe3D = ({ selectedDestination, onDestinationClick, highlightFilter }: any) => {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        
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
          maxDistance={10}
        />
      </Canvas>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 text-white text-xs bg-black/50 p-2 rounded">
        <div>🖱️ Drag to rotate</div>
        <div>🔍 Scroll to zoom</div>
        <div>📍 Click markers for info</div>
      </div>
    </div>
  )
}

export default Globe3D
