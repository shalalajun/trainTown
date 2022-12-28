import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Cat from './Cat.js'
import Train from './Train.js'
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
            this.train = new Train()
            this.environment = new Environment()
        })

        
    }

   

    update()
    {
        if(this.cat){
            this.cat.update()        
        }

        if(this.train)
        {
            this.train.update()
        }
       
    }
}