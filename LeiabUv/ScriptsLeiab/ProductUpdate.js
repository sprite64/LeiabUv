﻿

function lbUpdateTabInput() {

    var txt = $("#txtFromExcel").val() + LB_TAB;

    $("#txtFromExcel").val("");

    if (txt.length > 0 && txt.indexOf(LB_TAB) > 0) {        // Don't expect a tab on first char
        //alert("Text: " + txt);

        var output = "";
        var chr = "";
        var dest = 0;

        for (var i = 0; i < txt.length; i++) {

            chr = txt.charAt(i);

            if (chr != LB_TAB) {                    // Append char to output
                output += chr;
            } else {

                if (output.length == 0) {
                    output = "0,0";
                }

                $("#productVal" + dest).val(output);
                //alert("Segment: \"" + output + "\"");
                dest++;
                output = "";
                
            }

        }

        //if (output.length > 0) {                    // Set any left-over output
        //   $("#productVal" + dest).val(output);
        //}

    }
    
}


// Changes the save button color if input is valid
// also returns a bool result
//if (isNaN(parseFloat($("#paneWidth").val().replace(",", "."))) || parseFloat($("#paneWidth").val().replace(",", ".")) < 0.0) {
function lbUpdateInput() {

    // Init
    var valid = true;
    var tmp = 0.0;

    // Validate name
    if ($("#productVal0").val().length < 1) { valid = false; }
    
    tmp = $("#productVal1").val(); if (isNaN(parseFloat(tmp.replace(",", "."))) || parseFloat(tmp.replace(",", ".")) < 0.0) { valid = false; }
    tmp = $("#productVal2").val(); if (isNaN(parseFloat(tmp.replace(",", "."))) || parseFloat(tmp.replace(",", ".")) < 0.0) { valid = false; }
    tmp = $("#productVal3").val(); if (isNaN(parseFloat(tmp.replace(",", "."))) || parseFloat(tmp.replace(",", ".")) < 0.0) { valid = false; }

    tmp = $("#productVal4").val(); if (isNaN(parseFloat(tmp.replace(",", "."))) || parseFloat(tmp.replace(",", ".")) < 0.0) { valid = false; }
    tmp = $("#productVal5").val(); if (isNaN(parseFloat(tmp.replace(",", "."))) || parseFloat(tmp.replace(",", ".")) < 0.0) { valid = false; }
    tmp = $("#productVal6").val(); if (isNaN(parseFloat(tmp.replace(",", "."))) || parseFloat(tmp.replace(",", ".")) < 0.0) { valid = false; }

    tmp = $("#productVal7").val(); if (isNaN(parseFloat(tmp.replace(",", "."))) || parseFloat(tmp.replace(",", ".")) < 0.0) { valid = false; }

    if ($("#productVal8").val().length < 1) { valid = false; }


    // Update button color
    if (valid) {
        $("#btnSaveProduct").removeClass("btn-danger");
        $("#btnSaveProduct").addClass("btn-success");

        return true;
    } else {
        $("#btnSaveProduct").removeClass("btn-success");
        $("#btnSaveProduct").addClass("btn-danger");

        return false;
    }
}


function lbSaveProduct() {

    // Validate input data
    if (lbUpdateInput() == false) {
        alert("Felaktiga värden!");
        return;
    }

    // Create product object
    var prod = new lbProduct();

    prod.name = $("#productVal0").val();

    prod.tf = $("#productVal1").val();
    prod.uf = $("#productVal2").val();
    prod.yf = $("#productVal3").val();

    prod.tp = $("#productVal4").val();
    prod.up = $("#productVal5").val();
    prod.yp = $("#productVal6").val();

    prod.ug = $("#productVal7").val();
    prod.glass = $("#productVal8").val();

    prod.info = $("#productVal9").val();

    prod.window = true;
    prod.deprecated = false;


    // AJAX request
    var j = JSON.stringify(prod);                 // Create JSON product object

    document.getElementById("saveLoadingGlyphicon").style.visibility = "visible";

    $.getJSON("/Product/Save?json=" + j, function (data) {
        
        document.getElementById("saveLoadingGlyphicon").style.visibility = "hidden";

        if (data == "ok") {
            //alert("Product saved!");

            // Prepend successfully saved product
            var output = "";
            output += '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>'
            output += '<span style="margin-left: 10px;">Produkten ' + $("#productVal0").val() + ' har sparats!</span><br />'

            
            document.getElementById("alertSuccessMessage").style.visibility = "visible";

            $("#alertSuccessMessage").prepend(output);

            // Clear input fields
            $("#productVal0").val("");

            $("#productVal1").val("");
            $("#productVal2").val("");
            $("#productVal3").val("");

            $("#productVal4").val("");
            $("#productVal5").val("");
            $("#productVal6").val("");

            $("#productVal7").val("");
            $("#productVal8").val("");

            $("#productVal9").val("");

        } else {
            if (data == "name.already.in.use") {
                alert("Produktnamnet används redan.");
            }
        }

        //alert(data);
    });



    //this.id = 0;
    //this.created = "";
    /*
    this.name = "";
    
    this.tf = 0.0;
    this.uf = 0.0;
    this.yf = 0.0;

    this.tp = 0.0;
    this.up = 0.0;
    this.yp = 0.0;
    
    this.ug = 0.0;
    this.glass = "";

    this.window = true;
    this.deprecated = false;

    this.info = "";
    */
}
