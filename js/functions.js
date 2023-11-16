const baseUrl = 'https://restcountries.com/v3.1/';
import { Country } from './data.js';

const fetchAPI = async (url) => {
    try {
        const res = await axios.get(`${baseUrl}${url}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getCountry = (country) => fetchAPI(`name/${country}/?fields=name,flags,maps,population,languages,capital,borders,latlng`);
const getCountriesList = () => fetchAPI(`all/?fields=name,flags`);
const getFullName = (countryCode) => fetchAPI(`alpha/${countryCode}/?fields=name`);

const list = await getCountriesList();
let countriesList = list.map(country => {
    return country;
})
countriesList.sort((a, b) => a.name.common.localeCompare(b.name.common));

const owl_carousel = document.querySelector('.owl-carousel');
const dropdown_menu = document.querySelector('.dropdown-menu');
const createCountriesDropdown = () => {

    countriesList.forEach((country) => {
        dropdown_menu.innerHTML += `
        <li><a class="dropdown-item navClick" href="#" id=${country.name.common}>${country.name.common}</a></li>`;
        owl_carousel.innerHTML += `
        <div class="item">
            <img src="${country.flags.png}" alt="${country.name.common}" height="100px" style="cursor: pointer;">
        </div>
        `;
    })
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        autoplay: true,
        dotsContainer: false,
        responsive: {
            0: {
                items: 3
            },
            600: {
                items: 5
            },
            1000: {
                items: 8
            }
        }
    })

}

const content = document.querySelector('#content');
const countryInstance = new Country();

const handleCardLessDetails = async (data) => {
    if (data === null) {
        content.innerHTML = `<p class="justify-content-center display-3 bg-info-subtle p-5 text-center mt-5 w-50 mx-auto">Country Not Found:(</p>`;
        return;
    }
    const fullBorderNames = await Promise.all(data[0].borders.map(async (border) => {
        const res = await getFullName(border);
        return res.name.common;
    }));

    countryInstance.updateDetails(
        data[0].name.common,
        data[0].flags.png,
        data[0].population.toLocaleString(),
        data[0].languages,
        data[0].capital[0],
        fullBorderNames,
        data[0].latlng
    );
    await renderCardLessDetails();
}

const renderCardLessDetails = async () => {
    console.log('Rendering:', countryInstance.name);

    content.innerHTML = `
    <div class="col-md-4 mx-auto mt-4">
        <div class="card p-3 shadow m-auto mt-5" id="lessCard">
            <h1 class="display-4 mb-2 text-center">${countryInstance.name}</h1>
            <img src="${countryInstance.flag}" alt="flag" width="90%">
        </div>
    </div>
    `
    const lessCard = document.querySelector('#lessCard');
    lessCard.addEventListener('click', () => renderCountry())
}

const renderCountry = async () => {

    content.innerHTML = `
    <div class="col-md-8 mx-auto mt-4">
        <button class="btn btn-info col-1 mt-2 p-2" type="button" id="backBtn">Back</button>
        <div class="card p-4 shadow m-auto mt-5">
            <div class="row">
                <h1 class="m-0 display-4">${countryInstance.name}</h1>
            </div>
            <div class="row align-items-center">
                <div class="col-md-6 fs-4 mt-2" data-aos="fade-right" data-aos-duration="1000">
                    <img src="${countryInstance.flag}" alt="flag" width="90%" >
                </div>
                <div class="col-md-6 fs-5 mt-2" data-aos="fade-left" data-aos-duration="1000">
                    <p>Population: ${countryInstance.population}</p>
                    <p>Language: ${Object.values(countryInstance.languages).join(" | ")} </p>
                    <p>Capital City: ${countryInstance.capital}</p>
                    <p>Borders: ${countryInstance.borders.map(border => `<a class="navClick text-decoration-none text-info" href="#" id="${border}">${border}</a>`).join(" | ")}</p>
                </div>
            </div>
            <div id="map" class="mt-4" data-aos="fade-up" data-aos-duration="1000">
                <iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
                    src="https://maps.google.com/maps?q=${countryInstance.latlng[0]},${countryInstance.latlng[1]}&hl=iw&z=6&amp;output=embed">
                </iframe>
            </div>
        </div>
    </div>`;
    AOS.init();
    await run();
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', () => renderCardLessDetails())
}

const handleListener = async (val) => {
    const data = await getCountry(val);
    await handleCardLessDetails(data);
}

const addEventListenerIfNotAdded = (element, event, listener) => {
    if (element && !element.hasEventListener) {
        element.hasEventListener = true;
        element.addEventListener(event, listener);
    }
};

const run = async () => {
    const navLinks = document.querySelectorAll('.navClick');
    navLinks.forEach(link => {
        addEventListenerIfNotAdded(link, 'click', async () => await handleListener(link.id));
    });

    const searchBtn = document.getElementById('searchBtn');
    const searchCountry = document.getElementById('searchCountry');
    await addEventListenerIfNotAdded(searchBtn, 'click', async () => await handleListener(searchCountry.value));

    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        const val = item.querySelector('img').getAttribute('alt');
        addEventListenerIfNotAdded(item, 'click', async () => await handleListener(val));
    });

};

export { getCountry, createCountriesDropdown, getFullName, run, handleCardLessDetails }
