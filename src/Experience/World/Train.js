import keyboardState from 'keyboard-state'
import * as THREE from 'three'
import Experience from '../Experience.js'
import listen from "key-state";



export default class Train
{
    constructor()
    {
        this.keys = listen(window,{
            left: [ "ArrowLeft", "KeyA" ],
            right: [ "ArrowRight", "KeyD" ],
            up: [ "ArrowUp", "KeyW" ],
            down: [ "ArrowDown", "KeyS" ]
        })

       
       
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.renderer = this.experience.renderer
        this.player = new THREE.Group()
        this.speed = 0.3

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2()
      
        this.resource = this.resources.items.trainModel
        console.log(this.resource)
        this.setModel()
        
      
    }

    setModel()
    {
      
        this.model = this.resource.scene
        this.model.scale.set(1, 1, 1)
        this.model.position.set(0,-2,0)

         this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.material.side = THREE.DoubleSide
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        this.player.add(this.model)
        this.scene.add(this.player)

       
    }

  
    update()
    {
        //console.log(this.model)
        this.addControls()
        this.position = new THREE.Object3D()
        this.position.position.copy(this.model.position)
       
    } 
   
    addControls()
    {
        if(this.keys.up)
        {
            this.player.translateZ(this.speed);
        }
        if(this.keys.down)
        {
            this.player.translateZ(-this.speed);
        }
        if(this.keys.left)
        {
            this.player.rotateY(this.speed*0.5);
        }
        if(this.keys.right)
        {
            this.player.rotateY(-this.speed*0.5);
        }
    }

   
      
}