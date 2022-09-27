import Player from './player.js';
import InputHandler from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js';
import { UI } from './UI.js';
import { Button } from "./button.js";


window.addEventListener('load', function () {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;
    const startButton = document.getElementById("startButton");
    // const settingsBtn = document.getElementById("settingsButton");


    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 4;
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 50;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 30000;
            this.lastTime = 0;
            this.lives = 5;
            this.gameOver = false;
            this.pause = false;
            this.mute = false;
            this.backgroundTrack = document.getElementById("background_track");
            this.gameWinSound = document.getElementById("win_sound");
            this.gameLoseSound = document.getElementById("lose_sound");
            this.background = new Background(this, "forest");
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.btn = new Button(this.game, canvas.width - 30, 0, 100, 100, "\u2261", 'black');
        }
        enter() {
            this.backgroundTrack.play();
            this.time = 0;
            this.backgroundTrack.pause();
        }
        update(deltaTime) {
            if (!this.pause) {
                this.time += deltaTime;
                if (this.maxTime !== 'unlimit') {
                    if (this.time > this.maxTime) this.gameOver = true;
                }
                this.background.update();
                this.player.update(this.input.keys, deltaTime);
                // handle enemies
                if (this.enemyTimer > this.enemyInterval) {
                    this.addEnemy();
                    this.enemyTimer = 0
                } else this.enemyTimer += deltaTime;
                this.enemies.forEach(enemy => {
                    enemy.update(deltaTime);
                });

                //handle messages
                this.floatingMessages.forEach(message => {
                    message.update();
                });

                // handle particles
                this.particles.forEach((particle, index) => {
                    particle.update();
                    if (particle.markedForDeletion) this.particles.splice(index, 1);
                });
                if (this.particles.length > this.maxParticles) {
                    this.particles.length = this.maxParticles;
                }

                //handle collision sprites
                this.collisions.forEach((collision, index) => {
                    collision.update(deltaTime);
                });

                this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
                this.particles = this.particles.filter(particle => !particle.markedForDeletion);
                this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
                this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
            }
        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            })
            this.UI.draw(context);
        }
        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
        restart() {
            this.time = 0;
            this.lastTime = 0;
            this.speed = 0;
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.enemyTimer = 0;
            this.score = 0;
            this.lives = 5;
            this.background.restart();
            this.player.restart();
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.gameOver = false;
            animate(lastTime);
        }

    }

    startButton.addEventListener('click', function () {
        startButton.hidden = true;
        game.restart();
        game.enter();
    })

    // settingsBtn.addEventListener('click', function () {
    //     game.pause = !game.pause;
    //     settingsBtn.hidden = true;
    //     settingsBtn.hidden = false;
    // })

    const game = new Game(canvas.width, canvas.height);
    game.draw(ctx);
    let lastTime = 0;
    let deltaTime = 0;
    let defaultDeltaTime = 200;

    function animate(timeStamp) {
        deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        defaultDeltaTime = Math.min(deltaTime, defaultDeltaTime + 20);
        if (deltaTime > (defaultDeltaTime * 2)) {
            deltaTime = defaultDeltaTime;
            lastTime = timeStamp - defaultDeltaTime;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    }
});