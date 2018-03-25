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
	if (!$("#noteText" + thisId).val()) {
        alert("please enter a note to save")
    }else {
		$.ajax({
			method: "POST",
			url: "/notes/save/" + uniqueId,
			data: {
				text: $("#noteText" + uniqueId).val()
			}
		}).done(function(data) {
			console.log(data);
			$("#noteText" + thisId).val("");
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

function createModalHTML(data) {
    var modalText = data.title;
    $("#note-modal-title").text("Add your notes here: " + data.title);
    var noteItem;
    var noteDeleteBtn;
    for (var i = 0; i < data.notes.length; i++) {
      noteItem = $("<li>").text(data.notes[i].body);
      noteItem.addClass("note-item-list");
      noteItem.attr("id", data.notes[i]._id);
      noteDeleteBtn = $("<button> Delete </button>").addClass("btn btn-danger delete-note-modal");
      noteDeleteBtn.attr("data-noteId", data.notes[i]._id);
      noteItem.prepend(noteDeleteBtn, " ");
      $(".notes-list").append(noteItem);
    }
  }

  $(document).on("click", ".note-modal-btn", function() {
    var articleId = $(this).attr("data-articleId");
    $("#add-note-modal").attr("data-articleId", articleId);
    $("#note-modal-title").empty();
    $(".notes-list").empty();
    $("#note-body").val("");
    $.ajax("/notes/article/" + articleId, {
      type: "GET"
    }).then(
      function(data) {
        createModalHTML(data);
      }
	);
	$("#add-note-modal").modal("toggle");
  });