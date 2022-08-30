$('#commentText').on('input', function () {
    $('#commentTextValidation').text("");
});

$('#submit').click(function (event) {
    event.preventDefault();
    var text = $('#commentText').val();
    if (text == '') {
        $('#commentTextValidation').text("Comment can't be empty");
    }
    else {
        $('#commentText').val('');
        $.ajax({
            type: "GET",
            url: urlCreateComment,
            data: {
                itemId: modelId,
                userName: userName,
                text: text
            },
            success: function (msg) {
                console.log('success' + msg)
            },
            error: function (req, status, error) {
                console.log(req + ' ' + status + ' ' + error);
            }
        });
    }
});
