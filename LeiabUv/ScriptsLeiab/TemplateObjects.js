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


// Graphics settings for icon and editor
function lbCreateGraphicsSettings(type) {


    this.type = type;                   // Type of gfx settings
    
    var self = this;
    if (type == "editor") {             // Editor graphical settings *** ***

        self.offsetX = 20;                       // Units/Misc settings
        self.offsetY = 20;

        self.paneWidth = 40;
        self.paneHeight = 40;

        self.frameBorderSize = 8;
        self.paneBorderSize = 6;


        self.backgroundColor = "#fff";          // Color settings

        self.frameBorderColor = "#000";
        self.frameBackgroundColor = "#ddd";

        self.postBackgroundColor = "#bbb";

        self.paneGridColor = "#ddd";

        self.hoveredPaneColor = "#aaf";
        self.selectedPaneColor = "#ffa";

        self.mainBorderSize = 8;
        self.cellBorderSize = 6;

    } else if (type = "icon") {         // Icon graphical settings *** ***

        self.offsetX = 1;                       // Units/Misc settings
        self.offsetY = 1;

        self.paneWidth = 10;
        self.paneHeight = 10;

        self.frameBorderSize = 4;
        self.paneBorderSize = 2;


        self.backgroundColor = "#fff";          // Color settings

        self.frameBorderColor = "#000";
        self.frameBackgroundColor = "#ddd";

        self.postBackgroundColor = "#bbb";

        self.paneGridColor = "#ddd";

        self.hoveredPaneColor = "#aaf";
        self.selectedPaneColor = "#ffa";

        self.mainBorderSize = 4;
        self.cellBorderSize = 2;
    }
}


// lbPane and lbTemplate work as a transition from the bulky template/editor object
function lbPane() {
    this.colSpan = 1;
    this.rowSpan = 1;
    this.parentCellX = - 1;
    this.parentCellY = - 1;
}


function lbPaneData(xIndex, yIndex, colSpan, rowSpan) {
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.colSpan = colSpan;
    this.rowSpan = rowSpan;
}


// Slightly confusing but, this class is a middlehand between the editor template object 
// and template only data to be stored in the database
function lbTemplateData() {
    
    this.name = $("#inTemplateName").val();

    this.columns = template.cols;
    this.rows = template.rows;

    var pi = 0;         // Pane index
    var paneCount = lbGetParentCount();

    this.paneCount = paneCount;
    
    this.panes = new Array(paneCount);
    

    for (var x = 0; x < template.cols; x++) {           // Create pane objects
        for (var y = 0; y < template.rows; y++) {

            if (template.grid[x][y].parentCellX == -1) {     // Add pane to array

                this.panes[pi] = new lbPaneData(x, y, template.grid[x][y].colSpan, template.grid[x][y].rowSpan);
                pi ++;
            }
        }
    }
}


function lbAlertTemplateDate(td) {
    var output = "TemplateData: " + td.Name + ", cols: " + td.columns + ", rows: " + td.rows + ", paneCount: " + td.panes.length;

    for (var i = 0; i < td.panes.length; i++) {
        output += ", xIndex " + td.panes[i].xIndex + ", yIndex " + td.panes[i].yIndex;
        output += ", cSpan " + td.panes[i].colSpan + ", rSpan " + td.panes[i].rowSpan;
    }

    alert(output);
}


function lbAlertTemplateEditor() {

    var output = "TEditor cols " + template.cols + ", " + template.rows + ", " + template.maxCols + ", " + template.maxRows + 
        ", " + template.state + ", " + template.activeGfxSettings + ", " + template.activeCanvasId;
    alert(output);
}


// Template editor data
function lbTemplateEditor() {

    // Create grid with max cols and rows
    //this.grid = new lbCreate2DArray(LB_TemplateMaxColumns, LB_TemplateMaxRows);
    this.grid = lbCreate2DArray(LB_TemplateMaxColumns, LB_TemplateMaxRows);
    
    this.cols = 1;
    this.rows = 1;

    this.maxCols = LB_TemplateMaxColumns;
    this.maxRows = LB_TemplateMaxRows;

    this.state = LB_TemplateStateInactive;

    // Graphics settings
    this.activeGfxSettings = "editor";
    this.activeCanvasId = LB_TemplateCanvasId;
    //this.activeCanvasId = LB_IconCanvasId;

    //this.editorGfxSettings = new lbCreateGraphicsSettings("editor");
    //this.iconGfxSettings = new lbCreateGraphicsSettings("icon");

    this.mouseX = 0;
    this.mouseY = 0;

    // Occupy grid with panes
    for (var y = 0; y < this.maxRows; y++) {
        for (var x = 0; x < this.maxCols; x++) {
            this.grid[x][y] = new lbPane();
        }
    }

    // Init interactive properties
    this.selectedCellX = -1; 			    	
    this.selectedCellY = -1;

    this.hoverCellX = -1;
    this.hoverCellY = -1;
    this.hovering = false;
}


// Global template editor
var template = new lbTemplateEditor();                  // Actual editor
var backupTemplate = new lbTemplateEditor();            // Store data between rendering a template and icons
var templateIconData = undefined;                       // All template icon data

