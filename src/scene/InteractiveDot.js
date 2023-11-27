import * as THREE from 'three'
import assets from '../utils/AssetManager'
import { CSS2DObject } from '../utils/CSS2DRenderer';

const gradientKey = assets.queue({
    url: 'assets/images/grid-png-2.jpeg',
    type: 'texture',
})



gridConfig.gems.textureKeys = [];
for (let j = 0; j < gridConfig.gems.textures.length; j++) {
    gridConfig.gems.textureKeys.push(assets.queue({
        url: gridConfig.gems.textures[j],
        type: 'texture',
    }))
}



export default class InteractiveDot extends THREE.Group {
    isBeingRaycast = false;
    constructor(webgl, geometry, material, index, whiteMat, css2dRenderer) {
        super();
        this.webgl = webgl
        this.raycaster = new THREE.Raycaster()
        this.enabled = gridConfig.projects[index].enabled;

        // this.sphere = new THREE.Mesh(geometry, material);
        // material.color = new THREE.Color('green')
        // this.add(this.sphere)
      
        //  console.log(gridConfig.gems.textureKeys[index])
        const gemObject = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3, 1, 1), new THREE.MeshBasicMaterial({
            map: assets.get(gridConfig.gems.textureKeys[index % gridConfig.gems.textureKeys.length]),
            // alphaText: 0.5,
            transparent: true,
        }));
        this.add(gemObject)
        // textObject.position.z = 0.1;
        // textObject.position.x = 0.2;

        const div = document.createElement('div');
        this.div = div;
        div.innerHTML = ' ';
        div.classList.add('menuDot')
        const objectCSS = new CSS2DObject(div);
        this.add(objectCSS);

        // if (this.webgl.isTouch){
        //     div.classList.add('mobile')
        // }


        const title = document.createElement('div');
        title.innerHTML = gridConfig.projects[index].title;
        title.onclick = () => {
            window.location.href = gridConfig.projects[index].link
        }
        title.classList.add('title');
        div.appendChild(title);

        if (!gridConfig.projects[index].enabled) {
            div.classList.add('disabled')
        }

        // if (this.webgl.isTouch){
        //     const raycastSpriteMaterial = new THREE.SpriteMaterial( );

        //     const raycastSprite = new THREE.Sprite( material );
        //     this.add(raycastSprite)

        // }


        
        // this.add(textObject);

        // Can remove this once dots = length
        this.index = index;
        this.isDot = true;
        this.project = gridConfig.projects[index];
        this.title = gridConfig.projects[index].title.split('');
        this.textureKey = gridConfig.projects[index].textureKey;
       
        // textObject.curveRadius = 4

      


        this.layers.enable(1)
        if (webgl.isTouch) {
            // textObject.fontSize = 0.012;
          
        }

     
        // textObject.position.y = -0.01;
        if (webgl.isTouch) {
            this.tapToView = document.createElement('div');
            if (this.enabled) {
                this.tapToView.innerHTML = 'Tap To View';
            } else {
                this.tapToView.innerHTML = 'Coming Soon';
            }
            this.tapToView.onclick = () => {

                window.location.href = gridConfig.projects[index].link

            }

            this.tapToView.classList.add('tapToView');
            div.appendChild(this.tapToView);
            // this.add(tapToView)
        }
        // this.lookAt(webgl.camera.position)
        // Update the rendering:
      

        // webgl.scene.add(mesh);
    }
    handleRaycast() {
        // console.log('raycast')
        // this.scale.setScalar(1.5);

        // this.textObject.sync();
        this.isBeingRaycast = true;
        this.webgl.scene.artistSphere.changeTo(this.project);
        // this.webgl.scene.videoPlane.changeTo(this.index);
    }
    handleClick() {
        console.log('dot clicked, navigating to ' + gridConfig.projects[this.index].link)
        if (this.enabled) {
            window.open(gridConfig.projects[this.index].link, '_blank').focus();

        }
    }

    update(dt, time) {

        if (this.isBeingRaycast) {
            // console.log(this.index)
            // this.textObject.text = this.coordinates;
        } else {
            // this.textObject.text = this.title;
        }
        // this.isBeingRaycast = false;
        this.lookAt(this.webgl.camera.position)

    }


    onPointerDown(event, { x, y }) {
        if (this.isBeingRaycast) {
            // console.log(this.index)

        } else {

        }

    }

}
