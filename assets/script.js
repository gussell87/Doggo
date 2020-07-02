$("document").ready(function () {
    var dogApiKey = "804e825d-6365-40ce-99e9-1312b077fc63";
    var defaultImgUrl = "./assets/dog.jpg";

    // brought the most commonly used call into a separate function
    function dogApiCall(breedName) {
        var queryURL = "https://api.thedogapi.com/v1/breeds/search?apikey=" + dogApiKey + "&q=" + breedName;
        return $.ajax({
            url: queryURL,
            method: "GET"
        });
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
        var searchOrigin = $("#search-results").attr("data-id");
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
            url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=200&pilicense=free&origin=*&titles=" + breedName
        }).then(function (response) {
            // this var makes it easier to process the wikipedia response
            var usableResponse = response.query.pages[Object.keys(response.query.pages)];
            // checks for response error
            if (usableResponse) {
                // checks for available thumbnail
                if (usableResponse.thumbnail) {
                    imageElement.attr("src", usableResponse.thumbnail.source);
                } else {
                    // if response has no thumbnail, use default
                    imageElement.attr("src", defaultImgUrl);
                }
            }
            // if there's an error, use the default
            else {
                imageElement.attr("src", defaultImgUrl);
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
                // this is the best case scenario
                imageElement.attr("src", response[0].url);
            }
            else {
                // checks wikipedia
                getBackupImageUrl(imageElement, breedName);
            }
        });
    }

    $(".button").on("click", function () {
        // Andrew set the rootObject here to make it easier to integrate the code
        var rootObject = $("#search-results");
        // gets the search term from the text input box
        var breedName = $("#search-input").val();
        // clears the list and lets the user know something is happening
        rootObject.html("Searching...");
        dogApiCall(breedName).then(function (response) {
            // clear the list
            rootObject.empty();
            // check if we got a good response
            if (response[0]) {
                // remove the search bar tooltip
                searchInputTippy[0].disable();
                // expose the search results tooltip
                searchResultTippy[0].enable();
                searchResultTippy[0].show();
                // save the search term for later use
                rootObject.attr("data-id", breedName);
                // display the info of the first search result
                displayBreed(response[0]);
                // for loop to display up to five results
                for (var i = 0; i < 5 && i < response.length; i++) {
                    var searchListItem = $("<a>")
                    rootObject.append($("<li>").append(searchListItem));
                    // <a> tag required for styling
                    searchListItem.html(response[i].name);
                }
            }
            // if no good response
            else {
                searchInputTippy[0].enable();
                searchInputTippy[0].show();
                rootObject.append("No results found");
                searchResultTippy[0].disable();
            }
        });
    });


    // event listener for clicking on the search results
    $("#search-results").on("click", "a", function () {
        var breedName = $(this).text();
        dogApiCall(breedName).then(function (response) {
            // no error checking should be required here, the breedName came from this API
            displayBreed(response[0]);
        })
    });

    var searchInputTippy = tippy('#search-input', {
        content: 'Type some words and search for dog breeds!',
    });

    var searchResultTippy = tippy('#search-results', {
        content: 'Click a result to see the details!',
    });
    document.getElementById('search-input').focus();
    searchInputTippy[0].show();
    searchResultTippy[0].disable();
});
