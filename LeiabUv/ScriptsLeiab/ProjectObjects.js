/*  Template Objects
    
    Pritam Schönberger 2016, 2017

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Profil  - Profile
        Mall    - Template
        Båge    - -

    For all LEIAB functions and possibly some data a prefix [lb] is utilized.
    Constants utilizes [LB_] to note the use of the variable/"constant"

*/


function lbPaneData(xIndex, yIndex, colSpan, rowSpan) {

    this.xIndex = xIndex;
    this.yIndex = yIndex;

    this.colSpan = colSpan;
    this.rowSpan = rowSpan;
}


function lbPaneDataGfx() {

    this.x = 0;
    this.y = 0;

    this.width = 0;
    this.height = 0;

}


// All sizes and positions are in pixels
function lbFrameDataGfx() {

    this.xOffset;       // Frame canvas offset
    this.yOffset;

    this.width;         // Outer frame size
    this.height;

    this.topSize;       // Sizes of frame "width"
    this.bottomSize;

    this.leftSize;
    this.rightSize;
}


function lbProject(data) {

    this.name = "Project Name";
    this.description = "Project description";

    this.columns = data.columns;
    this.rows = data.rows;

    this.nrOfPanes = data.panes.length;

    this.panes = new Array(data.panes.length);
    for (var i = 0; i < data.panes.length; i++) {
        this.panes[i] = new lbPaneData(data.panes[i].xIndex, data.panes[i].yIndex, data.panes[i].colSpan, data.panes[i].rowSpan);
    }

    this.paneWidths = new Array(this.columns);      // Pane origin widths and heights
    this.paneHeights = new Array(this.rows);

    for (var i = 0; i < this.columns; i++) {        // Initiate width
        this.paneWidths[i] = 300;
    }

    for (var i = 0; i < this.rows; i++) {
        this.paneHeights[i] = 400;
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

    for (var i = 0; i < this.rows; i++) {
        this.paneHeightAge[i] = this.paneHeightAgeCounter;
        this.paneHeightAgeCounter ++;
    }
}


function lbProjectGraphics() {
    
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
        this.panes[i] = new lbPaneData(data.panes[i].xIndex, data.panes[i].yIndex, data.panes[i].colSpan, data.panes[i].rowSpan);
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
    this.selectedPane = -1;

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

var project = undefined;                // Project data
var selector = undefined;               // Pane selector data


