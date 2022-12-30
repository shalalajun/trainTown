import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import CharacterControl from './Utils/CharacterControl.js'

import sources from './sources.js'

let instance = null

export default class Experience
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        //this.characterControl = new CharacterControl()
       // this.scene.background = new THREE.Color(0xf5975e)
        //this.scene.fog = new THREE.FogExp2( 0xdf0ace, 0.039);
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        this.delta = 0
        this.fps = 24
        this.now;
        this.then = Date.now()
        this.interval = 1000/this.fps
        


        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.now = Date.now();
            this.delta = this.now - this.then;
        
        if(this.delta > this.interval)
        {
            this.update()
            this.then = this.now - (this.delta % this.interval)
        }
            
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
       
        this.world.update()
        this.renderer.update()
        //this.characterControl.update()
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }
}


/**
 * 프레임 트릭 참고!! 매우중요
 * var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;
  
function draw() {
     
    requestAnimationFrame(draw);
     
    now = Date.now();
    delta = now - then;
     
    if (delta > interval) {
        // update time stuffs
         
        // Just `then = now` is not enough.
        // Lets say we set fps at 10 which means
        // each frame must take 100ms
        // Now frame executes in 16ms (60fps) so
        // the loop iterates 7 times (16*7 = 112ms) until
        // delta > interval === true
        // Eventually this lowers down the FPS as
        // 112*10 = 1120ms (NOT 1000ms).
        // So we have to get rid of that extra 12ms
        // by subtracting delta (112) % interval (100).
        // Hope that makes sense.
         
        then = now - (delta % interval);
         
        // ... Code for Drawing the Frame ...
    }
}
 
draw();
 */