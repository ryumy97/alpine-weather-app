<script lang="ts">
	import Position from '$lib/canvas/position';
	import Scene from '$lib/canvas/scene';
	import Tree from '$lib/canvas/tree';
	import { weatherStore } from '$lib/stores/weather';
	import { onDestroy, onMount } from 'svelte';

	type Props = {
		treeX?: number;
		thickness?: number;
		trunkColor?: string;
		branchColor?: string;
		windSpeed?: number;
		branchAngle?: number;
		branchStrokeAngle?: number;
	};

	let {
		treeX = undefined,
		thickness = undefined,
		trunkColor = undefined,
		branchColor = undefined,
		windSpeed = undefined,
		branchAngle = undefined,
		branchStrokeAngle = undefined
	}: Props = $props();

	let canvasEl: HTMLCanvasElement;
	let scene: Scene;
	let tree = $state<Tree | undefined>(undefined);
	let animationId: number;

	$effect(() => {
		const { weather, loading, error } = $weatherStore;
		void weather;
		void loading;
		void error;
	});

	$effect(() => {
		if (!tree) return;
		if (treeX !== undefined) tree.setX(treeX);
		if (thickness !== undefined) tree.setThickness(thickness);
		if (trunkColor !== undefined) tree.setTrunkColor(trunkColor);
		if (branchColor !== undefined) tree.setBranchColor(branchColor);
		if (windSpeed !== undefined) tree.setWindSpeed(windSpeed);
		if (branchAngle !== undefined) tree.setBranchAngle(branchAngle);
		if (branchStrokeAngle !== undefined) tree.setBranchStrokeAngle(branchStrokeAngle);
	});

	onMount(() => {
		scene = new Scene(canvasEl);

		const x = treeX ?? window.innerWidth / 2;
		tree = new Tree(new Position(x, window.innerHeight), {
			thickness,
			trunkColor,
			branchColor,
			windSpeed,
			branchAngle,
			branchStrokeAngle
		});
		scene.add(tree);

		const animate = () => {
			const now = Date.now();
			scene.update(now);
			scene.draw();
			animationId = requestAnimationFrame(animate);
		};

		animationId = requestAnimationFrame(animate);
	});

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		if (scene) {
			scene.destroy();
		}
	});
</script>

<canvas
	bind:this={canvasEl}
	class="weather-canvas"
	aria-label="Interactive weather visualization"
></canvas>

<style>
	.weather-canvas {
		display: block;
		width: 100%;
		height: 100%;
		touch-action: none;
	}
</style>
