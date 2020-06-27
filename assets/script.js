$("document").ready(function () {
    var dogApiKey = "804e825d-6365-40ce-99e9-1312b077fc63";
    var defaultImgUrl = "https://placekitten.com/200/200";

    function getWikiText(textElement, breedName) {
        var searchOrigin = $("#search-results").attr("data-id");
        textElement.html("Checking wikipedia for information...");
        $.ajax({
            method: "GET",
            url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&origin=*&titles=" + breedName
        }).then(function (response) {
            // this variable makes it easier to check for invalid responses
            var usableResponse = response.query.pages[Object.keys(response.query.pages)];
            if (usableResponse) {
                if (usableResponse.extract) {
                    textElement.text(usableResponse.extract);
                } else {
                    if (searchOrigin !== breedName) {
                        getWikiText(textElement, searchOrigin);
                    }
                    else {
                        textElement.text("No Response from Wikipedia");
                    }
                }
            }
            else {
                // getWikiText(textElement, $(".input").val());
            }
        });
    }

    // gets called if thedogapi has no image available
    function getBackupImageUrl(imageElement, breedName) {
        var answer = "";
        $.ajax({
            method: "GET",
            url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=200&pilicense=free&origin=*&titles=" + breedName
        }).then(function (response) {
            var usableResponse = response.query.pages[Object.keys(response.query.pages)];
            if (usableResponse) {
                if (usableResponse.thumbnail) {
                    imageElement.attr("src", usableResponse.thumbnail.source);
                } else {
                    imageElement.attr("src", defaultImgUrl);
                }
            }
            else {
                imageElement.attr("src", defaultImgUrl);
            }
        });
    }


    function getImageUrl(imageElement, breedId, breedName) {
        // first check thedogapi for an image, if no result, check wikipedia
        $.ajax({
            method: "GET",
            url: "https://api.thedogapi.com/v1/images/search?apikey=" + dogApiKey + "&breed_id=" + breedId,
        }).then(function (response) {
            if (response[0]) {
                imageElement.attr("src", response[0].url);
            }
            else {
                getBackupImageUrl(imageElement, breedName);
            }
            imageElement.attr("alt", breedName);
        });
    }

    $(".button").on("click", function () {
        // clearResults();
        var rootObject = $("#search-results");
        //api key
        // var dogApiKey = "804e825d-6365-40ce-99e9-1312b077fc63";
        //user input query added to var
        var breedId = $(".input").val();
        //forming url depending on input (Andrew to update)
        var queryURL = "https://api.thedogapi.com/v1/breeds/search?apikey=" + dogApiKey + "&q=" + breedId;
        //check if url working
        // console.log(queryURL);
        //retreive data
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            rootObject.empty();
            if (response[0]) {
                rootObject.attr("data-id", breedId);
                displayBreed(response[0]);
                response.forEach(element => {
                    // console.log(element);
                    var searchListItem = $("<li>").addClass("dog-list");
                    rootObject.append(searchListItem);
                    searchListItem.html(`<a>${element.name}</a>`);
                    // searchListItem.attr("data-id", breedId);
                    // displayBreed(element, $("<div>").attr("style", "border: 1px solid black"))

                });
            } else {
                rootObject.append("No results found");
            }

            // var results = response.response.docs;
            // for (var i = 0; i < breedsReturned; {
            // var breedDiv = $("<div>");

            //Do info
            //$("#dogInfo").text("Breed Group: "+ element.breed_group, <br> "Height: "+element.weight.metric, <br> "Life Span: "+ element.life_span, <br> "Weight: " +element.weight.metric)

            // });
        });

    });

    function displayBreed(dogApiResponse) {
        getImageUrl($("img"), dogApiResponse.id, dogApiResponse.name)
        getWikiText($("#dogWiki"), dogApiResponse.name);
        $("#dogName").text(dogApiResponse.name);
        $("#dogGroup").text(dogApiResponse.breed_group);
        $("#dogHeight").text(dogApiResponse.height.metric + " cm");
        $("#dogWeight").text(dogApiResponse.weight.metric + " kg");
        $("#dogLife").text(dogApiResponse.life_span);
        // console.log(dogApiResponse.breed_group);
        // console.log(dogApiResponse.height.metric);
        // console.log(dogApiResponse.life_span);
        // console.log(dogApiResponse.weight.metric);

    }

    $("#search-results").on("click", "a", function () {
        var breedName = $(this).text();
        var breedId = $(this).attr("data-id");
        var queryURL = "https://api.thedogapi.com/v1/breeds/search?apikey=" + dogApiKey + "&q=" + breedName;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            displayBreed(response[0]);
        })
    });

    function clearResults() {
        $(this).closest('form').find("input[type=text], textarea").val("");
        $("#dogOne").closest('form').find("input[type=text], textarea").val("");
        $("#dogTwo").closest('form').find("input[type=text], textarea").val("");
        $("#dogThree").closest('form').find("input[type=text], textarea").val("");
        $("#dogFour").closest('form').find("input[type=text], textarea").val("");
        $("#dogTemp").empty();

    };
});
