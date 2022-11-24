import * as THREE from 'three'
import assets from '../utils/AssetManager'


export default class MenuSphere extends THREE.Group {
    constructor(webgl, options = {}) {
        super(options)
        // these can be used also in other methods
        this.webgl = webgl
        this.options = options

        // destructure and default values like you do in React
        const color = 0xecff77;

        const geometry = new THREE.SphereGeometry(0.3, 32, 24)
        const material = new THREE.MeshBasicMaterial({
            color,
        })
        this.sphere = new THREE.Mesh(geometry, material)

        // add it to the group,
        // later the group will be added to the scene
        this.add(this.sphere)


    }

    update(dt, time) {
    }


}
