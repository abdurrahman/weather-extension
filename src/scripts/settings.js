
$(function() {
    settings.init();
});

var settings = function(){

    // console.log(localStorage);
    // $('#units').val(localStorage._units || $('#units').val()).on('change', function() {
    //     debugger;
    //     localStorage._units = $(this).val();
    // });

    var init = function (){
        debugger;
        var settingHeader = chrome.i18n.getMessage("settingsHeader");
        var unitLabel = chrome.i18n.getMessage("units");
        var saveText = chrome.i18n.getMessage("save");
        var resetText = chrome.i18n.getMessage("reset");

        $('#settings-header').text(settingHeader);
        $('#units-label').text(unitLabel);
        $('#save').text(saveText);
        $('#reset').text(resetText);
        $('#units').val(localStorage._units);
    }

    var onSave = function(){
        debugger;
        var unit = $("input[name=units]:checked").val();
        localStorage._units = unit;
        var status = $('#status').show();
        status.text('Options saved.');
        setTimeout(function (){
            status.fadeOut();
        }, 1000);
        // getCurrentLocation(function(value) {
        //     if (!value) throw err

        //     if (value) {
        //         chrome.extension.getBackgroundPage().onUpdateBadge(value);
        //     }
        // })
    };

    var onReset = function() {
        localStorage.removeItem('_units');
    }

    return {
        init: init,
        onSave: onSave,
        onReset: onReset
    }
}();

document.getElementById("save").addEventListener("click", settings.onSave);
document.getElementById("reset").addEventListener("click", settings.onReset);