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

    if (paneSelectorData == undefined) return;        // Escape if paneSelectData isn't available
    
    var ctx = lbGetPaneSelectCanvasContext();

    var rect = lbGetOuterSelectorFrameRect();

    var xOuter = rect.x + 1;
    var yOuter = rect.y + 1;

    ctx.fillStyle = "#000";
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    ctx.fillStyle = "#ccc";
    ctx.fillRect(rect.x + 1, rect.y + 1, rect.width - 2, rect.height - 2);

    rect = lbGetInnerSelectorFrameRect();               // Render inner frame

    ctx.fillStyle = "#333";
    ctx.fillRect(rect.x + xOuter, rect.y + yOuter, rect.width, rect.height);

}


function lbRenderSelectorPanes() {

    var ctx = lbGetPaneSelectCanvasContext();

    var rect = new lbCreateRect(0, 0, 0, 0);

    for (var i = 0; i < paneSelectorData.nrOfPanes; i++) {

        rect = lbGetSelectorPaneRect(i);

        ctx.fillStyle = "#fff";
        if (paneSelectorData.hoverPane == i) {                  // Hovered pane
            ctx.fillStyle = "#ffa";
        } else if (paneSelectorData.selectedPane == i) {        // Selected pane
            ctx.fillStyle = "#aaf";
        }

        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    }
}


function lbRenderSelectorPosts() {

    var ctx = lbGetPaneSelectCanvasContext();

    var rect = undefined;
    var rectPost = new lbCreateRect(0, 0, 0, 0);
    var postSize = paneSelectorData.postSize;

    for (var i = 0; i < paneSelectorData.nrOfPanes; i++) {

        rect = lbGetSelectorPaneRect(i);

        // Left
        rectPost.x = rect.x;
        rectPost.y = rect.y;
        rectPost.width = postSize;
        rectPost.height = rect.height;

        if (paneSelectorData.panes[i].xIndex > 0) {
            ctx.fillStyle = "#333";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width, rectPost.height);
            ctx.fillStyle = "#ccc";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width - 1, rectPost.height);
        }
        
        // Right
        rectPost.x = rect.x + rect.width - postSize;
        
        if (paneSelectorData.panes[i].xIndex + paneSelectorData.panes[i].colSpan < paneSelectorData.columns) {
            ctx.fillStyle = "#333";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width, rectPost.height);
            ctx.fillStyle = "#ccc";
            ctx.fillRect(rectPost.x + 1, rectPost.y, rectPost.width - 1, rectPost.height);
        }
        
        // Top
        rectPost.x = rect.x;
        rectPost.y = rect.y;
        rectPost.width = rect.width;
        rectPost.height = postSize;

        if (paneSelectorData.panes[i].yIndex > 0) {
            ctx.fillStyle = "#333";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width, rectPost.height);
            ctx.fillStyle = "#ccc";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width, rectPost.height - 1);
        }
        
        // Bottom
        rectPost.y = rect.y + rect.height - postSize;

        if (paneSelectorData.panes[i].yIndex + paneSelectorData.panes[i].rowSpan < paneSelectorData.rows) {
            ctx.fillStyle = "#333";
            ctx.fillRect(rectPost.x, rectPost.y, rectPost.width, rectPost.height);
            ctx.fillStyle = "#ccc";
            ctx.fillRect(rectPost.x, rectPost.y + 1, rectPost.width, rectPost.height - 1);
        }
    }

}



function lbProjectRender() {

    if (paneSelectorData == undefined) return;

    var ctx = lbGetPaneSelectCanvasContext();

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, LB_PaneSelectCanvasWidth, LB_PaneSelectCanvasHeight);

    lbRenderSelectorFrame();
    lbRenderSelectorPanes();
    lbRenderSelectorPosts();

    // Dummy render
    ctx = lbGetProjectCanvasContext()

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 534, 534);
}

