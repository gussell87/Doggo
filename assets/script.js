$("document").ready(function () {
    var dogApiKey = "804e825d-6365-40ce-99e9-1312b077fc63";

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
        var queryURL = ("https://api.thedogapi.com/v1/breeds/search?apikey=" + dogApiKey + "&q=" + breedId);
        //check if url working
        // console.log(queryURL);
        //retreive data
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            rootObject.empty();
            response.forEach(element => {
                console.log(element);
                var searchListItem = $("<li>").addClass("dog-list");
                rootObject.append(searchListItem);
                searchListItem.text(element.name);
                searchListItem.attr("data-id", element.id);
                // displayBreed(element, $("<div>").attr("style", "border: 1px solid black"))
            });

            // var results = response.response.docs;
            // for (var i = 0; i < breedsReturned; {
            // var breedDiv = $("<div>");

            //Do info
            //$("#dogInfo").text("Breed Group: "+ element.breed_group, <br> "Height: "+element.weight.metric, <br> "Life Span: "+ element.life_span, <br> "Weight: " +element.weight.metric)

            // });
        });

    });
    $("#search-results").on("click", ".dog-list", function(event) {
        // console.log(event.target);
        console.log($(this));
        var imageName = $(this).text();
        console.log(imageName);
        getImageUrl($("img"), $(this).attr("data-id"), imageName);
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
