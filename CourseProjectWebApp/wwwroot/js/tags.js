function onSend() {
    var form = document.getElementById('form');
    var results = tagify.value;
    if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
            $('<input>').attr({
                type: 'hidden',
                id: 'Item_Tags_' + i + '__Name',
                name: 'Item.Tags[' + i + '].Name',
                value: results[i].value
            }).appendTo('#form');
        }
        form.submit();
    }
    else {
        addAlert();
    }
}

function addAlert() {
    if (!$('#tagAlert').length) {
        if ($('#model').length) {
            $('#model').remove();
            console.log(1234);
            return;
        }
        console.log(1111);
        $('<span>').attr({
            class: "text-danger field-validation-error",
            id: "tagAlert"
        }).html("The Tag field is required.").appendTo('#tagsForm');
    }
}

function checkAlert() {
    if ($('#tagAlert').length) {
        $('#tagAlert').remove();
    }
}

function addTags() {
    var childs = $('#exTags').children();
    $('#exTags').remove();
    if (childs.length == 0) {
        addAlert();
        return "";
    }
    var tags = '';
    for (var i = 0; i < childs.length; i++) {
        var tag = $(childs[i]).text();
        tags += tag + ',';
    }
    return tags;
}