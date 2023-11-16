import { getCountry, createCountriesDropdown, run, handleCardLessDetails } from '../js/functions.js';

// init
const init = async () => {
    createCountriesDropdown();
    await handleCardLessDetails(await getCountry('israel'));
    run();
};

await init();

