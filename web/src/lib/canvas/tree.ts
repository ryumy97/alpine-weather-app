import { easeOut, transform } from './helper';
import { CurveLine, StokeHorizontalLine } from './line';
import type Line from './line';
import Object2D from './object';
import Position from './position';

const BRANCH_WIND_FLUTTER_COEFFICIENT = 0.002;
const BRANCH_WIND_PUSH_COEFFICIENT = 0.02;
/** Multiplier from wind speed (m/s) to intensity. */
const WIND_SPEED_TO_INTENSITY_COEFFICIENT = 1 / 10;

export type TreeOptions = {
	thickness?: number;
	trunkColor?: string;
	branchColor?: string;
	windSpeed?: number;
	/** Degrees from the trunk axis toward the tip. 90 = perpendicular. */
	branchAngle?: number;
	/** Parallelogram short-side angle in degrees. 90 = rectangle. */
	branchStrokeAngle?: number;
};

export default class Tree extends Object2D {
	public trunk: CurveLine;
	public leftBranch: StokeHorizontalLine;
	public leftBranch2: StokeHorizontalLine;
	public leftBranch3: StokeHorizontalLine;
	public rightBranch: StokeHorizontalLine;
	public rightBranch2: StokeHorizontalLine;
	public rightBranch3: StokeHorizontalLine;
	private readonly createdAt: number;
	private readonly branches: StokeHorizontalLine[];
	private readonly leftBranches: StokeHorizontalLine[];
	private readonly rightBranches: StokeHorizontalLine[];

	public duration: number = 300;
	public stagger: number = 100;
	/** Wind speed in m/s, blowing left → right. */
	public windSpeed: number = 0;
	/** Degrees from the trunk axis toward the tip. 90 = perpendicular. */
	public branchAngle: number = 120;
	/** Parallelogram short-side angle in degrees. 90 = rectangle. */
	public branchStrokeAngle: number = 60;

	constructor(position: Position, options: TreeOptions = {}) {
		super();
		const thickness = options.thickness ?? window.innerWidth * 0.015;
		const trunkColor = options.trunkColor ?? 'black';
		const branchColor = options.branchColor ?? 'black';
		const branchThickness = thickness * 1.25;
		this.windSpeed = options.windSpeed ?? 0;
		this.branchAngle = options.branchAngle ?? 120;
		this.branchStrokeAngle = options.branchStrokeAngle ?? 60;
		const leftStrokeAngle = 180 - this.branchStrokeAngle;

		this.trunk = new CurveLine(position.copy(), position.copy(), position.copy(), {
			thickness,
			color: trunkColor
		});
		this.leftBranch = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor,
			angle: leftStrokeAngle
		});
		this.leftBranch2 = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor,
			angle: leftStrokeAngle
		});
		this.leftBranch3 = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor,
			angle: leftStrokeAngle
		});

		this.rightBranch = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor,
			angle: this.branchStrokeAngle
		});
		this.rightBranch2 = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor,
			angle: this.branchStrokeAngle
		});
		this.rightBranch3 = new StokeHorizontalLine(position.copy(), position.copy(), {
			thickness: branchThickness,
			color: branchColor,
			angle: this.branchStrokeAngle
		});

		this.leftBranches = [this.leftBranch, this.leftBranch2, this.leftBranch3];
		this.rightBranches = [this.rightBranch, this.rightBranch2, this.rightBranch3];
		this.branches = [...this.leftBranches, ...this.rightBranches];

		this.createdAt = Date.now();
	}

	public setX(x: number): void {
		this.trunk.start.x = x;
		this.trunk.end.x = x;
		this.trunk.control.x = x;
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

	public setWindSpeed(ms: number): void {
		this.windSpeed = Math.max(0, ms);
	}

	public setBranchAngle(degrees: number): void {
		this.branchAngle = degrees;
	}

	public setBranchStrokeAngle(degrees: number): void {
		this.branchStrokeAngle = degrees;
		const leftStrokeAngle = 180 - degrees;
		for (const branch of this.leftBranches) {
			branch.angle = leftStrokeAngle;
		}
		for (const branch of this.rightBranches) {
			branch.angle = degrees;
		}
	}

	private trunkPointAt(progress: number): Position {
		const t = Math.max(0, Math.min(1, progress));
		const inv = 1 - t;
		return new Position(
			inv * inv * this.trunk.start.x +
				2 * inv * t * this.trunk.control.x +
				t * t * this.trunk.end.x,
			inv * inv * this.trunk.start.y + 2 * inv * t * this.trunk.control.y + t * t * this.trunk.end.y
		);
	}

	private trunkTangentAt(progress: number): Position {
		const t = Math.max(0, Math.min(1, progress));
		const dx =
			2 * (1 - t) * (this.trunk.control.x - this.trunk.start.x) +
			2 * t * (this.trunk.end.x - this.trunk.control.x);
		const dy =
			2 * (1 - t) * (this.trunk.control.y - this.trunk.start.y) +
			2 * t * (this.trunk.end.y - this.trunk.control.y);
		const length = Math.hypot(dx, dy) || 1;

		return new Position(dx / length, dy / length);
	}

	private trunkNormalAt(progress: number): Position {
		const tangent = this.trunkTangentAt(progress);
		return new Position(-tangent.y, tangent.x);
	}

	private updateBranch(
		branch: Line,
		now: number,
		progress: number,
		growthWindow: [number, number],
		side: -1 | 1
	): void {
		const anchor = this.trunkPointAt(progress);
		const tangent = this.trunkTangentAt(progress);
		const normal = this.trunkNormalAt(progress);
		const length = transform(now - this.createdAt, growthWindow, [0, window.innerHeight * 0.1], {
			easing: easeOut
		});
		const angleRad = (this.branchAngle * Math.PI) / 180;
		const dirX = Math.cos(angleRad) * tangent.x + Math.sin(angleRad) * normal.x * side;
		const dirY = Math.cos(angleRad) * tangent.y + Math.sin(angleRad) * normal.y * side;

		branch.start.x = anchor.x;
		branch.start.y = anchor.y;
		branch.end.x = anchor.x + dirX * length;
		branch.end.y = anchor.y + dirY * length;
	}

	public update(now: number): void {
		// Grow assumes an upright trunk; wind bend is applied before branches are laid out.
		this.trunk.end.x = this.trunk.start.x;
		this.trunk.end.y =
			this.trunk.start.y -
			transform(now - this.createdAt, [0, this.duration], [0, window.innerHeight * 0.65], {
				easing: easeOut
			});
		this.trunk.control.x = this.trunk.start.x;
		this.trunk.control.y = (this.trunk.start.y + this.trunk.end.y) / 2;

		this.applyWind(now);

		this.updateBranch(this.leftBranch, now, 1, [this.duration, this.duration * 2], -1);
		this.updateBranch(
			this.leftBranch2,
			now,
			0.84,
			[this.duration + this.stagger * 2, this.duration * 2 + this.stagger * 2],
			-1
		);
		this.updateBranch(
			this.leftBranch3,
			now,
			0.68,
			[this.duration + this.stagger * 4, this.duration * 2 + this.stagger * 4],
			-1
		);

		this.updateBranch(
			this.rightBranch,
			now,
			1,
			[this.duration + this.stagger, this.duration * 2 + this.stagger],
			1
		);
		this.updateBranch(
			this.rightBranch2,
			now,
			0.84,
			[this.duration + this.stagger * 3, this.duration * 2 + this.stagger * 3],
			1
		);
		this.updateBranch(
			this.rightBranch3,
			now,
			0.68,
			[this.duration + this.stagger * 5, this.duration * 2 + this.stagger * 5],
			1
		);

		this.applyBranchWind(now);
	}

	private applyWind(now: number): void {
		const intensity = Math.min(this.windSpeed * WIND_SPEED_TO_INTENSITY_COEFFICIENT, 2);
		const h = window.innerHeight;
		const t = now / 1000;

		// Stronger wind → faster flutter; always biased left → right.
		const period = Math.max(0.35, 1.45 - intensity * 0.4);
		const phase = (t / period) * Math.PI * 2;
		const sway = Math.sin(phase);
		const gust = Math.sin(phase * 1.73 + 0.9);

		const baseLean = intensity * h * 0.065;
		const swayLean = intensity * h * 0.028 * (0.5 + 0.5 * sway);
		const gustLean = intensity * h * 0.01 * gust;
		const trunkBend = baseLean + swayLean + gustLean;

		// Quadratic bend: control stays over the base so the trunk curves (t² lean).
		this.trunk.end.x = this.trunk.start.x + trunkBend;
		this.trunk.control.x = this.trunk.start.x;
		this.trunk.control.y = (this.trunk.start.y + this.trunk.end.y) / 2;
	}

	private applyBranchWind(now: number): void {
		const intensity = Math.min(this.windSpeed * WIND_SPEED_TO_INTENSITY_COEFFICIENT, 2);
		const h = window.innerHeight;
		const t = now / 1000;

		// Tip-only extras — anchors/directions already come from the bent trunk.
		const period = Math.max(0.35, 1.45 - intensity * 0.4);
		const phase = (t / period) * Math.PI * 2;
		const baseLean = intensity * h * 0.065;

		const flexBranch = (branch: Line, flex: number, phaseOffset: number) => {
			const tipFlutter =
				Math.sin(phase + phaseOffset) * intensity * h * BRANCH_WIND_FLUTTER_COEFFICIENT * flex;
			branch.end.x += baseLean * BRANCH_WIND_PUSH_COEFFICIENT * flex + tipFlutter;
		};

		flexBranch(this.leftBranch, 1.25, 0.15);
		flexBranch(this.leftBranch2, 1.05, 0.55);
		flexBranch(this.leftBranch3, 0.9, 1.05);
		flexBranch(this.rightBranch, 1.35, 0.35);
		flexBranch(this.rightBranch2, 1.15, 0.75);
		flexBranch(this.rightBranch3, 0.95, 1.25);
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
