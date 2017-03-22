/*  Project Graphics
    
    Pritam Schönberger 2016, 2017

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Profil  - Profile
        Mall    - Template
        Båge    - -
*/




// Get HTML5 canvas object area
function lbGetProjectCanvas() {
    return document.getElementById(LB_ProjectCanvasId);
}


// Get canvas 2D context
function lbGetProjectCanvasContext() {
    var canvas = lbGetProjectCanvas();
    return canvas.getContext("2d");
}


// Get HTML5 canvas object area
function lbGetPaneSelectCanvas() {
    return document.getElementById(LB_PaneSelectCanvasId);
}


// Get canvas 2D context
function lbGetPaneSelectCanvasContext() {
    var canvas = lbGetPaneSelectCanvas();
    return canvas.getContext("2d");
}



function lbRenderSelectorFrame() {

    if (selector == undefined) return;        // Escape if paneSelectData isn't available

    var ctx = lbGetPaneSelectCanvasContext();

    var innerRect = lbGetInnerSelectorFrameRect();
    var outerRect = lbGetOuterSelectorFrameRect();

    // Render outer rect, frame size and inner rect
    ctx.fillStyle = "#000";
    ctx.fillRect(outerRect.x, outerRect.y, outerRect.width, outerRect.height);

    ctx.fillStyle = "#ccc";
    ctx.fillRect(outerRect.x + 1, outerRect.y + 1, outerRect.width - 2, outerRect.height - 2);

    // Render inner frame
    ctx.fillStyle = "#333";
    ctx.fillRect(innerRect.x + outerRect.x + 1, innerRect.y + outerRect.y + 1, innerRect.width, innerRect.height);

    // Render seperate horizontal frame border lines
    ctx.strokeStyle = "#000";
    //ctx.lineWidth = 1;
    
    ctx.moveTo(outerRect.x, outerRect.y + innerRect.y + 1 + 0.5);
    ctx.lineTo(outerRect.x + outerRect.width, outerRect.y + innerRect.y + 1 + 0.5);
    ctx.stroke();

    ctx.moveTo(outerRect.x, outerRect.y + outerRect.height - (innerRect.y + 2) + 0.5)
    ctx.lineTo(outerRect.x + outerRect.width, outerRect.y + outerRect.height - (innerRect.y + 2) + 0.5)
    ctx.stroke();
}


function lbRenderSelectorPanes() {

    var ctx = lbGetPaneSelectCanvasContext();

    var rect = new lbCreateRect(0, 0, 0, 0);

    for (var i = 0; i < selector.nrOfPanes; i++) {

        rect = lbGetSelectorPaneRect(i);

        ctx.fillStyle = "#fff";
        if (selector.hoverPane == i) {                  // Hovered pane
            ctx.fillStyle = "#ffa";
        } else if (selector.selectedPane == i) {        // Selected pane
            ctx.fillStyle = "#aaf";
        }

        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    }
}


function lbRenderSelectorDebug() {

    var ctx = lbGetPaneSelectCanvasContext();

    var rect = new lbCreateRect(0, 0, 0, 0);

    ctx.font = "12px Arial";
    ctx.fillStyle = "#333";
    
    // Render frame dimensions
    ctx.textAlign = "left";
    ctx.fillText("Karm: " + project.frameWidth + "x" + project.frameHeight + " mm", 15, 10);

    // Render pane dimensions
    ctx.textAlign = "center";
    for (var i = 0; i < selector.nrOfPanes; i++) {

        rect = lbGetSelectorPaneRect(i);

        ctx.fillText(project.panes[i].width + " x", rect.x + rect.width * 0.5, rect.y + rect.height * 0.5);
        ctx.fillText(project.panes[i].height + " mm", rect.x + rect.width * 0.5, rect.y + rect.height * 0.5 + 16);
    }

    // Render width/height ages
    /*
    ctx.textAlign = "left";
    //ctx.fillText("Ålder", 15, 40);
    for (var x = 0; x < project.columns; x++) {
        ctx.fillText(project.paneWidthAge[x], x * selector.paneSize + selector.paneSize * 0.5, 52);
        ctx.fillText(project.paneWidths[x], x * selector.paneSize + selector.paneSize * 0.5, 62);
    }

    for (var y = 0; y < project.rows; y++) {
        ctx.fillText(project.paneHeightAge[y], 5, y * selector.paneSize + selector.paneSize * 0.5 + 60);
        ctx.fillText(project.paneHeights[y], 5, y * selector.paneSize + selector.paneSize * 0.5 + 70);
    }
    */
}

/*
function lbPaneData(xIndex, yIndex, colSpan, rowSpan, width, height) {

    this.xIndex = xIndex;           // Position indices
    this.yIndex = yIndex;

    this.colSpan = colSpan;         // Spans
    this.rowSpan = rowSpan;

    this.width;                     // Dimensions in millimeters
    this.height;
}*/


function lbRenderSelectorPosts() {

    var ctx = lbGetPaneSelectCanvasContext();

    var rect = undefined;
    var rectPost = new lbCreateRect(0, 0, 0, 0);
    var postSize = selector.postSize;

    for (var i = 0; i < selector.nrOfPanes; i++) {

        rect = lbGetSelectorPaneRect(i);

        

        // Top
        rectPost.x = rect.x;
        rectPost.y = rect.y;
        rectPost.width = rect.width;
        rectPost.height = postSize;

        if (selector.panes[i].yIndex > 0) {
            ctx.fillStyle = "#333";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width, rectPost.height);
            ctx.fillStyle = "#ccc";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width, rectPost.height - 1);
        }

        // Bottom
        rectPost.y = rect.y + rect.height - postSize;

        if (selector.panes[i].yIndex + selector.panes[i].rowSpan < selector.rows) {
            ctx.fillStyle = "#333";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width, rectPost.height);
            ctx.fillStyle = "#ccc";
            ctx.fillRect(rectPost.x, rectPost.y + 1, rectPost.width, rectPost.height - 1);
        }

        // Left
        rectPost.x = rect.x;
        rectPost.y = rect.y;
        rectPost.width = postSize;
        rectPost.height = rect.height;

        if (selector.panes[i].xIndex > 0) {
            ctx.fillStyle = "#333";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width, rectPost.height);
            ctx.fillStyle = "#ccc";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width - 1, rectPost.height);
        }

        // Right
        rectPost.x = rect.x + rect.width - postSize;

        if (selector.panes[i].xIndex + selector.panes[i].colSpan < selector.columns) {
            ctx.fillStyle = "#333";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width, rectPost.height);
            ctx.fillStyle = "#ccc";
            ctx.fillRect(rectPost.x + 1, rectPost.y, rectPost.width - 1, rectPost.height);
        }
    }

}


function lbProjectRender() {

    if (selector == undefined) return;

    var ctx = lbGetPaneSelectCanvasContext();

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, LB_PaneSelectCanvasWidth, LB_PaneSelectCanvasHeight);

    lbRenderSelectorFrame();
    lbRenderSelectorPanes();
    lbRenderSelectorPosts();

    lbRenderSelectorDebug()

    // Dummy render
    ctx = lbGetProjectCanvasContext()

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 534, 534);
}

