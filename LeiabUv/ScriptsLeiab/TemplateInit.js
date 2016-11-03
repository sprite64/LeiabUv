/*  Template Init
    
    Pritam Schönberger 2016

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Profil  - Profile
        Mall    - Template
        Båge    - -
*/


/*
    Notes:

        [DONE] Mouse position and handling should be refined, it works as is but could be a lot more elegant.
        ^^^ This should be done before anything really, it's just a mess as is now regardless that it works.

        [DONE] The variable name currently used inside and out of functions "model" should be replaced with "template" for usage concurrency.

        Perhaps a "lazy" setInterval for lbUpdateAndRender should be implemented, interval on about 100ms or so.

        Implement New/Save/Cancle button functionality. With informational modals.

        Though more importantly is starting to work on a DB to store Templates and Panes/Luft/Cells in their respective tables, 
            Need to check out JSon tech and how to "post" this data to the controller without reloading the page.

*/


// Test model
// The "New" button should be pressed to do this, otherwise, m is just nothing or "undefined"

//var m = lbCreateTemplate(1, 1);
var template = lbCreateTemplate(1, 1);

//var m = lbCreateTemplate(LB_TemplateMaxColumns, LB_TemplateMaxRows);


// This is merely for the purpose of the above created model m
//lbTemplateRender(template);
//lbTemplateUpdate(template, "");



// JQuery Ready/Initiation
$(function () {

    //var canvas = document.getElementById(LB_TemplateCanvasId);
    //var ctx = canvas.getContext("2d");

    //lbTemplateUpdate(template, "");

    lbTemplateUpdateAndRender(template, "");


    // Mouse button down event
    function handleMouseDown(e) {
        // Do nothing
    }


    // Mouse button up event
    function handleMouseUp(e) {
        lbTemplateUpdateAndRender(template, "mouseUp");      // Handle mouse-clicks
    }


    // Mouse out of bounds
    function handleMouseOut(e) {
        // Do nothing
    }

    function handleMouseMove(e) {

        lbUpdateMousePosition(e);
        lbTemplateUpdateAndRender(template, "mouseMove");
    }


    // The actual event handlers
    $("#TemplateCanvas").mousedown(function (e) { handleMouseDown(e); });
    $("#TemplateCanvas").mousemove(function (e) { handleMouseMove(e); });
    $("#TemplateCanvas").mouseup(function (e) { handleMouseUp(e); });
    $("#TemplateCanvas").mouseout(function (e) { handleMouseOut(e); });


    /* Button events and control */
    $("#btnOpenEditor").click(function () { template = lbOpenEditor(template); lbTemplateUpdateAndRender(template, ""); });         // Main test functions for editor
    $("#btnCloseEditor").click(function () { template = lbCloseEditor(template); lbTemplateUpdateAndRender(template, ""); });
    $("#btnResetEditor").click(function () { template = lbResetEditor(template); lbTemplateUpdateAndRender(template, ""); });

    $("#btnSaveTemplate").click(function () { template = lbSaveTemplate(template); });


    $("#btnNewTemplateQuery").click(function () { template = lbHandleNewTemplateQuery(template); });               // Work this in first
    $("#btnThrowTemplateConfirm").click(function () { template = lbHandleThrowTemplateConfirm(template); });       // Throw current template

    $("#btnSaveTemplateQuery").click(function () { lbHandleSaveTemplateQuery(template); });

    $("#btnCancelTemplateQuery").click(function () { lbHandleCancelTemplateQuery(template); });         // Cancel template query
    $("#btnCancelTemplateConfirm").click(function () { lbHandleCancelTemplateConfirm(template); });     // Cancel template confirm


    /*
    <button id="btnNewTemplateQuery" class="btn btn-success" style="width: 80px; margin-bottom: 10px; margin-left: 10px;">Ny</button>
                
                btnNewTemplateQuery
                btnSaveTemplateQuery
                btnCancelTemplateQuery
                */

    /*
        <button id="btnNewTemplate" class="btn btn-success" style="width: 80px; margin-bottom: 10px; margin-left: 10px;">Ny</button>
                
        <!-- Modal save button -->
        <button type="button" class="btn btn-info" data-toggle="modal" data-target="#mdlSaveTemplate" style="width: 80px; margin-bottom: 10px; margin-left: 10px;">Spara</button>

        <!-- Perhaps a useless cancle button, could redirect to template gallery -->
        <button id="btnCancleTemplate" class="btn btn-warning" style="width: 80px; margin-bottom: 10px; margin-left: 10px;">Avbryt</button>


    */

    /* Frame control click events */
    $("#btnIncreaseFrameColumn").click(function () {    template = lbIncreaseFrameColumn(template); lbTemplateUpdateAndRender(template, ""); });
    $("#btnIncreaseFrameRow").click(function () {       template = lbIncreaseFrameRow(template);    lbTemplateUpdateAndRender(template, ""); });

    $("#btnDecreaseFrameColumn").click(function () {    template = lbDecreaseFrameColumn(template); lbTemplateUpdateAndRender(template, ""); });
    $("#btnDecreaseFrameRow").click(function () {       template = lbDecreaseFrameRow(template);    lbTemplateUpdateAndRender(template, ""); });
    

    /* Pane control click events */
    $("#btnIncreasePaneColumn").click(function () {     lbIncreasePaneColumn(template); lbTemplateUpdateAndRender(template, ""); });
    $("#btnIncreasePaneRow").click(function () {        lbIncreasePaneRow(template);    lbTemplateUpdateAndRender(template, ""); });

    $("#btnDecreasePaneColumn").click(function () {     lbDecreasePaneColumn(template); lbTemplateUpdateAndRender(template, ""); });
    $("#btnDecreasePaneRow").click(function () {        lbDecreasePaneRow(template);    lbTemplateUpdateAndRender(template, ""); });
});


setInterval(function () { lbTemplateUpdateAndRender(template, ""); }, 300);

