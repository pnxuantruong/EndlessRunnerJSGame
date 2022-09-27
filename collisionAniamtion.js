export class CollisionAnimation {
    constructor(game, x, y) {
        this.game = game;
        this.image = document.getElementById("collisionAnimation");
        this.spriteHeight = 100;
        this.spriteWidth = 90;
        this.sizeModifier = Math.random() + 0.5;
        this.width = this.sizeModifier * this.spriteWidth;
        this.height = this.sizeModifier * this.spriteHeight;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.frameX = 0;
        this.maxFrame = 4;
        this.markedForDeletion = false;
        this.fps = 15;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
    update(deltaTime) {
        this.x -= this.game.speed;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            this.frameX++
            if (this.frameX > this.maxFrame) this.markedForDeletion = true;
        } else this.frameTimer += deltaTime;
    }
}