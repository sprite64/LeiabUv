/*  Template Update
    
    Pritam Schönberger 2016

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Profil  - Profile
        Mall    - Template
        Båge    - -
*/



// Get outer Frame recrtangle
function lbGetOuterFrameRect() {

    var x = 0;
    var y = 0;

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    var w = template.cols * gfxSettings.paneWidth;
    w += gfxSettings.frameBorderSize * 2;
    w += gfxSettings.paneBorderSize * 2 * (template.cols - 1);
    w += 4 + (template.cols - 1) * 3;

    var h = template.rows * gfxSettings.paneHeight;
    h += gfxSettings.frameBorderSize * 2;
    h += gfxSettings.paneBorderSize * 2 * (template.rows - 1);
    h += 4 + (template.rows - 1) * 3;

    // Return rect object
    return new lbCreateRect(x, y, w, h);
}


// Get inner Frame rectangle
function lbGetInnerFrameRect() {

    var rect = lbGetOuterFrameRect();

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);
    
    
    rect.x = gfxSettings.frameBorderSize + 2;
    rect.y = gfxSettings.frameBorderSize + 2;
    
    rect.width -= (gfxSettings.frameBorderSize * 2 + 4);
    rect.height -= (gfxSettings.frameBorderSize * 2 + 4);

    return rect;
}


// Get Pane X split
// Used to get width/space between Posts/Poster
function lbGetPaneXSplit(index) {

    if (index == -1) { return 0; }

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    var x = 0;
    x = gfxSettings.paneWidth + gfxSettings.cellBorderSize + 1;
    x += index * (gfxSettings.paneWidth + gfxSettings.paneBorderSize * 2 + 3);

    return x;
}


// Get Pane Y split
// Used to get height/space between Posts/Poster
function lbGetPaneYSplit(index) {

    if (index == -1) { return 0; }

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    var y = 0;
    y = gfxSettings.paneHeight + gfxSettings.paneBorderSize + 1;
    y += index * (gfxSettings.paneHeight + gfxSettings.paneBorderSize * 2 + 3);

    return y;
}


// Determines if a Pane is a parent, returns true/false
function lbIsParent(xIndex, yIndex) {
    //alert("IsParent: " + xIndex + ", " + yIndex);
    if (template.grid[xIndex][yIndex].parentCellX != -1) { return false; }
    if (template.grid[xIndex][yIndex].parentCellY != -1) { return false; }

    return true;
}


// Returns the indice of parent cell OR the same indice parameters if already a parent
// Get parent Pane/Luft (if not already a parent)
function lbGetParent(xIndex, yIndex) {

    if (lbIsParent(xIndex, yIndex) == true) { 		// Return cell indice as is
        return new lbCreatePosition(xIndex, yIndex);
        //return lbCreatePosition(xIndex, yIndex);
    }

    var x = template.grid[xIndex][yIndex].parentCellX; 			// Get childs parent cell indice
    var y = template.grid[xIndex][yIndex].parentCellY;

    return new lbCreatePosition(x, y);
}


// Counts parent panes
function lbGetParentCount() {

    var count = 0;

    for (var x = 0; x < template.cols; x++) {
        for (var y = 0; y < template.rows; y++) {
            if (template.grid[x][y].parentCellX == -1) {
                count++;
            }
        }
    }

    return count;
}


// Functions for changing grid rows and cols 	***************************************************************************************************************************************
// It works but is quierky, for instance it doesn't take the cells span if any.
// Increase Pane column
function lbIncreaseFrameColumn() {

    if (template.cols >= LB_TemplateMaxColumns) { return; }     // Restrict maximum columns

    template.cols++;        // Increase columns

    for (var y = 0; y < template.rows; y++) {                   // Reset new panes
        template.grid[template.cols][y].colSpan = 1;
        template.grid[template.cols][y].rowSpan = 1;
        template.grid[template.cols][y].parentCellX = -1;
        template.grid[template.cols][y].parentCellY = -1;
    }
}


// Increase Pane row
function lbIncreaseFrameRow() {

    if (template.rows >= LB_TemplateMaxRows) { return; }

    template.rows++;        // Increase rows

    for (var x = 0; x < template.cols; x++) {
        template.grid[x][template.rows].colSpan = 1;
        template.grid[x][template.rows].rowSpan = 1;
        template.grid[x][template.rows].parentCellX = -1;
        template.grid[x][template.rows].parentcelly = -1;
    }
}


// Decrease Frame/Karm column
function lbDecreaseFrameColumn() {

    if (template.cols <= 1) { return; }

    for (var y = 0; y < template.rows; y++) {                   // Reset unused panes
        template.grid[template.cols][y].colSpan = 1;
        template.grid[template.cols][y].rowSpan = 1;
        template.grid[template.cols][y].parentCellX = -1;
        template.grid[template.cols][y].parentCellY = -1;
    }

    template.cols--;        // Decrease columns
}

// Decrease Frame/Karm row
function lbDecreaseFrameRow() {

    if (template.rows <= 1) { return; }

    for (var x = 0; x < template.cols; x++) {
        template.grid[x][template.rows].colSpan = 1;
        template.grid[x][template.rows].rowSpan = 1;
        template.grid[x][template.rows].parentCellX = -1;
        template.grid[x][template.rows].parentCellY = -1;
    }

    template.rows--;
}


// Functions for changing grid rows and cols 	***************************************************************************************************************************************


// Get Pane/Luft rectangle (redirects a child to parent cell if indices indicate a child)
function lbGetPaneRect(xIndex, yIndex) {

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    // Update cell index to parent if any
    if (lbIsParent(xIndex, yIndex) == false) {

        var pos = lbGetParent(xIndex, yIndex);
        xIndex = pos.x;
        yIndex = pos.y;
    }
    
    var x = lbGetPaneXSplit(xIndex - 1); 		// Get rect position
    var y = lbGetPaneYSplit(yIndex - 1);

    if (x > 0) { x++; }
    if (y > 0) { y++; }

    var w = 0;
    var h = 0;

    if (template.cols == 1) {
        w = gfxSettings.paneWidth; // Adjust size because of space anomaly when there's only one row or column
    } else {
        for (var nx = 0; nx < template.grid[xIndex][yIndex].colSpan; nx++) { 			// Accumulate cell spans
            if (xIndex + nx == 0 || xIndex + nx == template.cols - 1) {
                w += lbGetPaneXSplit(0);
            } else {
                w += lbGetPaneXSplit(1) - lbGetPaneXSplit(0) - 1;
            }
        }
    }

    w += template.grid[xIndex][yIndex].colSpan - 1; 									// Include single pixel borders

    if (template.rows == 1) {
        h = gfxSettings.paneHeight; // Adjust size because of space anomaly when there's only one row or column
    } else {
        for (var ny = 0; ny < template.grid[xIndex][yIndex].rowSpan; ny++) { 			// Accumulate cell spans
            if (yIndex + ny == 0 || yIndex + ny == template.rows - 1) {
                h += lbGetPaneYSplit(0);
            } else {
                h += lbGetPaneYSplit(1) - lbGetPaneYSplit(0) - 1;
            }
        }
    }

    h += template.grid[xIndex][yIndex].rowSpan - 1; 								// Include single pixel borders


    return new lbCreateRect(x, y, w, h);
    //return lbCreateRect(x, y, w, h); 											// Create and return rectangle
}


// Increase Pane/Luft column
function lbIncreasePaneColumn() {

    // Check data validity
    if (template.selectedCellX < 0 || template.selectedCellY < 0) { return; } 		// Check selected cell
    var xIndex = template.selectedCellX;
    var yIndex = template.selectedCellY;

    if (xIndex < 0 || xIndex + template.grid[xIndex][yIndex].colSpan >= template.cols) { return; }
    if (yIndex < 0) { return; }
    
    // Init
    var x = xIndex + template.grid[xIndex][yIndex].colSpan;
    var y = yIndex;

    //if (y > 0) { y --; }

    // There is an error with checking the upper-most row
    // FIX DAT SHIT
    // 
    // My best guess is that not ONLY do you need to check the new occpied cells but also by the width of it
    // This loop needs to be for(y) for(x) <logic>
    //
    for (var ny = 0; ny < template.grid[xIndex][yIndex].rowSpan; ny++) { 			// Cancel if the cellspan increase overlapps any other cell than one with 1x1 span
        if (template.grid[x][y + ny].colSpan != 1) { return; }
        if (template.grid[x][y + ny].rowSpan != 1) { return; }

        if (template.grid[x][y + ny].parentCellX >= 0) { return; }                   // Bugfix: Without this, you can overlapp parented panes/lufts
    }

    template.grid[xIndex][yIndex].colSpan++; 										// Increase column span

    for (var ny = 0; ny < template.grid[xIndex][yIndex].rowSpan; ny++) { 			// Update all child cells

        template.grid[x][y + ny].parentCellX = xIndex;
        template.grid[x][y + ny].parentCellY = yIndex;
    }
}


// Increase Pane/Luft row
function lbIncreasePaneRow() {

    // Check data validity
    if (template.selectedCellX < 0 || template.selectedCellY < 0) { return; }
    var xIndex = template.selectedCellX;
    var yIndex = template.selectedCellY;

    if (xIndex < 0) { return; }
    if (yIndex < 0 || yIndex + template.grid[xIndex][yIndex].rowSpan >= template.rows) { return; }

    // Init
    var x = xIndex;
    var y = yIndex + template.grid[xIndex][yIndex].rowSpan;

    for (var nx = 0; nx < template.grid[xIndex][yIndex].colSpan; nx++) { 		// Cancel if the cellspan increase overlaps any other cell than one with 1x1 span
        if (template.grid[x + nx][y].colSpan != 1) { return; }
        if (template.grid[x + nx][y].rowSpan != 1) { return; }

        if (template.grid[x + nx][y].parentCellY >= 0) { return; }               // Bugfix: Without this, you can overlapp parented panes/lufts
    }

    template.grid[xIndex][yIndex].rowSpan++; 						// Increase row span

    for (var nx = 0; nx < template.grid[xIndex][yIndex].colSpan; nx++) { 		// Update child cells

        template.grid[x + nx][y].parentCellX = xIndex;
        template.grid[x + nx][y].parentCellY = yIndex;
    }
}


// Decrease Pane/Luft column
function lbDecreasePaneColumn() {

    // Check data validity
    if (template.selectedCellX < 0 || template.selectedCellY < 0) { return; } 		// Check selected cell
    var xIndex = template.selectedCellX;
    var yIndex = template.selectedCellY;

    // Get parent
    var pos = lbGetParent(template, template.selectedCellX, template.selectedCellY);

    if (template.grid[pos.x][pos.y].colSpan <= 1) { return; } 						// Check rows

    var tmpCol = template.grid[pos.x][pos.y].colSpan - 1;
    for (var ny = pos.y; ny < pos.y + template.grid[pos.x][pos.y].rowSpan; ny++) {
        template.grid[pos.x + tmpCol][ny].parentCellX = -1;
        template.grid[pos.x + tmpCol][ny].parentCellY = -1;
    }

    template.grid[pos.x][pos.y].colSpan -= 1; 			// Update column span
}


// Decrease Pane/Luft row
function lbDecreasePaneRow() {

    // Check data validity
    if (template.selectedCellX < 0 || template.selectedCellY < 0) { return; } 		// Check selected cell
    var xIndex = template.selectedCellX;
    var yIndex = template.selectedCellY;

    // Get parent
    var pos = lbGetParent(template, template.selectedCellX, template.selectedCellY);

    if (template.grid[pos.x][pos.y].rowSpan <= 1) { return; } 						// Check rows

    //for(var nx = pos.x; nx < pos.x + model[xIndex][yIndex].colSpan; nx ++) {
    var tmpRow = template.grid[pos.x][pos.y].rowSpan - 1;
    for (var nx = pos.x; nx < pos.x + template.grid[pos.x][pos.y].colSpan; nx++) {
        template.grid[nx][pos.y + tmpRow].parentCellX = -1;
        template.grid[nx][pos.y + tmpRow].parentCellY = -1;
    }

    template.grid[pos.x][pos.y].rowSpan -= 1; 			// Update column span
}


// Update mouse position
function lbUpdateMousePosition(e) {

    var mouseX = parseInt(e.clientX);                               // Get event data
    var mouseY = parseInt(e.clientY);

    var canvasOffset = $("#" + LB_TemplateCanvasId).offset();       // Get canvas element offset

    template.mouseX = Math.round(mouseX - canvasOffset.left);                   // Update mouse position
    template.mouseY = Math.round(mouseY - canvasOffset.top);                    // Using round because at some times mouseX will return a float
}


// Main update *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 

// Main Update function
function lbTemplateUpdate(action) {

    // Init
    var rect;

    // Get graphics settings for active gfx settings
    var gfxSettings = new lbCreateGraphicsSettings(template.activeGfxSettings);

    // Actions
    switch (action) {
        case "mouseMove": 			// Mouse move

            // Find hover cell
            template.hovering = false;

            template.hoverCellX = -1;
            template.hoverCellY = -1;

            // Loop through cells (not including spans and shtuff)
            for (var nx = 0; nx < template.cols; nx++) {
                for (var ny = 0; ny < template.rows; ny++) {
                    rect = lbGetPaneRect(nx, ny);

                    rect.x += gfxSettings.offsetX + gfxSettings.frameBorderSize + 2;
                    rect.y += gfxSettings.offsetY + gfxSettings.frameBorderSize + 2;

                    // Check collision
                    if (template.mouseX >= rect.x && template.mouseX < rect.x + rect.width) {
                        if (template.mouseY >= rect.y && template.mouseY < rect.y + rect.height) {
                            template.hovering = true;
                            template.hoverCellX = nx;
                            template.hoverCellY = ny;

                            //alert("collision! " + template.hoverCellX + ", " + template.hoverCellY);
                        }
                    }

                }
            }

            break;
        case "mouseUp": 				// Mouse button released

            // Select a cell
            if (template.hoverCellX != -1 && template.hoverCellY != -1) {

                var x = template.hoverCellX;
                var y = template.hoverCellY;

                // Select single cell
                if (template.grid[x][y].parentCellX == -1 && template.grid[x][y].parentCellY == -1) {

                    template.selectedCellX = template.hoverCellX; 			// Update selected cell
                    template.selectedCellY = template.hoverCellY;

                    // Select spanned cell
                } else {

                    template.selectedCellX = template.grid[x][y].parentCellX;
                    template.selectedCellY = template.grid[x][y].parentCellY;
                }

            // Deselect cell
            } else {
                template.selectedCellX = -1;
                template.selectedCellY = -1;
            }

            break;
    }
}


function lbTemplateUpdateAndRender(action) {

    lbTemplateUpdate(action);
    lbTemplateRender();
}


/* Main editor functions */
function lbShowEditor() {

    var canvas = lbGetTemplateCanvas();
    var saveCon = document.getElementById("TemplateSaveControl");

    canvas.style.visibility = "visible";
    saveCon.style.visibility = "visible";
}


function lbHideEditor() {

    var canvas = lbGetTemplateCanvas();
    var saveCon = document.getElementById("TemplateSaveControl");

    canvas.style.visibility = "hidden";
    saveCon.style.visibility = "hidden";

    document.getElementById("saveLoadingGlyphicon").style.visibility = "hidden";
}



function lbOpenEditor() {

    if (template.state == LB_TemplateStateInactive) {
        lbShowEditor();
        template.state = LB_TemplateStateActive;
        //template = lbCreateTemplate(1, 1);
    }

    // Reset template name
    $("#inTemplateName").val("");

    // Hide/Show alert elements
    document.getElementById("alertSuccessMessage").style.display = "none";
    document.getElementById("alertErrorMessage").style.display = "block";

    document.getElementById("alertErrorMessage").style.visibility = "hidden";
    document.getElementById("alertSuccessMessage").style.visibility = "hidden";
    
    //return template;
}


function lbCloseEditor() {

    lbHideEditor();
    template.state = LB_TemplateStateInactive;

    // Hide/Show alert elements
    document.getElementById("alertSuccessMessage").style.display = "none";
    document.getElementById("alertErrorMessage").style.display = "block";

    document.getElementById("alertErrorMessage").style.visibility = "hidden";
    document.getElementById("alertSuccessMessage").style.visibility = "hidden";

    document.getElementById("saveLoadingGlyphicon").style.visibility = "hidden";

    //return template;
}


function lbResetEditor() {

    //template = lbCreateTemplate(1, 1);
    template.state = LB_TemplateStateActive;

    // Hide/Show alert elements
    document.getElementById("alertSuccessMessage").style.display = "none";
    document.getElementById("alertErrorMessage").style.display = "block";

    document.getElementById("alertErrorMessage").style.visibility = "hidden";
    document.getElementById("alertSuccessMessage").style.visibility = "hidden";

    document.getElementById("saveLoadingGlyphicon").style.visibility = "hidden";

    //return template;
}


function lbSaveTemplate() {

    // Check if editor is open
    var canvas = lbGetTemplateCanvas();
    if (canvas.style.visibility == "hidden") {
        return template;
    }

    var nt = new lbTemplateData(template);          // Create simplified template object
    
    var j = JSON.stringify(nt);                 // Create JSON object

    //alert(j);

    // Hide/Show alert elements and loading glyph
    document.getElementById("alertSuccessMessage").style.display = "none";
    document.getElementById("alertErrorMessage").style.display = "block";

    document.getElementById("alertErrorMessage").style.visibility = "hidden";
    document.getElementById("alertSuccessMessage").style.visibility = "hidden";

    document.getElementById("saveLoadingGlyphicon").style.visibility = "visible";

    // Send AJAX query
    $.getJSON("/Template/Save?json=" + j, function (data) {

        document.getElementById("saveLoadingGlyphicon").style.visibility = "hidden";

        if (data != "ok") {
            
            // Update error message
            document.getElementById("alertErrorMessageParagraph").innerHTML = data;

            // Hide/Show alert elements
            document.getElementById("alertSuccessMessage").style.display = "none";
            document.getElementById("alertErrorMessage").style.display = "block";

            document.getElementById("alertErrorMessage").style.visibility = "visible";
            document.getElementById("alertSuccessMessage").style.visibility = "hidden";
        } else {

            // Hide/Show alert elements
            document.getElementById("alertSuccessMessage").style.display = "block";
            document.getElementById("alertErrorMessage").style.display = "none";

            document.getElementById("alertErrorMessage").style.visibility = "hidden";
            document.getElementById("alertSuccessMessage").style.visibility = "visible";
        }
        
        //alert(data);
    });

    //return template;
}


/*** PROBABLUY UNUSED BULLSHIT TO BE REMOVED!!! */


/* Handle template editor main events *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */
function lbHandleNewTemplateQuery() {

    //alert("Handle new!");                         
                                                                // The logic here is flawed, not sure how or why but it's an error of my own.
    //alert("State: " + template.state);

    //alert("lbHandleNewTempalteQuery!");

    var canvas = lbGetTemplateCanvas();

    if (template.state == LB_TemplateStateActive) {             // Open Throw or Save modal
        //alert("lbHandleNewTemplateQuery: active");

        $("#mdlThrowOrSaveTemplate").modal("show");

        return template;                                                 // Return to cut off template state toggles
    }

    if (template.state == LB_TemplateStateInactive) {           // Initiate new template
        //alert("lbHandleNewTemplateQuery: inactive");
        canvas.style.visibility = "visible";                    // Make canvas visible

        template.state = LB_TemplateStateActive;                // Update state

        return template;
    }

    alert("HandleNewTemplateQuery: not handled at all!");
}


function lbHandleThrowTemplateConfirm() {

    template = lbCreateTemplate(1, 1);
    template.state = LB_TemplateStateActive;

    return template;
}


function lbHandleSaveTemplateQuery() {

    if (template.state == LB_TemplateStateActive) {             // Open Save modal


    }

}


function lbHandleCancelTemplateQuery() {                        // Fires off the cancel modal

    if (template.state == LB_TemplateStateActive) {
        $("#mdlCancelTemplate").modal();
    }
}


function lbHandleCancelTemplateConfirm() {

    var canvas = lbGetTemplateCanvas();
    
    if (template.state == LB_TemplateStateActive) {             // Open Cancel template modal

        template.state = LB_TemplateStateInactive;
        canvas.style.visibility = "hidden";
    }
}



