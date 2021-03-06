var current_file;
var DURATION = 300;

$(function() {
  setup_drag_n_drop("dropzone");
});

function setup_drag_n_drop(id) {
  id = document.getElementById(id);
  id.addEventListener("dragenter", dragEnter, false);
  id.addEventListener("dragleave", dragLeave, false);
  id.addEventListener("dragover", dragOver, false);
  id.addEventListener("drop", drop, false);
}

function dragEnter(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  $(evt.target).removeClass("drag-inactive").addClass("drag-active");
}

function dragLeave(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  $(evt.target).removeClass("drag-active").addClass("drag-inactive");
}

function dragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
}

function drop(evt) {
  evt.preventDefault();
  $(evt.target).removeClass("drag-active").addClass("drag-inactive");
  $("#main-button").attr("disabled", "disabled");

  var files = evt.dataTransfer.files;
  var count = files.length;
  var file = files[0];
  current_file = file;

  var reader = new FileReader(), filter = /^(text\/plain)$/i;
  reader.onload = handle_data;

  // Abort, when the user hasn't uploaded anything
  if (count <= 0) {return; }
  // Check if the file is a valid mp3
  if (filter.test(file.type)) {
    $('#dropzone').text("Thanks! Now give it a spin! :)");
  } else {
    show_error("We think you uploaded the wrong file ;)");
    return;
  }
  // Otherwise hide the error
  hide_error();

  reader.readAsText(file);
}

function show_error(msg) {
  $("#errors").html(msg);
  $("#errors").show(DURATION);
}

function hide_error() {
  $("#errors").hide(DURATION);
}

function handle_data(evt) {
  var text_data = evt.target.result;

  $.ajax({
    url: "/text",
    data: {
      text: text_data
    },
    type: 'POST'
  }).done(function() {
    $("#main-button").removeAttr("disabled");
    hide_error();
  }).fail(function() {
    show_error("Uploading to the server didn't work. Strange...");
  });
}
