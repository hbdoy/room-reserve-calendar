/* Modal */
$(document).ready(function () {
  $('.modal').modal();
})

/* Modify -> Get JSON */
$(document).ready(function () {
  $.ajax({
    url: "https://暨大猴子.tw/api/user/104213083",
    type: "GET",
    dataType: "json",
    success: function (data) {
      $('#modify_imagePreview').css('background-image', 'url(' + data.photo + ')');
      $('#modify_name').val(data.name);
      $('#modify_department').val(data.department);
      $('#modify_email').val(data.email);
      var allcard = "";
      if (data.card != null) {
        for (var i = 0; i < data.card.length; i++) {
          allcard += data.card[i].cardID + " ";
        }
        $('#modify_cardid').val(allcard);
      }
      $('#modify_cellphone').val(data.cellphone);
    },
    error: function () {
      alert("ERROR!!!");
    }
  });
});

/* warning */
$(document).ready(function () {
  $('.collapsible').collapsible();
});

/* Upload Image */
var base64photo;
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      base64photo = e.target.result;
      $('#modify_imagePreview').css('background-image', 'url(' + e.target.result + ')');
      $('#modify_imagePrevieww').hide();
      $('#modify_imagePreview').fadeIn(650);
    }
    reader.readAsDataURL(input.files[0]);
  }
}
$("#modify_imageUpload").change(function () {
  readURL(this);
});

/* FAB */
$(document).ready(function () {
  $('.fixed-action-btn').floatingActionButton();
});

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'top',
    hoverEnabled: false
  });
});

/* PATCH JSON */
$(document).ready(function () {
  $("#submitmodify").click(function (e) {
    e.preventDefault();
    $.ajax({
      asyn: true,
      crossDomain: true,
      type: 'PATCH',
      url: 'https://暨大猴子.tw/api/register/104213083',
      data: JSON.stringify({
        "photo": base64photo,
        "name": $("#modify_name").val(),
        "email": $("#modify_email").val(),
        "password": $("#before_password").val(),
        "newpassword": $("#modify_password").val(),
        "cellphone": $("#modify_cellphone").val()
      }),
      headers: {
        "Content-Type": "application/json",
        "cache-control": "no-cache"
      },
      success: function (data) {
        console.log(data);
      },
      error: function (data) {
        // console.log(data.password);
        alert(data.responseJSON.message);
      }
    });
  });
});