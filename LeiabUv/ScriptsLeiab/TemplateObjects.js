/*  Template Objects
    
    Pritam Schönberger 2016

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


// lbPane and lbTemplate work as a transition from the bulky template/editor object
function lbPane(x, y, colSpan, rowSpan) {
    this.x = x;
    this.y = y;
    this.colSpan = colSpan;
    this.rowSpan = rowSpan;
}


function lbTemplate(template) {

    this.name = $("#inTemplateName").val();

    this.columns = template.cols;
    this.rows = template.rows;

    var pi = 0;         // Pane index
    var paneCount = lbGetParentCount(template);

    this.paneCount = paneCount;

    this.panes = new Array(paneCount);

    for (var x = 0; x < template.cols; x++) {           // Create pane objects
        for (var y = 0; y < template.rows; y++) {

            if (template[x][y].parentCellX == -1) {     // Add pane to array

                this.panes[pi] = new lbPane(x, y, template[x][y].colSpan, template[x][y].rowSpan);
                pi ++;
            }
        }
    }
}


// Create Pane/Luft
function lbCreatePane() {

    var pane = new Object();

    pane.colSpan = 1;
    pane.rowSpan = 1;

    pane.parentCellX = -1;
    pane.parentCellY = -1;

    return pane;
}


// Create Template/Mall
function lbCreateTemplate(cols, rows) {

    var template = lbCreate2DArray(cols, rows); 	// Create grid
    template.cols = cols;
    template.rows = rows;

    template.state = LB_TemplateStateInactive;      // State of editor

    template.offsetX = LB_ModelOffsetX;             // Render offset
    template.offsetY = LB_ModelOffsetY;

    for (var y = 0; y < rows; y++) { 		        // Add cells to grid
        for (var x = 0; x < cols; x++) {
            template[x][y] = lbCreatePane();
        }
    }

    template.mouseX = 0;
    template.mouseY = 0;

    template.cellWidth = LB_ModelPaneWidth; 	    // Set proportional settings
    template.cellHeight = LB_ModelPaneHeight;

    template.mainBorderSize = LB_ModelFrameBorderSize;
    template.cellBorderSize = LB_ModelPaneBorderSize;
    

    template.selectedCellX = -1; 			    	// Init interactive properties
    template.selectedCellY = -1;

    template.hoverCellX = -1;
    template.hoverCellY = -1;
    template.hovering = false;

    return template; 							    // Return window model object
}

