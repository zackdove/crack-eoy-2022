import { UnsignedByteType } from "three";
import { Pass } from "postprocessing";

/**
 * A shader pass.
 *
 * Renders any shader material as a fullscreen effect. If you want to create multiple chained effects, please use
 * {@link EffectPass} instead.
 */

export class FisheyePass extends Pass {

    /**
     * Constructs a new shader pass.
     *
     * @param {ShaderMaterial} material - A shader material.
     * @param {String} [input="inputBuffer"] - The name of the input buffer uniform.
     */

    constructor(material, input = "inputBuffer", webgl) {

        super("ShaderPass");


        this.webgl = webgl;

        this.fullscreenMaterial = material;

        /**
         * The name of the input buffer uniform.
         *
         * Most fullscreen materials modify texels from an input texture. This pass automatically assigns the main input
         * buffer to the uniform identified by the input name.
         *
         * @type {String}
         */

        this.input = input;

    }

    /**
     * Sets the name of the input buffer uniform.
     *
     * @param {String} input - The name of the input buffer uniform.
     * @deprecated Use input instead.
     */

    setInput(input) {

        this.input = input;

    }

    /**
     * Renders the effect.
     *
     * @param {WebGLRenderer} renderer - The renderer.
     * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
     * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
     * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
     * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
     */

    render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

        const uniforms = this.fullscreenMaterial.uniforms;

        if (inputBuffer !== null && uniforms !== undefined && uniforms[this.input] !== undefined) {

            uniforms[this.input].value = inputBuffer.texture;
        }

        // this.webgl.composer.setMainScene(this.pickingScene)

        // const readPixel = new Float32Array(4);
        // const rect = webgl.canvas.getBoundingClientRect();
        // var x = (this.mousePos.x - rect.left) * inputBuffer.width / rect.width;
        // var y = (rect.height - (this.mousePos.y - rect.top)) * inputBuffer.height / rect.height;
        // renderer.setRenderTarget(outputBuffer);
        // console.log(renderer)

        // this.pickingScene.add(webgl.camera)
        // renderer.render(this.scene, this.camera);
        // renderer.readRenderTargetPixels(outputBuffer, x, y, 1, 1, readPixel);
        // console.log(readPixel); // Returns only [0., 0., 0., 0.]


        renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);

        renderer.render(this.scene, this.camera);


    }

    /**
     * Performs initialization tasks.
     *
     * @param {WebGLRenderer} renderer - A renderer.
     * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
     * @param {Number} frameBufferType - The type of the main frame buffers.
     */

    initialize(renderer, alpha, frameBufferType) {

        if (frameBufferType !== undefined && frameBufferType !== UnsignedByteType) {

            this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";

        }

    }

}