/*  Template Init
    
    Pritam Schönberger 2016, 2017

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Produkt - Product
        Mall    - Template
        Båge    - -
*/



// JQuery Ready/Initiation
$(function () {


    // Update selection canvas html dimensions
    // This didn't work, but it's fine
    //$("#PaneSelectCanvas").width(LB_PaneSelectCanvasWidth);
    //$("#PaneSelectCanvas").height(LB_PaneSelectCanvasHeight);


    // Mouse button down event
    function handleMouseDown(e) {
        // Do nothing
    }


    // Mouse button up event
    function handleMouseUp(e) {
        lbUpdateAndRender("mouseUp");      // Handle mouse-clicks
    }


    // Mouse out of bounds
    function handleMouseOut(e) {
        // Do nothing
    }

    function handleMouseMove(e) {

        lbUpdateMousePosition(e);
        lbUpdateAndRender("mouseMove");
    }


    // The actual event handlers
    $("#PaneSelectCanvas").mousedown(function (e) { handleMouseDown(e); });
    $("#PaneSelectCanvas").mousemove(function (e) { handleMouseMove(e); });
    $("#PaneSelectCanvas").mouseup(function (e) { handleMouseUp(e); });
    $("#PaneSelectCanvas").mouseout(function (e) { handleMouseOut(e); });

    // Redirect to template gallery to select a template
    $("#btnSelectTemplate").click(function () { window.location.replace("/Template/Show"); });

    $("#btnPaneDimensionsUpdate").click(function () { lbUpdatePaneDimensions(); });
    $("#btnFrameDimensionsUpdate").click(function () { lbUpdateFrameDimensions(); });
    $("#btnProductUpdate").click(function () { lbUpdateProductData(); });
    $("#btnProductUpdateAll").click(function () { lbUpdateAllProductData(); });

    $("#btnUpdateUValue").click(function () { lbFinalizeUv(); });


    $("#btnNewWindow").click(function () { lbReloadTemplates("window"); });
    $("#btnNewDoor").click(function () { lbReloadTemplates("door"); });

    $("#btnNewEntryCancel").click(function () { editor.state = "neutral"; lbUpdateEditor(); });
    $("#btnNewEntryDone").click(function () { editor.state = "neutral"; lbAddEntry(); lbUpdateEditor(); });

    //$("#btnTestAreaParts").click(function () {
        //lbGetPaneAreaPartsExt(selector.selectedPane);         // Might not be needed here
    //    lbFinalizeUv();
    //});
    

    // Input change events
    // Not in use, probably wont be either
    //$("#paneWidth").change(function () { lbProjectInputChange(); });
    $("#productList").change(function () {
        //var id = document.getElementById("productList").value;
        lbChangeProduct();
        //var id = $("#productList").val();
        //alert("Product change! " + id);
    });
});

setInterval(function () { lbUpdateAndRender(""); }, 100);

