$("#searchBtn").on("click", function () {
    clearResults();
    //api key
    var key = "xxxxx";
    //user input query added to var
    var search = $("#searchTerm").val().trim();
    //forming url depending on input (Andrew to update)
    var queryURL = ("https://jsfiddle.net/xxx=" + search + "xxx" + "&api-key=" + key);
    //check if url working
    console.log(queryURL);
    //retreive data
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var results = response.response.docs;
        for (var i = 0; i < articlesReturned; {
            var articleDiv = $("<div>");
            var heading = $("<h3>");
            var author = $("<h5>");
            var preview = $("<p>");
            heading.text(results[i].headline.main);
            author.text(results[i].byline.original);
            preview.text(results[i].abstract);
            $(articleDiv).append(heading, author);
            $(articleDiv).append(preview);
            $(".article-list").append(articleDiv);

        });
    });

    $("#clearBtn").on("click", clearResults);

    function clearFields() {
        $(this).closest('form').find("input[type=text], textarea").val("");
        $("#dogOne").closest('form').find("input[type=text], textarea").val("");
        $("#dogTwo").closest('form').find("input[type=text], textarea").val("");
        $("#dogThree").closest('form').find("input[type=text], textarea").val("");
        $("#dogFour").closest('form').find("input[type=text], textarea").val("");
    }

    function clearResults() {
        $(".article-list").empty();
    }