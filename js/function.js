/* Login In Form Modal */
$(document).ready(function () {
  $('.modal').modal();
})

var base64image;
/* Upload Image */
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
      base64image = e.target.result;
      $('#imagePreview').hide();
      $('#imagePreview').fadeIn(650);
    }
    reader.readAsDataURL(input.files[0]);
  }
}
$("#register_imageUpload").change(function () {
  readURL(this);
});

/* POST JSON */
$(document).ready(function () {
  $("#submitregister").click(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: 'https://xn--pss23c41retm.tw/api/register',
      data: {
        "photo": base64image,
        "first_name": $("#register_firstname").val(),
        "last_name": $("#register_lastname").val(),
        "email": $("#register_email").val(),
        "password": $("#register_password").val(),
        "student_id": $("#register_stuid").val(),
        "cellphone": $("#register_cellphone").val()
      },
      cache: false,
      dataType: 'json',
      success: function (data) {
        console.log(data);
      },
      error: function (data) {
        alert(data.responseJSON.message);
      }
    });
  });
});