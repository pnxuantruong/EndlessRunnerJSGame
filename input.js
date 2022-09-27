export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown', e => {
            if ((e.key === 'ArrowUp' ||
                e.key === 'ArrowDown' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === ' '
                ) && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
            }
            else if(e.key === 'd') this.game.debug = !this.game.debug;
            else if(e.key === 'Enter' && this.game.gameOver) this.game.restart();
        });
        window.addEventListener('keyup', e => {
            if ((e.key === 'ArrowUp' ||
                e.key === 'ArrowDown' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === ' ' ||
                e.key === 'Enter'
                )) {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}