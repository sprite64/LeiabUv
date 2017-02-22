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

                //selector.panes[paneId];

                //alert("Pane: " + paneId);
                //alert(selector.panes[paneId].xIndex);

                // This is gonna get tricky
                //alert($("#paneWidth").val().text());

                //$("#paneWidth").val(project.paneWidths[selector.panes[paneId].xIndex]);
                //$("#paneHeight").val(project.paneHeights[selector.panes[paneId].yIndex]);

                $("#paneWidth").val(lbGetSelectedPaneWidth());
                $("#paneHeight").val(lbGetSelectedPaneHeight());
                
                //project.paneWidths[selector.panes[i].xIndex] + " x"
                //ctx.fillText(project.paneHeights[selector.panes[i].xIndex] + " mm", rect.x + rect.width * 0.5, rect.y + rect.height * 0.5 + 16);

                //document.getElementById("paneWidth").textContent("hello");
                //document.getElementById("paneHeight");

                //pw.text("Hello");

                //project.paneWidths[];
                //project.paneHeights[];

            } else {
                selector.selectedPane = -1;
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

function lbGetSelectedPaneWidth() {
    return project.paneWidths[selector.panes[selector.selectedPane].xIndex];
}


function lbSetSelectedPaneHeight(n) {
    project.paneHeights[selector.panes[selector.selectedPane].yIndex] = n;
}

function lbGetSelectedPaneHeight() {
    return project.paneHeights[selector.panes[selector.selectedPane].yIndex];
}



function lbProjectUpdatePaneDimensions() {

    // This needs to take the width/height age into account
    // A functino for getting the active paneWidth/height would be usefull as well

    lbSetSelectedPaneWidth($("#paneWidth").val());
    lbSetSelectedPaneHeight($("#paneHeight").val());
    

}


function lbProjectUpdateAndRender(action) {

    lbProjectUpdate(action);
    lbProjectRender();
}

