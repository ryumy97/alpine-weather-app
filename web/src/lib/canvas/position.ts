export default class Position {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public copy(): Position {
		return new Position(this.x, this.y);
	}
}
