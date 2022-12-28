import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Tree
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

      
        // Resource
      
        this.resource = this.resources.items.treeModel
        

        console.log(this.catTex)

        this.setModel()
      
    }

    setModel()
    {
      
        this.model = this.resource.scene
        this.model.scale.set(5, 5, 5)
        this.model.position.set(1,-5.5,0)
        this.model.rotation.y = Math.PI * 0.5 
        this.scene.add(this.model)
     
        

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
               
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    update()
    {
        this.model.position.z -= 0.03
    }

    
}