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

    //var x = Math.round((LB_PaneSelectCanvasSize - w) * 0.5);
    //var y = Math.round((LB_PaneSelectCanvasSize - h) * 0.5);

    var w = paneSelectorData.paneSize * paneSelectorData.columns + paneSelectorData.columns + 1;
    var h = paneSelectorData.paneSize * paneSelectorData.rows + paneSelectorData.rows + 1;

    var rect = new lbCreateRect(x, y, w, h);

    /*
    rect.x += paneSelectorData.frameSize;
    rect.y += paneSelectorData.frameSize;

    rect.width -= paneSelectorData.frameSize * 2;
    rect.height -= paneSelectorData.frameSize * 2;
    */

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


// Returns a rect object with the outer frame rectangle of the selector canvas
function lbGetOuterSelectorFrameRect2() {

    if (paneSelectorData == undefined)
        return;

    var w = paneSelectorData.frameSize * 2 + paneSelectorData.paneSize * paneSelectorData.columns + paneSelectorData.columns - 1;
    var h = paneSelectorData.frameSize * 2 + paneSelectorData.paneSize * paneSelectorData.rows + paneSelectorData.rows - 1;

    var x = Math.round((LB_PaneSelectCanvasSize - w) * 0.5);
    var y = Math.round((LB_PaneSelectCanvasSize - h) * 0.5);

    //alert("Outer: " + x + ", " + y + ", " + w + ", " + h);

    var rect = new lbCreateRect(x, y, w, h);

    return rect;
}


// Returns a rect object with the inner frame rectangle of the selector canvas
function lbGetInnerSelectorFrameRect2() {

    var rect = lbGetOuterSelectorFrameRect();

    rect.x += paneSelectorData.frameSize;
    rect.y += paneSelectorData.frameSize;

    rect.width -= paneSelectorData.frameSize * 2;
    rect.height -= paneSelectorData.frameSize * 2;

    //alert("Inner: " + rect.x + ", " + rect.y + ", " + rect.width + ", " + rect.height);

    //ctx.fillRect(x + paneSelectorData.frameSize, y + paneSelectorData.frameSize,
    //    w - paneSelectorData.frameSize * 2, h - paneSelectorData.frameSize * 2);

    return rect;
}







function lbProjectUpdate(action) {          // action specifies what action to preform

    switch (action) {

        default:

            break;
    }
}


function lbProjectUpdateAndRender() {

    lbProjectUpdate("");
    lbProjectRender();
}

