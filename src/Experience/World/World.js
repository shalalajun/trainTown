import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Cat from './Cat.js'
import Tree from './Tree.js'
import CharacterControl from '../Utils/CharacterControl.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.charactotContol = new CharacterControl()

        this.camera = this.experience.camera
       
        this.scene = this.experience.scene
        this.resources = this.experience.resources
       

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.cat = new Cat()
            this.tree = new Tree()
            this.environment = new Environment()
        })

        
    }

   

    update()
    {
        if(this.cat){
            this.cat.update()        
        }
       
       
    }

    // characterUpdate()
    // {
    //     this.raycaster.setFromCamera(new THREE.Vector2(this.characterControl.pointer.x,this.characterControl.pointer.y), this.camera.instance)

    //     const direction = this.raycaster.ray.direction

    //     const distance = this.raycaster.ray.origin.distanceTo(this.cat.model.position);
       
    //     const movement = direction.clone().multiplyScalar(distance)

    //     this.cat.model.position.add(movement)

    //     this.cat.model.rotation.setFromVector3(direction);

    //     console.log(movement)
       
    // }
}