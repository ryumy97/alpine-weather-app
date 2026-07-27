export type WeatherCondition =
	| 'clear'
	| 'partly-cloudy'
	| 'cloudy'
	| 'fog'
	| 'drizzle'
	| 'rain'
	| 'snow'
	| 'thunderstorm';

export interface HourlyPoint {
	time: Date;
	temperature: number;
	precipitationProbability: number;
	weatherCode: number;
	condition: WeatherCondition;
}

export interface DailyPoint {
	date: Date;
	weatherCode: number;
	condition: WeatherCondition;
	tempMax: number;
	tempMin: number;
	precipitationProbability: number;
}

export interface WeatherSnapshot {
	latitude: number;
	longitude: number;
	timezone: string;
	locationName: string;
	temperature: number;
	apparentTemperature: number;
	humidity: number;
	windSpeed: number;
	weatherCode: number;
	condition: WeatherCondition;
	isDay: boolean;
	hourly: HourlyPoint[];
	daily: DailyPoint[];
	fetchedAt: Date;
}

export interface GeoResult {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	country: string;
	admin1?: string;
	timezone?: string;
}
