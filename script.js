// const canvas = document.querySelector('arena')
// const ctx = canvas.getContext("2d")
const canvas = document.querySelector('#arena')
const ctx = canvas.getContext("2d")
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

class Player {
    constructor({position}) {
        this.position = position   
        this.rotation = (180 * Math.PI / 180)
    }

    draw() {
        ctx.fillStyle = "blue"
        ctx.fillRect(this.position.x, this.position.y, 10, 10);
        ctx.fillRect(this.position.x, this.position.y, -10, -10);
        ctx.fillRect(this.position.x, this.position.y, -10, 10);
        ctx.fillRect(this.position.x, this.position.y, 10, -10);

    }

    update() {
        this.draw()
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
      console.log(this.rotation)
    }
}

class Trooper {
    constructor({ position, velocity, playerPosition }) {
      this.position = position // {x, y}
      this.velocity = velocity
      this.playerPosition = playerPosition
      this.rotation = Math.atan2(this.playerPosition.y - this.position.y, this.playerPosition.x - this.position.x);
      
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


function drawJedi() {
    // const canvas = document.querySelector('#arena')
    // const ctx = canvas.getContext("2d")


    ctx.fillStyle = "blue"
    ctx.fillRect(player.x, player.y, 20, 20);
}


// const trooperpos = new Trooper({
//     position: { x: 200, y: 200 },
//     velocity: { x: 0, y: 0 },
//   })


function drawTrooper() {
    ctx.fillStyle = "red"
    ctx.fillRect(700, 400, 20, 20);
}


const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 }
})

const trooper = new Trooper({
    position: { x: 600, y: 500 },
    velocity: { x: 0, y: 0 },
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
    player.update()
    trooper.update()
    drawJedi()
    drawTrooper()
    // console.log(shootCounter)
    shootCounter++
    if (shootCounter >= 60) {
        shootAll()
        shootCounter = 0
    }


    drawBolt()
    // trooperpos.update()
    for (let i = 0; i < projectiles.length; i++ ) {
        projectiles[i].update()
    }
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

function drawBolt() {
    
    // bolt.x -= 1
    // bolt.y += 0
    if ((x < 800 && x > 0) && (y < 800 && y >0)) {
        t = +dt;
        x = (x + vx * t) + colDiam * .0109;
        y = y - vy * t + .5 * ay * (t * t);
        let futureIntervals = 50
        let futurex = (x + vx * (t * dt *futureIntervals) ) + colDiam * .0109;
        let futurey = y - vy * (t * dt *futureIntervals) + .5 * ay * ((t * dt *futureIntervals) * (t * dt *futureIntervals));
        
        
        ctx.fillStyle = "orange"
        
        // ctx.save()
        // ctx.rotate(45 * Math.PI / 180);
        ctx.beginPath()
        ctx.moveTo(x,y)
        ctx.lineTo(futurex,futurey)
        ctx.lineTo(futurex +2,futurey+2)

        console.log(`x: ${x} y: ${y}`)
        console.log(`futurex: ${futurex} futurey: ${futurey}`)
        ctx.fill()
        // ctx.save();
        
        // 
        // ctx.drawImage();
        // draw your object
        // ctx.restore();
    } 
    
}
drawBoard()

window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    // jedi.style.left = parseInt(jedi.style.left) - moveSpeed + 'px';
                    player.position.x -= 10
                    // player.position.x = player.x
                    break;
                case 'ArrowRight':
                    // jedi.style.left = parseInt(jedi.style.left) + moveSpeed + 'px';
                    player.position.x += 10
                    // player.position.x = player.x
                    break;
                case 'ArrowUp':
                    // jedi.style.top = parseInt(jedi.style.top) - moveSpeed + 'px';
                    player.position.y -= 10
                    // player.position.y = player.y
                    break;
                case 'ArrowDown':
                    // jedi.style.top = parseInt(jedi.style.top) + moveSpeed + 'px';
                    player.position.y += 10
                    // player.position.y = player.y
                    console.log("down pushed")
                    break;
                case ' ':
                    console.log("space pushed")
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
                        })
                    )
                    console.log(projectiles)
                    break;
                    
            }
            ctx.clearRect(0,0, 800, 800);
            ctx.fillStyle = "grey"
            ctx.fillRect(0,0, 800,800)
            // drawBoard();
        })
let gameCycle = setInterval(drawBoard, 20)


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