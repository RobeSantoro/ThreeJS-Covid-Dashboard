import * as THREE from 'three'

// Get the canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-5, 3, 5)
camera.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(camera)

// Cube
const CubeGeo = new THREE.BoxBufferGeometry(1, 1, 1)
const CubeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(CubeGeo, CubeMat)

scene.add(cube)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.render(scene, camera)