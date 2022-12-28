import * as THREE from 'three'
import Experience from '../Experience.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.renderer = this.experience.renderer.instance
        this.camera = this.scene.camera
        this.sunLight = new THREE.DirectionalLight('#ffffff', 2)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 150
        this.sunLight.shadow.mapSize.set(4096, 4096)
        this.sunLight.shadow.normalBias = 0.1
        this.sunLight.shadow.camera.left = 20;
        this.sunLight.shadow.camera.right = -20;
       // this.light.position.setFromSphericalCoords(250,phi,theta)
        this.scene.add(this.sunLight)

        this.shadowHelper = new THREE.CameraHelper(this.sunLight.shadow.camera)
        //this.scene.add(this.shadowHelper)
       
        
       
        this.sky = new Sky();
        this.sun = new THREE.Vector3();
        this.uniforms = this.sky.material.uniforms;



      
        
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
            this.debugFolder2 = this.debug.ui.addFolder('ski')
        }
        
        this.initSun()
       // this.setSunLight()
        this.setEnvironmentMap()
    }



    

    initSun()
    {
        this.sky.scale.setScalar( 450000 );
	    this.scene.add( this.sky );

        this.effectController = {
            turbidity: 0.6,
            rayleigh: 1.394,
            mieCoefficient: 0.1,
            mieDirectionalG: 0.8,
            elevation: 23,
            azimuth: -10.267,
            exposure: this.renderer.toneMappingExposure
        }
      
        this.guiChanged = () => {
            
            this.uniforms[ 'turbidity'].value = this.effectController.turbidity;
            this.uniforms[ 'rayleigh' ].value = this.effectController.rayleigh;
            this.uniforms[ 'mieCoefficient' ].value = this.effectController.mieCoefficient;
            this.uniforms[ 'mieDirectionalG' ].value = this.effectController.mieDirectionalG;
     
            const phi = THREE.MathUtils.degToRad( 90 - this.effectController.elevation );
            const theta = THREE.MathUtils.degToRad( this.effectController.azimuth );
             console.log(phi)
            this.sun.setFromSphericalCoords( 1, phi, theta );
            if(phi>=1.43){
                this.sunLight.position.setFromSphericalCoords(5,1.43,theta)
            }else{
            this.sunLight.position.setFromSphericalCoords(5,phi,theta)
            }
            const dayColor = new THREE.Color(0xffffff)
            const nightColor = new THREE.Color(0xf38645)
            const sunColor = new THREE.Color()
            const alpha = (this.effectController.elevation - 2) / (90 - 2); // 노말라이즈 하는 방법
            sunColor.lerpColors( nightColor, dayColor, alpha)
        
            this.sunLight.color.set(sunColor)

           
        //    const lightPower = alpha * 2 + 1
        //     this.sunLight.intensity = lightPower

          // console.log( this.sunLight.intensity)

            this.uniforms[ 'sunPosition' ].value.copy( this.sun );
     
            this.renderer.toneMappingExposure = this.effectController.exposure;

            //this.renderer.render( this.scene, this.camera);
        }
     
        this.debugFolder2.add( this.effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( this.guiChanged );
        this.debugFolder2.add( this.effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( this.guiChanged );
        this.debugFolder2.add( this.effectController, 'mieCoefficient', 0.0, 0.2, 0.001 ).onChange( this.guiChanged );
        this.debugFolder2.add( this.effectController, 'mieDirectionalG', 0.0, 1, 0.0005 ).onChange( this.guiChanged );
        this.debugFolder2.add( this.effectController, 'elevation', -5, 90, 0.001 ).onChange( this.guiChanged );
        this.debugFolder2.add( this.effectController, 'azimuth', - 180, 180, 0.001 ).onChange( this.guiChanged );
        this.debugFolder2.add( this.effectController, 'exposure', 0, 2, 0.0001 ).onChange( this.guiChanged );
       
        this.debugFolder2.add(this.shadowHelper,'visible').name('shadowHelper')
      
        //console.log(this.effectController.turbidity)
      
        this.guiChanged()
           
   }

   
  
   
  
     

    



   

    setSunLight()
    {

        // const phi = THREE.MathUtils.degToRad(90-this.effectController.elevation);
        // const theta = THREE.MathUtils.degToRad(this.effectController.azimuth);
        
        
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.001
       // this.light.position.setFromSphericalCoords(250,phi,theta)
        this.scene.add(this.sunLight)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 5)
                .max(5)
                .step(0.001)
        }
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 1.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding
        
        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}