$(document).on("click", "#scrape", function() {
	$ajax({
		method: "GET",
		url: "/scrape",
	}).done(function(data) {
		console.log(data);
	});
});

$(document).on("click", "#saved", function () {
	var uniqueId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/save/" + uniqueId
	}).done(function(data) {
		console.log(data)
	})
});

$(document).on("click", ".delete", function() {
	var uniqueId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/delete/" + uniqueId
	}).done(function(data) {
		console.log(data)
	})
});

