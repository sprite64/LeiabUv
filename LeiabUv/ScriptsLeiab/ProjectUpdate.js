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


/*
    Code to properly set values first. Then implement a system that limits/corrects values



*/


lbRenderSelectorFrame();


function lbGetInnerSelectorFrameRect() {

    var x = selector.frameSize;
    var y = selector.frameSize;

    var w = selector.paneSize * selector.columns + selector.columns + 1;
    var h = selector.paneSize * selector.rows + selector.rows + 1;

    var rect = new lbCreateRect(x, y, w, h);

    return rect;
}


function lbGetOuterSelectorFrameRect() {

    var rect = lbGetInnerSelectorFrameRect();

    var w = rect.width + selector.frameSize * 2 + 2;
    var h = rect.height + selector.frameSize * 2 + 2;

    var x = Math.round((LB_PaneSelectCanvasSize - w) * 0.5);
    var y = Math.round((LB_PaneSelectCanvasSize - h) * 0.5);

    rect.x = x;
    rect.y = y;

    rect.width = w;
    rect.height = h;

    return rect;
}


// Gets selector pane rectangle by index
function lbGetSelectorPaneRect(index) {

    var outerRect = lbGetOuterSelectorFrameRect();      // Get rectangels
    var innerRect = lbGetInnerSelectorFrameRect();

    var x = outerRect.x + innerRect.x + 2 + selector.paneSize * selector.panes[index].xIndex + selector.panes[index].xIndex;
    var y = outerRect.y + innerRect.y + 2 + selector.paneSize * selector.panes[index].yIndex + selector.panes[index].yIndex;

    var w = selector.paneSize * selector.panes[index].colSpan + selector.panes[index].colSpan - 1;
    var h = selector.paneSize * selector.panes[index].rowSpan + selector.panes[index].rowSpan - 1;

    var rect = new lbCreateRect(x, y, w, h);

    return rect;
}


// Update mouse position
function lbUpdateMousePosition(e) {

    if (selector == undefined) return;

    var mouseX = parseInt(e.clientX);                               // Get event data
    var mouseY = parseInt(e.clientY);

    var canvasOffset = $("#" + LB_PaneSelectCanvasId).offset();       // Get canvas element offset

    selector.mouseX = Math.round(mouseX - canvasOffset.left);                   // Update mouse position
    selector.mouseY = Math.round(mouseY - canvasOffset.top);                    // Using round because at some times mouseX will return a float

    //alert("Mouse: " + paneSelectorData.mouseX + ", " + paneSelectorData.mouseY);
}


function lbProjectUpdate(action) {          // action specifies what action to preform

    if (selector == undefined) return;

    var yOffset = $(window).scrollTop();    // Taking scroll y offset into account for pane collision

    switch (action) {

        case "mouseMove":

            // Find hover pane
            selector.hoverPane = -1;
            for (var i = 0; i < selector.nrOfPanes; i++) {
                
                var rect = lbGetSelectorPaneRect(i);
                

                // Check collision
                if (selector.mouseX > rect.x && selector.mouseX <= rect.x + rect.width) {
                    if (selector.mouseY + yOffset > rect.y && selector.mouseY + yOffset <= rect.y + rect.height) {
                        selector.hoverPane = i;
                    }
                }
            }

            break;
        case "mouseUp":

            // Select pane
            if (selector.hoverPane != -1) {
                selector.selectedPane = selector.hoverPane;

                // Update measure input data
                var paneId = selector.selectedPane;

                $("#paneWidth").val(lbGetSelectedPaneWidth());
                $("#paneHeight").val(lbGetSelectedPaneHeight());

                // Update profile and Ug value
                //$("#profileList").val(lbGetSelectedProfile());
                $("#paneUg").val(lbGetSelectedUg());

                var profileId = lbGetSelectedProfile();
                $("#profileList").val(profileId);

                // *** ### *** ### *** ### *** ### *** ### *** ### *** ### *** ### *** ### *** ### *** ### *** ### *** ### *** ### *** ### 
                // Update T/B/L/R profile inputs
                $("#profileListTop").val(lbGetSelectedTopProfile());
                $("#profileListBottom").val(lbGetSelectedBottomProfile());
                $("#profileListLeft").val(lbGetSelectedLeftProfile());
                $("#profileListRight").val(lbGetSelectedRightProfile());
            }

            break;

        default:

            break;
    }
}

// Used in Create.cshtml to update input values
function lbGetSelectedPaneWidth() {

    var paneId = selector.selectedPane;
    return project.panes[paneId].width;
}


function lbGetSelectedPaneHeight() {

    var paneId = selector.selectedPane;
    return project.panes[paneId].height;
}

function lbGetSelectedProfile() {               // *** ### *** This shouldnt work like this, consider the select dropdown list
    var paneId = selector.selectedPane;
    return -1;//project.panes[paneId].profileId;        // profileId should always be -1
}

function lbGetSelectedTopProfile() {
    var i = selector.selectedPane;
    return project.panes[i].profileTopId;
}

function lbGetSelectedBottomProfile() {
    var i = selector.selectedPane;
    return project.panes[i].profileBottomId;
}

function lbGetSelectedLeftProfile() {
    var i = selector.selectedPane;
    return project.panes[i].profileLeftId;
}

function lbGetSelectedRightProfile() {
    var i = selector.selectedPane;
    return project.panes[i].profileRightId;
}


function lbGetSelectedUg() {
    var paneId = selector.selectedPane;
    return project.panes[paneId].ug;
}

function lbGetFrameWidth() {

    if (isNaN(project.frameWidth)) {                // This NaN check is probably not necessary, it's all  handled by the update input functions
        project.frameWidth = 0.0;
        alert("NaN error!");
    }

    return project.frameWidth;
}

function lbGetFrameHeight() {

    if (isNaN(project.frameHeight)) {               // This NaN check is probably not necessary, it's all  handled by the update input functions
        project.frameHeight = 0.0;
        alert("NaN error!");
    }

    return project.frameHeight;
}


// Returns pane width by width array
function lbGetTotalPaneWidth() {

    var id = selector.selectedPane;
    var t = 0.0;

    for (var i = project.panes[id].xIndex; i < project.panes[id].xIndex + project.panes[id].colSpan; i++) {
        t += parseFloat(project.paneWidths[i]);
    }

    return t;
}

function lbGetTotalPaneHeight() {

    var id = selector.selectedPane;
    var t = 0.0;

    for (var i = project.panes[id].yIndex; i < project.panes[id].yIndex + project.panes[id].rowSpan; i++) {
        t += parseFloat(project.paneHeights[i]);
    }

    return t;
}


// Returns delta between pane width and width array
// 
function lbGetPaneWidthDelta() {

    var id = selector.selectedPane;
    var t = lbGetTotalPaneWidth();

    return (project.panes[id].width - t);
}

function lbGetPaneHeightDelta() {

    var id = selector.selectedPane;
    var t = lbGetTotalPaneHeight();

    return (project.panes[id].height - t);
}


// Get oldest width array index from selected pane
function lbGetOldestSelectedPaneWidthArray() {

    var id = selector.selectedPane;
    var oldest = project.paneWidthAgeCounter + 1;
    var oldId = - 1;

    for (var i = project.panes[id].xIndex; i < project.panes[id].xIndex + project.panes[id].colSpan; i++) {
        if (project.paneWidthAge[i] < oldest) {
            oldest = project.paneWidthAge[i];
            oldId = i;
        }
    }

    return oldId;
}

function lbGetOldestSelectedPaneHeightArray() {
         
    var id = selector.selectedPane;
    var oldest = project.paneHeightAgeCounter + 1;
    var oldId = -1;

    for (var i = project.panes[id].yIndex; i < project.panes[id].yIndex + project.panes[id].rowSpan; i++) {
        if (project.paneHeightAge[i] < oldest) {
            oldest = project.paneHeightAge[i];
            oldId = i;
        }
    }

    return oldId;
}


// Get oldest width array index from unselected panes
function lbGetOldestUnselectedPaneWidthArray() {

    var id = selector.selectedPane;
    var oldest = project.paneWidthAgeCounter + 1;
    var oldId = - 1;

    // Find oldest unselected width array index
    for (var i = 0; i < project.columns; i++) {

        //if(i < project.panes[id].xIndex || i >= project.panes[id].xIndex + project.panes[id].colSpan) {
        if(i < project.panes[id].xIndex || i >= project.panes[id].xIndex + project.panes[id].colSpan) {

            if(project.paneWidthAge[i] < oldest) {
                oldest = project.paneWidthAge[i];
                oldId = i;
            }
        }
    }

    return oldId;
}

function lbGetOldestUnselectedPaneHeightArray() {

    var id = selector.selectedPane;
    var oldest = project.paneHeightAgeCounter + 1;
    var oldId = - 1;

    // 
    for(var i = 0; i < project.rows; i ++) {

        if(i < project.panes[id].yIndex || i >= project.panes[id].yIndex + project.panes[id].rowSpan) {

            if(project.paneHeightAge[i] < oldest) {
                oldest = project.paneHeightAge[i];
                oldId = i;
            }
        }
    }

    return oldId;
}


// Gets index of any oldest array width, // any as in selected or unselected
function lbGetAnyOldestPaneWidthArray() {

    //var id = -1;
    var oldest = project.paneWidthAgeCounter + 1;
    var oldId = -1;

    for (var i = 0; i < project.columns; i++) {

        if (project.paneWidthAge[i] < oldest) {
            oldest = project.paneWidthAge[i];
            oldId = i;
        }
    }

    return oldId;
}

function lbGetAnyOldestPaneHeightArray() {

    var oldest = project.paneHeightAgeCounter + 1;
    var oldId = -1;

    for (var i = 0; i < project.rows; i++) {

        if (project.paneHeightAge[i] < oldest) {
            oldest = project.paneHeightAge[i];
            oldId = i;
        }
    }

    return oldId;
}


// Updates pane width from recent changes in width array
// This runs last
function lbUpdatePaneWidthFromWidthArray() {

    //var id = selector.selectedPane;
    var total = 0.0;

    for (var i = 0; i < project.nrOfPanes; i++) {

        for (var x = project.panes[i].xIndex; x < project.panes[i].xIndex + project.panes[i].colSpan; x ++) {
            total += project.paneWidths[x];
        }

        project.panes[i].width = total;
        total = 0.0;
    }
}


function lbUpdatePaneHeightFromHeightArray() {

    //var id = selector.selectedPane;
    var total = 0.0;

    for (var i = 0; i < project.nrOfPanes; i++) {

        for (var y = project.panes[i].yIndex; y < project.panes[i].yIndex + project.panes[i].rowSpan; y++) {
            total += project.paneHeights[y];
        }

        project.panes[i].height = total;
        total = 0.0;
    }
}


// Update width/height arrays by panes width/height
function lbUpdatePanes() {

    // *** Update width data *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 

    // Update frame if selected pane is the same size as frame sizes
    //project.frameWidth;
    //project.selectedPaneWidth/Colspans

    // Something should be considered here, if the width value (or height) doesnt change
    // the respective age counter should not update

    // Update unselected pane width
    var d = lbGetPaneWidthDelta();
    var oldId = lbGetOldestUnselectedPaneWidthArray();

    
    if (d != 0) {       // Update only if delta exists

        project.paneWidths[oldId] -= d;
        /*
        // This should be removed
        project.paneWidthAge[oldId] = project.paneWidthAgeCounter;
        project.paneWidthAgeCounter++;
        */

        // Update selected pane width
        oldId = lbGetOldestSelectedPaneWidthArray();

        //alert("Oldest pane: " + lbGetOldestSelectedPaneWidthArray());

        project.paneWidths[oldId] += d;
        project.paneWidthAge[oldId] = project.paneWidthAgeCounter;      // Update widths age
        project.paneWidthAgeCounter++;



        //alert("Oldest unselected: " + lbGetOldestUnselectedPaneWidthArray());

        // Update pane widths from width array
        lbUpdatePaneWidthFromWidthArray();

    }

    // *** Update height data *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 


    // Update unselected pane height
    d = lbGetPaneHeightDelta();
    
    
    oldId = lbGetOldestUnselectedPaneHeightArray();

    if (d != 0) {       // Update only if delta exists

        project.paneHeights[oldId] -= d;

        /*
        // This should be removed
        project.paneHeightAge[oldId] = project.paneHeightAgeCounter;
        project.paneHeightAgeCounter++;
        */

        // Update selected pane height
        //d = lbGetPaneHeightDelta();
        oldId = lbGetOldestSelectedPaneHeightArray();

        project.paneHeights[oldId] += d;
        project.paneHeightAge[oldId] = project.paneHeightAgeCounter;
        project.paneHeightAgeCounter++;

        lbUpdatePaneHeightFromHeightArray()
    }
}


// Runs on "Update" button hit
function lbProjectUpdatePaneDimensions() {

    var paneId = selector.selectedPane;                         // Selected pane ID

    // Check for NaN and negative input values and revert original value
    var nanError = false;

    if (isNaN(parseFloat($("#paneWidth").val().replace(",", "."))) || parseFloat($("#paneWidth").val().replace(",", ".")) < 0.0) {
        alert("Felaktigt bredd värde");
        $("#paneWidth").val(project.panes[paneId].width);
        nanError = true;
    }

    if (isNaN(parseFloat($("#paneHeight").val().replace(",", "."))) || parseFloat($("#paneHeight").val().replace(",", ".")) < 0.0) {
        alert("Felaktigt höjd värde");
        $("#paneHeight").val(project.panes[paneId].height);
        nanError = true;
    }

    if (nanError) {
        //alert("NaN error!");
        return;
    }
    

    // Correct frame dimensions conditionaly else do nothing
    if (project.panes[paneId].colSpan == project.columns) {
        if(project.frameWidth != parseFloat($("#paneWidth").val().replace(",", "."))) {

            if (confirm("Värde stämmer inte med karm mått, vill du uppdatera karm? (WIDTH)") == true) {
                project.frameWidth = parseFloat($("#paneWidth").val().replace(",", "."));//project.panes[paneId].width;
            } else {
                $("#paneWidth").val(project.panes[paneId].width);
                return;
            }
        }
    }

    if (project.panes[paneId].rowSpan == project.rows) {
        if(project.frameHeight != parseFloat($("#paneHeight").val().replace(",", "."))) {
            if (confirm("Värde stämmer inte med karm mått, vill du uppdatera karm? (HEIGHT)") == true) {
                project.frameHeight = parseFloat($("#paneHeight").val().replace(",", "."));//project.panes[paneId].width;
            } else {
                $("#paneHeight").val(project.panes[paneId].height);
                return;
            }
        }
    }

    // Update frame input if any changes were made above
    $("#frameWidth").val(project.frameWidth);
    $("#frameHeight").val(project.frameHeight);


    // Update pane dimensions
    project.panes[paneId].width = parseFloat($("#paneWidth").val().replace(",", "."));      // Set new widths/heights and replace
    project.panes[paneId].height = parseFloat($("#paneHeight").val().replace(",", "."));    // "," with "." to be float compatible

    $("#paneWidth").val(project.panes[paneId].width);           // Update input boxes to remove garbage values
    $("#paneHeight").val(project.panes[paneId].height);

    lbUpdatePanes();
}




// Gets pane area parts, frame, post and pane
// Returns a PaneAreaParts object on success, -1 on missing profile
function lbGetPaneAreaParts2(paneId) {

    var profileId = project.panes[paneId].profileId;

    if(profileId == -1) { 
        alert("Profile Id is -1, break operation");
        return - 1;
    }

    var parts = new lbPaneAreaParts();
    var profile = profiles[profileId];
    var pane = project.panes[paneId];

    // Calc Total area *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    parts.totalArea = pane.width * pane.height;
    //alert("Total Area: " + parts.totalArea);

    // Calc Frame area *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    if (pane.yIndex == 0) {                                 // Top frame
        parts.frameArea += pane.width * profile.Tf;
        //alert("Frame Area1: " + parts.frameArea);
    }

    if (pane.yIndex + pane.rowSpan == project.rows) {       // Bottom frame
        parts.frameArea += pane.width * profile.Tf;
        //alert("Frame Area2: " + parts.frameArea);
    }

    if (pane.xIndex == 0) {                                 // Left frame
        parts.frameArea += pane.height * profile.Tf;

        if (pane.yIndex == 0) { parts.frameArea -= profile.Tf * 2; }
        //alert("Frame Area3: " + parts.frameArea)
        if (pane.yIndex + pane.rowSpan == project.rows) { parts.frameArea -= profile.Tf * 2; }
        //alert("Frame Area4: " + parts.frameArea)
    }

    if (pane.xIndex + pane.colSpan == project.columns) {    // Right frame
        parts.frameArea += pane.height * profile.Tf;

        if (pane.yIndex == 0) { parts.frameArea -= profile.Tf * 2; }
        //alert("Frame Area5: " + parts.frameArea)
        if (pane.yIndex + pane.rowSpan == project.rows) { parts.frameArea -= profile.Tf * 2; }
        //alert("Frame Area6: " + parts.frameArea)
    }


    // Calc Post area *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    var half = 1;           // Setting to split post (or not to) width in half
    // Half option is not yet implemented

    if (pane.yIndex > 0) {                                  // Top post
        parts.postArea += pane.width * profile.Tp;          // Calc total post area

        if (pane.xIndex == 0) { parts.postArea -= profile.Tf * profile.Tp; }      // Remove [frame * post] areas
        if (pane.xIndex + pane.colSpan == project.columns) { parts.postArea -= profile.Tf * profile.Tp; }
        
        if (pane.xIndex > 0 && pane.xIndex + pane.colSpan <= project.columns) { parts.postArea -= profile.Tp * profile.Tp; }    // Remove [post * post] area left
        if (pane.xIndex >= 0 && pane.xIndex < project.columns - 1) { parts.postArea -= profile.Tp * profile.Tp; }   // Remove [post * post] area right
    }

    if (pane.yIndex + pane.rowSpan < project.rows) {        // Bottom post
        parts.postArea += pane.width * profile.Tp;           // Calc total post area

        if (pane.xIndex == 0) { parts.postArea -= profile.Tf * profile.Tp; }
        if (pane.xIndex + pane.colSpan == project.columns) { parts.postArea -= profile.Tf * profile.Tp; }

        if (pane.xIndex > 0 && pane.xIndex + pane.colSpan <= project.columns) { parts.postArea -= profile.Tp * profile.Tp; }
        if (pane.xIndex >= 0 && pane.xIndex < project.columns - 1) { parts.postArea -= profile.Tp * profile.Tp; }
    }

    
    // Left post only needs to take frame areas into consideration, they are already removed in horizontal posts
    if (pane.xIndex > 0) {                                  // Left post
        parts.postArea += pane.height * profile.Tp;
        
        if (pane.yIndex == 0) { parts.postArea -= profile.Tf * profile.Tp; }
        if (pane.yIndex + pane.rowSpan == project.rows) { parts.postArea -= profile.Tf * profile.Tp; }
    }

    // Right post
    if (pane.xIndex + pane.colSpan < project.columns) {
        
        parts.postArea += pane.height * profile.Tp;

        if (pane.yIndex == 0) { parts.postArea -= profile.Tf * profile.Tp; }
        if (pane.yIndex + pane.rowSpan == project.rows) { parts.postArea -= profile.Tf * profile.Tp; }
    }


    // Calc Pane Area *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    parts.paneArea = parts.totalArea - parts.frameArea - parts.postArea;
    alert("Total: " + parts.totalArea + ", Frame: " + parts.frameArea + ", Post: " + parts.postArea + ", Pane: " + parts.paneArea);

    return parts;
}


// Gets pane area parts, frame, post and pane
// Returns a PaneAreaParts object on success, -1 on missing profile

// This calculates by separate top/bottom/left/right profiles
function lbGetPaneAreaParts(paneId) {

    var profileId = project.panes[paneId].profileId;

    if (profileId == -1) {
        alert("Profile Id is -1, break operation");
        return -1;
    }

    var parts = new lbPaneAreaParts();
    var profile = profiles[profileId];
    var pane = project.panes[paneId];

    // Calc Total area *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    parts.totalArea = pane.width * pane.height;
    //alert("Total Area: " + parts.totalArea);

    // Calc Frame area *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    if (pane.yIndex == 0) {                                 // Top frame
        parts.frameArea += pane.width * profile.Tf;
        //alert("Frame Area1: " + parts.frameArea);
    }

    if (pane.yIndex + pane.rowSpan == project.rows) {       // Bottom frame
        parts.frameArea += pane.width * profile.Tf;
        //alert("Frame Area2: " + parts.frameArea);
    }

    if (pane.xIndex == 0) {                                 // Left frame
        parts.frameArea += pane.height * profile.Tf;

        if (pane.yIndex == 0) { parts.frameArea -= profile.Tf * 2; }
        //alert("Frame Area3: " + parts.frameArea)
        if (pane.yIndex + pane.rowSpan == project.rows) { parts.frameArea -= profile.Tf * 2; }
        //alert("Frame Area4: " + parts.frameArea)
    }

    if (pane.xIndex + pane.colSpan == project.columns) {    // Right frame
        parts.frameArea += pane.height * profile.Tf;

        if (pane.yIndex == 0) { parts.frameArea -= profile.Tf * 2; }
        //alert("Frame Area5: " + parts.frameArea)
        if (pane.yIndex + pane.rowSpan == project.rows) { parts.frameArea -= profile.Tf * 2; }
        //alert("Frame Area6: " + parts.frameArea)
    }


    // Calc Post area *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    var half = 1;           // Setting to split post (or not to) width in half
    // Half option is not yet implemented

    if (pane.yIndex > 0) {                                  // Top post
        parts.postArea += pane.width * profile.Tp;          // Calc total post area

        if (pane.xIndex == 0) { parts.postArea -= profile.Tf * profile.Tp; }      // Remove [frame * post] areas
        if (pane.xIndex + pane.colSpan == project.columns) { parts.postArea -= profile.Tf * profile.Tp; }

        if (pane.xIndex > 0 && pane.xIndex + pane.colSpan <= project.columns) { parts.postArea -= profile.Tp * profile.Tp; }    // Remove [post * post] area left
        if (pane.xIndex >= 0 && pane.xIndex < project.columns - 1) { parts.postArea -= profile.Tp * profile.Tp; }   // Remove [post * post] area right
    }

    if (pane.yIndex + pane.rowSpan < project.rows) {        // Bottom post
        parts.postArea += pane.width * profile.Tp;           // Calc total post area

        if (pane.xIndex == 0) { parts.postArea -= profile.Tf * profile.Tp; }
        if (pane.xIndex + pane.colSpan == project.columns) { parts.postArea -= profile.Tf * profile.Tp; }

        if (pane.xIndex > 0 && pane.xIndex + pane.colSpan <= project.columns) { parts.postArea -= profile.Tp * profile.Tp; }
        if (pane.xIndex >= 0 && pane.xIndex < project.columns - 1) { parts.postArea -= profile.Tp * profile.Tp; }
    }


    // Left post only needs to take frame areas into consideration, they are already removed in horizontal posts
    if (pane.xIndex > 0) {                                  // Left post
        parts.postArea += pane.height * profile.Tp;

        if (pane.yIndex == 0) { parts.postArea -= profile.Tf * profile.Tp; }
        if (pane.yIndex + pane.rowSpan == project.rows) { parts.postArea -= profile.Tf * profile.Tp; }
    }

    // Right post
    if (pane.xIndex + pane.colSpan < project.columns) {

        parts.postArea += pane.height * profile.Tp;

        if (pane.yIndex == 0) { parts.postArea -= profile.Tf * profile.Tp; }
        if (pane.yIndex + pane.rowSpan == project.rows) { parts.postArea -= profile.Tf * profile.Tp; }
    }


    // Calc Pane Area *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    parts.paneArea = parts.totalArea - parts.frameArea - parts.postArea;
    alert("Total: " + parts.totalArea + ", Frame: " + parts.frameArea + ", Post: " + parts.postArea + ", Pane: " + parts.paneArea);

    return parts;
}


/*
this.totalArea = 0.0;
this.frameArea = 0.0;
this.postArea = 0.0;
this.paneArea = 0.0;
*/


// Function below and function above need to correct a NaN input error, if Nan then make it zero
// *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 

// Update changes made to frame dimensions
function lbProjectUpdateFrameDimensions() {

    // Correct NaN errors, fall back on previous values or return; and show 
    
    // Check for NaN

    // Check for NaN and negative input values and revert original value
    var nanError = false;

    if (isNaN(parseFloat($("#frameWidth").val().replace(",", "."))) || parseFloat($("#frameWidth").val().replace(",", ".")) < 0.0) {
        alert("Felaktigt bredd värde");
        $("#frameWidth").val(project.frameWidth);
        nanError = true;
    }

    if (isNaN(parseFloat($("#frameHeight").val().replace(",", "."))) || parseFloat($("#frameHeight").val().replace(",", ".")) < 0.0) {
        alert("Felaktigt höjd värde");
        $("#frameHeight").val(project.frameHeight);
        nanError = true;
    }

    if (nanError) {
        return;
    }


    // *** Update width data *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    var id = lbGetAnyOldestPaneWidthArray();
    var delta = parseFloat($("#frameWidth").val().replace(",", ".")) - project.frameWidth;
    
    project.paneWidths[id] += delta;
    project.frameWidth += delta;

    project.paneWidthAge[id] = project.paneWidthAgeCounter;
    project.paneWidthAgeCounter++;

    lbUpdatePaneWidthFromWidthArray();

    // *** Update height data *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    id = lbGetAnyOldestPaneHeightArray();
    delta = parseFloat($("#frameHeight").val().replace(",", ".")) - project.frameHeight;

    project.paneHeights[id] += delta;
    project.frameHeight += delta;

    project.paneHeightAge[id] = project.paneHeightAgeCounter;
    project.paneHeightAgeCounter++;

    lbUpdatePaneHeightFromHeightArray();
}


// Basic profile list management functions
function lbAppendProfile(i) {       // i is the profile array index, not the profile id

    var pid = profiles[i].Id;
    var ptext = "[" + profiles[i].Name + "], [" + profiles[i].Glass + "]";
    
    $("#profileList").append($('<option/>', { id: "profileId" + pid, value: pid, text: ptext }));

    $("#profileListTop").append($('<option/>', { id: "profileTopId" + pid, value: pid, text: ptext }));
    $("#profileListBottom").append($('<option/>', { id: "profileBottomId" + pid, value: pid, text: ptext }));
    $("#profileListLeft").append($('<option/>', { id: "profileLeftId" + pid, value: pid, text: ptext }));
    $("#profileListRight").append($('<option/>', { id: "profileRightId" + pid, value: pid, text: ptext }));
}


function lbPrependProfile(i) {      // i is the profile id, not the profile array index

    // Capture profile name/text
    var txt = $("#profileId" + i).text();

    // Remove before prepending
    $("#profileId" + i).remove();

    $("#profileTopId" + i).remove();
    $("#profileBottomId" + i).remove();
    $("#profileLeftId" + i).remove();
    $("#profileRightId" + i).remove();

    //alert("Prepending: " + txt);

    // Prepend
    $("#profileList").prepend($('<option/>', { id: "profileId" + i, value: i, text: txt }));

    $("#profileListTop").prepend($('<option/>', { id: "profileTopId" + i, value: i, text: txt }));
    $("#profileListBottom").prepend($('<option/>', { id: "profileBottomId" + i, value: i, text: txt }));
    $("#profileListLeft").prepend($('<option/>', { id: "profileLeftId" + i, value: i, text: txt }));
    $("#profileListRight").prepend($('<option/>', { id: "profileRightId" + i, value: i, text: txt }));
}


// This function is called after lbPrependProfile to keep the selected profiles
function lbResetSelectedProfile() {

    var id = selector.selectedPane;

    //$("#profileList").val(project.panes[id].profileId);
    $("#profileList").val(-1);

    $("#profileListTop").val(project.panes[id].profileTopId);
    $("#profileListBottom").val(project.panes[id].profileBottomId);
    $("#profileListLeft").val(project.panes[id].profileLeftId);
    $("#profileListRight").val(project.panes[id].profileRightId);
}


// Update profile list items
function lbInitProfileLists() {

    for (var i = 0; i < profiles.length; i++) {

        //lbAppendProfile(profiles[i].Id, "[" + profiles[i].Name + "], [" + profiles[i].Glass + "]");
        lbAppendProfile(i);

        // Init profile allocation
        profiles[i].allocated = false;
    }
}


function lbUpdateProfileLists() {

    // Find and "allocate" used profiles
    var found = false;

    for (var i = 0; i < profiles.length; i++) {

        for(var x = 0; x < project.panes.length; x++) {

            //if (project.panes[x].profileId == profiles[i].Id) { found = true; }
            if (project.panes[x].profileTopId == profiles[i].Id) { found = true; }
            if (project.panes[x].profileBottomId == profiles[i].Id) { found = true; }
            if (project.panes[x].profileLeftId == profiles[i].Id) { found = true; }
            if (project.panes[x].profileRightId == profiles[i].Id) { found = true; }

            if (found) {
                profiles[i].allocated = true;
                found = false;
                break;
            }
        }
        //project.panes[]
    }

    // Update lists
    for (var i = 0; i < profiles.length; i++) {

        // Prepend
        if (profiles[i].allocated) {
            lbPrependProfile(profiles[i].Id);
            //alert("Prepending " + profiles[i].Id);
        }
        //alert("Prependign...-");
        //lbPrependProfile(i) {      // i is the profile id, not the profile array index
    }

    lbResetSelectedProfile();
}


// Updates pane Profile and Ug
function lbProjectUpdateProfileData() {

    var paneId = selector.selectedPane;
    var u = parseFloat($("#paneUg").val().replace(",", "."));
    
    if (isNaN(u) || u < 0.0) {
        alert("Felaktigt Ug värde");
        $("#paneUg").val(project.panes[paneId].ug);         // Reset Ug
        return;
    }

    //project.panes[paneId].profileId = $("#profileList").val();              // Update main profile
    //lbPrependProfile("#profileList", "");                                   // Prepend selected profile
    
    project.panes[paneId].ug = $("#paneUg").val().replace(",", ".");


    // Update direction specific profiles
    if ($("#profileListTop").val() == -1) {                                 // Update top profile
        project.panes[paneId].profileTopId = $("#profileList").val();
        $("#profileListTop").val($("#profileList").val());
    } else {
        project.panes[paneId].profileTopId = $("#profileListTop").val();
    }
    //lbPrependProfile("#profileListTop", "Top");

    if ($("#profileListBottom").val() == -1) {                              // Update bottom profile
        project.panes[paneId].profileBottomId = $("#profileList").val();
        $("#profileListBottom").val($("#profileList").val());
    } else {
        project.panes[paneId].profileBottomId = $("#profileListBottom").val();
    }
    //lbPrependProfile("#profileListBottom", "Bottom");

    if ($("#profileListLeft").val() == -1) {                                // Update left profile
        project.panes[paneId].profileLeftId = $("#profileList").val();
        $("#profileListLeft").val($("#profileList").val());
    } else {
        project.panes[paneId].profileLeftId = $("#profileListLeft").val();
    }
    //lbPrependProfile("#profileListLeft", "Left");

    if ($("#profileListRight").val() == -1) {                               // Update right profile
        project.panes[paneId].profileRightId = $("#profileList").val();
        $("#profileListRight").val($("#profileList").val());
    } else {
        project.panes[paneId].profileRightId = $("#profileListRight").val();
    }

    lbUpdateProfileLists();
}



// Updates all pane profiles and Ug
function lbProjectUpdateAllProfileData() {  // This functions is currently broken *** *** 

    //var nanError = false;
    var paneId = selector.selectedPane;
    var u = parseFloat($("#paneUg").val().replace(",", "."));

    if (isNaN(u) || u < 0.0) {
        alert("Felaktigt Ug värde");
        //$("#paneUg").val()        // Reset Ug value
        return;
    }

    // Loop through profiles
    for (var i = 0; i < selector.nrOfPanes; i++) {

        if (project.panes[i].ug == 0.0) {       // Update only on "unset" u values
            project.panes[i].ug = u;
        }
        
        //project.panes[i].profileId = $("#profileList").val();
        

        // Update direction specific profiles
        if ($("#profileListTop").val() == -1) {                          // Update top profile
            project.panes[i].profileTopId = $("#profileList").val();
            $("#profileListTop").val($("#profileList").val());
        } else {
            project.panes[i].profileTopId = $("#profileListTop").val();
        }
        

        if ($("#profileListBottom").val() == -1) {                       // Update bottom profile
            project.panes[i].profileBottomId = $("#profileList").val();
            $("#profileListBottom").val($("#profileList").val());
        } else {
            project.panes[i].profileBottomId = $("#profileListBottom").val();
        }
        

        if ($("#profileListLeft").val() == -1) {                         // Update left profile
            project.panes[i].profileLeftId = $("#profileList").val();
            $("#profileListLeft").val($("#profileList").val());
        } else {
            project.panes[i].profileLeftId = $("#profileListLeft").val();
        }
        

        if ($("#profileListRight").val() == -1) {                        // Update right profile
            project.panes[i].profileRightId = $("#profileList").val();
            $("#profileListRight").val($("#profileList").val());
        } else {
            project.panes[i].profileRightId = $("#profileListRight").val();
        }

        lbUpdateProfileLists();
    }
}


// Get selected profile Ug value
function lbGetProfileUg() {

    var profileId = $("#profileList").val();

    for (var i = 0; i < profiles.length; i++) {
        if (profileId == profiles[i].Id) {

            return profiles[i].Ug;
        }
    }
}


// Update Ug value on profile list change
function lbProjectChangeProfile() {

    var id = selector.selectedPane;
    var profileId = $("#profileList").val();

    if (profileId == -1) {
        //project.panes[id].profileId = -1;
        $("#paneUg").val("0");
    } else {
        //project.panes[id].profileId = profileId;

        // Update Ug
        $("#paneUg").val(lbGetProfileUg());
        //alert("Profile ug: " + lbGetProfileUg());
    }
}


function lbUpdateInputButtons() {

    if (selector == undefined) return;

    var id = selector.selectedPane;
    //var paneId = selector.selectedPane;                         // Selected pane ID

    // Pane button update *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    var w = parseFloat($("#paneWidth").val().replace(",", "."));
    var h = parseFloat($("#paneHeight").val().replace(",", "."));
    
    // Default to gray
    var toGray = true;

    // Update
    if(project.panes[id].width != w || project.panes[id].height != h) {
        // Change to green
        $("#btnPaneDimensionsUpdate").removeClass("btn-danger");
        $("#btnPaneDimensionsUpdate").removeClass("btn-default");
        $("#btnPaneDimensionsUpdate").addClass("btn-success");
        toGray = false;
    }

    // Error
    if(isNaN(w) || w < 0.0 || isNaN(h) || h < 0.0) {
        // Change to red
        $("#btnPaneDimensionsUpdate").removeClass("btn-success");
        $("#btnPaneDimensionsUpdate").removeClass("btn-default");
        $("#btnPaneDimensionsUpdate").addClass("btn-danger");
        toGray = false;
    }

    if(toGray) {
        $("#btnPaneDimensionsUpdate").removeClass("btn-success");
        $("#btnPaneDimensionsUpdate").removeClass("btn-danger");
        $("#btnPaneDimensionsUpdate").addClass("btn-default");
    }

    // Frame button update *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    var w = parseFloat($("#frameWidth").val().replace(",", "."));
    var h = parseFloat($("#frameHeight").val().replace(",", "."));

    // Default to gray
    toGray = true;

    // Update
    //if (project.panes[id].width != w || project.panes[id].height != h) {
    if(project.frameWidth != w || project.frameHeight != h) {
        // Change to green
        $("#btnFrameDimensionsUpdate").removeClass("btn-danger");
        $("#btnFrameDimensionsUpdate").removeClass("btn-default");
        $("#btnFrameDimensionsUpdate").addClass("btn-success");
        toGray = false;
    }

    // Error
    if (isNaN(w) || w < 0.0 || isNaN(h) || h < 0.0) {
        // Change to red
        $("#btnFrameDimensionsUpdate").removeClass("btn-success");
        $("#btnFrameDimensionsUpdate").removeClass("btn-default");
        $("#btnFrameDimensionsUpdate").addClass("btn-danger");
        toGray = false;
    }

    if (toGray) {
        // Change to default
        $("#btnFrameDimensionsUpdate").removeClass("btn-success");
        $("#btnFrameDimensionsUpdate").removeClass("btn-danger");
        $("#btnFrameDimensionsUpdate").addClass("btn-default");
    }

    // Profile/Ug button update *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    var ug = parseFloat($("#paneUg").val().replace(",", "."));
    
    // Default to gray
    toGray = true;

    // Update
    // This should also validate profile changes
    //if (project.panes[id].ug != ug || project.panes[id].profileId != $("#profileList").val() ||
    // *** *** Not sure about this change, needs testing
    if (project.panes[id].ug != ug || project.panes[id].profileId != -1 ||
        project.panes[id].profileTopId != $("#profileListTop").val() || project.panes[id].profileBottomId != $("#profileListBottom").val() ||
        project.panes[id].profileLeftId != $("#profileListLeft").val() || project.panes[id].profileRightId != $("#profileListRight").val()) {

        // Change to green
        $("#btnProfileUpdate").removeClass("btn-danger");
        $("#btnProfileUpdate").removeClass("btn-default");
        $("#btnProfileUpdate").addClass("btn-success");

        $("#btnProfileUpdateAll").removeClass("btn-danger");
        $("#btnProfileUpdateAll").removeClass("btn-default");
        $("#btnProfileUpdateAll").addClass("btn-success");

        toGray = false;
    }

    // Error
    // This should also validate profile changes
    if (isNaN(ug) || ug < 0.0) {
        // Change to red
        $("#btnProfileUpdate").removeClass("btn-success");
        $("#btnProfileUpdate").removeClass("btn-default");
        $("#btnProfileUpdate").addClass("btn-danger");

        $("#btnProfileUpdateAll").removeClass("btn-success");
        $("#btnProfileUpdateAll").removeClass("btn-default");
        $("#btnProfileUpdateAll").addClass("btn-danger");

        toGray = false;
    }

    if (toGray) {
        $("#btnProfileUpdate").removeClass("btn-success");
        $("#btnProfileUpdate").removeClass("btn-danger");
        $("#btnProfileUpdate").addClass("btn-default");

        $("#btnProfileUpdateAll").removeClass("btn-success");
        $("#btnProfileUpdateAll").removeClass("btn-danger");
        $("#btnProfileUpdateAll").addClass("btn-default");
    }
}


function lbProjectUpdateAndRender(action) {

    
    lbProjectUpdate(action);
    lbProjectRender();

    // If a dimension value has been entered but not updated the update button changes to green appearance
    // and if there is nothing to udpate the button is gray
    lbUpdateInputButtons();

    // There should also be a limit to how many decimal points are allowed, two but three at the most

    // Apart from that, it would be really nice to have a max/min input value to avoid negative pane dimension calculations, because they do happen
    // and add a minimum size for panes, perhaps 300mm or so.

    //$("#scrollTopper").text("Top: " + $(window).scrollTop());
}

