$("document").ready(function () {
    var dogImageindex = "";
    var dogApiKey = "804e825d-6365-40ce-99e9-1312b077fc63";
    var defaultImgUrl = "./assets/dogCropped.jpg";
    var lastSearch = localStorage.getItem("lastSearch") || "";
    var lastSearchResponse = JSON.parse(localStorage.getItem("lastSearchResponse")) || [];

    // brought the most commonly used call into a separate function
    function dogApiCall(breedName) {
        var queryURL = "https://api.thedogapi.com/v1/breeds/search?apikey=" + dogApiKey + "&q=" + breedName;
        return $.ajax({
            url: queryURL,
            method: "GET"
        });
    }

    function saveSearch() {
        localStorage.setItem("lastSearchResponse", JSON.stringify(lastSearchResponse));
        localStorage.setItem("lastSearch", lastSearch);
    }

    // Takes a single response from thedogapi.com and fills out each field
    function displayBreed(dogApiResponse) {
        getImageUrl($("#dogImage"), dogApiResponse.id, dogApiResponse.name)
        getWikiText($("#dogWiki"), dogApiResponse.name);
        $("#dogName").text(dogApiResponse.name);
        $("#dogGroup").text(dogApiResponse.bred_for);
        $("#dogHeight").text(dogApiResponse.height.metric + " cm");
        $("#dogWeight").text(dogApiResponse.weight.metric + " kg");
        $("#dogLife").text(dogApiResponse.life_span);
        $("#dogTemperament").text(dogApiResponse.temperament);
    }

    // Function to request a page summary from en.wikipedia.org
    function getWikiText(textElement, breedName) {
        // this is the search term that was used
        var searchOrigin = lastSearch;
        // a loading message
        textElement.html("Checking wikipedia for information...");
        // the API call
        $.ajax({
            method: "GET",
            url: "https://en.wikipedia.org/w/api.php?action=query&format=json&redirects&prop=extracts&exintro=1&explaintext=1&origin=*&titles=" + breedName
        }).then(function (response) {
            // this variable makes it easier to check for invalid responses
            var usableResponse = response.query.pages[Object.keys(response.query.pages)];
            // does the usable part of the response exist?
            if (usableResponse) {
                // does the response have a non-empty text extract?
                if (usableResponse.extract) {
                    // Yay! print the extract, put a link to the page
                    textElement.html(usableResponse.extract);
                    $("#wikiTitle").html(`<a href="https://en.wikipedia.org/wiki/${usableResponse.title}" target="_blank">Wikipedia.org - ${usableResponse.title}</a>`);
                } else {
                    // non-error response but no text? try the original search term (useful for poodle, husky, hound, shepherd)
                    if (searchOrigin !== breedName) {
                        getWikiText(textElement, searchOrigin);
                    }
                    else {
                        textElement.html("No Response from Wikipedia");
                        $("#wikiTitle").html("Wiki");
                    }
                }
            }
        });
    }

    // gets called if thedogapi has no image available
    function getBackupImageUrl(imageElement, breedName) {
        $.ajax({
            method: "GET",
            url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=300&pilicense=free&origin=*&titles=" + breedName
        }).then(function (response) {
            // this var makes it easier to process the wikipedia response
            var usableResponse = response.query.pages[Object.keys(response.query.pages)];
            // checks for response error
            if (usableResponse) {
                // checks for available thumbnail
                if (usableResponse.thumbnail) {
                    imageElement.attr("src", usableResponse.thumbnail.source);
                    $("#dogImageCaption").html(`Image from <a href="https://en.wikipedia.org/wiki/${usableResponse.title}" target="_blank">Wikipedia.org - ${usableResponse.title}</a>.`)
                } else {
                    // if response has no thumbnail, use default
                    imageElement.attr("src", defaultImgUrl);
                    $("#dogImageCaption").html(`Sorry! Couldn't find an image for ${breedName}`);
                }
            }
            // if there's an error, use the default
            else {
                imageElement.attr("src", defaultImgUrl);
                $("#dogImageCaption").html(`Sorry! Something went wrong with the image search`);
            }
        });
    }

    function getImageUrl(imageElement, breedId, breedName) {
        // sets the alt text of the image, no matter where the image comes from
        imageElement.attr("alt", breedName);
        // check thedogapi for an image, if no result, check wikipedia
        $.ajax({
            method: "GET",
            url: "https://api.thedogapi.com/v1/images/search?apikey=" + dogApiKey + "&breed_id=" + breedId,
        }).then(function (response) {
            if (response[0]) {
                dogImageindex = response[0].breeds[0].id;
                imageElement.attr("src", response[0].url);
                $("#dogImageCaption").html(`Click and we'll try to find more ${breedName} images for you!`);
            }
            else {
                dogImageindex = "";
                // check wikipedia
                getBackupImageUrl(imageElement, breedName);
            }
        });
    }

    function displaySearch(response) {
        // remove the search bar tooltip
        searchInputTippy[0].disable();
        // expose the search results tooltip
        searchResultTippy[0].enable();
        searchResultTippy[0].show();
        scrollTippy[0].show();
        setTimeout(() => {
            searchResultTippy[0].hide();
            scrollTippy[0].hide();
            scrollTippy[0].disable();
        }, 4500);
        $("#search-results").empty();
        displayBreed(response[0]);
        // for loop to display up to five results
        for (var i = 0; i < 5 && i < response.length; i++) {
            var searchListItem = $("<a>")
            $("#search-results").append($("<li>").append(searchListItem));
            // <a> tag required for styling
            searchListItem.html(response[i].name).data("index", i);
            lastSearchResponse[i] = response[i];
        }
    }

    function doSearch() {
        // gets the search term from the text input box
        var breedName = $("#search-input").val().trim();
        // clears the list and lets the user know something is happening
        $("#search-results").html("Searching...");
        dogApiCall(breedName).then(function (response) {
            // check if we got a good response
            if (response[0]) {
                // clear search history
                lastSearchResponse = [];
                // save the search term for later use
                lastSearch = breedName;
                // display the info of the first search result
                displaySearch(response);
                saveSearch();
            }
            // if no good response
            else {
                $("#search-results").empty();
                searchInputTippy[0].enable();
                searchInputTippy[0].show();
                $("#search-results").append("No results found");
                searchResultTippy[0].disable();
            }
        });
    }

    $("#search-button").on("click", doSearch);
    $("#search-input").on("keyup", function(event) {
        if (event.key == "Enter") {
            doSearch();
        }
    })

    // event listener for clicking on the listed search results
    $("#search-results").on("click", "a", function () {
        displayBreed(lastSearchResponse[$(this).data("index")]);
    });

    // event listener for updating images when possible
    $("#dogImage").parent().on('click', function () {
        if (dogImageindex) {
            getImageUrl($("#dogImage"), dogImageindex, $("#dogImage").attr("alt"));
        }
    })

    var searchInputTippy = tippy('#search-input', {
        content: 'Type some words and search for dog breeds!',
    });

    var searchResultTippy = tippy('#search-results', {
        content: 'Click a result to see the details!',
    });

    // This one is specifically here for mobile users
    var scrollTippy = tippy('#dogName', {
        content: 'Scroll down to see more info!',
    });

    function init() {
        if (lastSearch && lastSearchResponse) {
            $("#search-input").val(lastSearch);
            displaySearch(lastSearchResponse);
        }
        else {
            document.getElementById('search-input').focus();
            searchInputTippy[0].show();
            searchResultTippy[0].disable();
        }
    }

    init();
});
