$('document').ready(function () {
    var connection = new signalR.HubConnectionBuilder().withUrl("/comment").build();
    var group = "group" + modelId;

    connection.start().then(function () {
        connection.invoke("AddToGroup", group);
        console.log('connection started')
    }).catch(function (err) {
        return console.error(err.toString());
    });

    connection.on("Receive", function (data) {
        fillTemplate(data[0], data[1], data[2]);
    });

    connection.on("increment", function () {
        var likes = $('#likesCount').text();
        likes++;
        $('#likesCount').text(likes);
    });

    connection.on("decrement", function () {
        var likes = $('#likesCount').text();
        likes--;
        $('#likesCount').text(likes);
    });
});

function fillTemplate(commentText, userName, date) {
    var clone = $(".cloneItem").first().clone();
    clone.find('.commentText').text(commentText);
    clone.find('.commentUserName').text("User: " + userName);
    clone.find('.commentDate').text("Date: " + date);
    clone.removeClass('visually-hidden');
    $('#commentList').append(clone);
}