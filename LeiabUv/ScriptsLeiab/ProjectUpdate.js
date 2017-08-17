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

                // Update parts info table
                lbUpdatePartsInfo();
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
    /*
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
    }*/

    // Update frame input if any changes were made above
    //$("#frameWidth").val(project.frameWidth);             // Frame dimensions arent supposed to be possible to edit by x/y placement of posts, hence this is not needed
    //$("#frameHeight").val(project.frameHeight);


    // Update pane dimensions
    var x = parseFloat($("#paneWidth").val().replace(",", "."));
    var y = parseFloat($("#paneHeight").val().replace(",", "."));

    project.panes[paneId].width = Math.round(x * 100.0) / 100.0;      // Set new widths/heights and replace
    project.panes[paneId].height = Math.round(y * 100.0) / 100.0;    // "," with "." to be float compatible

    //project.panes[paneId].width = parseFloat($("#paneWidth").val().replace(",", "."));      // Set new widths/heights and replace
    //project.panes[paneId].height = parseFloat($("#paneHeight").val().replace(",", "."));    // "," with "." to be float compatible

    $("#paneWidth").val(project.panes[paneId].width);           // Update input boxes to remove garbage values
    $("#paneHeight").val(project.panes[paneId].height);

    //Math.round(project.panes[i].width * 100.0) / 100.0);//.toFixed(2);

    project.uv = -1.0;          // Reset Uv, it needs recalculation

    lbUpdatePanes();

    lbUpdatePartsInfo();
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
function lbGetPaneAreaPartsExt(paneId) {

    // Valid Id check
    var productId = project.panes[paneId].productId;
    if (productId == -1) { return -1; }     // Error message: "Selected [paneId] pane doesn't have a selected product"
    //if (productId == -1) { alert("Product Id is -1, break operation"); return -1; }

    // Init target product and pane
    var product = products[lbGetProductId(productId)];      // Get product array index by product DB Id
    var pane = project.panes[paneId];                       // Select project pane

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
    var fxp = product.Tf * product.Tp;                  // Frame x post #

    var pxp = product.Tp * product.Tp;                  // Post x post
    var pxf = product.Tp * product.Tf;                  // Post x frame #


    // Init frame values
    parts.frameTop = pane.width * product.Tf;
    parts.frameBottom = pane.width * product.Tf;

    parts.frameLeft = pane.height * product.Tf;
    parts.frameRight = pane.height * product.Tf;

    // Remove frame overlaps
    if (!frameTop) { parts.frameTop = 0.0 }
    if (!frameBottom) { parts.frameBottom = 0.0 }
    if (!frameLeft) { parts.frameLeft = 0.0 }
    if (!frameRight) { parts.frameRight = 0.0 }

    if (frameLeft && frameTop) { parts.frameLeft -= fxf; }
    if (frameLeft && frameBottom) { parts.frameLeft -= fxf; }

    if (frameRight && frameTop) { parts.frameRight -= fxf; }
    if (frameRight && frameBottom) { parts.frameRight -= fxf; }


    // Init post values
    if (!frameTop) { parts.postTop = pane.width * product.Tp; }
    if (!frameBottom) { parts.postBottom = pane.width * product.Tp; }

    if (!frameLeft) { parts.postLeft = pane.height * product.Tp; }
    if (!frameRight) { parts.postRight = pane.height * product.Tp; }

    // Remove post overlaps
    if (!frameTop) {        // Top post
        if (frameLeft) {
            parts.postTop -= pxf;
        } else {
            parts.postTop -= pxp;
        }

        if (frameRight) {
            parts.postTop -= pxf;
        } else {
            parts.postTop -= pxp;
        }
    }

    if (!frameBottom) {     // Bottom post
        if (frameLeft) {
            parts.postBottom -= pxf;
        } else {
            parts.postBottom -= pxp;
        }

        if (frameRight) {
            parts.postBottom -= pxf;
        } else {
            parts.postBottom -= pxp;
        }
    }

    if (!frameLeft) {       // Left post
        if (frameTop) {
            parts.postLeft -= pxf;
        }
        if (frameBottom) {
            parts.postLeft -= pxf;
        }
    }

    if (!frameRight) {      // Right post
        if (frameTop) {
            parts.postRight -= pxf;
        }
        if (frameBottom) {
            parts.postRight -= pxf;
        }
    }

    // Calculate circumference
    var cw = pane.width + 13 * 2;       // 13mm indentation on circumference
    var ch = pane.height + 13 * 2;
    
    // Remove out of bounds/overlap
    if (frameLeft) { cw -= product.Tf; } else { cw -= product.Tp; }
    if (frameRight) { cw -= product.Tf; } else { cw -= product.Tp; }

    if (frameTop) { ch -= product.Tf; } else { ch -= product.Tp; }
    if (frameBottom) { ch -= product.Tf; } else { ch -= product.Tp; }

    // Assign circumference to frame or post
    if (frameTop) { parts.frameCircum += cw; } else { parts.postCircum += cw; }
    if (frameBottom) { parts.frameCircum += cw; } else { parts.postCircum += cw; }

    if (frameLeft) { parts.frameCircum += ch; } else { parts.postCircum += ch; }
    if (frameRight) { parts.frameCircum += ch; } else { parts.postCircum += ch; }

    // Get total circumference
    parts.totalCircum = cw * 2 + ch * 2;
    parts.paneArea = parts.totalArea - (parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight + 
        parts.postTop + parts.postBottom + parts.postLeft + parts.postRight);

    // Debug 
    // ### This is not the place to update parts info table
    //lbUpdatePartsInfo(parts);

    return parts;
}


// Final calculation on Uv
function lbFinalizeUv() {

    // Init
    var productId = -1;
    var product;
    var parts;

    var uv = 0.0;

    var totalFrameU = 0.0;
    var totalFrameY = 0.0;

    var totalPostU = 0.0;
    var totalPostY = 0.0;

    var totalPaneU = 0.0;

    var totalArea = 0.0;


    // Loop through each pane
    for (var i = 0; i < project.nrOfPanes; i++) {

        //alert("Iteration: " + i);

        // Get parts object
        productId = project.panes[i].productId;
        product = products[lbGetProductId(productId)];
        parts = lbGetPaneAreaPartsExt(i);

        if (parts == -1) { $("#totalUValue").text("-"); return -1; } // Error message: One or more panes dont have applied products
        //if (parts == -1) { alert("Parts are -1, break operation"); return -1; }

        totalFrameU += (parts.frameTop + parts.frameBottom + parts.frameLeft + parts.frameRight) * product.Uf;
        totalFrameY += parts.frameCircum * product.Yf;

        totalPostU += (parts.postTop + parts.postBottom + parts.postLeft + parts.postRight) * product.Up;
        totalPostY += parts.postCircum * product.Yp;

        //totalPaneU += parts.paneArea * product.Ug;
        totalPaneU += parts.paneArea * project.panes[i].ug;     // Utilize the custom Ug value setting

        totalArea += parts.totalArea;
        

    }

    // Finalize
    uv = (((totalFrameU + totalPostU + totalPaneU) / 1000000.0) + ((totalFrameY + totalPostY) / 1000.0)) / (totalArea / 1000000.0);
    uvr = Math.round(uv * 1000.0) / 1000.0;

    $("#totalUValue").text(uvr);

    // Update project value
    project.uv = uvr;
    //alert("Uv: " + uv + LB_ENDL + "UvR: " + uvr);
}


// Function below and function above need to correct a NaN input error, if Nan then make it zero
// *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 


// Basic function to limit a nr of decimals, utilized in lbUpdatePartsInfo()
function lbLimitDecimals(val, max) {

    if (isNaN(parseFloat(val))) { return ""; }

    if (val.length == undefined) { val = val + ""; }        // "Typecast"

    if (val.length > max) {
        //alert("Mod! " + val.length);
        val = val.substring(0, max);
    }
    
    return val;
}


// Updates parts information from _selected_ pane
function lbUpdatePartsInfo() {

    var paneId = selector.selectedPane;

    // Valid Id check
    var productId = project.panes[paneId].productId;
    if (productId == -1) {

        // Set default/zero values
        $("#totalArea").text("");
        $("#paneArea").text("");

        $("#totalCircum").text("");
        $("#frameCircum").text("");
        $("#postCircum").text("");

        $("#frameTop").text("");
        $("#frameBottom").text("");
        $("#frameLeft").text("");
        $("#frameRight").text("");

        $("#postTop").text("");
        $("#postBottom").text("");
        $("#postLeft").text("");
        $("#postRight").text("");

        // Error message "Pane doesnt have a product"

        return -1;
    }
    //if (productId == -1) { alert("lbUpdatePartsInfo: No pane selected[" + paneId + "]"); return -1; }

    // Init target product and pane
    //var product = products[lbGetProductId(productId)];      // Get product array index by product DB Id
    //var pane = project.panes[paneId];                       // Select project pane

    // Update parts info of selected pane
    var parts = lbGetPaneAreaPartsExt(paneId);

    // Update table data
    var limitChars = false;     // Turn chr limiting on or off
    var limit = 18;             // Limit to # of characters including .

    if (!limitChars) {

        $("#totalArea").text(parts.totalArea / 1000000.0 + " m²");
        $("#paneArea").text(parts.paneArea / 1000000.0 + " m²");

        $("#totalCircum").text(parts.totalCircum / 1000.0 + " m");
        $("#frameCircum").text(parts.frameCircum / 1000.0 + " m");
        $("#postCircum").text(parts.postCircum / 1000.0 + " m");

        $("#frameTop").text(parts.frameTop / 1000000.0 + " m²");
        $("#frameBottom").text(parts.frameBottom / 1000000.0 + " m²");
        $("#frameLeft").text(parts.frameLeft / 1000000.0 + " m²");
        $("#frameRight").text(parts.frameRight / 1000000.0 + " m²");

        $("#postTop").text(parts.postTop / 1000000.0 + " m²");
        $("#postBottom").text(parts.postBottom / 1000000.0 + " m²");
        $("#postLeft").text(parts.postLeft / 1000000.0 + " m²");
        $("#postRight").text(parts.postRight / 1000000.0 + " m²");

    } else {

        $("#totalArea").text(lbLimitDecimals(parts.totalArea / 1000000.0, limit) + " m²");
        $("#paneArea").text(lbLimitDecimals(parts.paneArea / 1000000.0, limit) + " m²");

        $("#totalCircum").text(lbLimitDecimals(parts.totalCircum / 1000.0, limit) + " m");
        $("#frameCircum").text(lbLimitDecimals(parts.frameCircum / 1000.0, limit) + " m");
        $("#postCircum").text(lbLimitDecimals(parts.postCircum / 1000.0, limit) + " m");

        $("#frameTop").text(lbLimitDecimals(parts.frameTop / 1000000.0, limit) + " m²");
        $("#frameBottom").text(lbLimitDecimals(parts.frameBottom / 1000000.0, limit) + " m²");
        $("#frameLeft").text(lbLimitDecimals(parts.frameLeft / 1000000.0, limit) + " m²");
        $("#frameRight").text(lbLimitDecimals(parts.frameRight / 1000000.0, limit) + " m²");

        $("#postTop").text(lbLimitDecimals(parts.postTop / 1000000.0, limit) + " m²");
        $("#postBottom").text(lbLimitDecimals(parts.postBottom / 1000000.0, limit) + " m²");
        $("#postLeft").text(lbLimitDecimals(parts.postLeft / 1000000.0, limit) + " m²");
        $("#postRight").text(lbLimitDecimals(parts.postRight / 1000000.0, limit) + " m²");
    }

    //$("#paneArea").text(lbLimitDecimals(parts.paneArea / 1000000.0, 18) + " m²");
}


// Update changes made to frame dimensions
// Frame dimensions are limited to fractionless mm
function lbProjectUpdateFrameDimensionsOriginal() {

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

    /*
    // Update parts info of selected pane
    var parts = lbGetPaneAreaPartsExt(paneId);

    // Valid Id check
    var productId = project.panes[paneId].productId;
    if (productId != -1) {
        lbUpdatePartsInfo(parts);
    }*/

    lbUpdatePartsInfo();
}



// Updated version of lpProjectUpdateFrameDimensions()

// Update changes made to frame dimensions
// Frame dimensions are limited to fractionless mm
function lbProjectUpdateFrameDimensions() {

    // Check for NaN and negative input values and revert original value
    var nanError = false;

    // Following parseFloat statements may as well be using parseInt, probably
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

    if (nanError) {     // Reverting value happens above
        return;
        // Possible error message: "Invalid number, "reset/revert" to original number"
    }


    // *** Update width data *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    var id = lbGetAnyOldestPaneWidthArray();
    var delta = parseInt($("#frameWidth").val()) - project.frameWidth;        // This will hopefully guard against floating/decimal frame values
    //var delta = parseFloat($("#frameWidth").val().replace(",", ".")) - project.frameWidth;

    project.paneWidths[id] += delta;
    project.frameWidth += delta;

    project.paneWidthAge[id] = project.paneWidthAgeCounter;
    project.paneWidthAgeCounter++;

    lbUpdatePaneWidthFromWidthArray();

    // *** Update height data *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** 
    id = lbGetAnyOldestPaneHeightArray();
    delta = parseInt($("#frameHeight").val().replace(",", ".")) - project.frameHeight;

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


    // Clear frame dimension fractions
    $("#frameWidth").val(parseInt($("#frameWidth").val()));
    $("#frameHeight").val(parseInt($("#frameHeight").val()));
    
    // Update selected pane parts info
    lbUpdatePartsInfo();

    project.uv = -1.0;          // Reset Uv, it needs recalculation
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

    project.uv = -1.0;          // Reset Uv, it needs recalculation

    lbUpdateProductLists();

    lbUpdateFrameAndPostTables();


    lbUpdatePartsInfo();
    lbUpdateTotalUValueButton();
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

    project.uv = -1.0;          // Reset Uv, it needs recalculation

    lbUpdateProductLists();

    lbUpdateFrameAndPostTables();


    lbUpdatePartsInfo();
    lbUpdateTotalUValueButton();
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


// Update visibility of pane dimension/post placement x y input
function lbUpdatePaneDimensionInput() {
    
    // Init
    var paneId = selector.selectedPane;
    var productId = project.panes[paneId].productId;
    var pIndex = lbGetProductId(productId);
    var pane = project.panes[paneId];

    var showX = true;
    var showY = true;

    if (project.columns == pane.colSpan) {
        // Hide X
        showX = false;
    }

    if (project.rows == pane.rowSpan) {
        // Hide Y
        showY = false;
    }

    if (showX == false && showY == false) {
        // Hide all controls
        document.getElementById("paneLabel").style.display = "none";
        document.getElementById("paneX").style.display = "none";
        document.getElementById("paneY").style.display = "none";
        document.getElementById("paneBrX").style.display = "none";
        document.getElementById("paneBrY").style.display = "inline-block";
        document.getElementById("btnPaneDimensionsUpdate").style.display = "none";

        //document.getElementById("paneFrameSplit1").style.display = "none";
        //document.getElementById("paneFrameSplit2").style.display = "none";
    } else {

        if (showX) {
            document.getElementById("paneX").style.display = "inline-block";
            document.getElementById("paneBrX").style.display = "inline-block";
        } else {
            document.getElementById("paneX").style.display = "none";
            document.getElementById("paneBrX").style.display = "none";
        }

        if (showY) {
            document.getElementById("paneY").style.display = "inline-block";
            document.getElementById("paneBrY").style.display = "inline-block";
        } else {
            document.getElementById("paneY").style.display = "none";
            document.getElementById("paneBrY").style.display = "none";
        }

        document.getElementById("paneLabel").style.display = "inline-block";
        document.getElementById("btnPaneDimensionsUpdate").style.display = "inline-block";

        //document.getElementById("paneFrameSplit1").style.display = "inline-block";
        //document.getElementById("paneFrameSplit2").style.display = "inline-block";
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

    //if (project.panes[id].ug != ug || $("#productList").val() != -1 || project.panes[id].productId != -1) {
    if (project.panes[id].ug != ug) {

        // Above if statement is incomplete, causing the buttons to show green when not suppose to

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


// Update Uv update button
// Doesn't account for all changes, perhaps an easy fix is to set project.uv to -1 again when other changes are made
function lbUpdateTotalUValueButton() {

    var state = "normal";

    for (var i = 0; i < project.nrOfPanes; i++) {
        if (project.panes[i].productId == -1) {
            state = "incomplete";
            break;
        }
    }

    if (state == "normal") {

        if($("#totalUValue").text() == Math.round(project.uv * 1000.0) / 1000.0 + "") {
            // Make gray
            $("#btnUpdateUValue").removeClass("btn-success");
            $("#btnUpdateUValue").removeClass("btn-danger");
            $("#btnUpdateUValue").addClass("btn-default");
        } else {
            // Make green
            $("#btnUpdateUValue").removeClass("btn-default");
            $("#btnUpdateUValue").removeClass("btn-danger");
            $("#btnUpdateUValue").addClass("btn-success");
        }
    } else {
        // Make red
        $("#btnUpdateUValue").removeClass("btn-default");
        $("#btnUpdateUValue").removeClass("btn-success");
        $("#btnUpdateUValue").addClass("btn-danger");
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
            $(".FrameTf").text(products[pIndex].Tf + " mm"); $(".FrameUf").text(products[pIndex].Uf); $(".FrameYf").text(products[pIndex].Yf);
            $(".PostTp").text(products[pIndex].Tp + " mm"); $(".PostUp").text(products[pIndex].Up); $(".PostYp").text(products[pIndex].Yp);
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
    lbUpdatePaneDimensionInput();
    lbUpdateTotalUValueButton();

    //lbUpdateFrameAndPostTables();

    // There should also be a limit to how many decimal points are allowed, two but three at the most

    // Apart from that, it would be really nice to have a max/min input value to avoid negative pane dimension calculations, because they do happen
    // and add a minimum size for panes, perhaps 300mm or so.

    //$("#scrollTopper").text("Top: " + $(window).scrollTop());
}

