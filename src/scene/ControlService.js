import * as THREE from 'three'

export default class ControlService extends THREE.Group {
    constructor(webgl, camera) {
        super()
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.prevMovement = {
            x: null,
            y: null,
        }
        this.cameraTarget = new THREE.Vector3(0, 0, 0)
        this.webgl = webgl;
    }

    setupOrientation(){
        if (window.DeviceOrientationEvent) {
            console.log("Device has orientation")
            window.addEventListener(
              "deviceorientation",
              (event) => {
                const rotateDegrees = event.alpha; // alpha: rotation around z-axis
                const leftToRight = event.gamma; // gamma: left to right
                const frontToBack = event.beta; // beta: front back motion
          
                handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
              },
              true,
            );
          }
          
          const handleOrientationEvent = (frontToBack, leftToRight, rotateDegrees) => {
            console.log(frontToBack)
          };
    }
    onPointerDown(event, { x, y }) {

        if (this.webgl.isTouch) {
            this.prevMovement.x = null;
            this.prevMovement.y = null;
        }
    }


    onPointerMove(event, { x, y }) {
        if (this.webgl.isTouch) {
            if (this.prevMovement.x && this.prevMovement.y) {
                const deltaX = x - this.prevMovement.x;
                const deltaY = y - this.prevMovement.y;

                this.velocity.x += deltaX;

                this.velocity.y += deltaY;
            }
            this.prevMovement.x = x;
            this.prevMovement.y = y;
        } else {
            const xFrac = (x / this.webgl.width) - 0.5;
            const yFrac = (y / this.webgl.height) - 0.5;
            this.cameraTarget.x = yFrac * this.webgl.params.controls.maxDegreesVertical * Math.PI / 90;
            this.cameraTarget.y = xFrac * this.webgl.params.controls.maxDegreesHorizontal * Math.PI / 90;
        }
    }

    onPointerUp(event, { x, y }) {
        if (this.webgl.isTouch) {

        }
    }


    update(dt, time) {
        if (!this.webgl.debugCameraMode) {
            if (this.webgl.isTouch) {
                this.webgl.scene.rotationGroup.rotation.x -= this.velocity.y * this.webgl.params.mobileControls.velocityFactor;
                if (this.webgl.scene.rotationGroup.rotation.x > this.webgl.params.controls.maxDegreesVertical * Math.PI / 180) {
                    this.webgl.scene.rotationGroup.rotation.x = this.webgl.params.controls.maxDegreesVertical * Math.PI / 180;
                } else if (this.webgl.scene.rotationGroup.rotation.x < -this.webgl.params.controls.maxDegreesVertical * Math.PI / 180) {
                    this.webgl.scene.rotationGroup.rotation.x = -this.webgl.params.controls.maxDegreesVertical * Math.PI / 180;
                }
                this.webgl.scene.rotationGroup.rotation.y -= this.velocity.x * this.webgl.params.mobileControls.velocityFactor;
                if (this.webgl.scene.rotationGroup.rotation.y > this.webgl.params.controls.maxDegreesHorizontal * Math.PI / 180) {
                    this.webgl.scene.rotationGroup.rotation.y = this.webgl.params.controls.maxDegreesHorizontal * Math.PI / 180;
                } else if (this.webgl.scene.rotationGroup.rotation.y < -this.webgl.params.controls.maxDegreesHorizontal * Math.PI / 180) {
                    this.webgl.scene.rotationGroup.rotation.y = -this.webgl.params.controls.maxDegreesHorizontal * Math.PI / 180;
                }
                this.velocity.x *= 1 - this.webgl.params.mobileControls.velocityDecay;
                this.velocity.y *= 1 - this.webgl.params.mobileControls.velocityDecay;
            } else {
                this.webgl.scene.rotationGroup.rotation.y += (this.cameraTarget.y - this.webgl.scene.rotationGroup.rotation.y) * this.webgl.params.controls.damping;
                this.webgl.scene.rotationGroup.rotation.x += (this.cameraTarget.x - this.webgl.scene.rotationGroup.rotation.x) * this.webgl.params.controls.damping;
                // this.webgl.pickingScene.rotationGroup.rotation.copy(this.webgl.scene.rotationGroup.rotation)
            }

        } else {

        }
    }
}