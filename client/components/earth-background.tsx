"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export function EarthBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const earthRef = useRef<THREE.Group | null>(null)
  const starsRef = useRef<THREE.Points | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(5, 0, 8)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Earth group
    const earthGroup = new THREE.Group()
    earthRef.current = earthGroup

    // Load realistic Earth textures
    const textureLoader = new THREE.TextureLoader()
    
    // Real Earth texture from NASA
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg')
    const earthBumpMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg')
    const earthSpecularMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg')
    const cloudsTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png')

    // Earth geometry and material with realistic textures
    const earthGeometry = new THREE.SphereGeometry(2.8, 128, 128)
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: earthBumpMap,
      bumpScale: 0.05,
      specularMap: earthSpecularMap,
      specular: new THREE.Color('grey'),
      shininess: 10
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earth.castShadow = true
    earthGroup.add(earth)

    // Realistic cloud layer
    const cloudGeometry = new THREE.SphereGeometry(2.81, 128, 128)
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide
    })
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
    earthGroup.add(clouds)

    scene.add(earthGroup)

    // Enhanced lighting for realistic appearance
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.5)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Add a subtle point light for additional realism
    const pointLight = new THREE.PointLight(0xFFFFFF, 0.3, 100)
    pointLight.position.set(-10, 0, 10)
    scene.add(pointLight)

    // Realistic starfield with actual star positions
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 25000
    const starPositions = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)
    const starColors = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i += 3) {
      // Use spherical coordinates for more realistic star distribution
      const phi = Math.acos(-1 + (2 * Math.random()))
      const theta = Math.sqrt(2 * Math.PI) * Math.random()
      
      const x = 3000 * Math.cos(theta) * Math.sin(phi)
      const y = 3000 * Math.sin(theta) * Math.sin(phi)
      const z = 3000 * Math.cos(phi)
      
      starPositions[i] = x
      starPositions[i + 1] = y
      starPositions[i + 2] = z
      
      starSizes[i / 3] = Math.random() * 3 + 0.5
      
      // Vary star colors slightly for realism
      const colorVariation = Math.random() * 0.3 + 0.7
      starColors[i] = colorVariation
      starColors[i + 1] = colorVariation
      starColors[i + 2] = colorVariation
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

    const starMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 1,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      vertexColors: true
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    starsRef.current = stars
    scene.add(stars)

    // Earth atmospheric glow effect
    const glowGeometry = new THREE.SphereGeometry(2.9, 128, 128)
    const glowMaterial = new THREE.MeshPhongMaterial({
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    })
    const earthGlow = new THREE.Mesh(glowGeometry, glowMaterial)
    earthGroup.add(earthGlow)

    // Animation loop with realistic rotation
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      if (earthGroup) {
        // Realistic Earth rotation (faster rotation)
        earthGroup.rotation.y += 0.008
        earthGroup.rotation.x = 0.4 // Earth's axial tilt
      }

      if (stars) {
        stars.rotation.y += 0.0008
        stars.rotation.x += 0.0003
        stars.rotation.z += 0.0002
      }

      // Animate cloud texture for realistic cloud movement
      if (cloudsTexture) {
        cloudsTexture.offset.x += 0.0003
      }

      renderer.render(scene, camera)
    }

    animate()
    setIsLoaded(true)

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // Scroll-based Earth movement
    const handleScroll = () => {
      if (!cameraRef.current || !earthRef.current) return
      
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollProgress = Math.min(scrollY / (documentHeight - windowHeight), 1)
      
      // Start position (left side)
      const startX = 3
      const startZ = 4
      
      // End position (center)
      const endX = 0
      const endZ = 6
      
      // Smooth interpolation
      const currentX = startX + (endX - startX) * scrollProgress
      const currentZ = startZ + (endZ - startZ) * scrollProgress
      
      cameraRef.current.position.x = currentX
      cameraRef.current.position.z = currentZ
      
      // Scale earth based on scroll progress (smaller at center)
      const startScale = 1.0
      const endScale = 0.6
      const currentScale = startScale + (endScale - startScale) * scrollProgress
      
      earthRef.current.scale.set(currentScale, currentScale, currentScale)
    }

    // Reset camera position when component mounts
    const initializePage = () => {
      // Reset camera to starting position
      if (cameraRef.current) {
        cameraRef.current.position.x = 3
        cameraRef.current.position.z = 4
      }
      
      // Reset earth scale to starting size
      if (earthRef.current) {
        earthRef.current.scale.set(1.0, 1.0, 1.0)
      }
      
      // Trigger scroll handler immediately to set correct position based on current scroll
      handleScroll()
    }

    // Handle page visibility changes (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User returned to the page, ensure scroll effect is working
        setTimeout(() => {
          handleScroll()
        }, 50)
      }
    }

    // Handle window focus (when user returns to window)
    const handleWindowFocus = () => {
      // User returned to the window, ensure scroll effect is working
      setTimeout(() => {
        handleScroll()
      }, 50)
    }

    // Handle route changes (for Next.js)
    const handleRouteChange = () => {
      // Reset camera position when route changes
      setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.position.x = 3
          cameraRef.current.position.z = 4
        }
        handleScroll()
      }, 100)
    }

    // Initialize page state
    initializePage()

    // Add event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleWindowFocus)
    
    // Listen for route changes (Next.js)
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleRouteChange)
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleWindowFocus)
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handleRouteChange)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      earthTexture.dispose()
      earthBumpMap.dispose()
      earthSpecularMap.dispose()
      cloudsTexture.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10"
      style={{ 
        background: '#000000'
      }}
    />
  )
}
