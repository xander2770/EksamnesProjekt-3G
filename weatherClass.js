class EmilErEnAbeVejr {
    constructor() {
        this.weather = null;
        this.temperature = null;
        this.isDaytime = null;

        this.clear = [0, 1];
        this.cloudy = [2, 3, 45, 48, 51, 53];
        this.rain = [55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99];

        this.updateWeather();
    }

    async getWeatherData() {
        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=55.6761&longitude=12.5683&current_weather=true');
            const data = await response.json();
            return data.current_weather;
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
            return null;
        }
    }

    getWeatherType(code) {
        if (this.clear.includes(code)) return "clear";
        if (this.cloudy.includes(code)) return "cloudy";
        if (this.rain.includes(code)) return "rain";
        return "unknown";
    }

    async updateWeather() {
        const data = await this.getWeatherData();
        if (!data) return;

        this.weather = this.getWeatherType(data.weathercode);
        this.temperature = data.temperature;
        this.isDaytime = data.is_day === 1;

        console.log("Weather updated:");
        console.log("- Type:", this.weather);
        console.log("- Temp:", this.temperature + "°C");
        console.log("- Daytime:", this.isDaytime ? "Yes" : "No");

        setInterval(async () => {
            const updatedData = await this.getWeatherData();
            if (!updatedData) return;

            this.weather = this.getWeatherType(updatedData.weathercode);
            this.temperature = updatedData.temperature;
            this.isDaytime = updatedData.is_day === 1;

            console.log("Weather updated:");
            console.log("- Type:", this.weather);
            console.log("- Temp:", this.temperature + "°C");
            console.log("- Daytime:", this.isDaytime ? "Yes" : "No");
        }, 200000);
    }
}
