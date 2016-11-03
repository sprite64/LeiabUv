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
function lbGetOuterFrameRect(template) {

    var x = 0;
    var y = 0;

    var w = template.cols * template.cellWidth; 					// Width of cells
    w += template.mainBorderSize * 2; 							// Main border width
    w += template.cellBorderSize * 2 * (template.cols - 1); 	// Cell border width
    w += 4 + (template.cols - 1) * 3; 							// Single pixel borders/lines

    var h = template.rows * template.cellHeight; 					// Same as above but for height
    h += template.mainBorderSize * 2;
    h += template.cellBorderSize * 2 * (template.rows - 1);
    h += 4 + (template.rows - 1) * 3;

    var rect = lbCreateRect(x, y, w, h);

    return rect;
}


// Get inner Frame rectangle
function lbGetInnerFrameRect(template) {

    var rect = lbGetOuterFrameRect(template);

    rect.x = template.mainBorderSize + 2; 			// Top left coordinate
    rect.y = template.mainBorderSize + 2;

    rect.w -= (template.mainBorderSize * 2 + 4); 	// Bottom right coordinate
    rect.h -= (template.mainBorderSize * 2 + 4);

    return rect;
}


// Get Pane X split
// Used to get width/space between Posts/Poster
function lbGetPaneXSplit(template, index) {

    if (index == -1) { return 0; }

    var x = 0;
    x = template.cellWidth + template.cellBorderSize + 1;
    x += index * (template.cellWidth + template.cellBorderSize * 2 + 3);

    return x;
}


// Get Pane Y split
// Used to get height/space between Posts/Poster
function lbGetPaneYSplit(template, index) {

    if (index == -1) { return 0; }

    var y = 0;
    y = template.cellHeight + template.cellBorderSize + 1;
    y += index * (template.cellHeight + template.cellBorderSize * 2 + 3);

    return y;
}


// Determines if a Pane is a parent, returns true/false
function lbIsParent(template, xIndex, yIndex) {

    if (template[xIndex][yIndex].parentCellX != -1) { return false; }
    if (template[xIndex][yIndex].parentCellY != -1) { return false; }

    return true;
}


// Returns the indice of parent cell OR the same indice parameters if already a parent
// Get parent Pane/Luft (if not already a parent)
function lbGetParent(template, xIndex, yIndex) {

    if (lbIsParent(template, xIndex, yIndex) == true) { 		// Return cell indice as is
        return lbCreatePosition(xIndex, yIndex);
    }

    var x = template[xIndex][yIndex].parentCellX; 			// Get childs parent cell indice
    var y = template[xIndex][yIndex].parentCellY;

    return lbCreatePosition(x, y);
}


// 
function lbGetParentCount(tempalte) {

    var count = 0;

    for (var x = 0; x < template.cols; x++) {
        for (var y = 0; y < template.rows; y++) {
            if (template[x][y].parentCellX == -1) {
                count ++;
            }
        }
    }

    return count;
}


// Functions for changing grid rows and cols 	***************************************************************************************************************************************
// It works but is quierky, for instance it doesn't take the cells span if any.
// Increase Frame/Karm column
function lbIncreaseFrameColumn(template) {

    if (template.cols >= LB_TemplateMaxColumns) { return template; }   // Restrict maximum columns

    var nTemplate = lbCreateTemplate(template.cols + 1, template.rows);

    // Copy span/parent data
    for (var ny = 0; ny < template.rows; ny++) {
        for (var nx = 0; nx < template.cols; nx++) {
            nTemplate[nx][ny] = template[nx][ny];
        }
    }

    return nTemplate; 		// Return new model
}


// Increase Frame/Karm row
function lbIncreaseFrameRow(template) {

    if (template.rows >= LB_TemplateMaxRows) { return template; }

    var nTemplate = lbCreateTemplate(template.cols, template.rows + 1);

    // Copy span/parent data
    for (var ny = 0; ny < template.rows; ny++) {
        for (var nx = 0; nx < template.cols; nx++) {
            nTemplate[nx][ny] = template[nx][ny];
        }
    }

    return nTemplate;
}


// Decrease Frame/Karm column
function lbDecreaseFrameColumn(template) {

    if (template.cols <= 1) { return template; }

    var nTemplate = lbCreateTemplate(template.cols - 1, template.rows);

    // Copy span/parent data
    for (var ny = 0; ny < template.rows; ny++) {
        for (var nx = 0; nx < template.cols - 1; nx++) {
            nTemplate[nx][ny] = template[nx][ny];

            // Reduce out of bounds cellspans
            if (lbIsParent(template, nx, ny)) {
                if (nTemplate[nx][ny].colSpan + nx > nTemplate.cols) {
                    nTemplate[nx][ny].colSpan--;
                }
            }
        }
    }

    return nTemplate;
}

// Decrease Frame/Karm row
function lbDecreaseFrameRow(template) {

    if (template.rows <= 1) { return template; }

    var nTemplate = lbCreateTemplate(template.cols, template.rows - 1);

    // Copy span/parent data
    for (var ny = 0; ny < template.rows - 1; ny++) {
        for (var nx = 0; nx < template.cols; nx++) {
            nTemplate[nx][ny] = template[nx][ny];

            // Reduce out of bound spans
            if (lbIsParent(template, nx, ny)) {
                if (nTemplate[nx][ny].rowSpan + ny > nTemplate.rows) {
                    nTemplate[nx][ny].rowSpan--;
                }
            }
        }
    }

    return nTemplate;
}


// Functions for changing grid rows and cols 	***************************************************************************************************************************************


// Get Pane/Luft rectangle (redirects a child to parent cell if indices indicate a child)
function lbGetPaneRect(template, xIndex, yIndex) {

    // Update cell index to parent if any
    if (lbIsParent(template, xIndex, yIndex) == false) {

        var pos = lbGetParent(template, xIndex, yIndex);
        xIndex = pos.x;
        yIndex = pos.y;
    }
    
    var x = lbGetPaneXSplit(template, xIndex - 1); 		// Get rect position
    var y = lbGetPaneYSplit(template, yIndex - 1);

    if (x > 0) { x++; }
    if (y > 0) { y++; }

    var w = 0;
    var h = 0;

    if (template.cols == 1) {
        w = template.cellWidth; // Adjust size because of space anomaly when there's only one row or column
    } else {
        for (var nx = 0; nx < template[xIndex][yIndex].colSpan; nx++) { 			// Accumulate cell spans
            if (xIndex + nx == 0 || xIndex + nx == template.cols - 1) {
                w += lbGetPaneXSplit(template, 0);
            } else {
                w += lbGetPaneXSplit(template, 1) - lbGetPaneXSplit(template, 0) - 1;
            }
        }
    }

    w += template[xIndex][yIndex].colSpan - 1; 									// Include single pixel borders

    if (template.rows == 1) {
        h = template.cellHeight; // Adjust size because of space anomaly when there's only one row or column
    } else {
        for (var ny = 0; ny < template[xIndex][yIndex].rowSpan; ny++) { 			// Accumulate cell spans
            if (yIndex + ny == 0 || yIndex + ny == template.rows - 1) {
                h += lbGetPaneYSplit(template, 0);
            } else {
                h += lbGetPaneYSplit(template, 1) - lbGetPaneYSplit(template, 0) - 1;
            }
        }
    }

    h += template[xIndex][yIndex].rowSpan - 1; 								// Include single pixel borders


    return lbCreateRect(x, y, w, h); 											// Create and return rectangle
}


// This is for the moment NEVER used, consider removing it further down the way
// Get single Pane/Luft rectangle
function lbGetSinglePaneRect(template, xIndex, yIndex) {

    var x = lbGetPaneXSplit(template, xIndex - 1);
    var y = lbGetPaneYSplit(template, yIndex - 1);

    if (x > 0) { x++; }
    if (y > 0) { y++; }

    var w = 0;
    var h = 0;

    // Single cell/no spans
    if (template[xIndex][yIndex].colSpan > 1 || template[xIndex][yIndex].rowSpan > 1) {


        if (xIndex == 0 || xIndex == template.cols - 1) {
            w = lbGetPaneXSplit(template, 0);
        } else {
            w = lbGetPaneXSplit(template, 1) - lbGetPaneXSplit(template, 0) - 1;
        }

        if (yIndex == 0 || yIndex == template.rows - 1) {
            h = lbGetPaneYSplit(template, 0);
        } else {
            h = lbGetPaneYSplit(template, 1) - lbGetPaneYSplit(template, 0) - 1;
        }


    } else {

        if (xIndex == 0 || xIndex == template.cols - 1) {
            w = lbGetPaneXSplit(template, 0);
        } else {
            w = lbGetPaneXSplit(template, 1) - lbGetPaneXSplit(template, 0) - 1;
        }

        if (yIndex == 0 || yIndex == template.rows - 1) {
            h = lbGetPaneYSplit(template, 0);
        } else {
            h = lbGetPaneYSplit(template, 1) - lbGetPaneYSplit(template, 0) - 1;
        }
    }



    var rect = lbCreateRect(x, y, w, h);

    return rect;
}


// Increase Pane/Luft column
function lbIncreasePaneColumn(template) {

    // Check data validity
    if (template.selectedCellX < 0 || template.selectedCellY < 0) { return; } 		// Check selected cell
    var xIndex = template.selectedCellX;
    var yIndex = template.selectedCellY;

    if (xIndex < 0 || xIndex + template[xIndex][yIndex].colSpan >= template.cols) { return; }
    if (yIndex < 0) { return; }
    
    // Init
    var x = xIndex + template[xIndex][yIndex].colSpan;
    var y = yIndex;

    //if (y > 0) { y --; }

    // There is an error with checking the upper-most row
    // FIX DAT SHIT
    // 
    // My best guess is that not ONLY do you need to check the new occpied cells but also by the width of it
    // This loop needs to be for(y) for(x) <logic>
    //
    for (var ny = 0; ny < template[xIndex][yIndex].rowSpan; ny++) { 			// Cancel if the cellspan increase overlapps any other cell than one with 1x1 span
        if (template[x][y + ny].colSpan != 1) { return; }
        if (template[x][y + ny].rowSpan != 1) { return; }

        if (template[x][y + ny].parentCellX >= 0) { return; }                   // Bugfix: Without this, you can overlapp parented panes/lufts
    }

    template[xIndex][yIndex].colSpan++; 										// Increase column span

    for (var ny = 0; ny < template[xIndex][yIndex].rowSpan; ny++) { 			// Update all child cells

        template[x][y + ny].parentCellX = xIndex;
        template[x][y + ny].parentCellY = yIndex;
    }
}


// Increase Pane/Luft row
function lbIncreasePaneRow(template, xIndex, yIndex) {

    // Check data validity
    if (template.selectedCellX < 0 || template.selectedCellY < 0) { return; }
    var xIndex = template.selectedCellX;
    var yIndex = template.selectedCellY;

    if (xIndex < 0) { return; }
    if (yIndex < 0 || yIndex + template[xIndex][yIndex].rowSpan >= template.rows) { return; }

    // Init
    var x = xIndex;
    var y = yIndex + template[xIndex][yIndex].rowSpan;

    for (var nx = 0; nx < template[xIndex][yIndex].colSpan; nx++) { 		// Cancel if the cellspan increase overlaps any other cell than one with 1x1 span
        if (template[x + nx][y].colSpan != 1) { return; }
        if (template[x + nx][y].rowSpan != 1) { return; }

        if (template[x + nx][y].parentCellY >= 0) { return; }               // Bugfix: Without this, you can overlapp parented panes/lufts
    }

    template[xIndex][yIndex].rowSpan++; 						// Increase row span

    for (var nx = 0; nx < template[xIndex][yIndex].colSpan; nx++) { 		// Update child cells

        template[x + nx][y].parentCellX = xIndex;
        template[x + nx][y].parentCellY = yIndex;
    }
}


// Decrease Pane/Luft column
function lbDecreasePaneColumn(template) {

    // Check data validity
    if (template.selectedCellX < 0 || template.selectedCellY < 0) { return; } 		// Check selected cell
    var xIndex = template.selectedCellX;
    var yIndex = template.selectedCellY;

    // Get parent
    var pos = lbGetParent(template, template.selectedCellX, template.selectedCellY);

    if (template[pos.x][pos.y].colSpan <= 1) { return; } 						// Check rows

    var tmpCol = template[pos.x][pos.y].colSpan - 1;
    for (var ny = pos.y; ny < pos.y + template[pos.x][pos.y].rowSpan; ny++) {
        template[pos.x + tmpCol][ny].parentCellX = -1;
        template[pos.x + tmpCol][ny].parentCellY = -1;
    }

    template[pos.x][pos.y].colSpan -= 1; 			// Update column span
}


// Decrease Pane/Luft row
function lbDecreasePaneRow(template) {

    // Check data validity
    if (template.selectedCellX < 0 || template.selectedCellY < 0) { return; } 		// Check selected cell
    var xIndex = template.selectedCellX;
    var yIndex = template.selectedCellY;

    // Get parent
    var pos = lbGetParent(template, template.selectedCellX, template.selectedCellY);

    if (template[pos.x][pos.y].rowSpan <= 1) { return; } 						// Check rows

    //for(var nx = pos.x; nx < pos.x + model[xIndex][yIndex].colSpan; nx ++) {
    var tmpRow = template[pos.x][pos.y].rowSpan - 1;
    for (var nx = pos.x; nx < pos.x + template[pos.x][pos.y].colSpan; nx++) {
        template[nx][pos.y + tmpRow].parentCellX = -1;
        template[nx][pos.y + tmpRow].parentCellY = -1;
    }

    template[pos.x][pos.y].rowSpan -= 1; 			// Update column span
}


// Update mouse position
function lbUpdateMousePosition(e) {

    var mouseX = parseInt(e.clientX);                               // Get event data
    var mouseY = parseInt(e.clientY);

    var canvasOffset = $("#" + LB_TemplateCanvasId).offset();       // Get canvas element offset

    template.mouseX = mouseX - canvasOffset.left;                   // Update mouse position
    template.mouseY = mouseY - canvasOffset.top;
}


// Main update *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 

// Main Update function
function lbTemplateUpdate(template, action) {

    // Init
    var rect;

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
                    rect = lbGetPaneRect(template, nx, ny);

                    rect.x += template.offsetX + template.mainBorderSize + 2;
                    rect.y += template.offsetY + template.mainBorderSize + 2;

                    // Check collision
                    if (template.mouseX >= rect.x && template.mouseX < rect.x + rect.w) {
                        if (template.mouseY >= rect.y && template.mouseY < rect.y + rect.h) {
                            template.hovering = true;
                            template.hoverCellX = nx;
                            template.hoverCellY = ny;
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
                if (template[x][y].parentCellX == -1 && template[x][y].parentCellY == -1) {

                    template.selectedCellX = template.hoverCellX; 			// Update selected cell
                    template.selectedCellY = template.hoverCellY;

                    // Select spanned cell
                } else {

                    template.selectedCellX = template[x][y].parentCellX;
                    template.selectedCellY = template[x][y].parentCellY;
                }

            // Deselect cell
            } else {
                template.selectedCellX = -1;
                template.selectedCellY = -1;
            }

            break;
    }
}


function lbTemplateUpdateAndRender(template, action) {

    lbTemplateUpdate(template, action);
    lbTemplateRender(template);
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



function lbOpenEditor(template) {

    if (template.state == LB_TemplateStateInactive) {
        lbShowEditor();
        template.state = LB_TemplateStateActive;
        template = lbCreateTemplate(1, 1);
    }

    // Reset template name
    $("#inTemplateName").val("");

    // Hide/Show alert elements
    document.getElementById("alertSuccessMessage").style.display = "none";
    document.getElementById("alertErrorMessage").style.display = "block";

    document.getElementById("alertErrorMessage").style.visibility = "hidden";
    document.getElementById("alertSuccessMessage").style.visibility = "hidden";
    
    return template;
}


function lbCloseEditor(template) {

    lbHideEditor();
    template.state = LB_TemplateStateInactive;

    // Hide/Show alert elements
    document.getElementById("alertSuccessMessage").style.display = "none";
    document.getElementById("alertErrorMessage").style.display = "block";

    document.getElementById("alertErrorMessage").style.visibility = "hidden";
    document.getElementById("alertSuccessMessage").style.visibility = "hidden";

    document.getElementById("saveLoadingGlyphicon").style.visibility = "hidden";

    return template;
}


function lbResetEditor(template) {

    template = lbCreateTemplate(1, 1);
    template.state = LB_TemplateStateActive;

    // Hide/Show alert elements
    document.getElementById("alertSuccessMessage").style.display = "none";
    document.getElementById("alertErrorMessage").style.display = "block";

    document.getElementById("alertErrorMessage").style.visibility = "hidden";
    document.getElementById("alertSuccessMessage").style.visibility = "hidden";

    document.getElementById("saveLoadingGlyphicon").style.visibility = "hidden";

    return template;
}


function lbSaveTemplate(template) {

    // Check if editor is open
    var canvas = lbGetTemplateCanvas();
    if (canvas.style.visibility == "hidden") {
        return template;
    }

    var nt = new lbTemplate(template);          // Create simplified template object
    
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

    return template;
}



/* Handle template editor main events *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */
function lbHandleNewTemplateQuery(template) {

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


function lbHandleThrowTemplateConfirm(template) {

    template = lbCreateTemplate(1, 1);
    template.state = LB_TemplateStateActive;

    return template;
}


function lbHandleSaveTemplateQuery(template) {

    if (template.state == LB_TemplateStateActive) {             // Open Save modal


    }

}


function lbHandleCancelTemplateQuery(template) {                        // Fires off the cancel modal

    if (template.state == LB_TemplateStateActive) {
        $("#mdlCancelTemplate").modal();
    }
}


function lbHandleCancelTemplateConfirm(template) {

    var canvas = lbGetTemplateCanvas();
    
    if (template.state == LB_TemplateStateActive) {             // Open Cancel template modal

        template.state = LB_TemplateStateInactive;
        canvas.style.visibility = "hidden";
    }
}



