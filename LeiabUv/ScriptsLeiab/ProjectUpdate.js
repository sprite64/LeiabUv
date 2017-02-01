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

    var x = paneSelectorData.frameSize;
    var y = paneSelectorData.frameSize;

    var w = paneSelectorData.paneSize * paneSelectorData.columns + paneSelectorData.columns + 1;
    var h = paneSelectorData.paneSize * paneSelectorData.rows + paneSelectorData.rows + 1;

    var rect = new lbCreateRect(x, y, w, h);

    return rect;
}


function lbGetOuterSelectorFrameRect() {

    var rect = lbGetInnerSelectorFrameRect();

    var w = rect.width + paneSelectorData.frameSize * 2 + 2;
    var h = rect.height + paneSelectorData.frameSize * 2 + 2;

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

    var x = outerRect.x + innerRect.x + 2 + paneSelectorData.paneSize * paneSelectorData.panes[index].xIndex + paneSelectorData.panes[index].xIndex;
    var y = outerRect.y + innerRect.y + 2 + paneSelectorData.paneSize * paneSelectorData.panes[index].yIndex + paneSelectorData.panes[index].yIndex;

    var w = paneSelectorData.paneSize * paneSelectorData.panes[index].colSpan + paneSelectorData.panes[index].colSpan - 1;
    var h = paneSelectorData.paneSize * paneSelectorData.panes[index].rowSpan + paneSelectorData.panes[index].rowSpan - 1;

    var rect = new lbCreateRect(x, y, w, h);

    return rect;
}


// Update mouse position
function lbUpdateMousePosition(e) {

    var mouseX = parseInt(e.clientX);                               // Get event data
    var mouseY = parseInt(e.clientY);

    var canvasOffset = $("#" + LB_PaneSelectCanvasId).offset();       // Get canvas element offset

    paneSelectorData.mouseX = Math.round(mouseX - canvasOffset.left);                   // Update mouse position
    paneSelectorData.mouseY = Math.round(mouseY - canvasOffset.top);                    // Using round because at some times mouseX will return a float

    //alert("Mouse: " + paneSelectorData.mouseX + ", " + paneSelectorData.mouseY);
}


function lbProjectUpdate(action) {          // action specifies what action to preform



    switch (action) {

        case "mouseMove":

            // Find hover pane
            paneSelectorData.hoverPane = -1;
            for (var i = 0; i < paneSelectorData.nrOfPanes; i++) {
                
                var rect = lbGetSelectorPaneRect(i);
                
                if(paneSelectorData.mouseX > rect.x && paneSelectorData.mouseX <= rect.x + rect.width) {
                    if(paneSelectorData.mouseY > rect.y && paneSelectorData.mouseY <= rect.y + rect.height) {
                        paneSelectorData.hoverPane = i;
                    }
                }
            }

            break;
        case "mouseUp":

            // Select pane
            if (paneSelectorData.hoverPane != -1) {
                paneSelectorData.selectedPane = paneSelectorData.hoverPane;
            } else {
                paneSelectorData.selectedPane = -1;
            }

            break;

        default:

            break;
    }
}


function lbProjectUpdateAndRender(action) {

    lbProjectUpdate(action);
    lbProjectRender();
}

