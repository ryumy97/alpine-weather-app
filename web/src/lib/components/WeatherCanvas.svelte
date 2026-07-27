<script lang="ts">
	import Position from '$lib/canvas/position';
	import Scene from '$lib/canvas/scene';
	import Tree from '$lib/canvas/tree';
	import { weatherStore } from '$lib/stores/weather';
	import { onDestroy, onMount } from 'svelte';

	let canvasEl: HTMLCanvasElement;
	let scene: Scene;
	let animationId: number;

	$effect(() => {
		const { weather, loading, error } = $weatherStore;
		void weather;
		void loading;
		void error;
	});

	onMount(() => {
		scene = new Scene(canvasEl);

		scene.add(new Tree(new Position(window.innerWidth / 2, window.innerHeight)));

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
