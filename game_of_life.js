
const LIFE_STATE = {
    ALIVE: true,
    DEAD: false
};

class Cell {

    constructor(life_state) {
        this.life_state = life_state;
        this.neighbour_count = 0;
    }

    kill() {
        this.life_state = LIFE_STATE.DEAD;
    }

    bring_to_life() {
        this.life_state = LIFE_STATE.ALIVE;
    }
}


class GameOfLife {

    constructor(width, height) {

        this.canvas = document.getElementById("canvas");
        this.canvas.addEventListener("click", (e)=>this.on_canvas_click(e), false);
        this.canvas_ctx = this.canvas.getContext("2d");
        this.width = width;
        this.height = height;
        this.board = new Array(height).fill().map(
            (_, y) => new Array(width).fill().map((_, x) => new Cell(Math.random() <= 0.5 ? LIFE_STATE.ALIVE : LIFE_STATE.DEAD))
        );


        this.draw.bind(this);
    }

    on_canvas_click(e) {

        let w = this.canvas.width/this.width;
        let h = this.canvas.height/this.height;

        let x = Math.floor(e.clientX / w);
        let y = Math.floor(e.clientY / h);

        console.log(x,y);

        this.board[y][x].bring_to_life();

    }

    get_neighbour_counts() {

        const move_table = [
            [-1, -1], [0, -1], [1, -1],
            [-1, 0], [1, 0],
            [-1, 1], [0, 1], [1, 1]
        ];

        const mod = (n, m) => { return ((n%m)+m)%m};

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {

                let count = 0;
                for(let move of move_table) {
                    let _x = mod(x + move[0], this.width);
                    let _y = mod(y + move[1], this.height);

                    let cell = this.board[_y][_x];

                    if(cell.life_state === LIFE_STATE.ALIVE)
                        count++;
                }
                this.board[y][x].neighbour_count = count;
            }
        }
    }

    evolve() {

        this.get_neighbour_counts();
        for(let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {

                let cell = this.board[y][x];

                if(cell.neighbour_count <= 1)
                    cell.kill();
                else if(cell.neighbour_count > 3)
                    cell.kill();
                else if(cell.life_state === LIFE_STATE.ALIVE && cell.neighbour_count === 2)
                    cell.bring_to_life();
                else if(cell.neighbour_count === 3)
                    cell.bring_to_life();
            }
        }
    }

    draw() {

        let w = this.canvas.width/this.width;
        let h = this.canvas.height/this.height;



        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {

                this.canvas_ctx.fillStyle = this.board[y][x].life_state === LIFE_STATE.ALIVE ? "black" : "white";
                this.canvas_ctx.fillRect(x * h, y * w , w, h);
            }
        }
    }
}