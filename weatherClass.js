class EmilErEnAbeVejr {
     constructor() {
        this.weather = this.getWeather();
        this.temperature = this.getTemperature();
        this.isDaytime = this.isDaytime();
        this.clear = [0,1]
        this.cloudy = [2,3,45,48,51,53]
        this.rain = [55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99]

    }
    async getWeather() {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=55.6761&longitude=12.5683&current_weather=true');
        data = await response.json();
        if(this.clear.includes(data.current_weather.weathercode)){
            return "clear"
    }
        else if(this.cloudy.includes(data.current_weather.weathercode)){
            return "cloudy"
        }
        else if(this.rain.includes(data.current_weather.weathercode)){
            return "rain"
        }
    }
}