$(document).on("click", "#scrape", function() {
	$.ajax({
		method: "GET",
		url: "/scrape",
	}).done(function(data) {
		console.log(data);
		window.location.reload();
	});
});

$(document).on("click", ".save", function() {
    var uniqueId = $(this).attr("data-id");
    console.log(uniqueId);

    $.ajax({
        method: "POST",
        url: "/articles/save/" + uniqueId
    }).done(function(data) {
    	console.log("data");
    	location.reload();
    });
});

$(document).on("click", ".delete", function() {
	var uniqueId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/delete/" + uniqueId
	}).done(function(data) {
		console.log(data);
		location.reload();
	})
});

$(document).on("click", ".saveNote", function() {
	var uniqueId = $(this).attr("data-id");
	if (!$("#noteText" + uniqueId).val()) {
        alert("please leave a comment to save")
    }else {

		$.ajax({
			method: "POST",
			url: "/notes/save/" + uniqueId,
			data: {
				text: $("#noteText" + uniqueId).val()
			}
		}).done(function(data) {
			console.log(data);
			$("#noteText" + uniqueId).val("");
	        $(".modalNote").modal("hide");
	    
		});
	}
});

$(document).on("click", ".deleteNote", function() {
    var noteId = $(this).attr("data-note-id");
    var articleId = $(this).attr("data-article-id");
    $.ajax({
        method: "DELETE",
        url: "/notes/delete/" + noteId + "/" + articleId
    }).done(function(data) {
        console.log(data)
        $(".modalNote").modal("hide");
    })
});

