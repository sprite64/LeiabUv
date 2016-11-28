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
    return document.getElementById(template.activeCanvasId)
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
    //ctx.fillStyle = "#f00";
    //ctx.fillRect(10, 10, 16, 16);
    
    // Draw outer rect
    ctx.fillStyle = gfxSettings.frameBorderColor;
    ctx.fillRect(gfxSettings.offsetX + outerRect.x, gfxSettings.offsetY + outerRect.y, outerRect.width, outerRect.height);

    // Draw inner rect
    ctx.fillStyle = gfxSettings.backgroundColor;
    ctx.fillRect(gfxSettings.offsetX + innerRect.x, gfxSettings.offsetY + innerRect.y, innerRect.width, innerRect.height);

    
    // Draw main border
    ctx.fillStyle = gfxSettings.frameBackgroundColor;

    var x = 1; var y = 1; 										                        // Init for horizontal main borders
    var w = outerRect.width - 2; var h = gfxSettings.frameBorderSize;

    ctx.fillRect(gfxSettings.offsetX + x, gfxSettings.offsetY + y, w, h); 				// Top main border

    y += innerRect.height + gfxSettings.frameBorderSize + 2; 				            // Bottom main border
    ctx.fillRect(gfxSettings.offsetX + x, gfxSettings.offsetY + y, w, h);

    x = 1; y = gfxSettings.frameBorderSize + 2; 						                // Init for vertical main borders
    w = gfxSettings.frameBorderSize; h = innerRect.height;

    ctx.fillRect(gfxSettings.offsetX + x, gfxSettings.offsetY + y, w, h); 				// Left main border

    x = outerRect.width - (gfxSettings.frameBorderSize + 1); 				            // Right main border
    ctx.fillRect(gfxSettings.offsetX + x, gfxSettings.offsetY + y, w, h);
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

    var offsetX = gfxSettings.frameBorderSize + 2 + gfxSettings.offsetX;
    var offsetY = gfxSettings.frameBorderSize + 2 + gfxSettings.offsetY;
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
                tmpH = rect.height - gfxSettings.paneBorderSize * 0;

                if (nx > 0 && nx < template.cols) { ctx.fillRect(tmpX, tmpY, tmpW, tmpH); }


                //ctx.fillStyle = "#aaf"; 							// Right border ****

                tmpX += rect.width - gfxSettings.paneBorderSize;

                if (nx >= 0 && nx < template.cols - template.grid[nx][ny].colSpan) {

                    //if(nx + tmpSpan.x < model.colSpan) { 			// Extra border adjustment
                    ctx.fillRect(tmpX, tmpY, tmpW, tmpH);
                    //}
                }



                //ctx.fillStyle = "#aff"; 			 				// Top border

                tmpX = rect.x + offsetX;
                tmpW = rect.width;

                tmpY = offsetY + rect.y;
                tmpH = gfxSettings.paneBorderSize;

                if (ny > 0 && ny <= template.rows) { ctx.fillRect(tmpX, tmpY, tmpW, tmpH); }

                //ctx.fillStyle = "#faa"; 							// Bottom border ****

                tmpY += rect.height - gfxSettings.paneBorderSize;

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
    var h = y + innerRect.height;

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
    w = x + innerRect.width - 1;
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
    var rect = new lbCreateRect(0, 0, 0, 0);
    //var tmpRect = new lbCreateRect(0, 0, 0, 0);

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    var x = 0; var y = 0;

    // lbRender hovered pane
    if (template.hovering == true && template.hoverCellX >= 0 && template.hoverCellY >= 0) {

        rect = lbGetPaneRect(template.hoverCellX, template.hoverCellY);

        rect.x += gfxSettings.offsetX + gfxSettings.frameBorderSize + 2;
        rect.y += gfxSettings.offsetY + gfxSettings.frameBorderSize + 2;

        x = template.hoverCellX;
        y = template.hoverCellY;

        // Draw hovered cell
        ctx.fillStyle = gfxSettings.hoveredPaneColor;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    // lbRender selected pane
    if (template.selectedCellX != -1 && template.selectedCellY != -1) {

        rect = lbGetPaneRect(template.selectedCellX, template.selectedCellY);

        rect.x += gfxSettings.offsetX + gfxSettings.frameBorderSize + 2;
        rect.y += gfxSettings.offsetY + gfxSettings.frameBorderSize + 2;
        
        // Draw selected cell
        ctx.fillStyle = gfxSettings.selectedPaneColor;
        //ctx.fillStyle = "#ff0";
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

        //alert("seledt pane" + rect.x + ", " + rect.y + ", " + rect.width + ", " + rect.height)
    }
}



// Render Pane grid
function lbRenderDebug() {

    // Init
    var ctx = lbGetTemplateCanvasContext();
    
    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    var innerRect = lbGetInnerFrameRect();

    var x = gfxSettings.offsetX + innerRect.x + 0.5;
    var y = gfxSettings.offsetY;

    var w = x;
    var h = y + innerRect.height;

    var outerRect = lbGetMaxOuterFrameRect();
    
    var span = 0;

    // Render complete grid
    ctx.strokeStyle = gfxSettings.paneGridColor;
    ctx.strokeStyle = "#f40";
    ctx.lineWidth = 1;

    for (var gx = 1; gx < template.maxCols; gx++) { 				// lbRender verticals

        span = lbGetPaneXSplit(gx - 1);

        ctx.beginPath();
        ctx.moveTo(x + span, y);
        ctx.lineTo(x + span, y + outerRect.height);
        ctx.stroke();
    }

    x = gfxSettings.offsetX;
    y += 0.5 + innerRect.y;
    w = x;
    h = y;

    for (var gy = 1; gy < template.maxRows; gy++) { 				// lbRender horizontals

        span = lbGetPaneYSplit(gy - 1);

        ctx.beginPath();
        ctx.moveTo(x, y + span);
        ctx.lineTo(w + outerRect.width, h + span);
        ctx.stroke();
    }

    // Render pane data

    //ctx.strokeStyle = "#f40";
    x = 0;
    y = 0;
    var paneRect;
    var debugText = "";

    ctx.fillStyle = "#f40";
    ctx.fillStyle = "#000";
    ctx.font = "10px";

    for (var gy = 0; gy < template.maxRows; gy++) {
        for (var gx = 0; gx < template.maxCols; gx++) {

            paneRect = lbGetAnyPaneRect(gx, gy);

            debugText = "I: " + gx + ", " + gy;
            ctx.fillText(debugText, paneRect.x + gfxSettings.offsetX + gfxSettings.frameBorderSize + 4, paneRect.y + gfxSettings.offsetY + gfxSettings.frameBorderSize + 14);

            debugText = "P: " + template.grid[gx][gy].parentCellX + ", " + template.grid[gx][gy].parentCellY;
            ctx.fillText(debugText, paneRect.x + gfxSettings.offsetX + gfxSettings.frameBorderSize + 4, paneRect.y + gfxSettings.offsetY + gfxSettings.frameBorderSize + 14 + 12 + 12);

            debugText = "S: " + template.grid[gx][gy].colSpan + ", " + template.grid[gx][gy].rowSpan;
            ctx.fillText(debugText, paneRect.x + gfxSettings.offsetX + gfxSettings.frameBorderSize + 4, paneRect.y + gfxSettings.offsetY + gfxSettings.frameBorderSize + 14 + 12);
        }
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
    
    /*
    template.activeGfxSettings = "icon";

    lbRenderFrame();
    lbRenderActivePanes();
    lbRenderPosts();
    lbRenderPaneGrid();
    */
    //lbRenderDebug();

    template.activeGfxSettings = "editor";

    
    lbRenderFrame();
    lbRenderActivePanes();
    lbRenderPosts();
    lbRenderPaneGrid();

    //template.activeGfxSettings = "editor";
}


function lbRenderIcon(data) {


    // Append icon elements to #TemplateIcons
    /*
    for (var i = 0; i < data.length; i++) {

        var output = '<div style="width: 120px; height: 80px; display: inline-block; margin-right: 10px;">'
        output += '<canvas id="IconCanvas' + data[i].Id + '" width="120" height="80" style=""></canvas>'
        output += '<p>' + data[i].Name + '</p>'
        output += '</div>'

        $("#TemplateIcons").append(output);

    }
    */

    // This section is messy but it works well enough, so far there are no bugs anyway.

    // Render template icons
    lbBackupTemplateEditor();

    template.activeGfxSettings = "icon";
    for (var i = 0; i < data.length; i++) {

        lbUpdateTemplateEditorFromDB(data[i]);

        //lbAlertTemplateDate(data[i]);
        //lbAlertTemplateEditor();

        //alert(data[i].panes.length);

        var canvas = document.getElementById("IconCanvas" + data[i].Id);
        var ctx = canvas.getContext("2d");

        template.activeCanvasId = LB_IconCanvasId + data[i].Id;


        ctx.fillStyle = "#f00";
        ctx.fillRect(5, 5, 20, 20);

        //lbTemplateRender();


        lbRenderFrame();
        lbRenderActivePanes();
        lbRenderPosts();
        lbRenderPaneGrid();

    }

    // Restore active canvas
    template.activeGfxSettings = "editor";
    template.activeCanvasId = LB_TemplateCanvasId;

    lbRestoreTemplateEditor();

    //var LB_TemplateCanvasId = "TemplateCanvas";
    //var LB_IconCanvasId = "IconCanvas";

}

