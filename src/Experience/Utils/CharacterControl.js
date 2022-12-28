
import * as THREE from 'three'
import EventEmitter from "./EventEmitter";
import Experience from '../Experience.js'


export default class CharacterControl 
{
    constructor()
    {
       
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.raycaster = new THREE.Raycaster()
       // this.cat = this.experience.world.cat.model
        

        this.renderer = this.experience.renderer

        this.pointer = new THREE.Vector2()
      
        
        window.addEventListener("click", ()=>
        {
          
           // this.onClick()
            console.log(this.cat)
            //this.trigger('click')
        }, false);
        

    }

    onClick(event)
    {
        this.camera = this.experience.camera.instance
        

        this.pointer.x = (window.event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(window.event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(new THREE.Vector2(this.pointer.x,this.pointer.y), this.camera)

        const direction = this.raycaster.ray.direction
        console.log(direction)

        const distance = this.raycaster.ray.origin.distanceTo(this.cat.model);
       
        const movement = direction.clone().multiplyScalar(distance)

        this.cat.model.position.add(movement)

        this.cat.model.rotation.setFromVector3(direction);

        console.log(movement)
    }

    // update()
    // {
    //     this.camPos = this.camera.instance.clone()
    //     this.raycaster.setFromCamera(new THREE.Vector2(this.pointer.x, this.pointer.y), this.camPos)
    // }
}