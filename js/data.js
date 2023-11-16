class Country {
    constructor() {
        this.name = '';
        this.flag = '';
        this.population = 0;
        this.languages = [];
        this.capital = '';
        this.borders = [];
        this.latlng = [];
    }

    updateDetails(name, flag, population, languages, capital, borders, latlng) {
        this.name = name;
        this.flag = flag;
        this.population = population;
        this.languages = languages;
        this.capital = capital;
        this.borders = borders;
        this.latlng = latlng;
    }
}
export { Country }