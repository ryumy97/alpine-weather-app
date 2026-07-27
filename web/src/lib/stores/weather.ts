import { fetchWeather, formatLocationLabel } from '$lib/weather/api';
import type { GeoResult, WeatherSnapshot } from '$lib/weather/types';
import { writable } from 'svelte/store';

type WeatherState = {
	weather: WeatherSnapshot | null;
	loading: boolean;
	error: string | null;
};

const initialState: WeatherState = {
	weather: null,
	loading: false,
	error: null
};

function createWeatherStore() {
	const { subscribe, set, update } = writable(initialState);
	let abort: AbortController | null = null;

	return {
		subscribe,

		async loadPlace(place: GeoResult) {
			abort?.abort();
			abort = new AbortController();

			update((state) => ({
				...state,
				loading: true,
				error: null
			}));

			try {
				const weather = await fetchWeather(
					place.latitude,
					place.longitude,
					formatLocationLabel(place),
					abort.signal
				);

				update((state) => ({
					...state,
					weather,
					loading: false,
					error: null
				}));
			} catch (err) {
				if ((err as Error).name === 'AbortError') return;

				update((state) => ({
					...state,
					loading: false,
					error: 'Could not load weather'
				}));
			}
		},

		reset() {
			abort?.abort();
			abort = null;
			set(initialState);
		}
	};
}

export const weatherStore = createWeatherStore();
