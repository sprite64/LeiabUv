
var LB_ENDL = String.fromCharCode(10);
var LB_TAB = String.fromCharCode(9);



// JQuery Ready/Initiation
$(function () {


    //$("#btnSaveTemplate").click(function () { lbSaveTemplate(); });
    //$("#btnSaveTemplate").click(function () { lbSaveTemplate(); });

    $("#btnSaveProduct").click(function () { lbSaveProduct(); });

    $("#btnFromExcel").click(function () { lbUpdateTabInput(); });

    //$("#productVal0").change(function () { alert("Change! "); });


});


setInterval(function () { lbUpdateInput(); }, 300);

