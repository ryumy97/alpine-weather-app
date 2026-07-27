import { easeOut, transform } from './helper';
import Line, { StokeHorizontalLine } from './line';
import Object2D from './object';
import Position from './position';

export type TreeOptions = {
	thickness?: number;
	trunkColor?: string;
	branchColor?: string;
};

export default class Tree extends Object2D {
	public trunk: Line;
	public leftBranch: Line;
	public leftBranch2: Line;
	public leftBranch3: Line;
	public rightBranch: Line;
	public rightBranch2: Line;
	public rightBranch3: Line;
	private readonly createdAt: number;
	private readonly branches: Line[];

	public duration: number = 300;
	public stagger: number = 100;

	constructor(position: Position, options: TreeOptions = {}) {
		super();
		const thickness = options.thickness ?? window.innerWidth * 0.015;
		const trunkColor = options.trunkColor ?? 'black';
		const branchColor = options.branchColor ?? 'black';
		const branchThickness = thickness * 1.25;

		this.trunk = new Line(position.copy(), position.copy(), {
			thickness,
			color: trunkColor
		});
		this.leftBranch = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor
		});
		this.leftBranch2 = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor
		});
		this.leftBranch3 = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor
		});

		this.rightBranch = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor
		});
		this.rightBranch2 = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor
		});
		this.rightBranch3 = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor
		});

		this.branches = [
			this.leftBranch,
			this.leftBranch2,
			this.leftBranch3,
			this.rightBranch,
			this.rightBranch2,
			this.rightBranch3
		];

		this.createdAt = Date.now();
	}

	public setX(x: number): void {
		this.trunk.start.x = x;
		this.trunk.end.x = x;
	}

	public setThickness(thickness: number): void {
		this.trunk.thickness = thickness;
		const branchThickness = thickness * 1.25;
		for (const branch of this.branches) {
			branch.thickness = branchThickness;
		}
	}

	public setTrunkColor(color: string): void {
		this.trunk.color = color;
	}

	public setBranchColor(color: string): void {
		for (const branch of this.branches) {
			branch.color = color;
		}
	}

	public update(now: number): void {
		this.trunk.end.y =
			this.trunk.start.y -
			transform(now - this.createdAt, [0, this.duration], [0, window.innerHeight * 0.65], {
				easing: easeOut
			});

		this.leftBranch.start.x = this.trunk.end.x;
		this.leftBranch.start.y = this.trunk.end.y;
		this.leftBranch.end.x =
			this.leftBranch.start.x -
			transform(
				now - this.createdAt,
				[this.duration, this.duration * 2],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);
		this.leftBranch.end.y =
			this.leftBranch.start.y +
			transform(
				now - this.createdAt,
				[this.duration, this.duration * 2],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);

		this.leftBranch2.start.x = this.trunk.end.x;
		this.leftBranch2.start.y = this.trunk.end.y + window.innerHeight * 0.1;
		this.leftBranch2.end.x =
			this.leftBranch2.start.x -
			transform(
				now - this.createdAt,
				[this.duration + this.stagger * 2, this.duration * 2 + this.stagger * 2],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);
		this.leftBranch2.end.y =
			this.leftBranch2.start.y +
			transform(
				now - this.createdAt,
				[this.duration + this.stagger * 2, this.duration * 2 + this.stagger * 2],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);

		this.leftBranch3.start.x = this.trunk.end.x;
		this.leftBranch3.start.y = this.trunk.end.y + window.innerHeight * 0.2;
		this.leftBranch3.end.x =
			this.leftBranch3.start.x -
			transform(
				now - this.createdAt,
				[this.duration + this.stagger * 4, this.duration * 2 + this.stagger * 4],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);
		this.leftBranch3.end.y =
			this.leftBranch3.start.y +
			transform(
				now - this.createdAt,
				[this.duration + this.stagger * 4, this.duration * 2 + this.stagger * 4],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);

		this.rightBranch.start.x = this.trunk.end.x;
		this.rightBranch.start.y = this.trunk.end.y;
		this.rightBranch.end.x =
			this.rightBranch.start.x +
			transform(
				now - this.createdAt,
				[this.duration + this.stagger, this.duration * 2 + this.stagger],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);
		this.rightBranch.end.y =
			this.rightBranch.start.y +
			transform(
				now - this.createdAt,
				[this.duration + this.stagger, this.duration * 2 + this.stagger],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);

		this.rightBranch2.start.x = this.trunk.end.x;
		this.rightBranch2.start.y = this.trunk.end.y + window.innerHeight * 0.1;
		this.rightBranch2.end.x =
			this.rightBranch2.start.x +
			transform(
				now - this.createdAt,
				[this.duration + this.stagger * 3, this.duration * 2 + this.stagger * 3],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);
		this.rightBranch2.end.y =
			this.rightBranch2.start.y +
			transform(
				now - this.createdAt,
				[this.duration + this.stagger * 3, this.duration * 2 + this.stagger * 3],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);

		this.rightBranch3.start.x = this.trunk.end.x;
		this.rightBranch3.start.y = this.trunk.end.y + window.innerHeight * 0.2;
		this.rightBranch3.end.x =
			this.rightBranch3.start.x +
			transform(
				now - this.createdAt,
				[this.duration + this.stagger * 5, this.duration * 2 + this.stagger * 5],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);
		this.rightBranch3.end.y =
			this.rightBranch3.start.y +
			transform(
				now - this.createdAt,
				[this.duration + this.stagger * 5, this.duration * 2 + this.stagger * 5],
				[0, window.innerHeight * 0.1],
				{
					easing: easeOut
				}
			);
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		this.trunk.draw(ctx);
		this.leftBranch.draw(ctx);
		this.leftBranch2.draw(ctx);
		this.leftBranch3.draw(ctx);
		this.rightBranch.draw(ctx);
		this.rightBranch2.draw(ctx);
		this.rightBranch3.draw(ctx);
	}
}
