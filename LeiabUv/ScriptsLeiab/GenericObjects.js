/*  Generic Objects
    
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


// Create Position/Point
function lbCreatePosition(x, y) {
    this.x = x;
    this.y = y;
}


// Create Rectangle, including position

function lbCreateRect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}


// Create 2D Array
function lbCreate2DArray2(cols, rows) {
    this.grid = new Array(cols);
    for (var i = 0; i < cols; i++) {
        this.grid[i] = new Array(rows);
    }
}

function lbCreate2DArray(cols, rows) {

    var grid = new Array(cols);
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    return grid;
}

