// Klasse til at håndtere vejrdata og opdatere spillets miljø derefter
class vejr {
    constructor() {
        this.weather; // Aktuel vejrtype (f.eks. klart, overskyet, regn)
        this.temperature; // Aktuel temperatur i grader Celsius
        this.isDaytime; // Boolean der angiver om det er dag

        // Vejrkoder for forskellige vejrtype
        this.clear = [0, 1]; // Koder for klart vejr
        this.cloudy = [2, 3, 45, 48, 51, 53]; // Koder for overskyet vejr
        this.rain = [55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]; // Koder for regnvejr


        // Hent og opdater vejrdatasættet, når klassen kaldes
        this.updateWeather();
    }

    // Hent aktuelle vejrdata fra Open-Meteo API
    async getWeatherData() {
        try {
            // API-kald for at hente vejrdata for København (breddegrad: 55.6761, længdegrad: 12.5683)
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=55.6761&longitude=12.5683&current_weather=true');
            const data = await response.json(); // laver dataen til JSON
            return data.current_weather; // Returner de aktuelle vejrdata
        } catch (error) {
            // Log en fejl hvis API-kaldet mislykkes
            console.error("Kunne ikke hente vejrdata:", error);
            return null; // Returner null hvis hentning fejler
        }
    }

    // Bestem vejrtype baseret på vejrkode
    getWeatherType(code) {
        if (this.clear.includes(code)) return "clear"; // Tjek om koden matcher klart vejr
        if (this.cloudy.includes(code)) return "cloudy"; // Tjek om koden matcher overskyet vejr
        if (this.rain.includes(code)) return "rain"; // Tjek om koden matcher regnvejr
        return "unknown"; // Returner "ukendt" hvis koden ikke matcher nogen kategori
    }

    // Hent og opdater vejrdata
    async updateWeather() {
        const data = await this.getWeatherData(); // Hent de aktuelle vejrdata
        if (!data) {return}; // Afslut hvis ingen data returneres

        this.weather = this.getWeatherType(data.weathercode); // Bestem vejrtype
        this.temperature = data.temperature; // Opdater temperaturen
        this.isDaytime = data.is_day === 1; // Opdater om det er dag (1 = dag, 0 = nat)

        // Log de opdaterede vejrdata til konsollen
        console.log("Vejret er opdateret:");
        console.log("- Type:", this.weather);
        console.log("- Temp:", this.temperature + "°C");
        console.log("- Dag:", this.isDaytime ? "Ja" : "Nej");

        // Opdater spilbaggrunde baseret på vejrtype
        switch (this.weather) {
            case "clear":
                map = mapClear; // Sæt baggrunde til klart vejr
                break;
            case "cloudy":
                map = mapCloudy; // Sæt baggrunde til overskyet vejr
                break;
            case "rain":
                map = mapRain; // Sæt baggrunde til regnvejr
                break;
            default:
                map = mapClear; // Standard til klart vejr hvis typen er ukendt
        }

        // Sæt et interval for periodisk opdatering af vejrdata
        setInterval(async () => {
            const updatedData = await this.getWeatherData(); // Hent opdaterede vejrdata
            if (!updatedData) return; // Afslut hvis ingen data returneres

            this.weather = this.getWeatherType(data.weathercode); // Bestem vejrtype
            this.temperature = data.temperature; // Opdater temperaturen
            this.isDaytime = data.is_day === 1; // Opdater om det er dag (1 = dag, 0 = nat)
    
            // Log de opdaterede vejrdata til konsollen
            console.log("Vejret er opdateret:");
            console.log("- Type:", this.weather);
            console.log("- Temp:", this.temperature + "°C");
            console.log("- Dag:", this.isDaytime ? "Ja" : "Nej");
    
            // Opdater spilbaggrunde baseret på vejrtype
            switch (this.weather) {
                case "clear":
                    map = mapClear; // Sæt baggrunde til klart vejr
                    break;
                case "cloudy":
                    map = mapCloudy; // Sæt baggrunde til overskyet vejr
                    break;
                case "rain":
                    map = mapRain; // Sæt baggrunde til regnvejr
                    break;
                default:
                    map = mapClear; // Standard til klart vejr hvis typen er ukendt
            }
        }, 200000); // Opdater hver 200.000 millisekunder (200 sekunder)
    }
}
