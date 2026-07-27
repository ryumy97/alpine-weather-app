export default abstract class Object2D {
	public abstract update(now: number): void;
	public abstract draw(ctx: CanvasRenderingContext2D): void;
}
