
var LB_ENDL = String.fromCharCode(10);
var LB_TAB = String.fromCharCode(9);



// JQuery Ready/Initiation
$(function () {


    //$("#btnSaveTemplate").click(function () { lbSaveTemplate(); });
    //$("#btnSaveTemplate").click(function () { lbSaveTemplate(); });
    //$("#btnSaveProductChanges").click(function () { lbSaveProductChanges(); });
    $("#btnSaveProduct").click(function () { lbSaveProduct(); });

    $("#btnFromExcel").click(function () { lbUpdateTabInput(); });

    $("#btnClearInput").click(function () { lbClearInput(); });


    //$("#productVal0").change(function () { alert("Change! "); });
    //alert("Door or not: " + $("#nonDoorInput").length);
    //alert("!!!");

});


setInterval(function () { lbUpdateInput(); }, 300);

