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
        lbProjectUpdateAndRender("mouseUp");      // Handle mouse-clicks
    }


    // Mouse out of bounds
    function handleMouseOut(e) {
        // Do nothing
    }

    function handleMouseMove(e) {

        lbUpdateMousePosition(e);
        lbProjectUpdateAndRender("mouseMove");
    }


    // The actual event handlers
    $("#PaneSelectCanvas").mousedown(function (e) { handleMouseDown(e); });
    $("#PaneSelectCanvas").mousemove(function (e) { handleMouseMove(e); });
    $("#PaneSelectCanvas").mouseup(function (e) { handleMouseUp(e); });
    $("#PaneSelectCanvas").mouseout(function (e) { handleMouseOut(e); });

    // Redirect to template gallery to select a template
    $("#btnSelectTemplate").click(function () { window.location.replace("/Template/Show"); });

    $("#btnPaneDimensionsUpdate").click(function () { lbProjectUpdatePaneDimensions(); });
    $("#btnFrameDimensionsUpdate").click(function () { lbProjectUpdateFrameDimensions(); });
    $("#btnProductUpdate").click(function () { lbProjectUpdateProductData(); });
    $("#btnProductUpdateAll").click(function () { lbProjectUpdateAllProductData(); });

    $("#btnUpdateUValue").click(function () { lbFinalizeUv(); });

    //$("#btnTestAreaParts").click(function () {
        //lbGetPaneAreaPartsExt(selector.selectedPane);         // Might not be needed here
    //    lbFinalizeUv();
    //});
    

    // Input change events
    // Not in use, probably wont be either
    //$("#paneWidth").change(function () { lbProjectInputChange(); });
    $("#productList").change(function () {
        //var id = document.getElementById("productList").value;
        lbProjectChangeProduct();
        //var id = $("#productList").val();
        //alert("Product change! " + id);
    });
});

setInterval(function () { lbProjectUpdateAndRender(""); }, 300);

