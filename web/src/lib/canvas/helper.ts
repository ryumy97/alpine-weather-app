export function lerp(from: number, to: number, t: number): number {
	return from + (to - from) * t;
}

export function inverseLerp(from: number, to: number, value: number): number {
	return (value - from) / (to - from);
}

export function transform(
	value: number,
	from: [number, number],
	to: [number, number],
	{
		clamp = true,
		easing = linear
	}: {
		clamp?: boolean;
		easing?: (t: number) => number;
	} = {}
): number {
	let t = inverseLerp(from[0], from[1], value);
	if (clamp) {
		t = Math.max(0, Math.min(1, t));
	}
	t = easing(t);
	return lerp(to[0], to[1], t);
}

export function linear(t: number): number {
	return t;
}

export function easeInOut(t: number): number {
	return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function easeOut(t: number): number {
	return 1 - (1 - t) * (1 - t);
}

export function easeIn(t: number): number {
	return t * t;
}

/**
 * CSS-style cubic-bezier easing.
 * Control points are (0,0), (x1,y1), (x2,y2), (1,1).
 * Input t is progress on X; output is the corresponding Y.
 */
export function createEaseCubicBezier(
	x1: number,
	y1: number,
	x2: number,
	y2: number
): (t: number) => number {
	// Sample curve: B(u) = 3(1-u)^2 u P1 + 3(1-u) u^2 P2 + u^3
	const sampleCurve = (a: number, b: number, u: number) => {
		const inv = 1 - u;
		return 3 * inv * inv * u * a + 3 * inv * u * u * b + u * u * u;
	};

	const sampleDerivative = (a: number, b: number, u: number) => {
		const inv = 1 - u;
		return 3 * inv * inv * a + 6 * inv * u * (b - a) + 3 * u * u * (1 - b);
	};

	const solveX = (t: number) => {
		let u = t;
		for (let i = 0; i < 8; i++) {
			const x = sampleCurve(x1, x2, u) - t;
			const dx = sampleDerivative(x1, x2, u);
			if (Math.abs(x) < 1e-6) return u;
			if (Math.abs(dx) < 1e-6) break;
			u -= x / dx;
		}

		// Fallback binary search if Newton fails to converge.
		let lo = 0;
		let hi = 1;
		u = t;
		for (let i = 0; i < 20; i++) {
			const x = sampleCurve(x1, x2, u);
			if (Math.abs(x - t) < 1e-6) return u;
			if (t > x) lo = u;
			else hi = u;
			u = (lo + hi) / 2;
		}
		return u;
	};

	return (t: number) => {
		if (t <= 0) return 0;
		if (t >= 1) return 1;
		return sampleCurve(y1, y2, solveX(t));
	};
}
