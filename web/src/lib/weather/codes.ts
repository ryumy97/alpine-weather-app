import type { WeatherCondition } from './types';

export function conditionFromCode(code: number): WeatherCondition {
	if (code === 0) return 'clear';
	if (code <= 2) return 'partly-cloudy';
	if (code === 3) return 'cloudy';
	if (code === 45 || code === 48) return 'fog';
	if (code <= 57) return 'drizzle';
	if (code <= 67 || code === 80 || code === 81 || code === 82) return 'rain';
	if (code <= 77 || code === 85 || code === 86) return 'snow';
	if (code >= 95) return 'thunderstorm';
	return 'cloudy';
}

export function conditionLabel(condition: WeatherCondition): string {
	switch (condition) {
		case 'clear':
			return 'Clear';
		case 'partly-cloudy':
			return 'Partly cloudy';
		case 'cloudy':
			return 'Cloudy';
		case 'fog':
			return 'Fog';
		case 'drizzle':
			return 'Drizzle';
		case 'rain':
			return 'Rain';
		case 'snow':
			return 'Snow';
		case 'thunderstorm':
			return 'Thunderstorm';
	}
}
