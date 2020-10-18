// https://gomakethings.com/converting-a-string-into-markup-with-vanilla-js/#:~:text=The%20DOMParser()%20object%20creates,string%20as%20it's%20first%20argument.
/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
var stringToHTML = function (str) {
	var dom = document.createElement('div');
	dom.innerHTML = str;
	return dom;
};

function config() {
	var cardName = $('.card-text-title')
		.first()
		.clone()
		.children()
			.remove()
		.end()
		.text().trim().replace(/"/g, "");

    // Mobile url: "https://www.ligamagic.com.br/_mobile_lm/ajax/search.php?unixt=1603048755236&&card=" + cardName + "&cardID=0&cardAux=&exactMatch=1&orderBy=1&page=1&category=1"
    var url = "https://www.ligamagic.com.br/?view=cards/card&card=" + cardName;

    addLigaMagicDiv(url);

    // Fetch url (goes to bg_page.js)
    chrome.runtime.sendMessage(url, data => onSuccess(data, url)); 
}

function addLigaMagicDiv(url) {
    // Create table
    var table = document.createElement("table");
    table.className = "prints-table";
    table.id = "ligamagic";

    // Header
    var header = table.createTHead();
    var headerRow = header.insertRow(0);     

    var firstHeaderCell = document.createElement('th');
    firstHeaderCell.innerHTML = '<a href="' + url + '">LigaMagic</a>';
    headerRow.appendChild(firstHeaderCell);

    var secondHeaderCell = document.createElement('th');
    secondHeaderCell.innerHTML = "<span>💰</span>";
    headerRow.appendChild(secondHeaderCell);
    
    // Append
    var tablesContainer = document.getElementsByClassName("prints")[0];
    tablesContainer.appendChild(table);
}

function onSuccess(docString, url) {
    var doc = stringToHTML(docString);
    var table = document.getElementById("ligamagic");
    var tbody = document.createElement("tbody");
    
    try {
        // Prices
        var lowerPrice = doc.getElementsByClassName("preco-menor")[0].innerHTML;
        var higherPrice = doc.getElementsByClassName("preco-maior")[0].innerHTML;

        // First row: Lowest
        var lowestRow = tbody.insertRow();     
        var firstLowestCell = lowestRow.insertCell();
        firstLowestCell.innerHTML = '<a data-component="card-tooltip" href="' + url + '">Menor Preço</a>';
        
        var secondLowestCell = lowestRow.insertCell();
        secondLowestCell.innerHTML = '<a class="currency-usd" href="' + url + '">' + lowerPrice + '</a>';
        
        // Second row: Highest
        var highestRow = tbody.insertRow();     
        var firstHighestCell = highestRow.insertCell();
        firstHighestCell.innerHTML = '<a data-component="card-tooltip" href="' + url + '">Maior Preço</a>';
        
        var secondHighestCell = highestRow.insertCell();
        secondHighestCell.innerHTML = '<a class="currency-tix" href="' + url + '">' + higherPrice + '</a>';
    } catch(e) {
        // Add error row
        var errorRow = tbody.insertRow();     
        var errorCell  = errorRow.insertCell();
        errorCell.innerHTML = '<a data-component="card-tooltip" href="' + url + '">Deu ruim! :(</a>';
    }
    
    table.appendChild(tbody);
}

config();	