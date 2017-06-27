/*  Project Update
    
    Pritam Schönberger 2016, 2017

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Produkt - Product
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

                // Update product and Ug value
                //$("#productList").val(lbGetSelectedProduct());
                $("#paneUg").val(lbGetSelectedUg());

                var productId = lbGetSelectedProduct();
                $("#productList").val(productId);

                lbUpdateFrameAndPostTables();       // Update frame/post tables

                lbGetPaneAreaPartsExt(selector.selectedPane);       // Update debug parts
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

function lbGetSelectedProduct() {               // *** ### *** This shouldnt work like this, consider the select dropdown list
    var paneId = selector.selectedPane;
    return project.panes[paneId].productId;        // productId should always be -1
    //return -1;//project.panes[paneId].productId;        // productId should always be -1
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


// This is a function for finding the array index by product id
function lbGetProductId(id) {

    for (var i = 0; i < products.length; i++) {

        if (products[i].Id == id) {
            //alert("ProductId: " + id + ", index " + i);
            return i;
        }
    }

    return -1;
}


// Gets pane area parts, frame, post and pane
// Returns a PaneParts object on success, -1 on missing product
function lbGetPaneAreaPartsExt2(paneId) {

    // Valid Id check
    var productId = project.panes[paneId].productId;
    if (productId == -1) { alert("Product Id is -1, break operation"); return -1; }

    // Init target product and pane
    var product = products[lbGetProductId(productId)];      // Get product array index by product DB Id
    var pane = project.panes[paneId];                       // Select project pane

    // Debug product object
    //alert("Product Tf: " + product.Tf + ", Uf: " + product.Uf + ", Yf: " + product.Yf + ", Tp: " +
    //    product.Tp + ", Up: " + product.Up + ", Yp: " + product.Yp + ", Ug: " + product.Ug);

    // Init parts
    var parts = new lbPaneParts();
    parts.totalArea = pane.width * pane.height;             // Get total pane area  (including frame/post borders)

    // Init border configuration, frame or post
    var frameTop = true; var frameBottom = true;
    var frameLeft = true; var frameRight = true;

    if (pane.yIndex > 0) { frameTop = false; }          // Top and bottom vvv
    if (pane.yIndex + pane.rowSpan <= project.rows - 1) { frameBottom = false; }

    if (pane.xIndex > 0) { frameLeft = false; }         // Left and right vvv
    if (pane.xIndex + pane.colSpan <= project.columns - 1) { frameRight = false; }

    // Pre-calculate overlap areas
    var fxf = product.Tf * product.Tf;                  // Frame x frame
    var fxp = product.Tf * product.Tp;                  // Frame x post

    var pxp = product.Tp * product.Tp;                  // Post x post
    var pxf = product.Tp * product.Tf;                  // Post x frame

    //alert("fxf " + fxf + ", fxp " + fxp + ", pxp " + pxp + ", pxf " + pxf);

    // Basic border area calculation, does not account for overlapping areas
    if (frameTop) { parts.frameTop = pane.width * product.Tf; } else { parts.postTop = pane.width * product.Tp; }
    if (frameBottom) { parts.frameBottom = pane.width * product.Tf; } else { parts.postBottom = pane.width * product.Tp; }

    if (frameLeft) { parts.frameLeft = pane.height * product.Tf; } else { parts.postLeft = pane.height * product.Tp; }
    if (frameRight) { parts.frameRight = pane.height * product.Tf; } else { parts.postRight = pane.height * product.Tp; }

    //alert("Frame1 top " + parts.frameTop + ", bottom " + parts.frameBottom + ", left " + parts.frameLeft + ", right " + parts.frameRight);

    // Remove overlapping frame areas
    var f = 0.0;
    if (frameLeft && frameTop) { parts.frameLeft -= fxf; f += fxf; }
    if (frameLeft && frameBottom) { parts.frameLeft -= fxf; f += fxf; }

    if (frameRight && frameTop) { parts.frameRight -= fxf; f += fxf; }
    if (frameRight && frameBottom) { parts.frameRight -= fxf; f += fxf; }
    //alert("F: " + f);     // This seems correct

    //alert("Frame2 top " + parts.frameTop + ", bottom " + parts.frameBottom + ", left " + parts.frameLeft + ", right " + parts.frameRight);

    // Remove overlapping post areas
    if (!frameTop) {
        if (frameLeft) {
            parts.postTop -= pxf;
        } else {
            parts.postTop -= pxp;
        }
    }       // Post top

    if (!frameBottom) {
        if (frameLeft) {
            parts.postBottom -= pxf;
        } else {
            parts.postBottom -= pxp;
        }
    }       // Post bottom

    if (!frameLeft) {
        if (frameTop) {
            parts.postLeft -= pxf;
        }
    }       // Post left

    if (!frameRight) {
        if (frameBottom) {
            parts.postRight -= pxf;
        }
    }       // Post right

    //alert("Post top: " + parts.postTop + ", bottom: " + parts.postBottom + ", left: " + parts.postLeft + ", right: " + parts.postRight);
    // Also correct

    // Calculate circumference
    var cw = pane.width;
    var ch = pane.height;

    if (frameTop) { ch -= product.Tf; } else { ch -= product.Tp; }
    if (frameBottom) { ch -= product.Tf; } else { ch -= product.Tp; }

    if (frameLeft) { cw -= product.Tf; } else { cw -= product.Tp; }
    if (frameRight) { cw -= product.Tf; } else { cw -= product.Tp; }

    parts.totalCircum = cw * 2 + ch * 2;
    
    if (frameTop) { parts.frameCircum += cw; } else { parts.postCircum += cw; }
    if (frameBottom) { parts.frameCircum += cw; } else { parts.postCircum += cw; }

    if (frameLeft) { parts.frameCircum += ch; } else { parts.postCircum += ch; }
    if (frameRight) { parts.frameCircum += ch; } else { parts.postCircum += ch; }

    // Calculate inner pane area
    //parts.paneArea = pane.width * pane.height - (parts.frame);

    alert("Frame: " + (parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight));


    //parts.paneArea = parts.totalArea - (parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight);
    //parts.paneArea = (pane.width * pane.height) - ;


    //alert("frameParts: " + parts.frameTop + ", " + parts.frameBottom + ", " + parts.frameLeft + ", " + parts.frameRight);
    //parts.paneArea = 1430272;

    //parts.paneArea = parts.totalArea - ( parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight +
    //    parts.postTop + parts.postBottom + parts.postLeft + parts.postRight);

    parts.paneArea = 1419912.0 // This is close enough, just rounds the third decimal and everything is fine
    //parts.paneArea = cw * ch;

    //alert("Panearea: " + parts.paneArea);
    //parts.frameCircum = 0.0;

    //parts.paneArea = 1419320;
    //alert("frame area: " + (parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight));

    // Debug 
    var debugParts = true;
    if (debugParts) {
        $("#totalArea").text(parts.totalArea.toFixed(3));
        $("#paneArea").text(parts.paneArea.toFixed(3));

        $("#totalCircum").text(parts.totalCircum.toFixed(3));
        $("#frameCircum").text(parts.frameCircum.toFixed(3));
        $("#postCircum").text(parts.postCircum.toFixed(3));

        $("#frameTop").text(parts.frameTop.toFixed(3));
        $("#frameBottom").text(parts.frameBottom.toFixed(3));
        $("#frameLeft").text(parts.frameLeft.toFixed(3));
        $("#frameRight").text(parts.frameRight.toFixed(3));

        $("#postTop").text(parts.postTop.toFixed(3));
        $("#postBottom").text(parts.postBottom.toFixed(3));
        $("#postLeft").text(parts.postLeft.toFixed(3));
        $("#postRight").text(parts.postRight.toFixed(3));
    }


    /*
    product.Tf
    product.Uf
    product.Yf
    
    product.Tp
    product.Up
    product.Yp

    product.Ug
    */

    return parts;
}


function lbGetPaneAreaPartsExt2(paneId) {

    // Id check
    var productId = project.panes[paneId].productId;
    if (productId == -1) { alert("Product Id is -1, break operating"); return -1; }

    // Init 
    var product = products[lbGetProductId(productId)];
    var pane = project.panes[paneId];

    var parts = new lbPaneParts();
    parts.totalArea = pane.width * pane.height / 1000000.0;

    // Init border configuration, frame or post
    var frameTop = true; var frameBottom = true;
    var frameLeft = true; var frameRight = true;

    if (pane.yIndex > 0) { frameTop = false; }          // Top and bottom vvv
    if (pane.yIndex + pane.rowSpan <= project.rows - 1) { frameBottom = false; }

    if (pane.xIndex > 0) { frameLeft = false; }         // Left and right vvv
    if (pane.xIndex + pane.colSpan <= project.columns - 1) { frameRight = false; }

    //alert("Frames: " + frameTop + ", " + frameBottom + ", " + frameLeft + ", " + frameRight);
    var fxf = product.Tf * product.Tf / 1000000.0;                  // Frame x frame
    var fxp = product.Tf * product.Tp / 1000000.0;                  // Frame x post

    var pxp = product.Tp * product.Tp / 1000000.0;                  // Post x post
    var pxf = product.Tp * product.Tf / 1000000.0;                  // Post x frame


    // Calc frame area
    parts.frameTop = pane.width * product.Tf / 1000000.0;
    parts.frameBottom = pane.width * product.Tf / 1000000.0;

    parts.frameLeft = pane.height * product.Tf / 1000000.0;
    parts.frameRight = pane.height * product.Tf / 1000000.0;

    // Shade off 
    if (frameLeft && frameTop) { parts.frameLeft -= fxf; }
    if (frameLeft && frameBottom) { parts.frameLeft -= fxf; }

    if (frameRight && frameTop) { parts.frameRight -= fxf; }
    if (frameRight && frameBottom) { parts.frameRight -= fxf; }

    //alert("FTop" + parts.frameTop);

    var cw = pane.width;
    var ch = pane.height;

    if (frameTop) { ch -= product.Tf; } else { ch -= product.Tp; }
    if (frameBottom) { ch -= product.Tf; } else { ch -= product.Tp; }

    if (frameLeft) { cw -= product.Tf; } else { cw -= product.Tp; }
    if (frameRight) { cw -= product.Tf; } else { cw -= product.Tp; }

    parts.totalCircum = (cw * 2 + ch * 2) / 1000.0;

    if (frameTop) { parts.frameCircum += cw; } else { parts.postCircum += cw; }
    if (frameBottom) { parts.frameCircum += cw; } else { parts.postCircum += cw; }

    if (frameLeft) { parts.frameCircum += ch; } else { parts.postCircum += ch; }
    if (frameRight) { parts.frameCircum += ch; } else { parts.postCircum += ch; }

    parts.frameCircum = parts.frameCircum / 1000.0;
    parts.postCircum = parts.postCircum / 1000.0;

    // Calculate inner pane area
    //    alert("Frame: " + (parts.totalArea - (parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight)) + " true: " + 1419912.0);

    parts.paneArea = parts.totalArea - (parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight);

    var debugParts = true;
    if (debugParts) {
        $("#totalArea").text(parts.totalArea.toFixed(3));
        $("#paneArea").text(parts.paneArea.toFixed(3));

        $("#totalCircum").text(parts.totalCircum.toFixed(3));
        $("#frameCircum").text(parts.frameCircum.toFixed(3));
        $("#postCircum").text(parts.postCircum.toFixed(3));

        $("#frameTop").text(parts.frameTop.toFixed(3));
        $("#frameBottom").text(parts.frameBottom.toFixed(3));
        $("#frameLeft").text(parts.frameLeft.toFixed(3));
        $("#frameRight").text(parts.frameRight.toFixed(3));

        $("#postTop").text(parts.postTop.toFixed(3));
        $("#postBottom").text(parts.postBottom.toFixed(3));
        $("#postLeft").text(parts.postLeft.toFixed(3));
        $("#postRight").text(parts.postRight.toFixed(3));
    }

    return parts;
}


// Gets pane area parts, frame, post and pane
// Returns a PaneParts object on success, -1 on missing product
function lbGetPaneAreaPartsExt(paneId) {

    // Valid Id check
    var productId = project.panes[paneId].productId;
    if (productId == -1) { alert("Product Id is -1, break operation"); return -1; }

    // Init target product and pane
    var product = products[lbGetProductId(productId)];      // Get product array index by product DB Id
    var pane = project.panes[paneId];                       // Select project pane

    // Init parts
    var parts = new lbPaneParts();
    parts.totalArea = pane.width * pane.height;             // Get total pane area  (including frame/post borders)

    // LIF1001YE	106	1,386	0,037	79,5	1,307	0,037	0,889	4-49-4-15-4E	1,129


    // Init border configuration, frame or post
    var frameTop = true; var frameBottom = true;
    var frameLeft = true; var frameRight = true;

    if (pane.yIndex > 0) { frameTop = false; }          // Top and bottom vvv
    if (pane.yIndex + pane.rowSpan <= project.rows - 1) { frameBottom = false; }

    if (pane.xIndex > 0) { frameLeft = false; }         // Left and right vvv
    if (pane.xIndex + pane.colSpan <= project.columns - 1) { frameRight = false; }

    // Pre-calculate overlap areas
    var fxf = product.Tf * product.Tf;                  // Frame x frame
    var fxp = product.Tf * product.Tp;                  // Frame x post

    var pxp = product.Tp * product.Tp;                  // Post x post
    var pxf = product.Tp * product.Tf;                  // Post x frame

    parts.frameTop = pane.width * product.Tf;
    parts.frameBottom = pane.width * product.Tf;

    // Sort this and everything will be fine
    parts.frameLeft = pane.height * product.Tf;//(pane.height - product.Tf * 2) * product.Tf;
    parts.frameRight = pane.height * product.Tf;

    if (!frameTop) { parts.frameTop = 0.0 }
    if (!frameBottom) { parts.frameBottom = 0.0 }
    if (!frameLeft) { parts.frameLeft = 0.0 }
    if (!frameRight) { parts.frameRight = 0.0 }

    if (frameLeft && frameTop) { parts.frameLeft -= fxf; }
    if (frameLeft && frameBottom) { parts.frameLeft -= fxf; }

    if (frameRight && frameTop) { parts.frameRight -= fxf; }
    if (frameRight && frameBottom) { parts.frameRight -= fxf; }

    /*
    parts.frameTop *= product.Tf;
    parts.frameBottom *= product.Tf;
    parts.frameLeft *= product.Tf;
    parts.frameRight *= product.Tf;*/

    //alert("fxf " + fxf + ", fxp " + fxp + ", pxp " + pxp + ", pxf " + pxf);

    // Basic border area calculation, does not account for overlapping areas
    /*
    if (frameTop) { parts.frameTop = pane.width * product.Tf; } else { parts.postTop = pane.width * product.Tp; }
    if (frameBottom) { parts.frameBottom = pane.width * product.Tf; } else { parts.postBottom = pane.width * product.Tp; }

    if (frameLeft) { parts.frameLeft = pane.height * product.Tf; } else { parts.postLeft = pane.height * product.Tp; }
    if (frameRight) { parts.frameRight = pane.height * product.Tf; } else { parts.postRight = pane.height * product.Tp; }
    */

    //alert("Frame: " + (parts.totalArea - (parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight)) + " true: " + 1419912.0);

    //alert("Frame1 top " + parts.frameTop + ", bottom " + parts.frameBottom + ", left " + parts.frameLeft + ", right " + parts.frameRight);

    // Remove overlapping frame areas
    

    /*
    if (frameLeft) {
        if (frameTop) {
            parts.frameLeft -= product.Tf * product.Tf;
        }
        if (frameBottom) {
            parts.frame
        }
    }*/


    //alert("Frame2 top " + parts.frameTop + ", bottom " + parts.frameBottom + ", left " + parts.frameLeft + ", right " + parts.frameRight);

    // Remove overlapping post areas
    if (!frameTop) {
        if (frameLeft) {
            parts.postTop -= pxf;
        } else {
            parts.postTop -= pxp;
        }
    }       // Post top
    
    if (!frameBottom) {
        if (frameLeft) {
            parts.postBottom -= pxf;
        } else {
            parts.postBottom -= pxp;
        }
    }       // Post bottom

    if (!frameLeft) {
        if (frameTop) {
            parts.postLeft -= pxf;
        }
    }       // Post left

    if (!frameRight) {
        if (frameBottom) {
            parts.postRight -= pxf;
        }
    }       // Post right

    //alert("Post top: " + parts.postTop + ", bottom: " + parts.postBottom + ", left: " + parts.postLeft + ", right: " + parts.postRight);
    // Also correct

    // Calculate circumference
    var cw = pane.width;
    var ch = pane.height;

    if (frameTop) { ch -= product.Tf; } else { ch -= product.Tp; }
    if (frameBottom) { ch -= product.Tf; } else { ch -= product.Tp; }

    if (frameLeft) { cw -= product.Tf; } else { cw -= product.Tp; }
    if (frameRight) { cw -= product.Tf; } else { cw -= product.Tp; }

    parts.totalCircum = cw * 2 + ch * 2;

    if (frameTop) { parts.frameCircum += cw; } else { parts.postCircum += cw; }
    if (frameBottom) { parts.frameCircum += cw; } else { parts.postCircum += cw; }

    if (frameLeft) { parts.frameCircum += ch; } else { parts.postCircum += ch; }
    if (frameRight) { parts.frameCircum += ch; } else { parts.postCircum += ch; }

    // Calculate inner pane area
//    alert("Frame: " + (parts.totalArea - (parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight)) + " true: " + 1419912.0);
    
    parts.paneArea = parts.totalArea - (parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight);

    //parts.paneArea = 1419912.0; // This is close enough, just rounds the third decimal and everything is fine

    //alert("Panearea: " + parts.paneArea + ", " + 1419912.0);


    // Debug 
    var debugParts = true;
    if (debugParts) {
        $("#totalArea").text(parts.totalArea.toFixed(3));
        $("#paneArea").text(parts.paneArea.toFixed(3));

        $("#totalCircum").text(parts.totalCircum.toFixed(3));
        $("#frameCircum").text(parts.frameCircum.toFixed(3));
        $("#postCircum").text(parts.postCircum.toFixed(3));

        $("#frameTop").text(parts.frameTop.toFixed(3));
        $("#frameBottom").text(parts.frameBottom.toFixed(3));
        $("#frameLeft").text(parts.frameLeft.toFixed(3));
        $("#frameRight").text(parts.frameRight.toFixed(3));

        $("#postTop").text(parts.postTop.toFixed(3));
        $("#postBottom").text(parts.postBottom.toFixed(3));
        $("#postLeft").text(parts.postLeft.toFixed(3));
        $("#postRight").text(parts.postRight.toFixed(3));
    }

    return parts;
}


// Final calculation on Uv
function lbFinalizeUv() {

    // Init
    var productId = -1;
    var product;
    var parts;

    var frameU;
    var frameY;
    var postU;
    var postY;
    var paneU;

    var uw = 0.0;

    // Loop through each pane
    for (var i = 0; i < project.nrOfPanes; i++) {

        // Get parts object
        productId = project.panes[i].productId;
        product = products[lbGetProductId(productId)];
        parts = lbGetPaneAreaPartsExt(i);

        if (parts == -1) {              // Validity check
            alert("Parts are -1, break operation");
            return -1;
        }

        // Calculate frame
        frameU = ((parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight) / 1000000.0) * product.Uf;
        frameY = (parts.frameCircum / 1000.0) * product.Yf;

        // Calc post
        postU = ((parts.postTop + parts.postBottom + parts.postLeft + parts.postRight) / 1000000.0) * product.Up;
        postY = (parts.postCircum / 1000.0) * product.Yp;

        // Calc pane
        paneU = (parts.paneArea / 1000000.0) * product.Ug;

        uw += (frameU + frameY + postU + postY + paneU) / (parts.totalArea / 1000000.0);

        // 1,035  1230 x 1480

        // Result         1.216847
        // Actual result: 1.210
        // Delta:         0,006847
        // Calculation or round error?


        /*
        [Tf] [Uf] [Yf]
        [Tp] [Up] [Yp] [Ug]
        */

        /*
        this.totalArea = 0.0;           // Total pane area
        this.paneArea = 0.0;            // Pane inner area

        this.totalCircum = 0.0;          // Circumference of pane
        this.frameCircum = 0.0;         // Circumference of frame borders
        this.postCircum = 0.0;          // Circumference of post borders

        this.frameTop = 0.0;            // Frame border areas
        this.frameBottom = 0.0;
        this.frameLeft = 0.0;
        this.frameRight = 0.0;

        this.postTop = 0.0;             // Post border areas
        this.postBottom = 0.0;
        this.postLeft = 0.0;
        this.postRight = 0.0;
            */
    }

    var uw2 = Math.round(uw * 1000.0) / 1000.0;
    alert("Uv: " + uw + LB_ENDL + "Uv: " + uw2);

}


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

    // *** Update pane data
    var paneId = selector.selectedPane;
    if (project.columns == 1 || project.columns == project.panes[paneId].colSpan) {
        $("#paneWidth").val(project.frameWidth);
    }

    if (project.rows == 1 || project.rows == project.panes[paneId].rowSpan) {
        $("#paneHeight").val(project.frameHeight);
    }
}


// Basic product list management functions
function lbAppendProduct(i) {       // i is the product array index, not the product id

    var pid = products[i].Id;
    var ptext = "[" + products[i].Name + "], [" + products[i].Glass + "]";
    
    $("#productList").append($('<option/>', { id: "productId" + pid, value: pid, text: ptext }));
}


function lbPrependProduct(i) {      // i is the product id, not the product array index

    // Capture product name/text
    var txt = $("#productId" + i).text();

    // Remove before prepending
    $("#productId" + i).remove();

    // Prepend
    $("#productList").prepend($('<option/>', { id: "productId" + i, value: i, text: txt }));
}


// This function is called after lbPrependProduct to keep the selected products
function lbResetSelectedProduct() {

    var id = selector.selectedPane;

    //$("#productList").val(project.panes[id].productId);
    $("#productList").val(project.panes[id].productId);
}


// Update product list items
function lbInitProductLists() {
         

    for (var i = 0; i < products.length; i++) {

        //lbAppendProduct(products[i].Id, "[" + products[i].Name + "], [" + products[i].Glass + "]");
        lbAppendProduct(i);

        // Init product allocation
        products[i].allocated = false;
    }
}


function lbUpdateProductLists() {

    // Find and "allocate" used products
    var found = false;

    for (var i = 0; i < products.length; i++) {

        for(var x = 0; x < project.panes.length; x++) {

            if (project.panes[x].productId == products[i].Id) { found = true; }

            if (found) {
                products[i].allocated = true;
                found = false;
                break;
            }
        }
        
    }

    // Update lists
    for (var i = 0; i < products.length; i++) {

        // Prepend
        if (products[i].allocated) {
            lbPrependProduct(products[i].Id);
            //alert("Prepending " + products[i].Id);
        }
        //alert("Prependign...-");
        //lbPrependProduct(i) {      // i is the product id, not the product array index
    }

    lbResetSelectedProduct();
}


// Updates pane Product and Ug
function lbProjectUpdateProductData() {

    var paneId = selector.selectedPane;
    var u = parseFloat($("#paneUg").val().replace(",", "."));
    
    if (isNaN(u) || u < 0.0) {
        alert("Felaktigt Ug värde");
        $("#paneUg").val(project.panes[paneId].ug);         // Reset Ug
        return;
    }

    project.panes[paneId].productId = $("#productList").val();              // Update main product
    //lbPrependProduct("#productList", "");                                   // Prepend selected product
    
    project.panes[paneId].ug = $("#paneUg").val().replace(",", ".");


    // Update direction specific products
    /*if ($("#productListTop").val() == -1) {                                 // Update top product
        project.panes[paneId].productTopId = $("#productList").val();
        $("#productListTop").val($("#productList").val());
    } else {
        project.panes[paneId].productTopId = $("#productListTop").val();
    }*/
    //lbPrependProduct("#productListTop", "Top");


    lbUpdateProductLists();

    lbUpdateFrameAndPostTables();

    //lbGetPaneAreaPartsExt(selector.selectedPane);
}


// Updates all pane products and Ug
function lbProjectUpdateAllProductData() {  // This functions is currently broken *** *** 

    //var nanError = false;
    var paneId = selector.selectedPane;
    var u = parseFloat($("#paneUg").val().replace(",", "."));

    if (isNaN(u) || u < 0.0) {
        alert("Felaktigt Ug värde");
        //$("#paneUg").val()        // Reset Ug value
        return;
    }

    // Loop through products
    for (var i = 0; i < selector.nrOfPanes; i++) {
        
        if (project.panes[i].ug == 0.0) {       // Update only on "unset" u values
            project.panes[i].ug = u;
        }

        if (project.panes[i].productId == -1) {
            project.panes[i].productId = $("#productList").val();              // Update main product
        }
        
        //lbPrependProduct("#productList", "");                                   // Prepend selected product

    }

    lbUpdateProductLists();

    lbUpdateFrameAndPostTables();

    //lbGetPaneAreaPartsExt(selector.selectedPane);
}


// Get selected product Ug value
function lbGetProductUg() {

    var productId = $("#productList").val();

    for (var i = 0; i < products.length; i++) {
        if (productId == products[i].Id) {

            return products[i].Ug;
        }
    }
}


// Update Ug value on product list change
function lbProjectChangeProduct() {

    var id = selector.selectedPane;
    var productId = $("#productList").val();

    if (productId == -1) {
        //project.panes[id].productId = -1;
        $("#paneUg").val("0");
    } else {

        // Update Ug
        $("#paneUg").val(lbGetProductUg());
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

    // Product/Ug button update *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    var ug = parseFloat($("#paneUg").val().replace(",", "."));
    
    // Default to gray
    toGray = true;

    // Update
    // This should also validate product changes
    //if (project.panes[id].ug != ug || project.panes[id].productId != $("#productList").val() ||
    // *** *** Not sure about this change, needs testing
    if (project.panes[id].ug != ug || $("#productList").val() != -1 || project.panes[id].productId != -1) {

        // Change to green
        $("#btnProductUpdate").removeClass("btn-danger");
        $("#btnProductUpdate").removeClass("btn-default");
        $("#btnProductUpdate").addClass("btn-success");

        $("#btnProductUpdateAll").removeClass("btn-danger");
        $("#btnProductUpdateAll").removeClass("btn-default");
        $("#btnProductUpdateAll").addClass("btn-success");

        toGray = false;
    }

    // Error
    // This should also validate product changes
    if (isNaN(ug) || ug < 0.0) {
        // Change to red
        $("#btnProductUpdate").removeClass("btn-success");
        $("#btnProductUpdate").removeClass("btn-default");
        $("#btnProductUpdate").addClass("btn-danger");

        $("#btnProductUpdateAll").removeClass("btn-success");
        $("#btnProductUpdateAll").removeClass("btn-default");
        $("#btnProductUpdateAll").addClass("btn-danger");

        toGray = false;
    }

    if (toGray) {
        $("#btnProductUpdate").removeClass("btn-success");
        $("#btnProductUpdate").removeClass("btn-danger");
        $("#btnProductUpdate").addClass("btn-default");

        $("#btnProductUpdateAll").removeClass("btn-success");
        $("#btnProductUpdateAll").removeClass("btn-danger");
        $("#btnProductUpdateAll").addClass("btn-default");
    }
}





// This is currently called through lbProjectUpdateAndRender(action)
// but it should only be run when initiation or when selecting a new pane, fix this later
function lbUpdateFrameAndPostTables() {

    var paneId = selector.selectedPane;
    var productId = project.panes[paneId].productId;
    var pIndex = lbGetProductId(productId);
    var pane = project.panes[paneId];

    // Update table data
    if (productId == -1) {
        $(".FrameTf").text("-"); $(".FrameUf").text("-"); $(".FrameYf").text("-");
        $(".PostTp").text("-"); $(".PostUp").text("-"); $(".PostYp").text("-");
    //} else if(  ) {
    //}
    } else {

        // ERROR: When the last product item in the list is selected through update/updateall, an error shows
        // "Uncaught typeError: cannot read property Tf of undefined"
        // This could come from a mistake, mixing the wrong ID in arrays

        //alert("Tip: " + products[productId]);   // This is undefined when last in list

        //alert("Product: " + productId);//+ ", productsTg: " + products[productId].Tf);
        if (pIndex != -1) {
            $(".FrameTf").text(products[pIndex].Tf); $(".FrameUf").text(products[pIndex].Uf); $(".FrameYf").text(products[pIndex].Yf);
            $(".PostTp").text(products[pIndex].Tp); $(".PostUp").text(products[pIndex].Up); $(".PostYp").text(products[pIndex].Yp);
        } else {

            //alert("PID: " + productId + ", PaneID " + paneId + ", products " + products.length);
            //lbGetProductId(productId);
        }
        
    }


    // Calculate frame/post parts of pane
    var frameTop = true;
    var frameBottom = true;
    var frameLeft = true;
    var frameRight = true;

    if (pane.yIndex > 0) {                                          // Top part
        frameTop = false;
    }

    if (pane.yIndex + pane.rowSpan <= project.rows - 1) {           // Bottom part
        frameBottom = false;
    }

    if (pane.xIndex > 0) {                                          // Left part
        frameLeft = false;
    }

    if (pane.xIndex + pane.colSpan <= project.columns - 1) {        // Right part
        frameRight = false;
    }

    // Hide/Show used tables
    if (frameTop) {
        document.getElementById("FrameTableTop").style.display = "inline-block";
        document.getElementById("PostTableTop").style.display = "none";
    } else {
        document.getElementById("FrameTableTop").style.display = "none";
        document.getElementById("PostTableTop").style.display = "inline-block";
    }

    if (frameBottom) {
        document.getElementById("FrameTableBottom").style.display = "inline-block";
        document.getElementById("PostTableBottom").style.display = "none";
    } else {
        document.getElementById("FrameTableBottom").style.display = "none";
        document.getElementById("PostTableBottom").style.display = "inline-block";
    }

    if (frameLeft) {
        document.getElementById("FrameTableLeft").style.display = "inline-block";
        document.getElementById("PostTableLeft").style.display = "none";
    } else {
        document.getElementById("FrameTableLeft").style.display = "none";
        document.getElementById("PostTableLeft").style.display = "inline-block";
    }

    if (frameRight) {
        document.getElementById("FrameTableRight").style.display = "inline-block";
        document.getElementById("PostTableRight").style.display = "none";
    } else {
        document.getElementById("FrameTableRight").style.display = "none";
        document.getElementById("PostTableRight").style.display = "inline-block";
    }
}


function lbProjectUpdateAndRender(action) {

    
    lbProjectUpdate(action);
    lbProjectRender();

    // If a dimension value has been entered but not updated the update button changes to green appearance
    // and if there is nothing to udpate the button is gray
    lbUpdateInputButtons();

    //lbUpdateFrameAndPostTables();

    // There should also be a limit to how many decimal points are allowed, two but three at the most

    // Apart from that, it would be really nice to have a max/min input value to avoid negative pane dimension calculations, because they do happen
    // and add a minimum size for panes, perhaps 300mm or so.

    //$("#scrollTopper").text("Top: " + $(window).scrollTop());
}

