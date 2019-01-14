function config() {
	var cardName = $('.card-text-title')
		.first()
		.clone()
		.children()
			.remove()
		.end()
		.text().trim().replace(/"/g, "");

    var url = "https://www.ligamagic.com.br/?view=cards/card&card=" + cardName;

    addLigaMagicDiv(url);
    getLigaMagicCard(url);
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

function getLigaMagicCard(url) {
    var xhr = new XMLHttpRequest();
    xhr.ontimeout = function () {
        onError("Timeout");
    };
    xhr.onload = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                onSuccess(xhr.response, url);
            } else {
                onError(xhr.statusText);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.responseType = "document";
    xhr.send(null);
}

function onSuccess(doc, url) {
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

function onError(statusText) {
    var table = document.getElementById("ligamagic");
    var tbody = document.createElement("tbody");
    
    // Add error row
    var errorRow = tbody.insertRow();     
    var errorCell  = errorRow.insertCell();
    errorCell.innerHTML = '<a data-component="card-tooltip" href="' + url + '">Deu ruim! :(</a>';
    
    table.appendChild(tbody);
}

config();	