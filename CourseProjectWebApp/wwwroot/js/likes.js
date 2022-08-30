$('document').ready(function () {
    $.ajax({
        type: "GET",
        url: urlIsLiked,
        data: {
            itemId: modelId,
            userName: userName,
        },
        success: function (msg) {
            console.log(msg)
            if (msg == true) {
                showButton('dislike', 'like');
            } else {
                showButton('like', 'dislike');
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});

$('#likeButton').click(function (event) {
    event.preventDefault();
    $.ajax({
        type: "GET",
        url: urlSetLike,
        data: {
            itemId: modelId,
            userName: userName,
        },
        success: function (msg) {
            if (msg == true) {
                showButton('dislike', 'like');
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});

$('#dislikeButton').click(function (event) {
    event.preventDefault();
    $.ajax({
        type: "GET",
        url: urlUnsetLike,
        data: {
            itemId: modelId,
            userName: userName,
        },
        success: function (msg) {
            if (msg == true) {
                showButton('like', 'dislike');
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});

function showButton(btnShow, btnHide) {
    $('#' + btnShow +'Button').removeClass('visually-hidden');
    $('#' + btnHide + 'Button').removeClass('visually-hidden').addClass('visually-hidden');
}