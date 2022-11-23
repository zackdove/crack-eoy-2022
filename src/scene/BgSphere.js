import * as THREE from 'three'
import assets from '../utils/AssetManager'

const gradientKey = assets.queue({
  url: 'assets/images/gradient23Nov.jpeg',
  type: 'texture',
})

export default class BgSphere extends THREE.Group {
  constructor(webgl, options = {}) {
    super(options)
    // these can be used also in other methods
    this.webgl = webgl
    this.options = options

    // destructure and default values like you do in React
    const color = 0xffffff;

    const geometry = new THREE.SphereGeometry(10, 32, 32)
    const map = assets.get(gradientKey);
    map.wrapS = THREE.MirroredRepeatWrapping;
    map.wrapT = THREE.MirroredRepeatWrapping;
    map.repeat.set(5, 5);
    map.offset.x = 0.;
    map.offset.y = 0.0;
    map.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      color,
      map: map,
      side: THREE.DoubleSide,
    })
    this.plane = new THREE.Mesh(geometry, material)

    // add it to the group,
    // later the group will be added to the scene
    this.add(this.plane)
    this.rotation.y = Math.PI / 2;

    this.resize({ width: webgl.width, height: webgl.height, pixelRatio: webgl.pixelRatio })
  }

  update(dt, time) {
  }

  resize({ width, height, pixelRatio }) {
    if (height > width) {
      this.plane.rotation.x = Math.PI / 2;
      // this.plane.scale.x = 1;
      // this.plane.scale.y = width / height;

    } else {
      this.plane.rotation.y = 0;
      // this.plane.scal?e.y = 1;
    }

  }
}
