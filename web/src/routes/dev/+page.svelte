<script lang="ts">
	import WeatherCanvas from '$lib/components/WeatherCanvas.svelte';
	import { onMount } from 'svelte';

	let ready = $state(false);
	let maxX = $state(1000);
	let treeX = $state(500);
	let thickness = $state(12);
	let trunkColor = $state('#3d2b1f');
	let branchColor = $state('#2f5d3a');

	onMount(() => {
		maxX = window.innerWidth;
		treeX = window.innerWidth / 2;
		thickness = Math.round(window.innerWidth * 0.015);
		ready = true;
	});
</script>

<main class="dev-page">
	<div class="stage">
		{#if ready}
			<WeatherCanvas {treeX} {thickness} {trunkColor} {branchColor} />
		{/if}
	</div>

	<aside class="controls" aria-label="Tree controls">
		<h1>Tree playground</h1>

		<label class="field">
			<span>Location X <output>{Math.round(treeX)}</output></span>
			<input type="range" min="0" max={maxX} step="1" bind:value={treeX} />
		</label>

		<label class="field">
			<span>Thickness <output>{thickness}</output></span>
			<input type="range" min="1" max="80" step="1" bind:value={thickness} />
		</label>

		<label class="field">
			<span>Trunk color</span>
			<div class="color-row">
				<input type="color" bind:value={trunkColor} aria-label="Trunk color picker" />
				<input type="text" bind:value={trunkColor} pattern="^#[0-9A-Fa-f]{6}$" spellcheck="false" />
			</div>
		</label>

		<label class="field">
			<span>Branch color</span>
			<div class="color-row">
				<input type="color" bind:value={branchColor} aria-label="Branch color picker" />
				<input type="text" bind:value={branchColor} pattern="^#[0-9A-Fa-f]{6}$" spellcheck="false" />
			</div>
		</label>
	</aside>
</main>

<style>
	.dev-page {
		position: relative;
		min-height: 100svh;
		overflow: hidden;
		background: #e8eef2;
	}

	.stage {
		position: absolute;
		inset: 0;
	}

	.controls {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		width: min(18rem, calc(100vw - 2rem));
		padding: 1rem 1.1rem;
		border: 1px solid rgb(0 0 0 / 12%);
		background: rgb(255 255 255 / 92%);
		backdrop-filter: blur(8px);
		font-family: Figtree, sans-serif;
		color: #1a1a1a;
	}

	.controls h1 {
		margin: 0;
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1.05rem;
		font-weight: 650;
		letter-spacing: -0.02em;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.field span {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.5rem;
	}

	.field output {
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		color: #555;
	}

	.field input[type='range'] {
		width: 100%;
		accent-color: #2f5d3a;
	}

	.color-row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.color-row input[type='color'] {
		width: 2.25rem;
		height: 2.25rem;
		padding: 0;
		border: 1px solid rgb(0 0 0 / 18%);
		background: transparent;
		cursor: pointer;
	}

	.color-row input[type='text'] {
		flex: 1;
		min-width: 0;
		padding: 0.4rem 0.55rem;
		border: 1px solid rgb(0 0 0 / 18%);
		background: #fff;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.8rem;
	}
</style>
