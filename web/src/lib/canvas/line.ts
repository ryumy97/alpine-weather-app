import Position from './position';
import Object2D from './object';

export default class Line extends Object2D {
	public start: Position;
	public end: Position;
	public thickness: number;
	public color: string;

	constructor(
		start: Position,
		end: Position,
		{
			thickness = 1,
			color = 'black'
		}: {
			thickness?: number;
			color?: string;
		} = {}
	) {
		super();
		this.start = start;
		this.end = end;
		this.thickness = thickness;
		this.color = color;
	}

	public update(): void {
		// nothing to do
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.moveTo(this.start.x, this.start.y);
		ctx.lineTo(this.end.x, this.end.y);
		ctx.lineWidth = this.thickness;
		ctx.strokeStyle = this.color;
		ctx.lineCap = 'round';
		ctx.stroke();
	}
}

/** Quadratic curve; colinear control draws as a straight segment. */
export class CurveLine extends Line {
	public control: Position;

	constructor(
		start: Position,
		end: Position,
		control: Position,
		options: {
			thickness?: number;
			color?: string;
		} = {}
	) {
		super(start, end, options);
		this.control = control;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.moveTo(this.start.x, this.start.y);
		ctx.quadraticCurveTo(this.control.x, this.control.y, this.end.x, this.end.y);
		ctx.lineWidth = this.thickness;
		ctx.strokeStyle = this.color;
		ctx.lineCap = 'round';
		ctx.stroke();
	}
}

export class StokeHorizontalLine extends Line {
	/** Angle between the branch axis and the short sides, in degrees. 90 = rectangle. */
	public angle: number;

	constructor(
		start: Position,
		end: Position,
		{
			thickness = 1,
			color = 'black',
			angle = 60
		}: {
			thickness?: number;
			color?: string;
			angle?: number;
		} = {}
	) {
		super(start, end, { thickness, color });
		this.angle = angle;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		const dx = this.end.x - this.start.x;
		const dy = this.end.y - this.start.y;
		const length = Math.hypot(dx, dy);
		if (length === 0) return;

		const tx = dx / length;
		const ty = dy / length;
		const nx = -ty;
		const ny = tx;
		const angleRad = (this.angle * Math.PI) / 180;
		const sinA = Math.sin(angleRad);
		if (Math.abs(sinA) < 1e-6) return;

		// Short-side direction at `angle` from the branch axis; scaled so thickness is preserved.
		const scale = this.thickness / 2 / sinA;
		const ox = (Math.cos(angleRad) * tx + sinA * nx) * scale;
		const oy = (Math.cos(angleRad) * ty + sinA * ny) * scale;

		ctx.beginPath();
		ctx.moveTo(this.start.x + ox, this.start.y + oy);
		ctx.lineTo(this.end.x + ox, this.end.y + oy);
		ctx.lineTo(this.end.x - ox, this.end.y - oy);
		ctx.lineTo(this.start.x - ox, this.start.y - oy);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}
