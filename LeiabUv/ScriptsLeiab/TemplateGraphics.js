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
function lbRenderFrame() {

    // Init
    var ctx = lbGetTemplateCanvasContext();

    var outerRect = lbGetOuterFrameRect();
    var innerRect = lbGetInnerFrameRect();

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);
    
    // Draw dummy
    ctx.fillStyle = "#f00";
    ctx.fillRect(10, 10, 16, 16);

    // Draw outer rect
    ctx.fillStyle = gfxSettings.frameBorderColor;
    ctx.fillRect(gfxSettings.offsetX + outerRect.x, gfxSettings.offsetY + outerRect.y, outerRect.width, outerRect.height);

    // Draw inner rect
    ctx.fillStyle = gfxSettings.backgroundColor;
    ctx.fillRect(template.offsetX + innerRect.x, template.offsetY + innerRect.y, innerRect.width, innerRect.height);

    // Draw main border
    ctx.fillStyle = gfxSettings.frameBackgroundColor;

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
function lbRenderPosts() {

    // Init
    var ctx = lbGetTemplateCanvasContext();

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    //ctx.fillStyle = LB_PostBackgroundColor;
    ctx.fillStyle = gfxSettings.postBackgroundColor;

    var rect;

    var offsetX = gfxSettings.mainBorderSize + 2 + gfxSettings.offsetx;
    var offsetY = gfxSettings.mainBorderSize + 2 + gfxSettings.offsetY;
    //var offsetX = template.mainBorderSize + 2 + template.offsetX;
    //var offsetY = template.mainBorderSize + 2 + template.offsetY;

    var tmpX;
    var tmpY;
    var tmpW;
    var tmpH;

    // Loop through all cells
    for (var ny = 0; ny < template.rows; ny++) {
        for (var nx = 0; nx < template.cols; nx++) {

            // Only lbRender parent cells
            if (lbIsParent(nx, ny) == true) {

                //var tmpSpan = lbGetParentSpanSize(model, nx, ny);

                var tmpSX = template.cols;
                var tmpSY = template.rows;

                //alert("TmpSpan " + tmpSpan.x + ", " + tmpSpan.y);

                rect = lbGetPaneRect(nx, ny);

                // lbRender left & right borders
                // model.cellBorderSize


                //ctx.fillStyle = "#faf";

                tmpX = offsetX + rect.x; 							// Left border
                tmpW = gfxSettings.paneBorderSize;

                tmpY = offsetY + rect.y;
                tmpH = rect.h - gfxSettings.paneBorderSize * 0;

                if (nx > 0 && nx < template.cols) { ctx.fillRect(tmpX, tmpY, tmpW, tmpH); }


                //ctx.fillStyle = "#aaf"; 							// Right border ****

                tmpX += rect.w - gfxSettings.paneBorderSize;

                if (nx >= 0 && nx < template.cols - template.grid[nx][ny].colSpan) {

                    //if(nx + tmpSpan.x < model.colSpan) { 			// Extra border adjustment
                    ctx.fillRect(tmpX, tmpY, tmpW, tmpH);
                    //}
                }



                //ctx.fillStyle = "#aff"; 			 				// Top border

                tmpX = rect.x + offsetX;
                tmpW = rect.w;

                tmpY = offsetY + rect.y;
                tmpH = gfxSettings.paneBorderSize;

                if (ny > 0 && ny <= template.rows) { ctx.fillRect(tmpX, tmpY, tmpW, tmpH); }

                //ctx.fillStyle = "#faa"; 							// Bottom border ****

                tmpY += rect.h - gfxSettings.paneBorderSize;

                //if(nx >= 0 && nx < model.cols - model[nx][ny].colSpan) {
                if (ny >= 0 && ny < template.rows - template.grid[nx][ny].rowSpan) {
                    ctx.fillRect(tmpX, tmpY, tmpW, tmpH);
                }
            }
        }
    }

}


// Render Pane grid
function lbRenderPaneGrid() {

    // Init
    var ctx = lbGetTemplateCanvasContext();

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    var innerRect = lbGetInnerFrameRect();

    var x = gfxSettings.offsetX + innerRect.x + 0.5;
    var y = gfxSettings.offsetY + innerRect.y;

    var w = x;
    var h = y + innerRect.h;

    var span = 0;

    ctx.strokeStyle = gfxSettings.paneGridColor;
    ctx.lineWidth = 1;

    for (var gx = 1; gx < template.cols; gx++) { 				// lbRender verticals

        span = lbGetPaneXSplit(gx - 1);

        ctx.beginPath();
        ctx.moveTo(x + span, y);
        ctx.lineTo(x + span, h);
        ctx.stroke();
    }

    y += 0.5;
    w = x + innerRect.w - 1;
    h = y;

    for (var gy = 1; gy < template.rows; gy++) { 				// lbRender horizontals

        span = lbGetPaneYSplit(gy - 1);

        ctx.beginPath();
        ctx.moveTo(x, y + span);
        ctx.lineTo(w, h + span);
        ctx.stroke();
    }
}


// Render select and hover Panes
function lbRenderActivePanes() {

    // Init
    var ctx = lbGetTemplateCanvasContext();
    var rect = lbCreateRect(0, 0, 0, 0);
    var tmpRect = lbCreateRect(0, 0, 0, 0);

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    var x = 0; var y = 0;

    // lbRender hovered pane
    if (template.hovering == true && template.hoverCellX >= 0 && template.hoverCellY >= 0) {

        rect = lbGetPaneRect(template.hoverCellX, template.hoverCellY);

        rect.x += gfxSettings.offsetX + gfxSettings.mainBorderSize + 2;
        rect.y += gfxSettings.offsetY + gfxSettings.mainBorderSize + 2;

        x = template.hoverCellX;
        y = template.hoverCellY;

        // Draw hovered cell
        ctx.fillStyle = gfxSettings.hoveredPaneColor;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    // lbRender selected pane
    if (template.selectedCellX != -1 && template.selectedCellY != -1) {

        rect = lbGetPaneRect(template, template.selectedCellX, template.selectedCellY);

        rect.x += template.offsetX + template.mainBorderSize + 2;
        rect.y += template.offsetY + template.mainBorderSize + 2;

        // Draw selected cell
        ctx.fillStyle = gfxSettings.selectedPaneColor;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
}


// Render Template/Mall to canvas
function lbTemplateRender() {

    // Init
    var ctx = lbGetTemplateCanvasContext();

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    var canvas = lbGetTemplateCanvas();
    var cWidth = canvas.offsetWidth;
    var cHeight = canvas.offsetHeight;

    // Clear screen
    ctx.fillStyle = gfxSettings.backgroundColor;
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Draw components
    lbRenderFrame();
    //lbRenderActivePanes();
    //lbRenderPosts();
    //lbRenderPaneGrid();
}

