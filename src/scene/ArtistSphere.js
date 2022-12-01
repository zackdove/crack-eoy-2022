import * as THREE from 'three'
import assets from '../utils/AssetManager'

const sudanKey = assets.queue({
  url: 'assets/images/sudanArchives.jpeg',
  type: 'texture',
})


const lsdxoxoKey = assets.queue({
  url: 'assets/images/lsdxoxo.jpeg',
  type: 'texture',
})

const arcaKey = assets.queue({
  url: 'assets/images/arca.jpg',
  type: 'texture',
})

for (let i = 0; i < gridConfig.projects.length; i++) {
  gridConfig.projects[i].textureKeys = [];
  for (let j = 0; j < gridConfig.projects[i].textures.length; j++) {
    gridConfig.projects[i].textureKeys.push(assets.queue({
      url: gridConfig.projects[i].textures[j],
      type: 'texture',
    }))
  }
}


export default class ArtistSphere extends THREE.Group {
  constructor(webgl, options = {}) {
    super(options)
    // these can be used also in other methods
    this.webgl = webgl
    this.options = options



    // destructure and default values like you do in React
    const color = 0xffffff;

    const geometry = new THREE.SphereGeometry(9.5, 32, 32)

    const sudanMap = assets.get(sudanKey);
    sudanMap.wrapS = THREE.MirroredRepeatWrapping;
    sudanMap.wrapT = THREE.MirroredRepeatWrapping;
    sudanMap.repeat.set(8, 4);
    sudanMap.offset.x = 0.0;
    sudanMap.offset.y = -1.0;
    sudanMap.needsUpdate = true;
    sudanMap.encoding = THREE.LinearEncoding;
    this.sudanMap = sudanMap;

    const lsdxoxoMap = assets.get(lsdxoxoKey);
    lsdxoxoMap.wrapS = THREE.MirroredRepeatWrapping;
    lsdxoxoMap.wrapT = THREE.MirroredRepeatWrapping;
    lsdxoxoMap.repeat.set(6, 5);
    lsdxoxoMap.offset.x = 0.5;
    lsdxoxoMap.offset.y = 0.0;
    lsdxoxoMap.needsUpdate = true;
    lsdxoxoMap.encoding = THREE.LinearEncoding;
    this.lsdxoxoMap = lsdxoxoMap;

    const arcaMap = assets.get(arcaKey);
    arcaMap.wrapS = THREE.MirroredRepeatWrapping;
    arcaMap.wrapT = THREE.MirroredRepeatWrapping;
    arcaMap.repeat.set(8, 5);
    arcaMap.offset.x = 0.5;
    arcaMap.offset.y = 0.0;
    arcaMap.needsUpdate = true;
    arcaMap.encoding = THREE.LinearEncoding;
    this.arcaMap = arcaMap;

    for (let i = 0; i < gridConfig.projects.length; i++) {
      gridConfig.projects[i].textureMaps = [];
      for (let j = 0; j < gridConfig.projects[i].textureKeys.length; j++) {
        const t = assets.get(gridConfig.projects[i].textureKeys[j]);
        t.wrapS = THREE.MirroredRepeatWrapping;
        t.wrapT = THREE.MirroredRepeatWrapping;
        t.repeat.set(2, 2);
        t.offset.x = 0.5;
        t.offset.y = -0.5;
        t.encoding = THREE.LinearEncoding;
        t.needsUpdate = true;
        gridConfig.projects[i].textureMaps.push(t);
      }
    }


    this.visible = false;

    const material = new THREE.MeshBasicMaterial({
      color,
      map: sudanMap,
      side: THREE.DoubleSide,


    })
    this.plane = new THREE.Mesh(geometry, material)

    // add it to the group,
    // later the group will be added to the scene
    this.add(this.plane)
    this.rotation.y = Math.PI / 2;
    this.currentProject = gridConfig.projects[0];

    this.i = 0;
    this.incrementI = this.incrementI.bind(this)


  }

  incrementI() {
    this.i++;
    this.i = this.i % this.currentProject.textureMaps.length;
    this.plane.material.map = this.currentProject.textureMaps[this.i];
    if (!this.visible) {

    }
  }

  startInterval() {
    if (!this.interval) {
      this.interval = setInterval(this.incrementI, 1200);
    }
  }

  clearInterval() {
    clearInterval(this.interval)
    this.interval = null;
  }

  update(dt, time) {
    if (!this.visible) {
      // clearInterval(this.interval)
      // this.interval = null;
    }
  }


  changeTo(project) {
    // this.plane.material.map = project.textureMaps[0];
    this.currentProject = project;
    this.i = 0;
    this.plane.material.map = this.currentProject.textureMaps[this.i];
    this.startInterval();
  }
}
