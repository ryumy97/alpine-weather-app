import { conditionFromCode } from './codes';
import type { DailyPoint, GeoResult, HourlyPoint, WeatherSnapshot } from './types';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

interface GeoApiResponse {
	results?: Array<{
		id: number;
		name: string;
		latitude: number;
		longitude: number;
		country: string;
		admin1?: string;
		timezone?: string;
	}>;
}

interface ForecastApiResponse {
	latitude: number;
	longitude: number;
	timezone: string;
	current: {
		time: string;
		temperature_2m: number;
		apparent_temperature: number;
		relative_humidity_2m: number;
		weather_code: number;
		wind_speed_10m: number;
		is_day: number;
	};
	hourly: {
		time: string[];
		temperature_2m: number[];
		precipitation_probability: (number | null)[];
		weather_code: number[];
	};
	daily: {
		time: string[];
		weather_code: number[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
		precipitation_probability_max: (number | null)[];
	};
}

export async function searchLocations(query: string, signal?: AbortSignal): Promise<GeoResult[]> {
	const trimmed = query.trim();
	if (trimmed.length < 2) return [];

	const url = new URL(GEO_URL);
	url.searchParams.set('name', trimmed);
	url.searchParams.set('count', '6');
	url.searchParams.set('language', 'en');
	url.searchParams.set('format', 'json');

	const response = await fetch(url, { signal });
	if (!response.ok) throw new Error(`Geocoding failed (${response.status})`);

	const data = (await response.json()) as GeoApiResponse;
	return (data.results ?? []).map((result) => ({
		id: result.id,
		name: result.name,
		latitude: result.latitude,
		longitude: result.longitude,
		country: result.country,
		admin1: result.admin1,
		timezone: result.timezone
	}));
}

export function formatLocationLabel(place: Pick<GeoResult, 'name' | 'admin1' | 'country'>): string {
	return [place.name, place.admin1, place.country].filter(Boolean).join(', ');
}

export async function fetchWeather(
	latitude: number,
	longitude: number,
	locationName: string,
	signal?: AbortSignal
): Promise<WeatherSnapshot> {
	const url = new URL(FORECAST_URL);
	url.searchParams.set(
		'current',
		[
			'temperature_2m',
			'apparent_temperature',
			'relative_humidity_2m',
			'weather_code',
			'wind_speed_10m',
			'is_day'
		].join(',')
	);
	url.searchParams.set(
		'hourly',
		['temperature_2m', 'precipitation_probability', 'weather_code'].join(',')
	);
	url.searchParams.set(
		'daily',
		[
			'weather_code',
			'temperature_2m_max',
			'temperature_2m_min',
			'precipitation_probability_max'
		].join(',')
	);
	url.searchParams.set('latitude', String(latitude));
	url.searchParams.set('longitude', String(longitude));
	url.searchParams.set('timezone', 'auto');
	url.searchParams.set('forecast_days', '7');

	const response = await fetch(url, { signal });
	if (!response.ok) throw new Error(`Forecast failed (${response.status})`);

	const data = (await response.json()) as ForecastApiResponse;
	const now = Date.now();

	const hourly: HourlyPoint[] = data.hourly.time
		.map((time, index) => {
			const date = new Date(time);
			return {
				time: date,
				temperature: data.hourly.temperature_2m[index],
				precipitationProbability: data.hourly.precipitation_probability[index] ?? 0,
				weatherCode: data.hourly.weather_code[index],
				condition: conditionFromCode(data.hourly.weather_code[index])
			};
		})
		.filter((point) => point.time.getTime() >= now - 60 * 60 * 1000)
		.slice(0, 24);

	const daily: DailyPoint[] = data.daily.time.map((time, index) => ({
		date: new Date(time),
		weatherCode: data.daily.weather_code[index],
		condition: conditionFromCode(data.daily.weather_code[index]),
		tempMax: data.daily.temperature_2m_max[index],
		tempMin: data.daily.temperature_2m_min[index],
		precipitationProbability: data.daily.precipitation_probability_max[index] ?? 0
	}));

	return {
		latitude: data.latitude,
		longitude: data.longitude,
		timezone: data.timezone,
		locationName,
		temperature: data.current.temperature_2m,
		apparentTemperature: data.current.apparent_temperature,
		humidity: data.current.relative_humidity_2m,
		windSpeed: data.current.wind_speed_10m,
		weatherCode: data.current.weather_code,
		condition: conditionFromCode(data.current.weather_code),
		isDay: data.current.is_day === 1,
		hourly,
		daily,
		fetchedAt: new Date()
	};
}

export async function fetchWeatherByGeolocation(signal?: AbortSignal): Promise<WeatherSnapshot> {
	const position = await new Promise<GeolocationPosition>((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Geolocation is unavailable'));
			return;
		}
		navigator.geolocation.getCurrentPosition(resolve, reject, {
			enableHighAccuracy: false,
			timeout: 10_000
		});
	});

	return fetchWeather(
		position.coords.latitude,
		position.coords.longitude,
		'Current location',
		signal
	);
}
