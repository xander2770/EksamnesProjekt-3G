// Class to handle weather data and update the game environment accordingly
class vejr {
    constructor() {
        // Initialize weather-related properties
        this.weather = null; // Current weather type (e.g., clear, cloudy, rain)
        this.temperature = null; // Current temperature in degrees Celsius
        this.isDaytime = null; // Boolean indicating if it's daytime

        // Weather code mappings for different weather types
        this.clear = [0, 2]; // Codes for clear weather
        this.cloudy = [1, 3, 45, 48, 51, 53]; // Codes for cloudy weather
        this.rain = [55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]; // Codes for rainy weather

        // Fetch and update the weather data when the class is instantiated
        this.updateWeather();
    }

    // Fetch current weather data from the Open-Meteo API
    async getWeatherData() {
        try {
            // API call to fetch weather data for Copenhagen (latitude: 55.6761, longitude: 12.5683)
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=55.6761&longitude=12.5683&current_weather=true');
            const data = await response.json(); // Parse the JSON response
            return data.current_weather; // Return the current weather data
        } catch (error) {
            // Log an error if the API call fails
            console.error("Failed to fetch weather data:", error);
            return null; // Return null if the fetch fails
        }
    }

    // Determine the weather type based on the weather code
    getWeatherType(code) {
        if (this.clear.includes(code)) return "clear"; // Check if the code matches clear weather
        if (this.cloudy.includes(code)) return "cloudy"; // Check if the code matches cloudy weather
        if (this.rain.includes(code)) return "rain"; // Check if the code matches rainy weather
        return "unknown"; // Return "unknown" if the code doesn't match any category
    }

    // Fetch and update the weather data periodically
    async updateWeather() {
        const data = await this.getWeatherData(); // Fetch the current weather data
        if (!data) return; // Exit if no data is returned

        // Update the weather properties
        this.weather = this.getWeatherType(data.weathercode); // Determine the weather type
        this.temperature = data.temperature; // Update the temperature
        this.isDaytime = data.is_day === 1; // Update the daytime status (1 = daytime, 0 = nighttime)

        // Log the updated weather data to the console
        console.log("Weather updated:");
        console.log("- Type:", this.weather);
        console.log("- Temp:", this.temperature + "°C");
        console.log("- Daytime:", this.isDaytime ? "Yes" : "No");

        // Update the game map based on the weather type
        switch (this.weather) {
            case "clear":
                map = mapClear; // Set the map to clear weather
                break;
            case "cloudy":
                map = mapCloudy; // Set the map to cloudy weather
                break;
            case "rain":
                map = mapRain; // Set the map to rainy weather
                break;
            default:
                map = mapClear; // Default to clear weather if the type is unknown
        }

        // Set an interval to periodically update the weather data
        setInterval(async () => {
            const updatedData = await this.getWeatherData(); // Fetch updated weather data
            if (!updatedData) return; // Exit if no data is returned

            // Update the weather properties with the new data
            this.weather = this.getWeatherType(updatedData.weathercode); // Determine the weather type
            this.temperature = updatedData.temperature; // Update the temperature
            this.isDaytime = updatedData.is_day === 1; // Update the daytime status

            // Log the updated weather data to the console
            console.log("Weather updated:");
            console.log("- Type:", this.weather);
            console.log("- Temp:", this.temperature + "°C");
            console.log("- Daytime:", this.isDaytime ? "Yes" : "No");

            // Update the game map based on the new weather type
            switch (this.weather) {
                case "clear":
                    map = mapClear; // Set the map to clear weather
                    break;
                case "cloudy":
                    map = mapCloudy; // Set the map to cloudy weather
                    break;
                case "rain":
                    map = mapRain; // Set the map to rainy weather
                    break;
                default:
                    map = mapClear; // Default to clear weather if the type is unknown
            }
        }, 200000); // Update every 200,000 milliseconds (200 seconds)
    }
}
