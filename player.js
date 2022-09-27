import { CollisionAnimation } from "./collisionAniamtion.js";
import { Diving, Falling, Hit, Jumping, Rolling, Running, Sitting } from "./playerState.js";
import { FloatingMessages } from "./foatingMessages.js";

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.gravity = 1;
        this.image = document.getElementById("player");
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
    }
    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);
        // horizontal movement;
        this.x += this.speed;
        if (input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;

        // horizontal boundary
        if (this.x < 0) this.x = 0;
        else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.gravity;
        else this.vy = 0;

        // vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
        //sprite animation
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;
        } else this.frameTimer += deltaTime;

    }
    draw(context) {
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision() {
        this.game.enemies.forEach(enenmy => {
            if (
                enenmy.x < this.x + this.width &&
                enenmy.x + enenmy.width > this.x &&
                enenmy.y + enenmy.height > this.y &&
                enenmy.y < this.y + this.height
            ) {
                //collison detected
                enenmy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enenmy.x + enenmy.width * 0.5, this.y + enenmy.height * 0.5));
                if (this.currentState == this.states[4] || this.currentState == this.states[5]) {
                    this.game.score++;
                    enenmy.deadSound.play();
                    this.game.floatingMessages.push(new FloatingMessages('+1', enenmy.x, enenmy.y, 150, 50))
                }
                else {
                    this.game.score-=5;
                    this.game.floatingMessages.push(new FloatingMessages('-5', enenmy.x, enenmy.y, 150, 50))
                    this.setState(6, 0);
                    this.game.lives--;
                    if(this.game.lives < 0) this.game.gameOver = true;
                }

            }
        });
    }
    restart(){
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frameTimer = 0;
        this.speed = 0;
        this.currentState = null;
    }
}