export class Button {
    constructor(game, x, y, width, height, value = '', color = 'black', backgroundColor = 'none', padding = 3) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 0;
        this.height = 0;
        this.value = value;
        this.color = color;
        this.padding = padding;
        this.backgroundColor = backgroundColor;
    }
    update() {

    }
    draw(context) {
        context.save();
        context.textAlign = 'left';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        let metrics = context.measureText(this.value);
        let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        this.width = metrics.width + this.padding * 2;
        this.height = fontHeight + this.padding * 2;
        if (this.backgroundColor != 'none') {
            context.fillStyle = this.backgroundColor;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        context.fillStyle = this.color;
        context.fillText(this.value, this.x + this.padding, this.y + fontHeight);
        context.restore();
    }
}