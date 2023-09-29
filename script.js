
const canvas = document.querySelector('#arena')
const ctx = canvas.getContext("2d")
const startScreen = document.querySelector("#startScreen");

bolts = []
troopers = []
projectiles = []
const SPEED = 3
const ROTATIONAL_SPEED = 0.05
const FRICTION = 0.97
const PROJECTILE_SPEED = 3
const TROOPER_SPEED = .1
let timer = 0.0
let gameStarted = false
let spawnSpeed = 120
let gameEnded = false
let highScores = []
if (localStorage.getItem('highScores')) {
    highScores = JSON.parse(localStorage.getItem('highScores'));
  }

const saberSwipe = new Audio('saberClash.mp3');
saberSwipe.loop = false;
saberSwipe.volume = 0.20

const saberMiss = new Audio('saberMiss2.m4a');

saberMiss.volume = 0.5

const saberStart = new Audio('power-up-2-lightsaber.mp3');
saberStart.loop = false;
saberStart.volume = .5

const saberHit = new Audio('crash-2-lightsaber.mp3');
saberHit.loop = false;
saberHit.volume = .5

const blaster = new Audio('blaster-pistol-001-01.mp3');
blaster.loop = false;
blaster.volume = .2

const intro = new Audio('im-a-jedi.mp3');
intro.loop = false;
intro.volume = 1

const playerHit = new Audio('ugh.mp3');
playerHit.loop = false;
playerHit.volume = .4

// const playerDeath = new Audio('ewok-death.mp3');
// playerDeath.loop = false;
// playerDeath.volume = .4

const playerDeath = new Audio('death.mp3');
playerDeath.loop = false;
playerDeath.volume = .4

const preDeath = new Audio('preDeath.mp3');
preDeath.loop = false;
preDeath.volume = 1



// 
// How to calculate vector between 2 points:
// var vectorX = this.x - enemy.x;
// var vectorY = this.y - enemy.y;
// 
// How to caculate distance between 2 points:
// var length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
// 


class Player {
    constructor({position}) {
        this.position = position   
        this.rotation = 0
        this.originalRotation = 0
        this.slash = false
        this.saberAnimationCounter = 18
        this.direction = "down"
        this.animateCounter = 0
        this.health = 20
    }

    draw() {
        if (this.position.x > 800) {
            this.position.x = 800
        }  
        if (this.position.x < 0) {
            this.position.x = 0
        } 
        if (this.position.y > 800) {
            this.position.y = 800
        }
         if (this.position.y < 0) {
            this.position.y = 0
         }

        let image = new Image()
        image.src = "SpriteSheetLion.png"

        let frameWidth = image.width/4
        let frameHeight = image.height/7
        let row = 0
        let column = 0
        
        if (this.direction == "up") {
            column = 1
        } else if (this.direction == "left") {
            column = 2
        } else if (this.direction == "right") {
            column = 3
        }
        row = parseInt(this.animateCounter / 20)
        if (this.animateCounter >= 120) {
            this.animateCounter = 0
        }

        let sizeMultiplier = 3
        let charWidth = frameWidth * sizeMultiplier
        let charHeight = frameHeight * sizeMultiplier
        
        ctx.drawImage(image, column*frameWidth, row*frameHeight, frameWidth, frameHeight, this.position.x - (charWidth /2), this.position.y - (charHeight / 2), charWidth, charHeight);
        if (keyboard.up || keyboard.down || keyboard.right || keyboard.left) {
            this.animateCounter++
        }
        
        


    }
    drawSaber() {
        let swordAngle = 0
        if (this.direction == "down") {
            swordAngle = 0
        } else if (this.direction == "right") {
            swordAngle = 0
        } else if (this.direction == "left") {
            swordAngle = 180
        } else if (this.direction == "up") {
            swordAngle = 180
        }
        ctx.save()
  
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate((swordAngle * Math.PI) / 180)
        ctx.translate(-this.position.x, -this.position.y)
        
        ctx.fillStyle = "yellow"

        let swordDirection
        if (swordAngle == 0) {
            swordDirection = -50
        } else {
            swordDirection = 50
        }
        ctx.fillRect(this.position.x + 18, this.position.y, 5, swordDirection)
        ctx.restore()
    }

    drawSlash() {
        ctx.save()        

        ctx.translate(this.position.x, this.position.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        ctx.translate(-this.position.x  , -this.position.y )
        
        ctx.fillStyle = "yellow"
        
        ctx.fillRect(this.position.x , this.position.y, 5, -50)
        
        ctx.restore()
    }

    update() {

        let currentSpeed = 5
        if (keyboard.up) {
            this.position.y -= currentSpeed;
            this.direction = "up"
        }
        if (keyboard.down) {
            this.position.y += currentSpeed;
            this.direction = "down"
        }    
        if (keyboard.left) {
            this.position.x -= currentSpeed;
            this.direction = "left" 
        }
        if (keyboard.right) {
            this.position.x += currentSpeed;
            this.direction = "right"
        } 

        if (this.slash == true ) {
            this.drawSlash()         
            
            this.rotation += 10
            if (this.saberAnimationCounter <= 0 ) {
                this.rotation = this.originalRotation
                this.slash = false
                this.saberAnimationCounter = 18
            } else {
                this.saberAnimationCounter--     
            }
                   
            
        }else {
            this.drawSaber()   
            
        }
        this.draw()
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
      this.trajectory = {x:0, y:0}
      this.boltColor = 'red'
    }
    
    draw() {
      ctx.beginPath()
   
        this.trajectory.x = this.position.x + (this.velocity.x * 20)
        this.trajectory.y = this.position.y + (this.velocity.y * 20)
        
        ctx.moveTo(this.position.x, this.position.y)
        
        ctx.lineTo(this.trajectory.x, this.trajectory.y)
        ctx.strokeStyle = this.boltColor
        ctx.lineWidth = 5
        ctx.stroke()


    }
  
    update() {
      
      
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
  
    }
}

class Trooper {
    constructor({ position, velocity, playerPosition }) {
      this.position = position // {x, y}
      

      this.playerPosition = playerPosition
      this.rotation = Math.atan2(this.playerPosition.y - this.position.y, this.playerPosition.x - this.position.x);
      this.velocity = { x: 0, y: 0 }
      this.projectiles = [] 
      this.dead = false
      this.animateCounter = 0
      this.timerchar = parseInt(timer/5) + 1
      this.deathCounter = 0

      if (this.timerchar > 9 ) {
        this.timerchar = 9
      }   
      this.randomChar = Math.floor((Math.random() * this.timerchar) + 1);
      this.sprite = `SpriteSheetBad${this.randomChar}.png`

        
      
    }
    
    draw() {
        
        let image = new Image()
        image.src = this.sprite

        let frameWidth = image.width/4
        let frameHeight = image.height/7
        let row = 0 
        let column = 0       
        row = parseInt(this.animateCounter / 20)
        if (this.animateCounter >= 120 ) {
            this.animateCounter = 0
        }
      
        let sizeMultiplier = 3
        let charWidth = frameWidth * sizeMultiplier
        let charHeight = frameHeight * sizeMultiplier
        if (this.dead == false) {
            ctx.drawImage(image, column*frameWidth, row*frameHeight, frameWidth, frameHeight, this.position.x - (charWidth /2), this.position.y - (charHeight / 2), charWidth, charHeight);
        }else {
            ctx.save()  
            ctx.translate(this.position.x, this.position.y)
            ctx.rotate(((this.deathCounter*4) * Math.PI) / 180)
            ctx.translate(-this.position.x, -this.position.y)
            ctx.drawImage(image, column*frameWidth, row*frameHeight, frameWidth, frameHeight, this.position.x - (charWidth /2), this.position.y - (charHeight / 2), charWidth, charHeight);
            ctx.restore()
        }
        this.animateCounter++      
      

    }
  
    update() {
        if (this.dead == false) {
            this.draw()
            this.velocity.x = Math.cos(this.rotation) * TROOPER_SPEED
            this.velocity.y = Math.sin(this.rotation) * TROOPER_SPEED
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            //https://gist.github.com/conorbuck/2606166
            this.rotation = Math.atan2(this.playerPosition.y - this.position.y, this.playerPosition.x - this.position.x);
        } else if (this.deathCounter <= 45) {
            console.log("dead")
            this.animateCounter = 120
            this.draw()
            this.deathCounter++
        
        }else if (this.deathCounter >= 45 || this.deathCounter > 360) {
            let image = new Image()
            image.src = "Fire.png"

            let frameWidth = image.width/12
            let frameHeight = image.height
            let row = 0 
            let column = 0       
            column = parseInt(this.animateCounter / 20) + 1          
        
            let sizeMultiplier = 3
            let charWidth = frameWidth * sizeMultiplier
            let charHeight = frameHeight * sizeMultiplier
         
            ctx.drawImage(image, column*frameWidth, row*frameHeight, frameWidth, frameHeight, this.position.x - (charWidth /2), this.position.y - (charHeight / 2), charWidth, charHeight);
            
            this.animateCounter++   
        }
    }
  

  }





const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 }
})



function shootAll() {
    troopers.forEach((trooper) => {
        if (trooper.dead == false) {
            trooper.projectiles.push(
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
    })
    blaster.play()
 
    
}


function spawnTrooper() {
    let side = Math.floor((Math.random() * 4) + 1)
    let x = Math.floor((Math.random() * 800) + 1)
    let y = Math.floor((Math.random() * 800) + 1)
    if (side == 1) { //top
        y = 0
    } else if (side == 2 ) { //right
        x = 800
    } else if (side == 3 ) { //bottom
        y = 800
    } else if (side == 4 ) { //left
        x = 0 
    } 
    
    troopers.push(
        new Trooper({        
            position: { x: x, y: y },            
            velocity: { x: 0, y: 0},
            playerPosition: player.position
        })
    )
}

////////////////////////////////////////////////////////////////////////
// 
//  Main Animate
//
////////////////////////////////////////////////////////////////////////
let shootCounter = 0
let spawnCounter = 0
let keyboard = { up: false, down: false, left: false, right: false };
function drawBoard() {
    
    if (!gameStarted) {
        drawStartScreen();
    } else {
    ctx.fillStyle = "background.png"
    ctx.fillRect(0,0, 800,800)
    let background = new Image()
    background.src = "background2.png"
    ctx.drawImage(background,0,0, 800, 800)

    
    //neon effect for everything !
    // ctx.shadowColor = "rgb("+193+","+253+","+51+")";
    // ctx.shadowBlur = 10;

    
    player.update()
    
    
    // trooper.update()
    // trooper2.update()
    troopers.forEach((trooper, trooperIndex) => {
        trooper.update()
        trooper.projectiles.forEach((projectile, projectileIndex) => {
            projectile.update()
            const dist = Math.hypot(trooper.projectiles[projectileIndex].trajectory.x - player.position.x, trooper.projectiles[projectileIndex].trajectory.y - player.position.y)
            const distToEnemy = Math.hypot(trooper.projectiles[projectileIndex].trajectory.x - trooper.position.x, trooper.projectiles[projectileIndex].trajectory.y - trooper.position.y)
            if (dist < 20 && player.slash == true) {
                console.log("redirected")
                
                saberSwipe.play(); 
                trooper.projectiles[projectileIndex].velocity.x =  -trooper.projectiles[projectileIndex].velocity.x
                trooper.projectiles[projectileIndex].velocity.y =  -trooper.projectiles[projectileIndex].velocity.y
                trooper.projectiles[projectileIndex].position.x = trooper.projectiles[projectileIndex].trajectory.x
                trooper.projectiles[projectileIndex].position.y = trooper.projectiles[projectileIndex].trajectory.y

                trooper.projectiles[projectileIndex].boltColor = 'blue'
                trooper.projectiles[projectileIndex].velocity.x *= 1.8
                trooper.projectiles[projectileIndex].velocity.y *= 1.8
            }else if (dist < 20) {
                console.log("Hit Player")
                player.health--
                if (player.health == 10) {
                    preDeath.play()
                } else {
                    playerHit.play()
                }
                
                trooper.projectiles.splice(projectileIndex,1)
            } else if (projectile.boltColor == "blue" && distToEnemy <= 20 ) {
                trooper.dead = true
                saberHit.play()
                console.log("enemy hit")              
            } else if (projectile.trajectory.x >= 800 || projectile.trajectory.x <= 0 || projectile.trajectory.y >= 800 || projectile.trajectory.y <= 0) {
                trooper.projectiles.splice(projectileIndex,1)
            }      
        })
    })

    troopers.forEach((trooper, trooperIndex) => {
        if (trooper.dead == true && trooper.projectiles.length == 0 && trooper.deathCounter > 400) {
            troopers.splice(trooperIndex,1 )
        }
    })

    shootCounter++
    if (shootCounter >= 120) {
        
        shootAll()
        shootCounter = 0
    }

    spawnCounter++
    if (spawnCounter >=spawnSpeed) {
        spawnTrooper()
        spawnCounter = 0
        console.log(spawnSpeed)
        if (spawnSpeed > 10 ) {
            spawnSpeed--
        }
    }

    timer += 20/1000
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'white'
    ctx.font = "bold 30px Arial";
    // ctx.shadowColor = "white";
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1
    ctx.fillText(`Timer: ${parseInt(timer)} sec`, 20, 50);
    ctx.strokeText(`Timer: ${parseInt(timer)} sec`, 20, 50);
    ctx.fillText(`Health: ${player.health}`, 600, 50)
    ctx.strokeText(`Health: ${player.health}`, 600, 50)

    
}


if (player.health > 0 ) {
    window.requestAnimationFrame(drawBoard)
    
} else {
    playerDeath.play()
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'black'
    ctx.font = "30px Arial";
    
    let deathText = `You Died! You survived for ${parseInt(timer)} sec! Press Enter to Reset`
    ctx.fillText(deathText,(canvas.width/2) - (ctx.measureText(deathText ).width/ 2) , canvas.height/2);
    ctx.strokeText(deathText,(canvas.width/2) - (ctx.measureText(deathText ).width/ 2) , canvas.height/2);
    ctx.fill();
    ctx.stroke();
    gameEnded = true
    score = timer
    if (score > Math.min(...highScores) || highScores.length < 10) {
        // The current score is higher than one of the top 10 or there are fewer than 10 high scores
        updateHighScores(score);
      }
    console.log(highScores)
    displayHighScores()
}
}

function updateHighScores(newScore) {
    highScores.push(newScore);
    highScores.sort((a, b) => b - a); // Sort in descending order
    if (highScores.length > 10) {
      highScores.pop(); // Remove the lowest score if there are more than 10
    }
    localStorage.setItem('highScores', JSON.stringify(highScores));
  }

  function displayHighScores() {
    const highScoresListElement = document.getElementById('high-scores-list');
  
    // Clear the existing list
    highScoresListElement.innerHTML = '';
  
    // Display the last 10 highest scores
    for (let i = 0; i < highScores.length; i++) {
      const listItem = document.createElement('li');
      listItem.textContent = `${i + 1}: ${highScores[i].toFixed(2)}sec`;
      highScoresListElement.appendChild(listItem);
    }
  }
displayHighScores()


window.addEventListener('keydown', (e) => {
            let playerSpeed = 20
            switch (e.key) {
                // case 'ArrowLeft':                    
                //     player.position.x -= playerSpeed
                //     player.rotation = 180                 
                //     break;
                // case 'ArrowRight':                   
                //     player.position.x += playerSpeed
                //     player.rotation = 0                  
                //     break;
                // case 'ArrowUp':                    
                //     player.position.y -= playerSpeed
                //     player.rotation = 270                
                //     break;
                // case 'ArrowDown':                    
                //     player.position.y += playerSpeed
                //     player.rotation = 90            
                //     console.log("down pushed")
                //     break;
                case ' ':
                    // console.log("space pushed")
                    e.preventDefault();
                    player.slashSaber()
                    if (gameStarted && gameEnded == false) {
                        saberMiss.play()
                    }
                    
                    break;
                    
            }

        })

document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 87: keyboard.up = true; player.rotation = 270;break; //w
        case 83: keyboard.down = true; player.rotation = 90; break; //s
        case 65: keyboard.left = true; player.rotation = 180 ;break; //a
        case 68: keyboard.right = true;player.rotation = 0 ; break; //d
    }
    if ( event.key === "Enter") {
        console.log(gameEnded, bolts)
        startScreen.style.display = "none"; // Hide the start screen
        if (gameStarted == false) {
            startGame()
        }
        
        if (gameEnded && gameStarted) {
            gameEnded = false
            // bolts = []
            troopers = []
            // projectiles = []            
            timer = 0.0
            gameStarted = false    
            gameEnded = false
            
            player.health = 30 
            player.position =  { x: canvas.width / 2, y: canvas.height / 2 }
            
            
            drawBoard()
            
        }
        // gameStarted = true;


    }
    });
    
document.addEventListener('keyup', function (event) {
switch (event.keyCode) {
    case 87: keyboard.up = false; break;
    case 83: keyboard.down = false; break;
    case 65: keyboard.left = false; break;
    case 68: keyboard.right = false; break;
}
});

function startGame() {
    startScreen.style.display = "none"; 
    gameStarted = true;
    saberStart.play()
    intro.play()

 
}


function drawStartScreen() {
    ctx.fillStyle = "black"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.fillText("Press Enter to Start", canvas.width / 2 - 160, canvas.height / 2);
}
drawBoard()

