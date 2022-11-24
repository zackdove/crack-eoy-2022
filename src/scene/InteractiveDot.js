import * as THREE from 'three'
import { Text } from 'troika-three-text'
import assets from '../utils/AssetManager'



export default class InteractiveDot extends THREE.Group {
    isBeingRaycast = false;
    constructor(webgl, geometry, material, index,) {
        super();
        this.webgl = webgl
        this.raycaster = new THREE.Raycaster()

        // this.sphere = new THREE.Mesh(geometry, material);
        // material.color = new THREE.Color('green')
        // this.add(this.sphere)
        const plusObject = new Text();
        this.add(plusObject);
        this.plusObject = plusObject;
        plusObject.handleRaycast = () => this.handleRaycast();
        plusObject.color = 0x000000;
        plusObject.anchorX = 'center';
        plusObject.anchorY = 'middle';
        plusObject.text = '+'
        plusObject.font = 'assets/fonts/PPNeueBit-Bold/PPNeueBit-Bold.woff'
        plusObject.fontSize = 0.325 * 1.6;
        plusObject.position.y = +  0.325 * 0.1;
        // textObject.position.z = 0.1;
        // textObject.position.x = 0.2;


        const textObject = new Text()
        this.add(textObject);
        this.textObject = textObject;
        // Can remove this once dots = length
        this.index = index;
        this.isDot = true;
        this.title = gridConfig.projects[index].title.split('');
        this.coordinates = gridConfig.projects[index].coordinates.split('');
        this.currentString = [...this.title];
        this.stringLength = Math.max(this.coordinates.length, this.title.length)
        this.transitionToCoordsTimeout = null;
        this.transitionToTitleTimeout = null;
        this.transitionToPartCoordsTimeout = null;
        this.transitionToCoordsIndex = 0;
        this.isTitle = true;
        this.isCoords = false;
        this.transitionToTitleIndex = 0;
        this.transitioningToCoords = false;
        this.transitioningToTitle = false;
        this.textureKey = gridConfig.projects[index].textureKey;
        textObject.text = this.title.join('');
        textObject.font = 'assets/fonts/PPNeueBit-Bold/PPNeueBit-Bold.woff'
        textObject.fontSize = 0.325;
        if (webgl.isTouch) {
            // textObject.fontSize = 0.012;
        }
        textObject.handleRaycast = () => this.handleRaycast();
        textObject.color = 0x000000;
        textObject.anchorX = 'left';
        textObject.anchorY = 'middle';
        // textObject.position.z = 0.1;
        textObject.position.x = 0.2;
        // textObject.position.y = -0.01;
        if (webgl.isTouch) {
            textObject.maxWidth = 0.12;
            const tapToView = new Text();
            tapToView.text = 'Tap to view';
            tapToView.handleRaycast = () => this.handleRaycast();
            tapToView.font = 'assets/fonts/PPNeueBit-Bold/PPNeueBit-Bold.woff'
            tapToView.fontSize = 0.01;
            tapToView.color = 0xc9c9c9;
            tapToView.anchorX = 'left';
            tapToView.anchorY = 'center';
            tapToView.position.z = 0.1;
            tapToView.position.x = 0.01;
            tapToView.position.y = -0.036;
            tapToView.visible = false;
            tapToView.sync();
            this.tapToView = tapToView
            this.add(tapToView)
        }
        // this.lookAt(webgl.camera.position)
        // Update the rendering:
        textObject.sync(() => {


            webgl.increaseTextsLoaded();
        })

        // webgl.scene.add(mesh);
    }
    handleRaycast() {
        // console.log('raycast')
        // this.scale.setScalar(1.5);

        // this.textObject.sync();
        this.isBeingRaycast = true;
        this.webgl.scene.artistSphere.changeTo(this.textureKey);
        // this.webgl.scene.videoPlane.changeTo(this.index);
    }
    handleClick() {
        console.log('dot clicked, navigating to ' + gridConfig.projects[this.index].link)
        window.location.href = gridConfig.projects[this.index].link
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
