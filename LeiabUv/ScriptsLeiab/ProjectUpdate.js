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


// Functions for setting/getting values of the width/height arrays
function lbSetSelectedPaneWidth(n) {
    project.paneWidths[selector.panes[selector.selectedPane].xIndex] = n;
}

function lbSetPaneWidth(id, n) {
    project.paneHeights[id] = n;
}

function lbGetSelectedPaneWidth() {

    var id = selector.selectedPane;
    var n = 0;
    if (selector.panes[id].colSpan > 1) {
        for (var x = 0; x < selector.panes[id].colSpan; x++) {
            n += parseInt(project.paneWidths[selector.panes[id].xIndex + x]);
        }
    } else {
        return project.paneWidths[selector.panes[selector.selectedPane].xIndex];
    }

    return n;
}

function lbSetSelectedPaneHeight(n) {
    project.paneHeights[selector.panes[selector.selectedPane].yIndex] = n;
}

function lbSetPaneHeight(id, n) {
    project.paneHeights[id] = n;
}

function lbGetSelectedPaneHeight() {
    var id = selector.selectedPane;
    var n = 0;
    if (selector.panes[id].rowSpan > 1) {
        for (var y = 0; y < selector.panes[id].rowSpan; y++) {
            n += parseInt(project.paneHeights[selector.panes[id].yIndex + y]);
        }
    } else {
        return project.paneHeights[selector.panes[selector.selectedPane].yIndex];
    }

    return n;
}


// Functions for getting width/height pane indexes.
function lbGetSelectedPaneWidthIndex() {
    return selector.panes[selector.selectedPane].xIndex;
}

function lbGetSelectedPaneHeightIndex() {
    return selector.panes[selector.selectedPane].yIndex;
}


// 

function lbGetTotalPaneWidth() {
    var n = 0;
    for (var x = 0; x < project.columns; x++) {
        n += parseInt(project.paneWidths[x]);
    }
    return n;
}

function lbGetTotalPaneHeight() {
    var n = 0;
    for (var y = 0; y < project.rows; y++) {
        n += parseInt(project.paneHeights[y]);
    }
    return n;
}

function lbWidthIndexIsSelected(i) {
    if (selector.panes[selector.selectedPane].xIndex == i) {
        return true;
    }
    return false;
}

function lbHeightIndexIsSelected(i) {
    if (selector.panes[selector.selectedPane].yIndex == i) {
        return true;
    }
    return false;
}

function lbGetSelectedWidthIndex() {
    return selector.panes[selector.selectedPane].xIndex;
}

function lbGetSelectedHeightIndex() {
    return selector.panes[selector.selectedPane].yIndex;
}

function lbGetYoungestWidth() {

    var i = 0;
    var yid = project.paneWidthAgeCounter + 1;

    for (var x = 0; x < project.columns; x++) {

        // Another condition is if the index is that of a selected pane
        if (project.paneWidthAge[x] < yid) {
            if(!lbWidthIndexIsSelected(x)) {
                yid = project.paneWidthAge[x];
                i = x;
            }
        }
    }

    return i;
}

function lbGetYoungestHeight() {

    var i = 0;
    var yid = project.paneHeightAgeCounter + 1;

    for (var y = 0; y < project.rows; y++) {

        if (project.paneHeightAge[y] < yid) {
            if (!lbHeightIndexIsSelected(y)) {
                yid = project.paneHeightAge[y];
                i = y;
            }
        }
    }

    return i;
}

// Selecting spanned panes need to set appropriate input values when selected
// 
// 
// 

function lbUpdatePaneDimensions() {


    // Correct pane dimensions by frame width
    var n = lbGetTotalPaneWidth();
    var r = 0;
    for (var y = 0; y < project.rows; y++) {


        // Row is longer than frame width *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
        if (n > project.frameWidth) {

            r = n - project.frameWidth;

            // Recalculate widths according to pane dimension ages
            while (r != 0) {

                // Find youngest pane
                var i = lbGetYoungestWidth();

                //alert("R: " + r);
                // Adjust youngest pane width
                project.paneWidths[i] -= r;

                // Update altered pane age
                project.paneWidthAgeCounter++;
                project.paneWidthAge[i] = project.paneWidthAgeCounter;

                // Update selected pane age
                project.paneWidthAgeCounter++;
                project.paneWidthAge[lbGetSelectedWidthIndex()] += project.paneWidthAgeCounter;

                //project.panes[].width = project.paneWidths[i];

                r = 0;          // This is temporary, r should be calculated for other panes until it's zero, hence the while loop
            }

            //alert("Row " + y + " (" + n + ") is more than frame width (" + project.frameWidth + ")");
        }


        // Row is shorter than frame width *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
        if (n < project.frameWidth) {

            // Because this is not implemented yet, a lesser size than the frame will screw up values to be smaller than the frame itself

            alert("Row " + y + " (" + n + ") is less than frame width (" + project.frameWidth + ")");
        }

        //alert("Frame width: " + n);
        n = lbGetTotalPaneWidth();
    }


    // 
    for (var i = 0; i < project.nrOfPanes; i++) {

        // Set single column pane width
        if(project.panes[i].colSpan == 1) {
            project.panes[i].width = project.paneWidths[project.panes[i].xIndex];
        }


        // Set single row pane height
        if(project.panes[i].rowSpan == 1) {
            project.panes[i].height = project.paneHeights[project.panes[i].yIndex];
        }

        // Calculate colSpan panes
        var h = 0;
        if (project.panes[i].colSpan > 1) {
            //for (var x = project.panes[i].xIndex; x < project.panes[i].colSpan; x++) {
            for (var x = 0; x < project.panes[i].colSpan; x++) {
                h += parseInt(project.paneWidths[project.panes[i].xIndex + x]);          // Might need to use parseFloat isntead
            }

            project.panes[i].width = h;
        }

        // Calculate rowSpan panes *** untested
        var w = 0;
        if (project.panes[i].rowSpan > 1) {
            //for (var y = project.panes[i].yIndex; y < project.panes[i].rowSpan; y++) {
            for (var y = 0; y < project.panes[i].rowSpan; y++) {
                w += parseInt(project.paneHeights[project.panes[i].yIndex + y]);          // Might need to use parseFloat isntead
            }

            project.panes[i].height = w;
        }
    }

    

}


function lbProjectUpdatePaneDimensions() {

    // This needs to take the width/height age into account
    // A functino for getting the active paneWidth/height would be usefull as well

    lbSetSelectedPaneWidth($("#paneWidth").val());
    lbSetSelectedPaneHeight($("#paneHeight").val());
    
    lbUpdatePaneDimensions();
}


function lbProjectUpdateAndRender(action) {

    lbProjectUpdate(action);
    lbProjectRender();
}

