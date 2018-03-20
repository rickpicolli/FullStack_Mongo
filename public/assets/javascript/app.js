// $(document).on("click", "#scrape", function() {
// 	$.ajax({
// 		method: "GET",
// 		url: "/scrape",
// 	}).done(function(data) {
// 		console.log(data);
// 	});
// });

// $(document).on("click", ".save", function() {
//     var uniqueId = $(this).attr("data-id");
//     console.log(uniqueId);

//     $.ajax({
//         method: "PUT",
//         url: "/articles/saved/" + uniqueId
//     }).then(function(data) {
//     	console.log("data");
//     });
// });

// $(document).on("click", ".delete", function() {
// 	var uniqueId = $(this).attr("data-id");
// 	$.ajax({
// 		method: "POST",
// 		url: "/articles/delete/" + uniqueId
// 	}).done(function(data) {
// 		console.log(data)
// 	})
// });

//Handle Scrape button
$("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});

// //Set clicked nav option to active
// $(".navbar-nav li").click(function() {
//    $(".navbar-nav li").removeClass("active");
//    $(this).addClass("active");
// });

//Handle Save Article button
$(".save").on("click", function() {
	console.log("clicked")
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
});

//Handle Delete Article button
$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function(data) {
        window.location = "/saved"
    })
});