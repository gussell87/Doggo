$(".button").on("click", function () {
    // clearResults();
    //api key
    var dogApiKey = "804e825d-6365-40ce-99e9-1312b077fc63";
    //user input query added to var
    var breedId = $(".input").val();
    //forming url depending on input (Andrew to update)
    var queryURL = ("https://api.thedogapi.com/v1/images/search?apikey=" + dogApiKey + "&q=" + breedId);
    //check if url working
    console.log(queryURL);
    //retreive data
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response[0].url);
        $("img").sr

        // var results = response.response.docs;
        // for (var i = 0; i < breedsReturned; {
        // var breedDiv = $("<div>");

        //Do info
        //$("#dogInfo").text("Breed Group: "+ element.breed_group, <br> "Height: "+element.weight.metric, <br> "Life Span: "+ element.life_span, <br> "Weight: " +element.weight.metric)

        // });
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
});
