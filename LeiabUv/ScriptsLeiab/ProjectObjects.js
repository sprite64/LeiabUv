/*  Template Objects
    
    Pritam Schönberger 2016, 2017

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Produkt - Product
        Mall    - Template
        Båge    - -

    For all LEIAB functions and possibly some data a prefix [lb] is utilized.
    Constants utilizes [LB_] to note the use of the variable/"constant"

*/


function lbPaneData(xIndex, yIndex, colSpan, rowSpan, width, height) {

    this.xIndex = xIndex;           // Position indices
    this.yIndex = yIndex;

    this.colSpan = colSpan;         // Spans
    this.rowSpan = rowSpan;

    this.width = width;             // Dimensions in millimeters
    this.height = height;

    this.ug = 0.0;                  // Pane Ug value
    this.productId = -1;

}


function lbPaneParts() {

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
}


// To be renamed ProjectEntry
// New Project object is to contain a projectEntries[] array of entries
function lbProjectEntry(data) {

    this.name = "Entryname";
    this.description = "Entry description";

    this.columns = data.columns;
    this.rows = data.rows;

    this.nrOfPanes = data.panes.length;

    this.panes = new Array(data.panes.length);
    for (var i = 0; i < data.panes.length; i++) {
        this.panes[i] = new lbPaneData(data.panes[i].xIndex, data.panes[i].yIndex,
            data.panes[i].colSpan, data.panes[i].rowSpan,
            LB_DefaultPaneWidthMM * data.panes[i].colSpan, LB_DefaultPaneHeightMM * data.panes[i].rowSpan);
    }

    this.frameWidth = LB_DefaultPaneWidthMM * data.columns;           // Frame dimensions
    this.frameHeight = LB_DefaultPaneHeightMM * data.rows;            // Update this for dimension of 1230x1480

    this.paneWidths = new Array(this.columns);      // Pane origin widths and heights
    this.paneHeights = new Array(this.rows);

    for (var i = 0; i < this.columns; i++) {        // Initiate width
        this.paneWidths[i] = LB_DefaultPaneWidthMM;
    }

    for (var i = 0; i < this.rows; i++) {
        this.paneHeights[i] = LB_DefaultPaneHeightMM;
    }

    this.paneWidthAge = new Array(this.columns);    // The age/timestamp of each pane
    this.paneHeightAge = new Array(this.rows);

    this.paneWidthAgeCounter = 0;                     // Width/height counter/ager
    this.paneHeightAgeCounter = 0;

    // Initiate age and counters
    for (var i = this.columns - 1; i >= 0; i --) {
    //for (var i = 0; i < this.columns; i++) {
        this.paneWidthAge[i] = this.paneWidthAgeCounter;
        this.paneWidthAgeCounter ++;
    }

    for(var i = this.rows - 1; i >= 0; i --) {
    //for (var i = 0; i < this.rows; i++) {
        this.paneHeightAge[i] = this.paneHeightAgeCounter;
        this.paneHeightAgeCounter ++;
    }

    this.uv = -1.0;
}


function lbProject2() {

    this.name = "Project name";     // Project name & descrition
    this.description = "";          // 

    this.orderNr = -1;              // Unique

    this.numEntries                 // Nr of project entries
    //this.entries = 0;
}


// Pane Selector constructor
function lbPaneSelector(data) {


    // Copy data
    this.id = data.Id;
    this.name = data.Name;

    this.columns = data.columns;
    this.rows = data.rows;

    this.nrOfPanes = data.panes.length;

    this.panes = new Array(data.panes.length);
    for (var i = 0; i < data.panes.length; i++) {
        this.panes[i] = new lbPaneData(data.panes[i].xIndex, data.panes[i].yIndex, data.panes[i].colSpan, data.panes[i].rowSpan, 0.0, 0.0);
    }

    this.frameSize = 10; //10;
    this.paneSize = 0;  //40;


    // Calculate pane and frame size
    //if (data.columns > data.rows) {             // Adjust after columns
    //if(data.columns >= data.rows) {
    if(data.columns >= data.rows) {

        var paneSize = ((LB_PaneSelectCanvasSize - LB_PaneSelectMargin * 2) / data.columns);

        var frameSize = paneSize * 0.2;

        var totalSize = LB_PaneSelectCanvasSize + frameSize * 2;
        
        var ratio = (LB_PaneSelectCanvasSize / totalSize);
        //alert("Ratio: " + ratio);

        frameSize = Math.round(frameSize * ratio);
        paneSize = Math.round(paneSize * ratio);
        
        this.frameSize = frameSize;
        this.paneSize = paneSize;

        this.xOffset = 5;
        this.yOffset = 5;


    } else {                                    // Adjust after rows

        var paneSize = ((LB_PaneSelectCanvasSize - LB_PaneSelectMargin * 2) / data.rows);

        var frameSize = paneSize * 0.2;

        var totalSize = LB_PaneSelectCanvasSize + frameSize * 2;

        var ratio = (LB_PaneSelectCanvasSize / totalSize);
        //alert("Ratio: " + ratio);

        frameSize = Math.round(frameSize * ratio);
        paneSize = Math.round(paneSize * ratio);

        this.frameSize = frameSize;
        this.paneSize = paneSize;

        this.xOffset = 5;
        this.yOffset = 5;

    }

    this.postSize = Math.round(frameSize * 0.7);            // Calculate post size/width

    this.hoverPane = -1;
    this.selectedPane = 0;

    this.mouseX = -1;
    this.mouseY = -1;

    /*
        Id = d.Id,
        columns = d.columns,
        rows = d.rows,
        Name = d.Name,
        Created = d.Created,
        CreatedBy = d.CreatedBy,
        Modified = d.Modified,
        ModifiedBy = d.ModifiedBy,
        panes = d.panes.Select(f => new TemplatePaneViewModel
        {
            Id = f.Id,
            colSpan = f.colSpan,
            rowSpan = f.rowSpan,
            xIndex = f.xIndex,
            yIndex = f.yIndex
        }).ToList<TemplatePaneViewModel>()
    */

}

var project = undefined;
var entry = undefined;                // Project data
var selector = undefined;               // Pane selector data
var products = undefined;               // List of product data

