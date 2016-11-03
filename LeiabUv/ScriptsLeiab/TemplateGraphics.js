/*  Template Graphics
    
    Pritam Schönberger 2016

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Profil  - Profile
        Mall    - Template
        Båge    - -
*/


// Get HTML5 canvas object area
function lbGetTemplateCanvas() {
    return document.getElementById(LB_TemplateCanvasId);
}


// Get canvas 2D context
function lbGetTemplateCanvasContext() {
    var canvas = lbGetTemplateCanvas();
    return canvas.getContext("2d");
}


// lbRender Frame/Karm
function lbRenderFrame(template) {

    // Init
    var ctx = lbGetTemplateCanvasContext();

    var outerRect = lbGetOuterFrameRect(template);
    var innerRect = lbGetInnerFrameRect(template);

    // Draw outer rect
    ctx.fillStyle = LB_FrameBorderColor;
    ctx.fillRect(template.offsetX + outerRect.x, template.offsetY + outerRect.y, outerRect.w, outerRect.h);

    // Draw inner rect
    ctx.fillStyle = LB_BackgroundColor;
    ctx.fillRect(template.offsetX + innerRect.x, template.offsetY + innerRect.y, innerRect.w, innerRect.h);

    // Draw main border
    ctx.fillStyle = LB_FrameBackgroundColor;

    var x = 1; var y = 1; 										// Init for horizontal main borders
    var w = outerRect.w - 2; var h = template.mainBorderSize;

    ctx.fillRect(template.offsetX + x, template.offsetY + y, w, h); 				// Top main border

    y += innerRect.h + template.mainBorderSize + 2; 				// Bottom main border
    ctx.fillRect(template.offsetX + x, template.offsetY + y, w, h);

    x = 1; y = template.mainBorderSize + 2; 						// Init for vertical main borders
    w = template.mainBorderSize; h = innerRect.h;

    ctx.fillRect(template.offsetX + x, template.offsetY + y, w, h); 				// Left main border

    x = outerRect.w - (template.mainBorderSize + 1); 				// Right main border
    ctx.fillRect(template.offsetX + x, template.offsetY + y, w, h);
}


// Render Posts/Poster
function lbRenderPosts(template) {

    // Init
    var ctx = lbGetTemplateCanvasContext();
    ctx.fillStyle = LB_PostBackgroundColor;

    var rect;

    var offsetX = template.mainBorderSize + 2 + template.offsetX;
    var offsetY = template.mainBorderSize + 2 + template.offsetY;

    var tmpX;
    var tmpY;
    var tmpW;
    var tmpH;

    // Loop through all cells
    for (var ny = 0; ny < template.rows; ny++) {
        for (var nx = 0; nx < template.cols; nx++) {

            // Only lbRender parent cells
            if (lbIsParent(template, nx, ny) == true) {

                //var tmpSpan = lbGetParentSpanSize(model, nx, ny);

                var tmpSX = template.cols;
                var tmpSY = template.rows;

                //alert("TmpSpan " + tmpSpan.x + ", " + tmpSpan.y);

                rect = lbGetPaneRect(template, nx, ny);

                // lbRender left & right borders
                // model.cellBorderSize


                //ctx.fillStyle = "#faf";

                tmpX = offsetX + rect.x; 							// Left border
                tmpW = template.cellBorderSize;

                tmpY = offsetY + rect.y;
                tmpH = rect.h - template.cellBorderSize * 0;

                if (nx > 0 && nx < template.cols) { ctx.fillRect(tmpX, tmpY, tmpW, tmpH); }


                //ctx.fillStyle = "#aaf"; 							// Right border ****

                tmpX += rect.w - template.cellBorderSize;

                if (nx >= 0 && nx < template.cols - template[nx][ny].colSpan) {



                    //if(nx + tmpSpan.x < model.colSpan) { 			// Extra border adjustment
                    ctx.fillRect(tmpX, tmpY, tmpW, tmpH);
                    //}
                }



                //ctx.fillStyle = "#aff"; 			 				// Top border

                tmpX = rect.x + offsetX;
                tmpW = rect.w;

                tmpY = offsetY + rect.y;
                tmpH = template.cellBorderSize;

                if (ny > 0 && ny <= template.rows) { ctx.fillRect(tmpX, tmpY, tmpW, tmpH); }

                //ctx.fillStyle = "#faa"; 							// Bottom border ****

                tmpY += rect.h - template.cellBorderSize;

                //if(nx >= 0 && nx < model.cols - model[nx][ny].colSpan) {
                if (ny >= 0 && ny < template.rows - template[nx][ny].rowSpan) {
                    ctx.fillRect(tmpX, tmpY, tmpW, tmpH);
                }
            }
        }
    }

}


// Render Pane grid
function lbRenderPaneGrid(template) {

    // Init
    var ctx = lbGetTemplateCanvasContext();

    var innerRect = lbGetInnerFrameRect(template);

    var x = template.offsetX + innerRect.x + 0.5;
    var y = template.offsetY + innerRect.y;

    var w = x;
    var h = y + innerRect.h;

    var span = 0;

    ctx.strokeStyle = LB_PaneGridColor;
    ctx.lineWidth = 1;

    for (var gx = 1; gx < template.cols; gx++) { 				// lbRender verticals

        span = lbGetPaneXSplit(template, gx - 1);

        ctx.beginPath();
        ctx.moveTo(x + span, y);
        ctx.lineTo(x + span, h);
        ctx.stroke();
    }

    y += 0.5;
    w = x + innerRect.w - 1;
    h = y;

    for (var gy = 1; gy < template.rows; gy++) { 				// lbRender horizontals

        span = lbGetPaneYSplit(template, gy - 1);

        ctx.beginPath();
        ctx.moveTo(x, y + span);
        ctx.lineTo(w, h + span);
        ctx.stroke();
    }
}


// Render select and hover Panes
function lbRenderActivePanes(template) {

    // Init
    var ctx = lbGetTemplateCanvasContext();
    var rect = lbCreateRect(0, 0, 0, 0);
    var tmpRect = lbCreateRect(0, 0, 0, 0);

    var x = 0; var y = 0;

    // lbRender hovered pane
    if (template.hovering == true && template.hoverCellX >= 0 && template.hoverCellY >= 0) {

        rect = lbGetPaneRect(template, template.hoverCellX, template.hoverCellY);

        rect.x += template.offsetX + template.mainBorderSize + 2;
        rect.y += template.offsetY + template.mainBorderSize + 2;

        x = template.hoverCellX;
        y = template.hoverCellY;

        // Draw hovered cell
        ctx.fillStyle = LB_HoveredPaneColor;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    // lbRender selected pane
    if (template.selectedCellX != -1 && template.selectedCellY != -1) {

        rect = lbGetPaneRect(template, template.selectedCellX, template.selectedCellY);

        rect.x += template.offsetX + template.mainBorderSize + 2;
        rect.y += template.offsetY + template.mainBorderSize + 2;

        // Draw selected cell
        ctx.fillStyle = LB_SelectedPaneColor;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
}


// Render Template/Mall to canvas
function lbTemplateRender(template) {

    // Init
    var ctx = lbGetTemplateCanvasContext();

    var canvas = lbGetTemplateCanvas();
    var cWidth = canvas.offsetWidth;
    var cHeight = canvas.offsetHeight;


    // Clear screen
    ctx.fillStyle = LB_BackgroundColor;
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);


    // Draw components
    lbRenderFrame(template);

    lbRenderActivePanes(template);

    lbRenderPosts(template);

    lbRenderPaneGrid(template);

}

