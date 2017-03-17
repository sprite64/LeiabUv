/*  Template Init
    
    Pritam Schönberger 2016, 2017

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Profil  - Profile
        Mall    - Template
        Båge    - -
*/



// JQuery Ready/Initiation
$(function () {


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

    // Input change events
    // Not in use, probably wont be either
    $("#paneWidth").change(function () { lbProjectInputChange(); });

});

setInterval(function () { lbProjectUpdateAndRender(""); }, 300);

