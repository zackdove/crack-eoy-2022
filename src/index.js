import { EffectPass, VignetteEffect } from 'postprocessing'
import WebGLApp from './utils/WebGLApp'
import assets from './utils/AssetManager'
import Suzanne from './scene/Suzanne'
import { addNaturalLight } from './scene/lights'
import { addScreenshotButton, addRecordButton } from './scene/screenshot-record-buttons'
import BgPlane from './scene/BgPlane'
import * as THREE from 'three'
import getDistortionShaderDefinition from './scene/Fisheye'
import { FisheyePass } from './scene/FisheyePass'
import ControlService from './scene/ControlService'

// true if the url has the `?debug` parameter, otherwise false
window.DEBUG = window.location.search.includes('debug')

// grab our canvas
const canvas = document.querySelector('#app')




// setup the WebGLRenderer
const webgl = new WebGLApp({
  canvas,
  // set the scene background color
  background: '#111',
  backgroundAlpha: 1,
  // enable postprocessing
  postprocessing: true,
  // show the fps counter from stats.js
  showFps: window.DEBUG,
  // enable OrbitControls
  orbitControls: window.DEBUG,
  // Add the controls pane inputs

  hideControls: true,
  // enable cannon-es
  // world: new CANNON.World(),
})

const isTouch = window.matchMedia("(hover: none)").matches;
webgl.isTouch = isTouch;

// attach it to the window to inspect in the console
if (window.DEBUG) {
  window.webgl = webgl
}

const params = {
  fisheye: {
    distortion: new THREE.Vector2(-0.2, -0.2),
    principalPoint: new THREE.Vector2(0, 0),
    focalLength: new THREE.Vector2(1, 1),
    skew: 0,
  },
  controls: {
    damping: 0.13,
    maxDegreesHorizontal: 5,
    maxDegreesVertical: 5,
  },
}
webgl.params = params;

// hide canvas
webgl.canvas.style.visibility = 'hidden'

// load any queued assets
assets.load({ renderer: webgl.renderer }).then(() => {
  // add any "WebGL components" here...
  // append them to the scene so you can
  // use them from other components easily
  webgl.scene.rotationGroup = new THREE.Group();
  webgl.scene.bgPlane = new BgPlane(webgl)
  webgl.scene.bgPlane.position.set(0, 0, -1)
  webgl.camera.position.set(0, 0, 0)

  webgl.scene.add(webgl.scene.rotationGroup)
  webgl.scene.rotationGroup.add(webgl.scene.bgPlane)

  webgl.scene.controlService = new ControlService(webgl);
  webgl.scene.add(webgl.scene.controlService)

  // lights and other scene related stuff
  addNaturalLight(webgl)

  // postprocessing
  // add an existing effect from the postprocessing library
  var fisheye = getDistortionShaderDefinition();
  const fisheyeMaterial = new THREE.ShaderMaterial({
    uniforms: fisheye.uniforms,
    vertexShader: fisheye.vertexShader,
    fragmentShader: fisheye.fragmentShader,
  });

  fisheyeMaterial.uniforms['distortion'].value = webgl.params.fisheye.distortion; // radial distortion coeff of term r^2
  fisheyeMaterial.uniforms['principalPoint'].value = webgl.params.fisheye.principalPoint;
  fisheyeMaterial.uniforms['focalLength'].value = webgl.params.fisheye.focalLength;
  fisheyeMaterial.uniforms['skew'].value = webgl.params.fisheye.skew;
  const fisheyePass = new FisheyePass(fisheyeMaterial, "tDiffuse", webgl);
  webgl.composer.addPass(fisheyePass);

  // add the save screenshot and save gif buttons
  if (window.DEBUG) {
    addScreenshotButton(webgl)
    addRecordButton(webgl)
  }

  // show canvas
  webgl.canvas.style.visibility = ''

  // start animation loop
  webgl.start()
})
