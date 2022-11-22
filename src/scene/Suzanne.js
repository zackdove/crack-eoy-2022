import * as THREE from 'three'
import glsl from 'glslify'
import assets from '../utils/AssetManager'
import { wireValue, wireUniform } from '../utils/Controls'
import { addUniforms, customizeVertexShader } from '../utils/customizeShader'

// elaborated three.js component example
// containing example usage of
//   - asset manager
//   - control panel
//   - touch events
//   - postprocessing
//   - screenshot saving

// preload the suzanne model
// const suzanneKey = assets.queue({
//   url: 'assets/suzanne.gltf',
//   type: 'gltf',
// })

// // preload the materials
// const albedoKey = assets.queue({
//   url: 'assets/spotty-metal/albedo.jpg',
//   type: 'texture',
// })
// const metalnessKey = assets.queue({
//   url: 'assets/spotty-metal/metalness.jpg',
//   type: 'texture',
//   linear: true, // don't use gamma correction
// })
// const roughnessKey = assets.queue({
//   url: 'assets/spotty-metal/roughness.jpg',
//   type: 'texture',
//   linear: true, // don't use gamma correction
// })
// const normalKey = assets.queue({
//   url: 'assets/spotty-metal/normal.jpg',
//   type: 'texture',
//   linear: true, // don't use gamma correction
// })

// preload the environment map
const hdrKey = assets.queue({
  url: 'assets/ouside-afternoon-blurred-hdr.jpg',
  type: 'env-map',
})

export default class Suzanne extends THREE.Group {
  constructor(webgl, options = {}) {
    super(options)
    this.webgl = webgl
    this.options = options

    // const suzanneGltf = assets.get(suzanneKey)
    // const suzanne = suzanneGltf.scene.clone()

    const envMap = assets.get(hdrKey)
    const material = new THREE.MeshBasicMaterial({
      // map: assets.get(albedoKey),
      // metalnessMap: assets.get(metalnessKey),
      // roughnessMap: assets.get(roughnessKey),
      // normalMap: assets.get(normalKey),
      // normalScale: new THREE.Vector2(2, 2),
      envMap,
      // roughness: webgl.controls.roughness,
      // metalness: 1,
    })

    // const material = new THREE.MeshBasicMaterial();
    const suzanne = new THREE.Mesh(new THREE.PlaneGeometry, material)
    suzanne.visible = true;
    suzanne.scale.set(0.0001, 0.00001, 0.000001)
    // this.material = material

    // wireValue(material, () => webgl.controls.roughness)

    // add new unifroms and expose current uniforms
    // addUniforms(material, {
    //   time: { value: 0 },
    //   // frequency: wireUniform(material, () => webgl.controls.movement.frequency),
    //   // amplitude: wireUniform(material, () => webgl.controls.movement.amplitude),
    // })

    // customizeVertexShader(material, {
    //   head: glsl`
    //     uniform float time;
    //     uniform float frequency;
    //     uniform float amplitude;

    //     // you could import glsl packages like this
    //     // #pragma glslify: noise = require(glsl-noise/simplex/3d)
    //   `,
    //   main: glsl`
    //     float theta = sin(position.z * frequency + time) * amplitude;
    //     float c = cos(theta);
    //     float s = sin(theta);
    //     mat3 deformMatrix = mat3(c, 0, s, 0, 1, 0, -s, 0, c);
    //   `,
    //   // hook that lets you modify the normal
    //   objectNormal: glsl`
    //     objectNormal *= deformMatrix;
    //   `,
    //   // hook that lets you modify the position
    //   transformed: glsl`
    //     transformed *= deformMatrix;
    //   `,
    // })

    // apply the material to the model
    // suzanne.traverse((child) => {
    //   if (child.isMesh) {
    //     child.material = material
    //   }
    // })

    // make it a little bigger
    // suzanne.scale.multiplyScalar(1.2)

    this.add(suzanne)

    // set the background as the hdr
    // this.webgl.scene.background = envMap
  }

  // onPointerDown(event, { x, y }) {
  //   // for example, check of we clicked on an
  //   // object with raycasting
  //   const coords = new THREE.Vector2().set(
  //     (x / this.webgl.width) * 2 - 1,
  //     (-y / this.webgl.height) * 2 + 1
  //   )
  //   const distortion = new THREE.Vector2(-0.24, -0.15);
  //   const principalPoint = new THREE.Vector2(0, 0);
  //   const focalLength = new THREE.Vector2(1, 1);
  //   const skew = 0;
  //   const coordsDot = coords.dot(coords);
  //   distortion.multiplyScalar(coordsDot);
  //   distortion.addScalar(1);
  //   distortion.multiply(coords)
  //   const Xd = new THREE.Vector3(distortion.x, distortion.y, 1.0);
  //   const KK = new THREE.Matrix3(
  //     focalLength.x, 0.0, 0.0,
  //     skew * focalLength.x, focalLength.y, 0,
  //     principalPoint.x, principalPoint.y, 1.0
  //   )
  //   Xd.applyMatrix3(KK)
  //   console.log(Xd)
  //   const raycaster = new THREE.Raycaster()
  //   raycaster.setFromCamera(coords, this.webgl.camera)
  //   // const hits = raycaster.intersectObject(this, true)
  //   // console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit')
  //   // this, of course, doesn't take into consideration the
  //   // mesh deformation in the vertex shader
  // }

  // update(dt, time) {
  //   this.material.uniforms.time.value += dt * 1
  // }
}
