import * as Renderer from './renderer.js'
import { Rect } from './rect.js';
import { Player } from './player.js';
import { Vector2 } from './vector2.js';

export const MAP_TILE_COUNT: number = 10;
export const TILE_SIZE: number = 64; 
export const MAP_SIZE: number = MAP_TILE_COUNT * TILE_SIZE;
export const MINIMAP_TILE_PADDING: number = 2;
export const MINIMAP_TILE_SIZE = 20;
export const MINIMAP_SIZE = MAP_TILE_COUNT * (MINIMAP_TILE_SIZE + MINIMAP_TILE_PADDING) + MINIMAP_TILE_PADDING;

const MAP: number[] = [
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
	1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
	1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 
	1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 
	1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 
	1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
	1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
	1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
	1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
];

export class Canvastein {
	private lastTimeStamp: DOMHighResTimeStamp;
	private player: Player;

	constructor() {
		this.player = new Player(new Vector2(MAP_SIZE/2, MAP_SIZE/2), 0);
		this.lastTimeStamp = 0;
		Renderer.SetCanvasSize(1920, 1080);
	}

	public Run(): void {
		window.requestAnimationFrame(this.GameLoop.bind(this));
	}

	private GameLoop(timeStamp: DOMHighResTimeStamp): void {
		const deltaTime: number = this.lastTimeStamp != 0 ? (timeStamp - this.lastTimeStamp) / 1000 : 1 / 60;

		this.player.Update(deltaTime);

		Renderer.BeginFrame('white');
		this.DrawMinimap();
		Renderer.DrawText(`FPS: ${Math.round(1/deltaTime)}`, new Vector2(Renderer.canvas.width-5, 5), 40, 'white', 'monospace', 5, 'black', 'right');

		this.lastTimeStamp = timeStamp;
		window.requestAnimationFrame(this.GameLoop.bind(this));
	}

	private DrawMinimap(): void {
		Renderer.FillRect(new Rect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE), '#aaa');

		Renderer.Begin();
		let mapTileRect: Rect = new Rect(0, 0, MINIMAP_TILE_SIZE, MINIMAP_TILE_SIZE);
		for(let y=0; y<MAP_TILE_COUNT; ++y) {
			for(let x=0; x<MAP_TILE_COUNT; ++x) {
				mapTileRect.x = MINIMAP_TILE_PADDING + x * (MINIMAP_TILE_SIZE + MINIMAP_TILE_PADDING);
				mapTileRect.y = MINIMAP_TILE_PADDING + y * (MINIMAP_TILE_SIZE + MINIMAP_TILE_PADDING);

				const tile: number = MAP[x + y * MAP_TILE_COUNT];
				if(tile == 0) continue;

				Renderer.AddRect(mapTileRect);
			}
		}
		Renderer.Fill('#555');
		Renderer.End();

		const playerMinimapPosition: Vector2 = new Vector2(this.player.position.x / MAP_SIZE * MINIMAP_SIZE, this.player.position.y / MAP_SIZE * MINIMAP_SIZE);

		// Draw player icon
		Renderer.Begin();
		Renderer.AddCircle(playerMinimapPosition, 5);
		Renderer.Fill('#f52');
		Renderer.End();

		// Draw player direction
		Renderer.Begin();
		Renderer.AddLine(playerMinimapPosition, new Vector2(playerMinimapPosition.x + Math.cos(this.player.angle) * 10, playerMinimapPosition.y + Math.sin(this.player.angle) * 10), 2);
		Renderer.Stroke('#5f2');
		Renderer.End();
	}
}
