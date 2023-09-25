// const canvas = document.querySelector('arena')
// const ctx = canvas.getContext("2d")
const canvas = document.querySelector('#arena')
const ctx = canvas.getContext("2d")
// ctx.globalCompositeOperation = "lighter";
// let player = {x : 400, y: 400, rotation: (270 * Math.PI / 180), position: {x: 400, y:400}} //intial horizontal position of drawn rectangle
// y = 400 //intial vertical position of drawn rectangle
let bolt = {x:700,y:400}
// let trooper = {x:700,y:400}
bolts = []
projectiles = []
const SPEED = 3
const ROTATIONAL_SPEED = 0.05
const FRICTION = 0.97
const PROJECTILE_SPEED = 3
const TROOPER_SPEED = .1

class Player {
    constructor({position}) {
        this.position = position   
        this.rotation = 0
        this.originalRotation = 0
        this.slash = false
        this.animationCounter = 18
    }

    draw() {
        

        ctx.fillStyle = "blue"
        // ctx.shadowColor = 'blue'
        ctx.fillRect(this.position.x, this.position.y, 10, 10);
        ctx.fillRect(this.position.x, this.position.y, -10, -10);
        ctx.fillRect(this.position.x, this.position.y, -10, 10);
        ctx.fillRect(this.position.x, this.position.y, 10, -10);

        


    }
    drawSaber() {
        ctx.save()
  
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        ctx.translate(-this.position.x, -this.position.y)
        
        ctx.fillStyle = "yellow"
        // ctx.moveTo(this.position.x + 30, this.position.y + 30)
        ctx.fillRect(this.position.x + 12, this.position.y, 5, -50)
        ctx.restore()
    }

    drawSlash() {
        ctx.save()
        
        // ctx.translate(this.position.x, this.position.y)
        // ctx.rotate((this.rotation * Math.PI) / 180)
        // ctx.translate(-this.position.x, -this.position.y)
        
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        ctx.translate(-this.position.x  , -this.position.y )
        
        ctx.fillStyle = "yellow"
        // ctx.moveTo(this.position.x + 30, this.position.y + 30)
        
        ctx.fillRect(this.position.x , this.position.y, 5, -50)
        
        ctx.restore()
    }

    update() {
        // console.log(this.animationCounter)        
        this.draw()
        // this.drawSaber()
        // this.drawSlash()
        if (this.slash == true ) {
            this.drawSlash()         
            this.rotation += 10
            if (this.animationCounter <= 0 ) {
                this.rotation = this.originalRotation
                this.slash = false
                this.animationCounter = 18
            } else {
                this.animationCounter--     
            }
                   
            
        }else {
            this.drawSaber()   
            
        }
    }

    slashSaber() {
        this.originalRotation = this.rotation
        this.slash = true
    }
}

class Projectile {
    constructor({ position, velocity, rotation }) {
      this.position = position
      this.velocity = velocity
      this.radius = 5
      this.rotation = rotation
    }
    
    draw() {
      ctx.beginPath()
    //   ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        
        let trajX = this.position.x + (this.velocity.x * 20)
        let trajY = this.position.y + (this.velocity.y * 20)
        
        ctx.moveTo(this.position.x, this.position.y)
        
        ctx.lineTo(trajX, trajY)
        ctx.strokeStyle = 'orange'
        ctx.stroke()

        // // let rotatex = trajX + Math.cos(this.rotation) 
        // // let rotatey = trajY + Math.sin(this.rotation ) 
        // console.log(rotatex, rotatey)
        // ctx.lineTo(rotatex, rotatey)
        // ctx.closePath()
        
        // ctx.fill()
    }
  
    update() {
      
      
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    //   console.log(this.rotation)
    }
}

class Trooper {
    constructor({ position, velocity, playerPosition }) {
      this.position = position // {x, y}
      

      this.playerPosition = playerPosition
      this.rotation = Math.atan2(this.playerPosition.y - this.position.y, this.playerPosition.x - this.position.x);
      this.velocity = { x: 0, y: 0 }
    }
    
    draw() {
      ctx.save()
  
      ctx.translate(this.position.x, this.position.y)
      ctx.rotate(this.rotation)
      ctx.translate(-this.position.x, -this.position.y)
  
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false)
      ctx.fillStyle = 'red'
      ctx.fill()
      ctx.closePath()
  
      // c.fillStyle = 'red'
      // c.fillRect(this.position.x, this.position.y, 100, 100)
      ctx.beginPath()
      ctx.moveTo(this.position.x + 30, this.position.y)
      ctx.lineTo(this.position.x - 10, this.position.y - 10)
      ctx.lineTo(this.position.x - 10, this.position.y + 10)
      ctx.closePath()
  
      ctx.strokeStyle = 'white'
      ctx.stroke()
      ctx.restore()
    }
  
    update() {
      this.draw()
      this.velocity.x = Math.cos(this.rotation) * TROOPER_SPEED
      this.velocity.y = Math.sin(this.rotation) * TROOPER_SPEED
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
      this.rotation = Math.atan2(this.playerPosition.y - this.position.y, this.playerPosition.x - this.position.x);
    }
  
    getVertices() {
      const cos = Math.cos(this.rotation)
      const sin = Math.sin(this.rotation)
  
      return [
        {
          x: this.position.x + cos * 30 - sin * 0,
          y: this.position.y + sin * 30 + cos * 0,
        },
        {
          x: this.position.x + cos * -10 - sin * 10,
          y: this.position.y + sin * -10 + cos * 10,
        },
        {
          x: this.position.x + cos * -10 - sin * -10,
          y: this.position.y + sin * -10 + cos * -10,
        },
      ]
    }
  }





const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 }
})

const trooper = new Trooper({
    position: { x: 600, y: 500 },
    
    velocity: { x: 0, y: 0},
    playerPosition: player.position
})

function shootAll() {
    projectiles.push(
        new Projectile({
            position: {
                x: trooper.position.x + Math.cos(trooper.rotation) * 30,
                y: trooper.position.y + Math.sin(trooper.rotation) * 30,
            },
            velocity: {
                x: Math.cos(trooper.rotation) * PROJECTILE_SPEED,
                y: Math.sin(trooper.rotation) * PROJECTILE_SPEED,
            },
            rotation: trooper.rotation
        })
    )
    
}

//////////////////////////
//
//  Main Animate
//
/////////////////////////
let shootCounter = 0
function drawBoard() {
    ctx.fillStyle = "grey"
    ctx.fillRect(0,0, 800,800)
    
    //neon effect for everything !
    ctx.shadowColor = "rgb("+193+","+253+","+51+")";
    ctx.shadowBlur = 10;

    player.update()
    trooper.update()
    
    shootCounter++
    if (shootCounter >= 60) {
        shootAll()
        shootCounter = 0
    }


    // drawBolt()
    // trooperpos.update()
    for (let i = 0; i < projectiles.length; i++ ) {
        projectiles[i].update()
    }
    // neonRect(200,200,50,50,193,253,51);
    // window.requestAnimationFrame(draw)
}

//
let ay = 0; //gravity constant in SI units
// let ay = 1;
let dt = 0.2; //time step in seconds
let t = 0; //initial time
let vel = 20; //intial speed in meters per second
let yo = trooper.y; //pixels from top to start 
let xo = trooper.x; //pixels from left to start
let angle = 90 * Math.PI / 180; // 45 degrees converted to radians
let vx = vel * Math.cos(angle);
let vy = vel * Math.sin(angle);
let x = xo; //position at t=0
let y = yo; //position at t=0
let colDiam = 100; //collagen count

function shoot() {

}

// var drawRectangle = function(x, y, w, h, border){
//     ctx.beginPath();
//     ctx.moveTo(x+border, y);
//     ctx.lineTo(x+w-border, y);
//     ctx.quadraticCurveTo(x+w-border, y, x+w, y+border);
//     ctx.lineTo(x+w, y+h-border);
//     ctx.quadraticCurveTo(x+w, y+h-border, x+w-border, y+h);
//     ctx.lineTo(x+border, y+h);
//     ctx.quadraticCurveTo(x+border, y+h, x, y+h-border);
//     ctx.lineTo(x, y+border);
//     ctx.quadraticCurveTo(x, y+border, x+border, y);
//     ctx.closePath();
//     ctx.stroke();
//   }
//   var neonRect = function(x,y,w,h,r,g,b){
//     ctx.shadowColor = "rgb("+r+","+g+","+b+")";
//     ctx.shadowBlur = 10;
//     ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
//     ctx.lineWidth=7.5;
//     drawRectangle(x,y,w,h,1.5);
//     ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
//     ctx.lineWidth=6;
//     drawRectangle(x,y,w,h,1.5);
//     ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
//     ctx.lineWidth=4.5;
//     drawRectangle(x,y,w,h,1.5);
//     ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
//     ctx.lineWidth=3;
//     drawRectangle(x,y,w,h,1.5);
//     ctx.strokeStyle= '#fff';
//     ctx.lineWidth=1.5;
//     drawRectangle(x,y,w,h,1.5);
    
//   };

drawBoard()

window.addEventListener('keydown', (e) => {
            let playerSpeed = 20
            switch (e.key) {
                case 'ArrowLeft':                    
                    player.position.x -= playerSpeed
                    player.rotation = 180                 
                    break;
                case 'ArrowRight':                   
                    player.position.x += playerSpeed
                    player.rotation = 0                  
                    break;
                case 'ArrowUp':                    
                    player.position.y -= playerSpeed
                    player.rotation = 270                
                    break;
                case 'ArrowDown':                    
                    player.position.y += playerSpeed
                    player.rotation = 90            
                    console.log("down pushed")
                    break;
                case ' ':
                    console.log("space pushed")
                    player.slashSaber()
                    break;
                    
            }
            ctx.clearRect(0,0, 800, 800);
            ctx.fillStyle = "grey"
            ctx.fillRect(0,0, 800,800)
            // drawBoard();
        })
let gameCycle = setInterval(drawBoard, 20)


// function drawJedi() {
//     // const canvas = document.querySelector('#arena')
//     // const ctx = canvas.getContext("2d")


//     ctx.fillStyle = "blue"
//     ctx.fillRect(player.x, player.y, 20, 20);
// }


// const trooperpos = new Trooper({
//     position: { x: 200, y: 200 },
//     velocity: { x: 0, y: 0 },
//   })


// function drawTrooper() {
//     ctx.fillStyle = "red"
//     ctx.fillRect(700, 400, 20, 20);
// }
// function drawBolt() {
    
//     // bolt.x -= 1
//     // bolt.y += 0
//     if ((x < 800 && x > 0) && (y < 800 && y >0)) {
//         t = +dt;
//         x = (x + vx * t) + colDiam * .0109;
//         y = y - vy * t + .5 * ay * (t * t);
//         let futureIntervals = 50
//         let futurex = (x + vx * (t * dt *futureIntervals) ) + colDiam * .0109;
//         let futurey = y - vy * (t * dt *futureIntervals) + .5 * ay * ((t * dt *futureIntervals) * (t * dt *futureIntervals));
        
        
//         ctx.fillStyle = "orange"
        
//         // ctx.save()
//         // ctx.rotate(45 * Math.PI / 180);
//         ctx.beginPath()
//         ctx.moveTo(x,y)
//         ctx.lineTo(futurex,futurey)
//         ctx.lineTo(futurex +2,futurey+2)

//         console.log(`x: ${x} y: ${y}`)
//         console.log(`futurex: ${futurex} futurey: ${futurey}`)
//         ctx.fill()
//         // ctx.save();
        
//         // 
//         // ctx.drawImage();
//         // draw your object
//         // ctx.restore();
//     } 
    
// }


    //draw 2 rectangles
    // ctx.fillStyle = "rgb(200, 0, 0)";
    // ctx.fillRect(10, 10, 50, 50);

    // ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    // ctx.fillRect(30, 30, 50, 50);
    // //draw a rectangle
    // ctx.fillRect(25, 25, 100, 100);
    // ctx.clearRect(45, 45, 60, 60);
    // ctx.strokeRect(50, 50, 50, 50);

    //draw a triangle then fill it
    // ctx.beginPath();
    // ctx.moveTo(75, 50);
    // ctx.lineTo(100, 75);
    // ctx.lineTo(100, 25);
    // ctx.fill();
    
    // ctx.beginPath();
    // ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    // ctx.moveTo(110, 75);
    // ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
    // ctx.moveTo(65, 65);
    // ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
    // ctx.moveTo(95, 65);
    // ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
    // ctx.stroke();

    // for (let i = 0; i < 4; i++) {
    //     for (let j = 0; j < 3; j++) {
    //       ctx.beginPath();
    //       const x = 25 + j * 50; // x coordinate
    //       const y = 25 + i * 50; // y coordinate
    //       const radius = 20; // Arc radius
    //       const startAngle = 0; // Starting point on circle
    //       const endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
    //       const counterclockwise = i % 2 !== 0; // clockwise or counterclockwise
  
    //       ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
  
    //       if (i > 1) {
    //         ctx.fill();
    //       } else {
    //         ctx.stroke();
    //       }
    //     }
    //   }

//     for (let i = 0; i < 6; i++) {
//         for (let j = 0; j < 6; j++) {
//           ctx.fillStyle = `rgb(${Math.floor(255 - 42.5 * i)}, ${Math.floor(
//             255 - 42.5 * j,
//           )}, 0)`;
//           ctx.fillRect(j * 25, i * 25, 25, 25);
//         }
//       }
//   }
// }

// draw()
  
// let canvas = document.createElement("canvas")
// canvas.id = "canvas"
// let ctx = canvas.getContext("2d")
// canvas.width = 800
// canvas.height = 800
// ctx.fillStyle = "rbga(0,0,200,0.2)"
// ctx.fillRect(0,0,800,800)
// ctx.beginPath()
// ctx.moveTo(0, 800)



// document.addEventListener('DOMContentLoaded', () => {
//     const arena = document.querySelector('#myCanvas')
//     const jedi = document.createElement('div')
//     const troopers = []
//     // const ctx = arena.getContext("2d")
//     // const canvas = document.getElementById("myCanvas")
//     const ctx = arena.getContext("2d");
    

//     let jediXLocation = 400
//     let jediYLocation = 400
//     const moveSpeed = 10

//     function createJedi() {
//         arena.appendChild(jedi)
//         jedi.classList.add('jedi')
//         jedi.style.left = jediXLocation + 'px'
//         jedi.style.top = jediYLocation + 'px'

//     }

//     function createTrooper() {
//         const trooper = document.createElement('div')
//         arena.appendChild(trooper)
//         trooper.classList.add('trooper')
//         trooper.style.left = '700px'
//         trooper.style.top = '400px'
//     }

//     function shoot() {

//     }
    


//     //https://www.fwait.com/how-to-move-an-object-with-arrow-keys-in-javascript/
//     window.addEventListener('keydown', (e) => {
//         switch (e.key) {
//             case 'ArrowLeft':
//                 jedi.style.left = parseInt(jedi.style.left) - moveSpeed + 'px';
//                 break;
//             case 'ArrowRight':
//                 jedi.style.left = parseInt(jedi.style.left) + moveSpeed + 'px';
//                 break;
//             case 'ArrowUp':
//                 jedi.style.top = parseInt(jedi.style.top) - moveSpeed + 'px';
//                 break;
//             case 'ArrowDown':
//                 jedi.style.top = parseInt(jedi.style.top) + moveSpeed + 'px';
//                 break;
//         }
//     })


//     // createJedi()

    

//     function  start() {
//         createJedi()
//         createTrooper()
//         ctx.moveTo(0, 0);
//         ctx.lineTo(100, 100);
//         ctx.stroke();

//     }

//     start()

// })