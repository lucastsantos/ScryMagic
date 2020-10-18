// Source: https://stackoverflow.com/a/56502776/2514286

chrome.runtime.onMessage.addListener(
    function(url, sender, onSuccess) {
        fetch(url)
            .then(response => response.text())
            .then(responseText => onSuccess(responseText))
        
        return true;  // Will respond asynchronously.
    }
);