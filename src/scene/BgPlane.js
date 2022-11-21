import * as THREE from 'three'
import assets from '../utils/AssetManager'

const gradientKey = assets.queue({
  url: 'assets/images/gradientBg.jpeg',
  type: 'texture',
})

export default class BgPlane extends THREE.Group {
  constructor(webgl, options = {}) {
    super(options)
    // these can be used also in other methods
    this.webgl = webgl
    this.options = options

    // destructure and default values like you do in React
    const color = 0xffffff;

    const geometry = new THREE.PlaneGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
      color,
      map: assets.get(gradientKey),
    })
    this.plane = new THREE.Mesh(geometry, material)

    // add it to the group,
    // later the group will be added to the scene
    this.add(this.plane)

    this.resize({ width: webgl.width, height: webgl.height, pixelRatio: webgl.pixelRatio })
  }

  update(dt, time) {
  }

  resize({ width, height, pixelRatio }) {
    if (height > width) {
      this.plane.rotation.z = Math.PI / 2;
      this.plane.scale.x = 1;
      this.plane.scale.y = width / height;

    } else {
      this.plane.rotation.z = 0;
      this.plane.scale.x = width / height;
      this.plane.scale.y = 1;
    }

  }
}
