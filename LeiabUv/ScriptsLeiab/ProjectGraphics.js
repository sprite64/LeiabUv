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



function lbRenderFrame() {

    if(paneSelectorData == undefined) return;       // Escape if paneSelectData isn't available

    var ctx = lbGetPaneSelectCanvasContext();


    //ctx.fillStyle = "#f00";
    //ctx.fillRect(10, 10, 20, 20);

    

    // Render frame
    var x = LB_PaneSelectMargin;
    var y = LB_PaneSelectMargin;

    var w = LB_PaneSelectCanvasWidth;
    var h = LB_PaneSelectCanvasHeight;

    
    ctx.fillStyle = "#000";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "#ccc";
    ctx.fillRect(x + 1, y + 1, w - 2, h - 2);

    ctx.fillStyle = "#444";
    ctx.fillRect(x + );

    // Render panes
    ctx.fillStyle = "#0f0";
    for (var i = 0; i < paneSelectorData.nrOfPanes; i++) {
        
        //var x = LB_PaneSelectMargin + paneSelectorData.panes[i].xIndex * paneSelectorData.paneSize + 1;
        //var y = LB_PaneSelectMargin + paneSelectorData.panes[i].yIndex * paneSelectorData.paneSize + 1;
        //var w = 0;
        //var h = 0;

        var x = LB_PaneSelectMargin + paneSelectorData.frameSize + paneSelectorData.panes[i].xIndex * paneSelectorData.paneSize + paneSelectorData.panes[i].xIndex;
        var y = LB_PaneSelectMargin + paneSelectorData.frameSize + paneSelectorData.panes[i].yIndex * paneSelectorData.paneSize + paneSelectorData.panes[i].yIndex;

        ctx.fillRect(x, y, paneSelectorData.paneSize, paneSelectorData.paneSize);
        
        //ctx.fillRect(paneSelectorData.panes[i].xIndex, y + paneSelectorData.panes[i].yIndex, paneSelectorData.paneSize, paneSelectorData.paneSize);
        //ctx.fillRect(x + paneSelectorData.panes[i].xIndex, y + paneSelectorData.panes[i].yIndex, paneSelectorData.paneSize, paneSelectorData.paneSize);

        // Create a lbGetPaneRect(paneIndex) function
    }

    //ctx.fillStyle = gfxSettings.frameBorderColor;
    //ctx.fillRect(gfxSettings.offsetX + outerRect.x, gfxSettings.offsetY + outerRect.y, outerRect.width, outerRect.height);
}


function lbProjectRender() {

    if (paneSelectorData == undefined) return;

    var ctx = lbGetPaneSelectCanvasContext();

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, LB_PaneSelectCanvasWidth, LB_PaneSelectCanvasHeight);

    lbRenderFrame();

}

