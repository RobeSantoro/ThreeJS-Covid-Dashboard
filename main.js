import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getData } from './modules/getData.js'

// Get the canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 50, 100)
camera.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(camera)

// Axis helper 
const axesHelper = new THREE.AxesHelper(20)
scene.add(axesHelper)

// Grid Helper
const gridHelper = new THREE.GridHelper(100, 10)
scene.add(gridHelper)

// Orbit controls
const controls = new OrbitControls(camera, canvas)

async function run() {

  const data = await getData()
  //console.log(data)

  const last = data[data.length - 1].data.split('T')[0].split('-')
  const lastDate = new Date(last)
  const lastDateToShow = new Intl.DateTimeFormat('en-EN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(lastDate)

  //console.log(lastDateToShow) ////////////////////////////////////////////////////////////////

  const TamponiStrings = [
    'tamponi',
    'tamponi_test_antigenico_rapido',
    'tamponi_test_molecolare',
    'totale_positivi_test_antigenico_rapido',
    'totale_positivi_test_molecolare',
    'totale_casi'
  ]

  const days = Array.from(new Set(data.map(el => el.data)))

  const tamponi = days
    .map(day => {
      return {
        date: day.split('T')[0].split('-').reverse().join(' '),
        value: data.filter(el => el.data === day)
          .map(el => el.tamponi)
          .reduce((acc, cur) => acc + cur)
      }
    })

  const tamponi_test_antigenico_rapido = days
    .map(day => {
      return {
        date: day.split('T')[0].split('-').reverse().join(' '),
        value: data.filter(el => el.data === day)
          .map(el => el.tamponi_test_antigenico_rapido)
          .reduce((acc, cur) => acc + cur)
      }
    })


  function PlotGraph(tamponi, color, posZ) {
    let x = 0

    // Cube
    const CubeGeo = new THREE.BoxBufferGeometry(1, 1, 1)
    const CubeMat = new THREE.MeshBasicMaterial({ color })

    const mesh = new THREE.InstancedMesh(CubeGeo, CubeMat, tamponi.length);
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < tamponi.length; i++) {

      matrix.makeScale(1, tamponi[i].value / 1000000, 1)
      matrix.setPosition(i, ((tamponi[i].value / 1000000) / 2), 0)

      mesh.setMatrixAt((i), matrix)
    }

    mesh.scale.set(.1, .1, .1)
    mesh.translateX((tamponi.length / 2) * -.1)
    mesh.translateZ(posZ)
    scene.add(mesh)

  }

  PlotGraph(tamponi, 0x00ff00, -.1)
  PlotGraph(tamponi_test_antigenico_rapido, 0xff0000, 0)



}

run()

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

function tick() {
  controls.update()
  requestAnimationFrame(tick)
  renderer.render(scene, camera)
}
tick()