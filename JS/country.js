"use strict";

// Variables
const content = document.querySelector(".__content");
const leftSide = document.querySelector(".__left-side");
const center = document.querySelector(".__center");
const rightSide = document.querySelector(".__right-side");
const errorContainer = document.querySelector(".__error-display");
const errorText = document.querySelector(".__error-text");
const neighboursContainer = document.querySelector(".__neighbours");
const countrySearch = document.querySelector(".__search");
const formSearch = document.querySelector(".__form-search");
const cardSearch = document.querySelector(".__card--search");
const cardList = document.querySelector(".__card--list");
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

let population;
let txt;
let neighbours;
let timer;
let cards;
let timerUnfocus;

// Render value in array
const renderArr = function (arr) {
  txt = "";
  arr.forEach((el, i, arr) => {
    i + 1 === arr.length ? (txt += el.name) : (txt += el.name + ", ");
  });
  return txt;
};

// return population
const returnPop = function (pop, qtt, t = "million") {
  population = (+pop / qtt).toFixed(2) + ` ${t}`;
  return population;
};

// Render country population
const renderPop = function (pop) {
  if (pop > 1000000000) {
    return returnPop(pop, 1000000000, "billion");
  } else if (pop > 1000000) {
    return returnPop(pop, 1000000);
  }
  return pop;
};

// Rendering neighbouring countries
const getNeighbours = function (arr) {
  neighbours = Array.from(document.querySelectorAll(".__country-card"));
  neighbours.forEach((el) => {
    el.remove();
  });

  arr.forEach((el) => {
    requestCountry(el, "alpha")
      .then((response) => {
        const html = `
      <div class="card __country-card" country="${response.alpha3Code}">
        <div class="row">
          <span class="col-md-6 col-sm-12 mt-3 mb-3 ml-2 text-center __neighbour-country" id="__${response.nativeName}" >${response.name}</span>
          <img class="d-none d-md-block col-4 p-0 m-1 img-fluid __neighbouring-country-flag" src="${response.flag}" alt="Country flag"></img>
        </div>
      </div>
      `;
        neighboursContainer.insertAdjacentHTML("beforeend", html);
      })
      .catch((err) => {
        console.error(`${err}`);
      });
  });
};

// Rendering neighbouring countries
const getCardCountries = function (arr) {
  cards = Array.from(document.querySelectorAll(".__country--card--search"));
  cards.forEach((el) => {
    el.remove();
  });

  for (let i = 0; i < 3; i++) {
    requestCountry(arr[i].name, "name")
      .then(([response]) => {
        const html = `
        <li class="list-group-item __country--card--search">${response.name}</li>
        `;
        cardList.insertAdjacentHTML("beforeend", html);
      })
      .catch((err) => {
        console.error(`${err}`);
      });
  }
};

// Rendering country
const renderCountry = function (country) {
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
  content.classList.remove("d-none");
  errorContainer.classList.add("d-none");
};

// Rendering search errors
const renderError = function (msg) {
  content.classList.add("d-none");
  errorText.textContent = msg;
  errorContainer.classList.remove("d-none");
};

// handling country request
const requestCountry = async function (
  country,
  code,
  errMsg = "Something went wrong"
) {
  const response = await fetch(
    `https://countries-api-836d.onrender.com/countries/${code}/${country}`
  );

  if (!response.ok) throw new Error(`${errMsg} ${response.status}`);
  return await response.json();
};

// Getting country data after country is requested
const getCountryData = function (country) {
  requestCountry(country, "name", "Country not found")
    .then(([data]) => {
      renderCountry(data);
    })
    .catch((err) => {
      console.error(`${err}`);
      renderError(`Something went wrong:  ${err.message}.`);
    });
};

// Getting country data after country is requested
const getNeighbourCountryData = function (country) {
  requestCountry(country, "alpha", "Country not found")
    .then((data) => {
      renderCountry(data);
    })
    .catch((err) => {
      console.error(`${err}`);
    });
};

// Stopping search timer
const stopSearch = function (to) {
  clearTimeout(to);
};

// Handling form typing
formSearch.addEventListener("keydown", function () {
  cardSearch.classList.remove("d-none");

  if (timer !== undefined) stopSearch(timer);

  timer = setTimeout(() => {
    requestCountry(countrySearch.value, "name")
      .then((response) => {
        getCardCountries(response);
      })
      .catch((err) => {
        console.error(`${err}`);
      });
  }, 500);
});

// Handling neighbouring countries click
cardSearch.addEventListener("click", function (e) {
  const click = e.target.closest(".__country--card--search");

  if (!click) return;

  getCountryData([click.textContent]);
});

// Handling form unfocus
formSearch.addEventListener("focusout", function () {
  timerUnfocus = setTimeout(() => {
    cardSearch.classList.add("d-none");
  }, 400);
});

// Handling form submit
formSearch.addEventListener("submit", function (e) {
  e.preventDefault();
  if (countrySearch.value === "") return;
  getCountryData(countrySearch.value);
  countrySearch.value = "";

  countrySearch.disabled = true;
  setTimeout(() => {
    countrySearch.disabled = false;
  }, 1500);
});

// Handling neighbouring countries click
neighboursContainer.addEventListener("click", function (e) {
  const click = e.target.closest(".__country-card");

  if (!click) return;

  getNeighbourCountryData([click.getAttribute("country")]);
});
