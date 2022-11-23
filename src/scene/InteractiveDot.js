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

            textObject.geometry.computeBoundingBox();
            webgl.textObject = textObject;
            const box = new THREE.BoxHelper(textObject, 0xffff00);
            // webgl.scene.add(box);
            this.box = box;

            const box3 = textObject.geometry.boundingBox;

            // conform to the object size like it's a boundingBox



            // make a BoxBufferGeometry of the same size as Box3
            const dimensions = new THREE.Vector3().subVectors(box3.max, box3.min);

            const boxGeo = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);

            // move new mesh center so it's aligned with the original object
            const matrix = new THREE.Matrix4().setPosition(dimensions.addVectors(box3.min, box3.max).multiplyScalar(0.5));
            boxGeo.applyMatrix4(matrix);
            // make a mesh

            const mesh = new THREE.Mesh(boxGeo, new THREE.MeshBasicMaterial());
            // this.webgl.pickingScene.add(mesh)
            // mesh.position.copy(new THREE.Vector3().addVectors(this.position, textObject.position))
            // mesh.position.copy(this.position)
            mesh.position.x += 0.01
            mesh.position.y += -0.01
            mesh.position.z -= 0.0
            if (webgl.isTouch) {
                mesh.position.x += 0.01
                mesh.position.y += -0.036
                mesh.position.z -= 0.0
            }
            // this.add(mesh)
            mesh.visible = false;
            mesh.handleRaycast = () => this.handleRaycast();
            mesh.scale.setScalar(1.15)
            // this.webgl.scene.rotationGroup.add(mesh)
            // this.webgl.scene.rotationGroup.add(mesh)
            this.textRaycastable = mesh;
            // this.textObject.updateWorldMatrix(true, false);
            // mesh.position.copy(this.textObject)
            webgl.increaseTextsLoaded();
        })

        // webgl.scene.add(mesh);
    }
    handleRaycast() {
        // console.log('raycast')
        // this.scale.setScalar(1.5);

        // this.textObject.sync();
        this.isBeingRaycast = true;
        // this.webgl.scene.videoPlane.changeTo(this.index);
    }
    handleClick() {
        console.log('dot clicked, navigating to ' + gridConfig.projects[this.index].link)
        window.location.href = gridConfig.projects[this.index].link
    }
    transitionToCoords() {
        // console.log(this.transitionToCoordsIndex)
        this.transitionToCoordsTimeout = setTimeout(() => {
            // console.log(this)
            if (this.transitionToCoordsIndex < this.stringLength) {
                this.currentString[this.transitionToCoordsIndex] = this.coordinates[this.transitionToCoordsIndex];
                this.textObject.text = this.currentString.join('');
                this.transitionToCoordsIndex++;
                this.transitionToCoords();
            } else {
                this.isCoords = true;
                this.transitioningToCoords = false;
            }
        }, 20)
    }
    transitionToTitle() {
        // console.log(this.transitionToCoordsIndex)
        this.transitionToTitleTimeout = setTimeout(() => {
            // console.log(this)
            if (this.transitionToTitleIndex < this.stringLength) {
                this.currentString[this.transitionToTitleIndex] = this.title[this.transitionToTitleIndex];
                this.textObject.text = this.currentString.join('');
                this.transitionToTitleIndex++;
                this.transitionToTitle();
            } else {
                this.isTitle = true;
                this.transitioningToTitle = false;
            }
        }, 40)
    }
    partTransitionToCoords() {

        this.transitionToPartCoordsTimeout = setTimeout(() => {
            // console.log(this)
            if (this.transitionToPartCoordsIndex < this.partCoordsEndIndex) {
                this.currentString[this.transitionToPartCoordsIndex] = this.coordinates[this.transitionToPartCoordsIndex];
                this.textObject.text = this.currentString.join('');
                this.transitionToPartCoordsIndex++;
                // this.partTransitionToCoords();
            } else {
                this.isPartCoords = true;
                this.transitioningToPartCoords = false;
                this.transitioningToTitle = true;
                this.transitionToTitleIndex = 0;
                this.isTitle = true;
                this.isCoords = false;
                // this.transitionToTitle();
            }
        }, 20)
    }
    update(dt, time) {



        if (this.isBeingRaycast) {
            // console.log(this.index)
            // this.textObject.text = this.coordinates;
            if (this.transitioningToTitle) {
                this.transitioningToTitle = false;
                clearTimeout(this.transitionToTitleTimeout);
            }
            if (this.transitioningToCoords) {
            } else {

                // if (!this.isCoords) {
                this.transitioningToCoords = true;
                this.transitionToCoordsIndex = 0;
                this.isTitle = false;
                this.isCoords = false;
                this.transitionToCoords();
                // }
            }
        } else {
            // this.textObject.text = this.title;
            if (this.transitioningToCoords) {
                this.transitioningToCoords = false;
                clearTimeout(this.transitionToCoordsTimeout);
            }
            if (this.isTitle) {
                // Random chance to do part transition
                if (Math.random() > 0.981) {
                    this.transitionToPartCoordsIndex = Math.floor(Math.random() * this.stringLength)
                    this.partCoordsEndIndex = this.transitionToPartCoordsIndex + 1;
                    if (this.partCoordsEndIndex < this.transitionToPartCoordsIndex) {
                        const t = this.transitionToPartCoordsIndex;
                        this.transitionToPartCoordsIndex = this.partCoordsEndIndex;
                        this.partCoordsEndIndex = t;
                    }
                    this.partTransitionToCoords();
                }
                if (Math.random() > 0.99) {
                    this.transitionToTitleIndex = 0;
                    this.transitionToTitle();
                }

            } else {
                this.transitioningToTitle = false;
                this.transitionToTitleIndex = 0;
                this.isTitle = true;
                this.isCoords = false;
                this.transitionToTitle();
            }


        }
        // this.isBeingRaycast = false;
        this.lookAt(this.webgl.camera.position)
        if (this.textRaycastable) {
            this.textRaycastable.rotation.copy(this.rotation)
        }
    }


    onPointerDown(event, { x, y }) {
        if (this.isBeingRaycast) {
            // console.log(this.index)
            this.webgl.scene.videoPlane.changeTo(this.index);
            // this.textObject.text = this.coordinates;
            if (this.transitioningToTitle) {
                this.transitioningToTitle = false;
                clearTimeout(this.transitionToTitleTimeout);
            }
            if (this.transitioningToCoords) {
            } else {

                // if (!this.isCoords) {
                this.transitioningToCoords = true;
                this.transitionToCoordsIndex = 0;
                this.isTitle = false;
                this.isCoords = false;
                this.transitionToCoords();
                // }
            }
        } else {
            // this.textObject.text = this.title;
            if (this.transitioningToCoords) {
                this.transitioningToCoords = false;
                clearTimeout(this.transitionToCoordsTimeout);
            }
            if (this.isTitle) {
                // Random chance to do part transition
                if (Math.random() > 0.981) {
                    this.transitionToPartCoordsIndex = Math.floor(Math.random() * this.stringLength)
                    this.partCoordsEndIndex = this.transitionToPartCoordsIndex + 1;
                    if (this.partCoordsEndIndex < this.transitionToPartCoordsIndex) {
                        const t = this.transitionToPartCoordsIndex;
                        this.transitionToPartCoordsIndex = this.partCoordsEndIndex;
                        this.partCoordsEndIndex = t;
                    }
                    this.partTransitionToCoords();
                }
                if (Math.random() > 0.99) {
                    this.transitionToTitleIndex = 0;
                    this.transitionToTitle();
                }

            } else {
                this.transitioningToTitle = false;
                this.transitionToTitleIndex = 0;
                this.isTitle = true;
                this.isCoords = false;
                this.transitionToTitle();
            }


        }
        // this.isBeingRaycast = false;
        this.lookAt(this.webgl.camera.position)
        if (this.textRaycastable) {
            this.textRaycastable.rotation.copy(this.rotation)
        }
    }

}
