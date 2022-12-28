import keyboardState from 'keyboard-state'
import * as THREE from 'three'
import Experience from '../Experience.js'
import listen from "key-state";



export default class Cat
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
        this.speed = 0.1
        
        this.cameras = []
        
        this.cameraIndex = 0
        this.camera = this.experience.camera
        
        this.followCam = new THREE.Object3D()
        this.followCam.position.copy(this.camera.instance.position)
        
        this.player.add(this.followCam)
        this.cameras.push(this.followCam)
        
        this.frontCam = new THREE.Object3D()
        this.frontCam.position.set(0, 3, -8)
        this.cameras.push(this.frontCam)

        this.overHeadCam = new THREE.Object3D()
        this.overHeadCam.position.set(0, 20, 0)
        this.cameras.push(this.overHeadCam)


        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
      
        this.resource = this.resources.items.foxModel
        this.catTex = this.resources.items.catTexture
        this.catTex.encoding = THREE.sRGBEncoding;
        // this.catTex = THREE.RepeatWrapping;
        // this.catTex = THREE.RepeatWrapping;
        this.catTex.flipY = false;
        this.catTex.needsUpdate = true;

        console.log(this.catTex)

        //this.playerControl(forward, turn);
        this.setModel()
        
      //  this.addKeyboardControl()
        this.setAnimation()
      
    }

    setModel()
    {
      
        this.model = this.resource.scene
        
        this.model.scale.set(10, 10, 10)
        this.model.position.set(0,-2,0)

        this.player.add(this.model)
        this.scene.add(this.player)
        
        this.catMap = new THREE.MeshStandardMaterial({
            map:this.catTex,
            roughness: 0.46,
            //metalness: 0.1
        })

        this.catMap.onBeforeCompile = (shader) => {


            shader.vertexShader = shader.vertexShader.replace(
                
                "#define STANDARD",
                `
                #define STANDARD
                varying vec3 wPosition;
                `
            )

            shader.vertexShader = shader.vertexShader.replace(
                
                "#include <clipping_planes_vertex> STANDARD",
                `
                #include <clipping_planes_vertex> STANDARD
                wPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                `
            )





            


            shader.fragmentShader = shader.fragmentShader.replace(
                
                "#include <output_fragment>",
                `
                #include <output_fragment>
                vec3 fCol = vec3(1.0,0.0,0.0);
                
                vec3 N = geometry.normal;
                vec3 L = normalize(directLight.direction);
                vec3 C = normalize(geometry.viewDir);
                vec3 H = normalize( directLight.direction + geometry.viewDir );

                float rim = dot(C,N);
                rim = 1. - rim;

                vec3 rimCol = vec3(1.000,0.785,0.250);
                
                gl_FragColor = vec4( outgoingLight + (rimCol*pow(rim, 12.)*0.5), diffuseColor.a );
                `
            )

        }

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.material = this.catMap
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        // this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        // this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
        
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
        this.addControls()
        this.position = new THREE.Object3D()
        this.position.position.copy(this.model.position)
        //console.log(position.position)
    // if (this.player.userData!==undefined && this.player.userData.move!==undefined){
    //     this.player.translateZ(this.player.userData.move.forward * dt * 5);
    //     this.player.rotateY(this.player.userData.move.turn * dt);
    //     }
    }

    // keyboardControl()
    // {
    //     const pos = this.player.position.clone()
    //     pos.y += 3;
    //     this.camera.instance.lookAt(pos)
    //     console.log(this.camera.instance)
    // }

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

    // addKeyboardControl(){
    //     document.addEventListener( 'keydown', this.keyDown );
    //     document.addEventListener( 'keyup', this.keyUp );

    //     // window.document.addEventListener( 'keydown', console.log('down') );
    //     // window.document.addEventListener( 'keyup', console.log('up')  );
    // }

//     keyDown(evt){
//         let forward = (this.player.userData!==undefined && this.player.userData.move!==undefined) ? this.player.userData.move.forward : 0;
//         let turn = (this.player.userData!=undefined && this.player.userData.move!==undefined) ?  this.player.userData.move.turn : 0;
        
//         switch(evt.keyCode){
//           case 87://W
//             forward = -1;
//             break;
//           case 83://S
//             forward = 1;
//             break;
//           case 65://A
//             turn = 1;
//             break;
//           case 68://D
//             turn = -1;
//             break;
//         }
        
//         this.playerControl(forward, turn);
//     }

//     keyUp(evt){
//         let forward = (this.player.userData!==undefined && this.player.userData.move!==undefined) ? this.player.userData.move.forward : 0;
//         let turn = (this.player.move!=undefined && this.player.userData.move!==undefined) ?  this.player.userData.move.turn : 0;
        
//         switch(evt.keyCode){
//           case 87://W
//             forward = 0;
//             break;
//           case 83://S
//             forward = 0;
//             break;
//           case 65://A
//             turn = 0;
//             break;
//           case 68://D
//             turn = 0;
//             break;
//         }
        
//         this.playerControl(forward, turn);
//     }

//     playerControl(forward, turn){
//         if (forward==0 && turn==0){
//              delete this.player.userData.move;
//          }else{
//        if (this.player.userData===undefined) this.player.userData = {};
//              this.player.userData.move = { forward, turn }; 
//          }
//  }
    
 
        

    
}