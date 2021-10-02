// ==UserScript==
// @name         ScryMagic
// @version      1.0
// @description  Mostra o menor e maior preço da LigaMagic diretamente na página da carta no Scryfall
// @match        https://scryfall.com/card/*/*/*
// @icon         https://www.google.com/s2/favicons?domain=scryfall.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==
(async function () {
    "use strict";

    const cardName = getCardName();
    const url = "https://www.ligamagic.com.br/?view=cards/card&card=" + cardName;

    const ligaMagicDocument = await getLigaMagicCardDocument(url);
    addLigaMagicDiv(url);
    addPricesFromLigaMagic(ligaMagicDocument, url);
})();

function getCardName() {
    const element = document.querySelector(".card-text-card-name");
    const text = element.innerText || element.textContent;
    return text.trim().replace(/"/g, "");
}

function addLigaMagicDiv(url) {
    var table = document.createElement("table");
    table.className = "prints-table";
    table.id = "ligamagic";

    var header = table.createTHead();
    var headerRow = header.insertRow(0);

    var firstHeaderCell = document.createElement("th");
    firstHeaderCell.innerHTML = '<a href="' + url + '">LigaMagic</a>';
    headerRow.appendChild(firstHeaderCell);

    var secondHeaderCell = document.createElement("th");
    secondHeaderCell.innerHTML = "<span>💰</span>";
    headerRow.appendChild(secondHeaderCell);

    var tablesContainer = document.getElementsByClassName("prints")[0];
    tablesContainer.appendChild(table);
}
function addPricesFromLigaMagic(ligaMagicDocument, url) {
    var table = document.getElementById("ligamagic");
    var tbody = document.createElement("tbody");

    try {
        // Prices
        var lowerPrice =
            ligaMagicDocument.getElementsByClassName("preco-menor")[0].innerHTML;
        var higherPrice =
            ligaMagicDocument.getElementsByClassName("preco-maior")[0].innerHTML;

        // First row: Lowest
        var lowestRow = tbody.insertRow();
        var firstLowestCell = lowestRow.insertCell();
        firstLowestCell.innerHTML =
            '<a data-component="card-tooltip" href="' + url + '">Menor Preço</a>';

        var secondLowestCell = lowestRow.insertCell();
        secondLowestCell.innerHTML =
            '<a class="currency-usd" href="' + url + '">' + lowerPrice + "</a>";

        // Second row: Highest
        var highestRow = tbody.insertRow();
        var firstHighestCell = highestRow.insertCell();
        firstHighestCell.innerHTML =
            '<a data-component="card-tooltip" href="' + url + '">Maior Preço</a>';

        var secondHighestCell = highestRow.insertCell();
        secondHighestCell.innerHTML =
            '<a class="currency-tix" href="' + url + '">' + higherPrice + "</a>";
    } catch (e) {
        // Add error row
        var errorRow = tbody.insertRow();
        var errorCell = errorRow.insertCell();
        errorCell.innerHTML =
            '<a data-component="card-tooltip" href="' + url + '">Deu ruim! :(</a>';
    }

    table.appendChild(tbody);
}

async function getLigaMagicCardDocument(url) {
    const response = await request(url, {
        headers: {},
        responseType: "text",
        method: "GET",
    });

    const dom = document.createElement("div");
    dom.innerHTML = response;
    return dom;
}

function request(url, options = {}) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url,
            method: options.method || "GET",
            headers: options.headers || {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            responseType: options.responseType || "json",
            data: options.body || options.data,
            onload: (res) => resolve(res.response),
            onerror: reject,
        });
    });
}
