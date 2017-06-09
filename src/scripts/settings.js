$(function() {
    settings.init();
});

var settings = function(){

    var init = function (){
        debugger;
        console.log(localStorage);
        $('#units').val(localStorage._units || $('#units').val()).on('change', function() {
            localStorage._units = $(this).val();
            // chrome.extension.getBackgroundPage().update();
        });
    }

    var onSave = function(){
        debugger;
        var unit = $("#units").val();
        console.log($(this));
        $(this).text('Saved!');
        chrome.storage.sync.set({'units': unit}, function (){
            $('#save').text('Save Location');
        });
    };

    return {
        init: init,
        onSave: onSave
    }
}();