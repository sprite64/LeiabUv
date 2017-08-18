/*  Project Graphics
    
    Pritam Schönberger 2016, 2017

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Produkt - Product
        Mall    - Template
        Båge    - -
*/



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

    if (entry == undefined || selector == undefined) return;

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
    ctx.textBaseline = "top"

    ctx.fillStyle = "#333";

    // Render frame dimensions
    ctx.textAlign = "left";

    ctx.fillText("Karm: " + Math.round(entry.frameWidth) + "x" + Math.round(entry.frameHeight), 15, 350);
    //ctx.fillText("Karm: " + (Math.round(project.frameWidth * 1000.0) / 1000.0).toFixed(3) + "x" +
    //(Math.round(project.frameHeight * 1000.0) / 1000.0).toFixed(3), 15, 350);

    ctx.textAlign = "right";
    ctx.fillText("(mm)", 335, 350);

    // Render pane dimensions
    ctx.textAlign = "right";
    ctx.textBaseline = "top"

    var x = 0.0;
    var y = 0.0;

    var wText = "0.0";
    var hText = "0.0";
    var uText = "0.0";

    var postSize = selector.postSize;

    for (var i = 0; i < selector.nrOfPanes; i++) {

        // Get pane dimensions
        rect = lbGetSelectorPaneRect(i);

        // Render width / height *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***

        // Format dimensions
        wText = (Math.round(entry.panes[i].width * 10.0) / 10.0).toFixed(1);      // Round to one decimal
        hText = (Math.round(entry.panes[i].height * 10.0) / 10.0).toFixed(1);

        //wText = (Math.round(project.panes[i].width * 1000.0) / 1000.0).toFixed(3);
        //hText = (Math.round(project.panes[i].height * 1000.0) / 1000.0).toFixed(3);
        uText = (Math.round(entry.panes[i].ug * 1000.0) / 1000.0).toFixed(3);

        //hText = Math.round((project.panes[i].height * 1000.0) / 1000.0).toFixed(3);

        //var u = (project.panes[i].ug * 1000.0 / 1000.0).toFixed(3);
        //uText = u;          // For some reason, uText can't be formated the same way as wText and hText, but this works fine

        // Calc X
        if ((selector.panes[i].xIndex + selector.panes[i].colSpan - 1) == (selector.columns - 1)) {
            x = rect.x + rect.width - 3;
        } else {
            x = rect.x + rect.width - postSize - 3;
        }

        // Calc Y
        if (selector.panes[i].yIndex > 0) {
            y = rect.y + postSize + 2;
        } else {
            y = rect.y + 2;
        }

        // Render text background
        var tw = 2;
        if (wText.length >= hText.length) {
            tw = ctx.measureText(wText).width;
        } else {
            tw = ctx.measureText(hText).width;
        }

        ctx.fillStyle = "#ddd";
        ctx.fillRect(x - tw + 3 - 7, y - 2, tw + 7, 32);
        //ctx.fillRect(x - tw + 3, y - 2, tw, 32);

        // Render text
        ctx.fillStyle = "#333";
        ctx.fillText(wText + "", x, y);
        ctx.fillText(hText + "", x, y + 16);

        // Render Ug *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***

        // Calc X
        if (selector.panes[i].xIndex == 0) {
            x = rect.x;
        } else {
            x = rect.x + postSize;
        }
        /*
        if ((selector.panes[i].xIndex + selector.panes[i].colSpan - 1) == (selector.columns - 1)) {
            x = rect.x + rect.width - 3;
        } else {
            x = rect.x + rect.width - postSize - 3;
        }*/

        // Calc Y
        //if (selector.panes[i].yIndex > 0 && selector.panes[i].rowSpan > 1) {


        if (selector.panes[i].yIndex + selector.panes[i].rowSpan < selector.rows) {
            y = rect.y + rect.height - 14 - postSize;
        } else {
            y = rect.y + rect.height - 14;// + postSize + 2;
        }


        // Render text background
        tw = 2;
        tw = ctx.measureText(uText).width;

        tw += 20;

        ctx.fillStyle = "#ddd";
        ctx.fillRect(x, y - 2, tw + 7, 16);
        //ctx.fillRect(x - tw + 3, y - 2, tw, 32);

        // Render text
        ctx.fillStyle = "#333";
        ctx.fillText("Ug " + uText, x + tw + 3, y);
        //ctx.fillText(hText + "", x, y + 16);

        // Render product null or not
        // ... Code ...
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


function lbEntryRender() {

    if (entry == undefined || selector == undefined) return;

    var ctx = lbGetPaneSelectCanvasContext();

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, LB_PaneSelectCanvasWidth, LB_PaneSelectCanvasHeight);

    lbRenderSelectorFrame();
    lbRenderSelectorPanes();
    lbRenderSelectorPosts();

    lbRenderSelectorDebug()
}

