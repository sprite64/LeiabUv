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

    this.hoverPane = 1;
    this.selectedPane = 2;

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


var paneSelectorData = undefined;

