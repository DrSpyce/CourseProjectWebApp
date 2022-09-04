$('#itemSearch').on('input', function () {
    if ($('#itemSearch').val() != '') {
        $.ajax({
            type: "GET",
            url: '/Api/Ajax/SearchItem/',
            data: {
                str: $('#itemSearch').val()
            },
            success: function (msg) {
                if (msg != '') {
                    clearAndFill(msg);
                    $('.dropdown-menu').show();
                } else {
                    $('.dropdown-menu').hide();
                }
            }
        });
    }
    if ($('#itemSearch').val() == '') {
        $('.dropdown-menu').hide();
    }
});

$('#itemSearch').focusout(function () {
    $('#itemSearch').val('');
    $('.dropdown-menu').hide();
});

$('#itemSearch').keypress(function (e) {
    if (e.which == 13) {
        window.location.href = "home/search?search="+$('#itemSearch').val();
    }
});

function clearAndFill(msg) {
    $('.dropdown-menu').empty();
    for (var i = 0; i < msg.length; i++) {
        var li = $('.li-clone').first().clone();
        li.removeClass('visually-hidden');
        switch (msg[i].typeOfResult) {
            case 1:
                itemAddToList(li, msg[i]);
                break;
            case 0:
                collectionAddToList(li, msg[i]);
                break;
            default:
                console.log(msg[i].typeOfResult);
                console.log('Error occured');
        }
    }
}

function itemAddToList(li, msg) {
    li.find('.dropdown-item').text('Item: ' + msg.title);
    li.find('.dropdown-item').attr('href', '/Collection/' + msg.collectionId + '/Item/' + msg.id);
    $('.dropdown-menu').append(li);
}

function collectionAddToList(li, msg) {
    li.find('.dropdown-item').text('Collection: ' + msg.title);
    li.find('.dropdown-item').attr('href', '/Collection/' + msg.id);
    $('.dropdown-menu').append(li);
}