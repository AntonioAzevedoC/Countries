"use strict";

// Variables
const leftSide = document.querySelector(".__left-side");
const center = document.querySelector(".__center");
const rightSide = document.querySelector(".__right-side");
const neighboursContainer = document.querySelector(".__neighbours");
const countrySearch = document.querySelector(".__search");
const formSearch = document.querySelector(".__form-search");
const countryName = document.querySelector(".__country-name");
const countryNativeName = document.querySelector(".__country-native-name");
const countryFlag = document.querySelector(".__country-flag");
const countryCapital = document.querySelector("#__capital");
const countryReg = document.querySelector("#__region");
const countrySubReg = document.querySelector("#__subregion");
const countryInd = document.querySelector("#__ind");
const countryPopu = document.querySelector("#__popu");
const countryLang = document.querySelector("#__lang");
const countryDemo = document.querySelector("#__demo");
const countryCurr = document.querySelector("#__curr");
const countryWiki = document.querySelector(".__wiki-link");

let neighbours;
let population;
let txt;

// Render value in array
const renderArr = function (arr) {
  txt = "";
  arr.forEach((el, i, arr) => {
    i + 1 === arr.length ? (txt += el.name) : (txt += el.name + ", ");
  });
  return txt;
};

// Render country population
const renderPop = function (pop) {
  if (pop > 1000000) {
    population = (+pop / 1000000).toFixed(2) + ` million`;
    return population;
  }
  return pop;
};

// Rendering neighbouring countries
const getNeighbours = function (arr) {
  neighbours = Array.from(document.querySelectorAll(".__neighbour-country"));
  neighbours.forEach((el) => {
    el.remove();
  });

  arr.forEach((el) => {
    requestCountry(el, "alpha").then((response) => {
      const name = response.name;
      const html = `
        <div class=" __neighbour-country" id="__${name}">${name}</div>
      `;
      neighboursContainer.insertAdjacentHTML("beforeend", html);
    });
  });
};

// Rendering country
const renderCountry = function (country) {
  console.log(country);

  countryName.textContent = country.name;
  countryNativeName.textContent = country.nativeName;
  countryFlag.src = country.flag;
  countryCapital.textContent = country.capital;
  countryReg.textContent = country.region;
  countrySubReg.textContent = country.subregion;
  countryInd.textContent = country.independent
    ? "This country is independent"
    : "This country is not independent";
  countryPopu.textContent = renderPop(country.population);
  countryLang.textContent = renderArr(country.languages);
  countryDemo.textContent = country.demonym;
  countryCurr.textContent = renderArr(country.currencies);
  countryWiki.textContent = `${country.name} Wikipedia Article`;
  countryWiki.href = `https://pt.wikipedia.org/wiki/${country.name}`;
  getNeighbours(country.borders);
};

// Rendering search errors
const renderError = function (msg) {
  alert(msg);
};

// handling country request
const requestCountry = function (
  country,
  code,
  errMsg = "Something went wrong"
) {
  return fetch(
    `https://countries-api-836d.onrender.com/countries/${code}/${country}`
  ).then((response) => {
    if (!response.ok) throw new Error(`${errMsg} ${response.status}`);

    return response.json();
  });
};

// Getting cpuntry data after country is requested
const getCountryData = function (country, code = "name") {
  requestCountry(country, code, "Country not found")
    .then(([data]) => {
      renderCountry(data);
    })
    .catch((err) => {
      console.error(`${err}`);
      renderError(`Something went wrong:  ${err.message}.`);
    });
};

formSearch.addEventListener("submit", function (e) {
  e.preventDefault();
  getCountryData(countrySearch.value);
});
