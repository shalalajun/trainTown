import * as THREE from 'three'
import Experience from './Experience.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { SMAAPass} from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'


export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug 


        if(this.debug.active)
        {
            this.debugFolder3 = this.debug.ui.addFolder('bloom')
        }

        this.setInstance()
        this.postEffect()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.physicallyCorrectLights = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        this.instance.toneMappingExposure = 1.36
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        //this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        /**
         * effectComposer
         */
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
        //this.effectComposer.render();
    }

    postEffect()
    {
        
        this.renderTarget = new THREE.WebGLRenderTarget(
                800, 
                600,
                {
                    samples: this.instance.getPixelRatio() === 1 ? 4 : 0
                }
            )

        this.effectComposer = new EffectComposer(this.instance, this.renderTarget)
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio,2))
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)

        this.renderPass = new RenderPass(this.scene, this.camera.instance)

        this.effectComposer.addPass(this.renderPass)
        /**
         * dot
         */
        this.dotScreenPass = new DotScreenPass()
        this.dotScreenPass.enabled = false
        this.effectComposer.addPass(this.dotScreenPass)
        /**
         * glitch
         */
        this.glitchPass = new GlitchPass()
        this.glitchPass.enabled = false
        this.effectComposer.addPass(this.glitchPass)
        /**
         * rgb
         */
        this.rgbShiftPass = new ShaderPass(RGBShiftShader)
        //this.effectComposer.addPass(this.rgbShiftPass)

        /**
         * unrealBloom
         */

        this.unrealBloom = new UnrealBloomPass()
        this.unrealBloom.strength = 0.083
        this.unrealBloom.radius = 0.5
        this.unrealBloom.threshold = 0.8
        this.effectComposer.addPass(this.unrealBloom)

        this.debugFolder3.add(this.unrealBloom,'enabled')
        this.debugFolder3.add(this.unrealBloom,'strength').min(0).max(2).step(0.001)
        this.debugFolder3.add(this.unrealBloom,'radius').min(0).max(2).step(0.001)
        this.debugFolder3.add(this.unrealBloom,'threshold').min(0).max(1).step(0.001)



        /**
         * gamma
         */
        this.gammaCorrectionShader = new ShaderPass(GammaCorrectionShader)
        this.effectComposer.addPass(this.gammaCorrectionShader)


        /**
         * SMAAPass(안티아리아스)
         */
        if(this.instance.getPixelRatio() === 1 && !this.instance.capabilities.isWebGL2){
            this.smaaPass = new SMAAPass()
            this.effectComposer.addPass(this.smaaPass)
        }

        /**
         * Tint
         */
        this.tintShader =
        {
            uniforms: 
            {
                tDiffuse: { value: null },
                uTint: { value: null}
            },
            vertexShader: `

                varying vec2 vUv;

                void main()
                {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }    
            `,
            fragmentShader: `

                varying vec2 vUv;
                uniform sampler2D tDiffuse;
                uniform vec3 uTint;

                void main()
                {
                    vec4 color = texture2D(tDiffuse, vUv);
                    color.rgb += uTint;
                    gl_FragColor = color;
                }
            `
        }

        this.tintPass = new ShaderPass(this.tintShader)
        this.tintPass.material.uniforms.uTint.value = new THREE.Vector3()
        this.effectComposer.addPass(this.tintPass)

        this.debugFolder3.add(this.tintPass.material.uniforms.uTint.value,'x').min(0).max(1).step(0.001).name("red")
        this.debugFolder3.add(this.tintPass.material.uniforms.uTint.value,'y').min(0).max(1).step(0.001).name("green")
        this.debugFolder3.add(this.tintPass.material.uniforms.uTint.value,'z').min(0).max(1).step(0.001).name("blue")
    }
}