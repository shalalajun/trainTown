import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        
        
        this.fps = 30
        this.now;
        this.then = Date.now()
        this.interval = 1000/this.fps
        


        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    // tick()
    // {
    //     const currentTime = Date.now() // then
    //     this.delta = currentTime - this.current
    //     this.current = currentTime
    //     this.elapsed = this.current - this.start
       

    //     this.trigger('tick')

    //     setTimeout(() =>{
    //         window.requestAnimationFrame(() =>
    //         {
    //             this.tick()
    //         })
    //     }, 1000 / 24)
       

    //     // window.requestAnimationFrame(() =>
    //     // {
    //     //     this.tick()
    //     // })
    // }

    /**
     * 프레임제한 연구
     */

    tick()
    {
        window.requestAnimationFrame(() =>
        {
            this.tick()
        })

        this.trigger('tick')

      

        // window.requestAnimationFrame(() =>
        // {
        //     this.tick()
        // })
    }
}