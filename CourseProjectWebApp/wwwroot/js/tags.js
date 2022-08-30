function addAlert() {
    if (!$('#tagAlert').length) {
        if ($('#model').length) {
            $('#model').remove();
            return;
        }
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
    var childs = $('#allTags').find('span');
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

function onChange() {
    $('#allTags').empty();
    var results = tagify.value;
    if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
            $('<input>').attr({
                type: 'hidden',
                id: 'Tags_' + i + '__Name',
                name: 'Tags[' + i + '].Name',
                value: results[i].value
            }).appendTo('#allTags');
        }
    }
    else {
        addAlert();
    }
}

var input = document.getElementById('tagName'),
    tagify = new Tagify(input, { whitelist: [] });
tagify.on('input', onInput);
tagify.addTags([addTags()]);

input.addEventListener('change', onChange);