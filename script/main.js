

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth; 
canvas.height = innerHeight;
//DOM element
const scoreElement = document.querySelector('#score_span')
const startButton = document.querySelector('.game_button');
const panelControl = document.querySelector('.game')
const panelScoreElement = document.querySelector('.game_score')

//control panel
let right = false; 
let left = false; 
let up = false; 
let down = false;

let speed = 8; 


class Player{
    
    constructor(x, y, radius, color){
        this.x = x; 
        this.y = y; 
        this.radius = radius; 
        this.color = color; 
    }

    draw(){
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;         
        ctx.fill();
        
    }

    move(speed){
        if(right && this.x < canvas.width - this.radius){
            this.x += speed
        }       
    
        if(left && this.x > 0 + this.radius){
            this.x -= speed
            
        }

        if(up && this.y > 0 + this.radius){
            this.y -= speed
        }
        
        if(down && this.y < canvas.height - this.radius){
            this.y += speed
        }
    }

}


class Projectile{

    constructor(x, y, radius, color, velocity){
        this.x = x; 
        this.y = y; 

        this.radius = radius; 
        this.color = color; 
        this.velocity = velocity;
    }

    draw(){
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;  
        ctx.fill();
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x; 
        this.y = this.y + this.velocity.y;
      
    }
}

class Enemies{

    constructor(x, y, radius, color, velocity){
        this.x = x, 
        this.y = y, 
        this.radius = radius; 
        this.color = color; 
        this.velocity = velocity; 
    }

    draw(){
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color
        ctx.fill();
    }

    update(){
        this.draw()
        this.y = this.y - this.velocity
    }
}


function keyDown(e){

    switch(e.keyCode){
        case 68: 
            right = true; 
        break
        case 65: 
           left = true
        break
        case 87:
            up = true
        break
        case 83: 
            down = true
        break
        case 32: 
            projectiles.push(new Projectile(player.x, player.y, 5, 'red', {x: 0, y: -10}))
        break
    }
}

function keyUp(e){

    switch(e.keyCode){
        case 68: 
            right = false
        break
        case 65: 
            left = false
        break
        case 87:
            up = false
        break
        case 83: 
            down = false
        break
    
    }
}





let timeoutSpawnEnemy; 

function randomSpawnEnemy(){
    enemiesArray.push(new Enemies(random(0, canvas.width), 0, random(4, 70), `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`, random(-1, -20)))
    timeoutSpawnEnemy = setTimeout(randomSpawnEnemy , 200);
}


const reset =  function(){
    player = new Player(canvas.width/2, canvas.height/2, 20, 'blue')
    projectiles = []
    enemiesArray = []
    scoreElement.innerHTML = ` ${0}`; 
    panelScoreElement.innerHTML = ` ${0}`;
    scoreI = 0
}

function random(min, max){
    return Math.floor(Math.random()*(max-min+1)+min)
}

const enemies = new Enemies(random(0, canvas.width), 0, random(4, 70), 'red', -2)

let player = new Player(canvas.width/2, canvas.height/2, 20, 'blue', 8)
let projectiles = []
let enemiesArray = []



let animationId; 
let scoreI = 0; 

function animation(){
    animationId = requestAnimationFrame(animation);
    ctx.fillStyle = 'rgba(0, 0, 0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    projectiles.forEach((projectile, index) => {

        projectile.update()

        // usuwa pociski, jeśli opuszczą krawędź ekranu delete projectiles, after cross edge  
        if(projectile.y - projectile.radius < 0){ 
            setTimeout(()=>{
                projectiles.splice(index, 1)
            }, 0)
        }
    })

    enemiesArray.forEach((enemy, index) =>{
        enemy.update()
        //usuwa przeciwników, jeśli opuszczą krawędź ekranu 
        if(enemy.y - enemy.radius > canvas.height){
            setTimeout(()=>{
                enemiesArray.splice(index, 1)
            })
        }   
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        // koniec gry 
        if(dist - player.radius - enemy.radius < 0){
            cancelAnimationFrame(animationId)
            panelControl.style.display = 'flex'
            panelScoreElement.innerHTML = ` ${scoreI}`;
            clearTimeout(timeoutSpawnEnemy)
        }   

        projectiles.forEach((projectile, projectileIndex) =>{
            // oblicznamy dystans między dwoma punktami - pociskiem, przeciwnikiem
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if(dist - projectile.radius - enemy.radius < 1){
                scoreI += 1
                scoreElement.textContent = ` ${scoreI}`
                //setTimeout usuwa efekt mrugania podczas usuwania elemnntu 
                setTimeout(()=>{
                    enemiesArray.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                }, 0)
              
            }
        })
    })


    player.draw()
    player.move(speed)

  
    
}

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)

startButton.addEventListener('click', ()=>{
    reset()
    animation()
    randomSpawnEnemy()

    panelControl.style.display = 'none'
    
})


