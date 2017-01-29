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


// PaneSelector object constructor, paneCanvasWidth/Height parameters are used to calculate framesize and panesize to fit the pane selection canvas
// 
function lbPaneSelector2(nrOfPanes, columns, rows) {

    var offset = 5;

    var paneCanvasWidth = LB_PaneSelectCanvasWidth - 5 * 2;         // Set to project constants
    var paneCanvasHeight = LB_PaneSelectCanvasHeight - 5 * 2;

    this.columns = columns;
    this.rows = rows;

    this.frameSize = 0; //10;
    this.paneSize = 0;  //40;

    // Calculate frame and pane size
    if (columns > rows) {       // Calculate for width/columns

        var width = 10 * 2;                 // Frame size
        //width += 6 * 2 * (columns - 1);     // Pane border size
        width += 40 * columns;              // Pane size

        var ratio = width / paneCanvasWidth;    // Ratio for sizes, not sure if this is correct or needs to be converted, test and find out

        this.frameSize = (10 * 2) * ratio;         // Update frame and pane size
        this.paneSize = (40 * columns) * ratio;

    } else {                    // Calculate for height/rows

        var height = 10 * 2;
        height += 40 * rows;

        var ratio = height / paneCanvasHeight;

        this.frameSize = (10 * 2) * ratio;
        this.paneSize = (40 * columns) * ratio;

    }

    this.hoverPane = -1;
    this.selectedPane = -1;

    this.xOffset = 5;      // Canvas render offset
    this.yOffset = 5;

    this.nrOfPanes = nrOfPanes;

    this.panes = new Array(this.nrOfPanes);

    for (var i = 0; i < this.nrOfPanes; i++) {
        this.panes[i] = new lbPaneData();
    }
}


function lbFrameData() {

    this.mmWidth = 70;      // Frame width in millimeters
    this.mmHeight = 70;     // Frame height in millimeters

    this.pxWidth = 10;      // Frame width in pixels, derived from mmWidth to fit canvas dimensions
    this.pxHeight = 10;     // frame height in pixels, derived from mmHeight to fit canvas dimensions

    this.pxXOffset = 0;
    this.pxYOffset = 0;

    this.columns = 0;
    this.rows = 0;

    this.horizontalPaneWidths = new Array(this.columns);
    this.verticalPaneHeights = new Array(this.rows);
}


// Pane Selector constructor
function lbPaneSelector(data) {

    var offset = 5;
    //LB_PaneSelectCanvasWidth
    //LB_PaneSelectCanvasHeight
    //LB_PaneSelectMargin

    //var canvasWidth = LB_PaneSelectCanvasWidth - 5 * 2;         // Set to project constants
    //var canvasHeight = LB_PaneSelectCanvasHeight - 5 * 2;

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
    if(true) {

        // Calculate widths: canvasWidth - single px line widths
        var w = (LB_PaneSelectCanvasWidth - LB_PaneSelectMargin) / data.columns;

        w *= 0.2;                                   // Get frame size ratio

        this.frameSize = Math.floor(w);

        w = (LB_PaneSelectCanvasWidth - 2 * this.frameSize);       // Get size of inner rectangle

        this.paneSize = Math.floor(w / data.columns);           // --!!--

        //alert("Pane: " + this.paneSize + ", Frame: " + this.frameSize);
        

        //this.paneSize = Math.floor((LB_PaneSelectCanvasWidth - (LB_PaneSelectMargin * 2 + this.frameSize + (data.panes.length - 1) + 4)) / data.columns);
        
        //this.frameSize = 10;
        //this.paneSize = 40;
        //this.postSize = 6;

    } else {                                    // Adjust after rows

        this.frameSize = 10;
        this.paneSize = 40;
        this.postSize = 6;

        this.frameWidth = LB_PaneSelectCanvasWidth - LB_PaneSelectMargin;
        this.frameHeight = LB_PaneSelectCanvasHeight - LB_PaneSelectMargin;

    }

    this.hoverPane = -1;
    this.selectedPane = -1;

    this.xOffset = 5;      // Canvas render offset
    this.yOffset = 5;


    /*
    // Calculate frame and pane size
    if (columns > rows) {       // Calculate for width/columns

        var width = 10 * 2;                 // Frame size
        //width += 6 * 2 * (columns - 1);     // Pane border size
        width += 40 * columns;              // Pane size

        var ratio = width / canvasWidth;    // Ratio for sizes, not sure if this is correct or needs to be converted, test and find out

        this.frameSize = (10 * 2) * ratio;         // Update frame and pane size
        this.paneSize = (40 * columns) * ratio;

    } else {                    // Calculate for height/rows

        var height = 10 * 2;
        height += 40 * rows;

        var ratio = height / canvasHeight;

        this.frameSize = (10 * 2) * ratio;
        this.paneSize = (40 * columns) * ratio;

    }*/


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


var paneSelectorData = undefined;

