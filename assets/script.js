// New JS file

// API key for "The dog api" - https://docs.thedogapi.com/
var apiKey = "804e825d-6365-40ce-99e9-1312b077fc63"

function getDog(dogSearch) {  
    console.log(dogSearch)

    $.ajax({
        async: true,
        crossDomain: true,
        url: "https://api.thedogapi.com/v1/breeds/search?api_key=804e825d-6365-40ce-99e9-1312b077fc63&q=" + dogSearch,
        method: "GET",
    }).done(function (response) {
        $("#bredFor").text(response[0].bred_for)
        $("#dogWeight").text(response[0].weight.metric)
        $("#dogTemp").text(response[0].temperament)
        console.log(response[0].bred_for)
        console.log(response);
    });
};

var srcBtn = $("#srcBtn");
srcBtn.on("click", function () {
    event.preventDefault();
    var dogSearch = $(this).prev().val().trim();
    console.log(dogSearch);
    getDog(dogSearch);
});