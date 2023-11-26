import * as THREE from 'three'
import assets from '../utils/AssetManager'

const middleGemKey = assets.queue({
    url: "/assets/images/gems/middle.png",
    type: "texture",
})


export default class MenuSphere extends THREE.Group {
    constructor(webgl, options = {}) {
        super(options)
        // these can be used also in other methods
        this.webgl = webgl
        this.options = options

        // destructure and default values like you do in React
        const color = 0xffffff;

        const geometry = new THREE.PlaneGeometry(0.6, 0.6);
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            map: assets.get(middleGemKey),
        })
        this.sphere = new THREE.Mesh(geometry, material)

        // add it to the group,
        // later the group will be added to the scene
        this.add(this.sphere)


    }

    update(dt, time) {
    }


}
