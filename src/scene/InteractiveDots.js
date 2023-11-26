import * as THREE from 'three'
import assets from '../utils/AssetManager'
import { CSS2DRenderer } from '../utils/CSS2DRenderer';
import InteractiveDot from './InteractiveDot'


const whiteMat = new THREE.MeshBasicMaterial();

const white = new THREE.Color('white');
const black = new THREE.Color('black');

export default class InteractiveDots extends THREE.Group {
    constructor(webgl, options = { widthSegments: 32, heightSegments: 16, dotSize: 0.01, count: 10, pickingScene: null }) {
        super(options)
        this.webgl = webgl
        this.options = options
        // this.css3DRenderer = new CSS2();
        // this.css3DRenderer.setSize(webgl.width, webgl.height);


        this.css2dRenderer = new CSS2DRenderer();
        this.css2dRenderer.setSize(webgl.width, webgl.height);
        document.getElementById('css2dContainer').appendChild(this.css2dRenderer.domElement);

        const radius = 4;
        const widthSegments = options.widthSegments;
        const heightSegments = options.heightSegments;
        const thetaStart = 0;
        const thetaLength = Math.PI;
        const phiStart = 0;
        const phiLength = 2 * Math.PI;
        const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);
        webgl.scene.rotationGroup.add(this)
        const idToObject = {};
        this.idToObject = idToObject;
        this.showTimeout;
        this.pickPosition = {
            x: 0,
            y: 0,
        }
        // this.position.set(0, 0, 0)
        this.topBanner = document.getElementById('topBanner')
        this.topBannerWhite = document.getElementById('topBannerWhite')
        this.bottomBanner = document.getElementById('bottomBanner')
        this.bottomBannerWhite = document.getElementById('bottomBannerWhite')
        this.overlay = document.getElementById('overlay');
        this.menuButton = document.getElementById('menuButton')
        const sphereGeo = new THREE.SphereGeometry(0.05);
        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('black') });
        this.material = material;
        this.currentDot;
        function getPosition(x, y) {
            let ix = -x + (widthSegments * 3 / 4);
            // if (widthSegments % 2 !== 0) ix -= 0.5;

            if (widthSegments % 4 !== 0 && widthSegments % 2 == 0) {
                ix -= 0.5;
            }
            else if ((widthSegments + 1) % 4 == 0) {
                ix -= 0.25;
            } else if ((widthSegments - 1) % 4 == 0) {
                ix += 0.25;
            }
            let iy = -y + (heightSegments / 2);
            if (heightSegments % 2 !== 0) iy -= 0.5;
            const v = iy / heightSegments;
            const u = ix / widthSegments;
            const vertex = new THREE.Vector3();
            vertex.x = - radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
            vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
            vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
            return vertex;
        }


        for (let i = 0; i < gridConfig.projects.length; i++) {
            let id = i
            // console.log(id)
            const sphere = new InteractiveDot(webgl, sphereGeo, material, i, whiteMat, this.css2dRenderer);
            sphere.position.copy(getPosition(gridConfig.projects[i].position.x, gridConfig.projects[i].position.y));
            this.add(sphere)
            idToObject[id] = sphere;

            // sphere.lookAt(webgl.camera.position)
            const pickingCube = new THREE.Mesh(sphereGeo, whiteMat);
            pickingCube.scale.setScalar(3);
            sphere.add(pickingCube)
            pickingCube.layers.enable(1);
            // this.webgl.scene.rotationGroup.add(pickingCube);
            // pickingCube.position.copy(sphere.position);
            pickingCube.visible = false;
            pickingCube.handleRaycast = () => sphere.handleRaycast();
        }
        // fixDotRotation();
    }

    fixDotRotation() {
        // this.webgl.scene.rotationGroup.rotation.set(0, 0, 0)
        const pos = new THREE.Vector3(this.webgl.camera.position.x, 0, this.webgl.camera.position.z);
        for (const [key, value] of Object.entries(this.idToObject)) {
            // pos.y = value.position.y;
            // value.lookAt(this.webgl.camera.position);
            // console.log(value)
        }
        this.webgl.camera.lookAt(new THREE.Vector3(0, 0, -1));
    }

    handleMove(event, { x, y }) {
        this.pickPosition.x = x;
        this.pickPosition.y = y;
        const coords = new THREE.Vector2().set(
            (x / this.webgl.width) * 2 - 1,
            (-y / this.webgl.height) * 2 + 1
        )
        // console.log(coords)
        // coords.x *= this.webgl.height / this.webgl.width
        // coords.y *= this.webgl.width / this.webgl.height


        const distortion = new THREE.Vector2(-0.24, -0.15);
        const principalPoint = new THREE.Vector2(0, 0);
        const focalLength = new THREE.Vector2(1, 1);
        const skew = 0;
        const coordsDot = coords.dot(coords);
        distortion.multiplyScalar(coordsDot);
        distortion.addScalar(1);
        distortion.multiply(coords)
        const Xd = new THREE.Vector3(distortion.x, distortion.y, 1.0);
        const KK = new THREE.Matrix3(
            focalLength.x, 0.0, 0.0,
            skew * focalLength.x, focalLength.y, 0,
            principalPoint.x, principalPoint.y, 1.0
        )
        KK.transpose();
        Xd.applyMatrix3(KK)
        // console.log(Xd)
        // Xd.x *= this.webgl.width / this.webgl.height
        // Xd.x *= this.webgl.height / this.webgl.width
        // Xd.y *= this.webgl.height / this.webgl.width
        const newCoords = new THREE.Vector2(Xd.x, Xd.y)
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(coords, this.webgl.camera)
        raycaster.layers.set(1);
        const hits = raycaster.intersectObject(this, true)
        // console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit')
        if (hits.length > 0) {
            // console.log(hits[0].object)
            hits[0].object.handleRaycast();
            this.currentDot = hits[0].object;
            if (!this.currentDot.isDot) this.currentDot = this.currentDot.parent
            if (this.currentDot.enabled) {
                document.body.style.cursor = 'pointer'
            } else {
                document.body.style.cursor = 'auto'
            }

            if (!this.showTimeout) {

                this.showTimeout = setTimeout(() => {
                    // console.log(this);
                    this.webgl.scene.artistSphere.visible = true;
                    // this.webgl.scene.videoPlane.visible = true;
                    this.showTimeout = null;
                    // this.webgl.scene.dottedSphere.sphere.material.uniforms.color.value = white;
                    // this.webgl.scene.dottedSphereVert.sphere.material.uniforms.color.value = white;
                    this.material.color = white;

                    for (const [key, value] of Object.entries(this.idToObject)) {
                        if (value === this.currentDot) {
                            value.visible = true;
                            value.div.classList.add('selected')
                            value.textObject.visible = true;
                            value.textObject.color = 0xffffff;
                            value.plusObject.color = 0xffffff;
                            this.topBanner.classList.remove('show')
                            this.topBannerWhite.classList.add('show');
                            this.bottomBanner.classList.remove('show')
                            this.bottomBannerWhite.classList.add('show')
                            this.menuButton.classList.add('hide')
                            if (this.webgl.isTouch) {
                                console.log(value)
                                value.tapToView.visible = true;
                             
                                  
                                
                            }
                        } else {
                            if (value.div) {
                                if (this.webgl.isTouch){
                                    value.div.classList.add('mobileShow')
                                } else {
                                    value.div.classList.remove('selected')
                                }
                              
                                // value.visible = false;
                                if (this.webgl.isTouch && value.tapToView) {
                                    value.tapToView.visible = true;
                                }
                            }
                        }

                    }


                }, 150)
            }

        } else {
            clearTimeout(this.showTimeout);
            this.webgl.scene.artistSphere.clearInterval();
            this.showTimeout = null;
            if (this.currentDot) {

            }
            this.material.color = black;
            for (const [key, value] of Object.entries(this.webgl.scene.interactiveDots.idToObject)) {
                if (value.textObject) {
                    value.textObject.color = 0x000000;
                    value.div.classList.remove('selected')
                    value.div.classList.remove('mobileShow')
                    value.plusObject.color = 0x000000;
                    this.menuButton.classList.remove('hide')

                    this.topBanner.classList.add('show')
                    this.topBannerWhite.classList.remove('show');
                    this.bottomBanner.classList.add('show');
                    this.bottomBannerWhite.classList.remove('show');

                    if (!this.webgl.isTouch) {
                        value.visible = true;
                        value.textObject.visible = false;
                        if (value.isBeingRaycast) {
                            value.isBeingRaycast = false;
                        }
                    } else {
                        if (value.tapToView) {
                            value.tapToView.visible = false;
                        }
                    }
                }
            }
            document.body.style.cursor = 'default'
            this.webgl.scene.artistSphere.visible = false;
        }
    }

    handleClick(event, { x, y }) {
        this.pickPosition.x = x;
        this.pickPosition.y = y;
        const coords = new THREE.Vector2().set(
            (x / this.webgl.width) * 2 - 1,
            (-y / this.webgl.height) * 2 + 1
        )
        // console.log(coords)
        // coords.x *= this.webgl.height / this.webgl.width
        // coords.y *= this.webgl.width / this.webgl.height


        const distortion = new THREE.Vector2(-0.24, -0.15);
        const principalPoint = new THREE.Vector2(0, 0);
        const focalLength = new THREE.Vector2(1, 1);
        const skew = 0;
        const coordsDot = coords.dot(coords);
        distortion.multiplyScalar(coordsDot);
        distortion.addScalar(1);
        distortion.multiply(coords)
        const Xd = new THREE.Vector3(distortion.x, distortion.y, 1.0);
        const KK = new THREE.Matrix3(
            focalLength.x, 0.0, 0.0,
            skew * focalLength.x, focalLength.y, 0,
            principalPoint.x, principalPoint.y, 1.0
        )
        KK.transpose();
        Xd.applyMatrix3(KK)
        // console.log(Xd)
        // Xd.x *= this.webgl.width / this.webgl.height
        // Xd.x *= this.webgl.height / this.webgl.width
        // Xd.y *= this.webgl.height / this.webgl.width
        const newCoords = new THREE.Vector2(Xd.x, Xd.y)
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(coords, this.webgl.camera)
        const hits = raycaster.intersectObject(this, true)
        // console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit')
        if (hits.length > 0) {
            // console.log(hits[0].object)
            // hits[0].object.handleClick();
            this.clickedDot = hits[0].object;
            if (!this.clickedDot.isDot) this.clickedDot = this.clickedDot.parent
            if (this.webgl.isTouch) {
                if (this.prevClickedDot === this.clickedDot) {
                    this.clickedDot.handleClick();
                }
                this.prevClickedDot = this.clickedDot;
            } else {
                this.clickedDot.handleClick();
            }
        } else {
            this.prevClickedDot = null;
        }
    }

    onPointerMove(event, { x, y }) {
        if (!this.webgl.isTouch) {
            this.handleMove(event, { x, y });
        }
    }

    onPointerDown(event, { x, y }) {
        this.handleMove(event, { x, y });
        this.handleClick(event, { x, y });
    };

    update(dt, time) {
        this.css2dRenderer.render(this.webgl.scene, this.webgl.camera)
        // this.gpuPickHelper.pick(this.pickPosition, this.pickingScene, this.webgl.camera, dt);
    }
}
