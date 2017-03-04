/*  Project Update
    
    Pritam Schönberger 2016, 2017

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Profil  - Profile
        Mall    - Template
        Båge    - -
*/


/*
    Code to properly set values first. Then implement a system that limits/corrects values



*/


lbRenderSelectorFrame();


function lbGetInnerSelectorFrameRect() {

    var x = selector.frameSize;
    var y = selector.frameSize;

    var w = selector.paneSize * selector.columns + selector.columns + 1;
    var h = selector.paneSize * selector.rows + selector.rows + 1;

    var rect = new lbCreateRect(x, y, w, h);

    return rect;
}


function lbGetOuterSelectorFrameRect() {

    var rect = lbGetInnerSelectorFrameRect();

    var w = rect.width + selector.frameSize * 2 + 2;
    var h = rect.height + selector.frameSize * 2 + 2;

    var x = Math.round((LB_PaneSelectCanvasSize - w) * 0.5);
    var y = Math.round((LB_PaneSelectCanvasSize - h) * 0.5);

    rect.x = x;
    rect.y = y;

    rect.width = w;
    rect.height = h;

    return rect;
}


// Gets selector pane rectangle by index
function lbGetSelectorPaneRect(index) {

    var outerRect = lbGetOuterSelectorFrameRect();      // Get rectangels
    var innerRect = lbGetInnerSelectorFrameRect();

    var x = outerRect.x + innerRect.x + 2 + selector.paneSize * selector.panes[index].xIndex + selector.panes[index].xIndex;
    var y = outerRect.y + innerRect.y + 2 + selector.paneSize * selector.panes[index].yIndex + selector.panes[index].yIndex;

    var w = selector.paneSize * selector.panes[index].colSpan + selector.panes[index].colSpan - 1;
    var h = selector.paneSize * selector.panes[index].rowSpan + selector.panes[index].rowSpan - 1;

    var rect = new lbCreateRect(x, y, w, h);

    return rect;
}


// Update mouse position
function lbUpdateMousePosition(e) {

    if (selector == undefined) return;

    var mouseX = parseInt(e.clientX);                               // Get event data
    var mouseY = parseInt(e.clientY);

    var canvasOffset = $("#" + LB_PaneSelectCanvasId).offset();       // Get canvas element offset

    selector.mouseX = Math.round(mouseX - canvasOffset.left);                   // Update mouse position
    selector.mouseY = Math.round(mouseY - canvasOffset.top);                    // Using round because at some times mouseX will return a float

    //alert("Mouse: " + paneSelectorData.mouseX + ", " + paneSelectorData.mouseY);
}


function lbProjectUpdate(action) {          // action specifies what action to preform

    if (selector == undefined) return;

    switch (action) {

        case "mouseMove":

            // Find hover pane
            selector.hoverPane = -1;
            for (var i = 0; i < selector.nrOfPanes; i++) {
                
                var rect = lbGetSelectorPaneRect(i);
                
                if (selector.mouseX > rect.x && selector.mouseX <= rect.x + rect.width) {
                    if (selector.mouseY > rect.y && selector.mouseY <= rect.y + rect.height) {
                        selector.hoverPane = i;
                    }
                }
            }

            break;
        case "mouseUp":

            // Select pane
            if (selector.hoverPane != -1) {
                selector.selectedPane = selector.hoverPane;

                // Update measure input data
                var paneId = selector.selectedPane;

                $("#paneWidth").val(lbGetSelectedPaneWidth());
                $("#paneHeight").val(lbGetSelectedPaneHeight());
            }

            break;

        default:

            break;
    }
}

// Used in Create.cshtml to update input values
function lbGetSelectedPaneWidth() {

    var paneId = selector.selectedPane;
    return project.panes[paneId].width;
}


function lbGetSelectedPaneHeight() {

    var paneId = selector.selectedPane;
    return project.panes[paneId].height;
}


// Used to calculate total widths/heights
function lbGetTotalArrayWidth() {

    var t = 0;
    for (var i = 0; i < project.columns; i++) {
        t += project.paneWidths[i];
    }

    return t;
}


// Returns delta between pane width and array width
function lbGetTotalPaneWidth() {

    var id = selector.selectedPane;
    var t = 0.0;

    for (var i = project.panes[id].xIndex; i < project.panes[id].xIndex + project.panes[id].colSpan; i++) {
        t += parseFloat(project.paneWidths[i]);
        alert("in " + project.paneWidths[i]);
    }

    return t;
}


// Update width/height arrays by panes width/height
function lbUpdatePanes() {

    //lbGetTotalPaneWidth();

    alert("Pane: " + lbGetTotalPaneWidth() + " Array: " + lbGetTotalArrayWidth());
    //alert("Total array width: " + lbGetTotalArrayWidth());

}


// Runs on "Update" button hit
function lbProjectUpdatePaneDimensions() {

    var paneId = selector.selectedPane;                         // Selected pane ID

    project.panes[paneId].width = parseFloat($("#paneWidth").val().replace(",", "."));      // Set new widths/heights and replace
    project.panes[paneId].height = parseFloat($("#paneHeight").val().replace(",", "."));    // "," with "." to be float compatible

    $("#paneWidth").val(project.panes[paneId].width);           // Update input boxes to remove garbage values
    $("#paneHeight").val(project.panes[paneId].height);

    lbUpdatePanes();
}


function lbProjectUpdateAndRender(action) {

    lbProjectUpdate(action);
    lbProjectRender();
}

