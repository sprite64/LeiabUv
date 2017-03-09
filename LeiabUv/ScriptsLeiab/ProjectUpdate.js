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


function lbGetFrameWidth() {

    if (project.frameWidth == Number.NaN) {
        project.frameWidth = 0.0;
    }

    return project.frameWidth;
}

function lbGetFrameHeight() {

    if (project.frameHeight == Number.NaN) {
        project.frameHeight = 0.0;
    }

    return project.frameHeight;
}



// Returns total of width array
// Used to calculate total widths/heights

// This seems to be totally unused, probably not needed anymore
function lbGetTotalArrayWidth() {

    var t = 0;
    for (var i = 0; i < project.columns; i++) {
        t += project.paneWidths[i];
    }

    return t;
}


// Returns pane width by width array
function lbGetTotalPaneWidth() {

    var id = selector.selectedPane;
    var t = 0.0;

    for (var i = project.panes[id].xIndex; i < project.panes[id].xIndex + project.panes[id].colSpan; i++) {
        t += parseFloat(project.paneWidths[i]);
    }

    return t;
}

function lbGetTotalPaneHeight() {

    var id = selector.selectedPane;
    var t = 0.0;

    for (var i = project.panes[id].yIndex; i < project.panes[id].yIndex + project.panes[id].rowSpan; i++) {
        t += parseFloat(project.paneHeights[i]);
    }

    return t;
}


// Returns delta between pane width and width array
// 
function lbGetPaneWidthDelta() {

    var id = selector.selectedPane;
    var t = lbGetTotalPaneWidth();

    return (project.panes[id].width - t);
}

function lbGetPaneHeightDelta() {

    var id = selector.selectedPane;
    var t = lbGetTotalPaneHeight();

    return (project.panes[id].height - t);
}


// Get oldest width array index from selected pane
function lbGetOldestSelectedPaneWidthArray() {

    var id = selector.selectedPane;
    var oldest = project.paneWidthAgeCounter + 1;
    var oldId = - 1;

    for (var i = project.panes[id].xIndex; i < project.panes[id].xIndex + project.panes[id].colSpan; i++) {
        if (project.paneWidthAge[i] < oldest) {
            oldest = project.paneWidthAge[i];
            oldId = i;
        }
    }

    return oldId;
}

function lbGetOldestSelectedPaneHeightArray() {
         
    var id = selector.selectedPane;
    var oldest = project.paneHeightAgeCounter + 1;
    var oldId = -1;

    for (var i = project.panes[id].yIndex; i < project.panes[id].yIndex + project.panes[id].rowSpan; i++) {
        if (project.paneHeightAge[i] < oldest) {
            oldest = project.paneHeightAge[i];
            oldId = i;
        }
    }

    return oldId;
}


// Get oldest width array index from unselected panes
function lbGetOldestUnselectedPaneWidthArray() {

    var id = selector.selectedPane;
    var oldest = project.paneWidthAgeCounter + 1;
    var oldId = - 1;

    // Find oldest unselected width array index
    for (var i = 0; i < project.columns; i++) {

        //if(i < project.panes[id].xIndex || i >= project.panes[id].xIndex + project.panes[id].colSpan) {
        if(i < project.panes[id].xIndex || i > project.panes[id].xIndex + project.panes[id].colSpan) {

            if(project.paneWidthAge[i] < oldest) {
                oldest = project.paneWidthAge[i];
                oldId = i;
            }
        }
    }

    return oldId;
}

function lbGetOldestUnselectedPaneHeightArray() {

    var id = selector.selectedPane;
    var oldest = project.paneHeightAgeCounter + 1;
    var oldId = - 1;

    // 
    for(var i = 0; i < project.rows; i ++) {

        if(i < project.panes[id].yIndex || i > project.panes[id].yIndex + project.panes[id].rowSpan) {

            if(project.paneHeightAge[i] < oldest) {
                oldest = project.paneHeightAge[i];
                oldId = i;
            }
        }
    }

    return oldId;
}


// Gets index of any oldest array width, // any as in selected or unselected
function lbGetAnyOldestPaneWidthArray() {

    //var id = -1;
    var oldest = project.paneWidthAgeCounter + 1;
    var oldId = -1;

    for (var i = 0; i < project.columns; i++) {

        if (project.paneWidthAge[i] < oldest) {
            oldest = project.paneWidthAge[i];
            oldId = i;
        }
    }

    return oldId;
}

function lbGetAnyOldestPaneHeightArray() {

    var oldest = project.paneHeightAgeCounter + 1;
    var oldId = -1;

    for (var i = 0; i < project.rows; i++) {

        if (project.paneHeightAge[i] < oldest) {
            oldest = project.paneHeightAge[i];
            oldId = i;
        }
    }

    return oldId;
}


// Updates pane width from recent changes in width array
// This runs last
function lbUpdatePaneWidthFromWidthArray() {

    var id = selector.selectedPane;
    var total = 0.0;

    for (var i = 0; i < project.nrOfPanes; i++) {

        for (var x = project.panes[i].xIndex; x < project.panes[i].xIndex + project.panes[i].colSpan; x ++) {
            total += project.paneWidths[x];
        }

        project.panes[i].width = total;
        total = 0.0;
    }
}


function lbUpdatePaneHeightFromHeightArray() {

    var id = selector.selectedPane;
    var total = 0.0;

    for (var i = 0; i < project.nrOfPanes; i++) {

        for (var y = project.panes[i].yIndex; y < project.panes[i].yIndex + project.panes[i].rowSpan; y++) {
            total += project.paneHeights[y];
        }

        project.panes[i].height = total;
        total = 0.0;
    }
}


// Update width/height arrays by panes width/height
function lbUpdatePanes() {

    // *** Update width data *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 

    // Update selected pane width
    var d = lbGetPaneWidthDelta();
    var oldId = lbGetOldestSelectedPaneWidthArray();

    //alert("Oldest pane: " + lbGetOldestSelectedPaneWidthArray());

    project.paneWidths[oldId] += d;
    project.paneWidthAge[oldId] = project.paneWidthAgeCounter;      // Update widths age
    project.paneWidthAgeCounter++;

    // Update unselected pane width
    oldId = lbGetOldestUnselectedPaneWidthArray();

    project.paneWidths[oldId] -= d;
    project.paneWidthAge[oldId] = project.paneWidthAgeCounter;
    project.paneWidthAgeCounter++;

    //alert("Oldest unselected: " + lbGetOldestUnselectedPaneWidthArray());

    // Update pane widths from width array
    lbUpdatePaneWidthFromWidthArray();

    // *** Update height data *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 

    // Update selected pane height
    d = lbGetPaneHeightDelta();
    oldId = lbGetOldestSelectedPaneHeightArray();

    project.paneHeights[oldId] += d;
    project.paneHeightAge[oldId] = project.paneHeightAgeCounter;
    project.paneHeightAgeCounter++;

    // Update unselected pane height
    oldId = lbGetOldestUnselectedPaneHeightArray();

    project.paneHeights[oldId] -= d;
    project.paneHeightAge[oldId] = project.paneHeightAgeCounter;
    project.paneHeightAgeCounter++;

    lbUpdatePaneHeightFromHeightArray()
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


// Function below and function above need to correct a NaN input error, if Nan then make it zero
// *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 

// Update changes made to frame dimensions
function lbProjectUpdateFrameDimensions() {

    // Correct NaN errors, fall back on previous values or return; and show 
    

    // *** Update width data *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    var id = lbGetAnyOldestPaneWidthArray();
    var delta = parseFloat($("#frameWidth").val().replace(",", ".")) - project.frameWidth;
    
    project.paneWidths[id] += delta;
    project.frameWidth += delta;

    project.paneWidthAge[id] = project.paneWidthAgeCounter;
    project.paneWidthAgeCounter++;

    lbUpdatePaneWidthFromWidthArray();

    // *** Update height data *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    id = lbGetAnyOldestPaneHeightArray();
    delta = parseFloat($("#frameHeight").val().replace(",", ".")) - project.frameHeight;

    project.paneHeights[id] += delta;
    project.frameHeight += delta;

    project.paneHeightAge[id] = project.paneHeightAgeCounter;
    project.paneHeightAgeCounter++;

    lbUpdatePaneHeightFromHeightArray();
}


function lbProjectUpdateAndRender(action) {

    lbProjectUpdate(action);
    lbProjectRender();
}

