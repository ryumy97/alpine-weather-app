import type Object2D from './object';

class Scene {
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly dpr: number;

	private readonly objects: Set<Object2D> = new Set();

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d')!;

		this.dpr = window.devicePixelRatio;

		this.canvas.width = window.innerWidth * this.dpr;
		this.canvas.height = window.innerHeight * this.dpr;
		this.canvas.style.width = window.innerWidth + 'px';
		this.canvas.style.height = window.innerHeight + 'px';
		this.ctx.scale(this.dpr, this.dpr);

		this.canvas.addEventListener('pointerdown', this.handleDown.bind(this));
		this.canvas.addEventListener('pointerup', this.handleUp.bind(this));
		this.canvas.addEventListener('pointermove', this.handleMove.bind(this));
		this.canvas.addEventListener('click', this.handleClick.bind(this));
	}

	public update(now: number): void {
		for (const object of this.objects) {
			object.update(now);
		}
	}

	public draw(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (const object of this.objects) {
			object.draw(this.ctx);
		}
	}

	public add(object: Object2D): void {
		this.objects.add(object);
	}

	public destroy(): void {
		this.canvas.removeEventListener('pointerdown', this.handleDown.bind(this));
		this.canvas.removeEventListener('pointerup', this.handleUp.bind(this));
		this.canvas.removeEventListener('pointermove', this.handleMove.bind(this));
		this.canvas.removeEventListener('click', this.handleClick.bind(this));
	}

	private handleClick(pointer: PointerEvent): void {
		void pointer;
	}

	private handleDown(pointer: PointerEvent): void {
		void pointer;
	}

	private handleMove(pointer: PointerEvent): void {
		void pointer;
	}

	private handleUp(pointer: PointerEvent): void {
		void pointer;
	}
}

export default Scene;
