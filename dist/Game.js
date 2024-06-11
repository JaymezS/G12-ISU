"use strict";
class Game {
    static _instance;
    player = new Player();
    gameMap = new GameMap();
    controller = new PlayerController(this.player);
    context = Canvas.instance.context;
    gameLoop = undefined;
    FPS = 60;
    timeInterval = 1000 / this.FPS;
    constructor() {
        this.gameLoop = setInterval(() => {
            this.controller.updatePlayer();
            this.renderForPlayer(this.player);
        }, this.timeInterval);
    }
    clearScreen() {
        this.context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
    }
    renderForPlayer(player) {
        this.clearScreen();
        for (let rayColumn = 0; rayColumn < Canvas.WIDTH; rayColumn++) {
            const CURRENT_RAY_ANGLE = (player.angle - player.fov / 2) + (rayColumn / Canvas.WIDTH) * player.fov;
            const RAW_RAY_RESULTS = player.castVisionRay(CURRENT_RAY_ANGLE);
            // cos angle = distance to wall (adj) / raw ray distance (hyp) 
            // distance to wall = raw distance * cos angle
            // angle = ray angle - player angle (or vice versa doesn't matter)
            const CORRECTED_DISTANCE = RAW_RAY_RESULTS[0] * Math.cos(player.angle - CURRENT_RAY_ANGLE);
            const WALL_LINE_HEIGHT = GameMap.tileSize / CORRECTED_DISTANCE * Canvas.HEIGHT;
            const LINE_START_POSITION = Canvas.HEIGHT / 2 - WALL_LINE_HEIGHT / 2;
            const LINE_END_POSITION = Canvas.HEIGHT / 2 + WALL_LINE_HEIGHT / 2;
            // custom shading, either use raw distance or distance to wall, either is fine, raw is more realistic
            // render the wall
            const brightness = Math.min(GameMap.tileSize / (RAW_RAY_RESULTS[0]), 1);
            Utilities.drawLine(rayColumn, LINE_START_POSITION, rayColumn, LINE_END_POSITION, `rgb(
        ${Math.floor(this.gameMap.baseTileColor[0] * brightness)},
        ${Math.floor(this.gameMap.baseTileColor[1] * brightness)},
        ${Math.floor(this.gameMap.baseTileColor[2] * brightness)}
        )`);
            // add texture to the walls
            const WALL_TEXTURE = this.gameMap.wallTexture;
            Canvas.instance.context.drawImage(WALL_TEXTURE, RAW_RAY_RESULTS[1], 0, 1, WALL_TEXTURE.height, rayColumn, LINE_START_POSITION, 1, LINE_END_POSITION - LINE_START_POSITION);
        }
    }
    static get instance() {
        if (Game._instance === undefined) {
            Game._instance = new Game();
        }
        return Game._instance;
    }
}
//# sourceMappingURL=Game.js.map