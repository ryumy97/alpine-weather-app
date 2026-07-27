<script lang="ts">
	import WeatherCanvas from '$lib/components/WeatherCanvas.svelte';
	import { weatherStore } from '$lib/stores/weather';
	import { onMount } from 'svelte';

	onMount(() => {
		void weatherStore.loadPlace({
			id: 2193733,
			name: 'Auckland',
			latitude: -36.8485,
			longitude: 174.7633,
			country: 'New Zealand',
			admin1: 'Auckland'
		});
	});
</script>

<main class="app-shell">
	<div class="stage">
		<WeatherCanvas />
	</div>
</main>

<style>
	.app-shell {
		position: relative;
		min-height: 100svh;
		overflow: hidden;
	}

	.stage {
		position: absolute;
		inset: 0;
	}
</style>
