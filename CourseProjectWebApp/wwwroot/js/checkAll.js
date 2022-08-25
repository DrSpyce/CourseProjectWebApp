window.onload = function () {
    var f = document.getElementById('form1');
    f.cb_all.onchange = function (e) {
        var el = e ? e.target : window.event.srcElement;
        var cb = el.form.getElementsByClassName('cb');
        for (var i = 0; i < cb.length; i++) {
            if (el.checked) {
                cb[i].checked = true;
            } else {
                cb[i].checked = false;
            }
        }
    }
}