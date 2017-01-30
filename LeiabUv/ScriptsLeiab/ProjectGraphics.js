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

    if (paneSelectorData == undefined) {        // Escape if paneSelectData isn't available
        //alert("paneselector is undefined ");
        return;
    }

    var ctx = lbGetPaneSelectCanvasContext();

    // Dummy rectangle
    //ctx.fillStyle = "#f00";
    //ctx.fillRect(paneSelectorData.xOffset, paneSelectorData.yOffset, 20, 20);

    //alert("Rendering frame!");

    // Render frame
    /*
    var x = paneSelectorData.xOffset;
    var y = paneSelectorData.yOffset;

    var w = paneSelectorData.frameSize * 2 + paneSelectorData.paneSize * paneSelectorData.columns + paneSelectorData.columns - 1;
    var h = paneSelectorData.frameSize * 2 + paneSelectorData.paneSize * paneSelectorData.rows + paneSelectorData.rows - 1;

    */

    var rect = lbGetOuterSelectorFrameRect();

    var x2 = rect.x + 1;            // This should be rewritten, it's a bit confusing but solves the problem of centering frames and borders
    var y2 = rect.y + 1;

    ctx.fillStyle = "#000";
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    ctx.fillStyle = "#ccc";
    ctx.fillRect(rect.x + 1, rect.y + 1, rect.width - 2, rect.height - 2);

    rect = lbGetInnerSelectorFrameRect();

    ctx.fillStyle = "#333";
    ctx.fillRect(rect.x + x2, rect.y + y2, rect.width, rect.height);


    // Render panes
    //ctx.fillStyle = "#0f0";
    //for (var i = 0; i < paneSelectorData.nrOfPanes; i++) {
        
        //var x = LB_PaneSelectMargin + paneSelectorData.panes[i].xIndex * paneSelectorData.paneSize + 1;
        //var y = LB_PaneSelectMargin + paneSelectorData.panes[i].yIndex * paneSelectorData.paneSize + 1;
        //var w = 0;
        //var h = 0;

        /*
        var x = LB_PaneSelectMargin + paneSelectorData.frameSize + paneSelectorData.panes[i].xIndex * paneSelectorData.paneSize + paneSelectorData.panes[i].xIndex;
        var y = LB_PaneSelectMargin + paneSelectorData.frameSize + paneSelectorData.panes[i].yIndex * paneSelectorData.paneSize + paneSelectorData.panes[i].yIndex;

        ctx.fillRect(x, y, paneSelectorData.paneSize, paneSelectorData.paneSize);
        */
        
        //ctx.fillRect(paneSelectorData.panes[i].xIndex, y + paneSelectorData.panes[i].yIndex, paneSelectorData.paneSize, paneSelectorData.paneSize);
        //ctx.fillRect(x + paneSelectorData.panes[i].xIndex, y + paneSelectorData.panes[i].yIndex, paneSelectorData.paneSize, paneSelectorData.paneSize);

        // Create a lbGetPaneRect(paneIndex) function
    //}

    //ctx.fillStyle = gfxSettings.frameBorderColor;
    //ctx.fillRect(gfxSettings.offsetX + outerRect.x, gfxSettings.offsetY + outerRect.y, outerRect.width, outerRect.height);
}


function lbRenderSelectorPanes() {


    var ctx = lbGetPaneSelectCanvasContext();

    // Get inner selector frame
    var rect = lbGetInnerSelectorFrameRect();
    //rect2 = lbGetOuterSelectorFrameRect();

    // Render panes
    ctx.fillStyle = "#0f0";

    var h = paneSelectorData.paneSize;
    var w = paneSelectorData.paneSize;

    var rect2 = lbGetOuterSelectorFrameRect();

    var x2 = rect2.x + 1;           // This should be rewritten, it's a bit confusing but solves the problem of centering frames and borders
    var y2 = rect2.y + 1;

    // Dummy pane render
    for (var x = 0; x < paneSelectorData.columns; x++) {
        for (var y = 0; y < paneSelectorData.rows; y++) {
            ctx.fillRect(x2 + 1 + rect.x + x + x * paneSelectorData.paneSize, y2 + 1 + rect.y + y + y * paneSelectorData.paneSize, paneSelectorData.paneSize, paneSelectorData.paneSize);
        }
    }



    /*
    for (var i = 0; i < paneSelectorData.nrOfPanes; i++) {

        var x = rect.x + 1;
        var y = rect.y + 1;

        

        ctx.fillRect(x, y, w, h);
    } */
}


function lbProjectRender() {

    if (paneSelectorData == undefined) return;

    var ctx = lbGetPaneSelectCanvasContext();

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, LB_PaneSelectCanvasWidth, LB_PaneSelectCanvasHeight);

    lbRenderSelectorFrame();
    lbRenderSelectorPanes();
}

