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
		ctx.stroke();
	}
}

export class StokeHorizontalLine extends Line {
	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.moveTo(this.start.x, this.start.y - this.thickness / 2);
		ctx.lineTo(this.end.x, this.end.y - this.thickness / 2);
		ctx.lineTo(this.end.x, this.end.y + this.thickness / 2);
		ctx.lineTo(this.start.x, this.start.y + this.thickness / 2);
		ctx.lineTo(this.start.x, this.start.y - this.thickness / 2);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}
