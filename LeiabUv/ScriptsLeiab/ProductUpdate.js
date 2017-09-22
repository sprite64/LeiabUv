

function lbUpdateTabInput() {

    var txt = $("#productVal0").val();
    //var tabs = txt.indexOf(LB_TAB);

    // Text input correction
    txt.replace(LB_TAB + LB_TAB, LB_TAB)
    txt.replace(LB_TAB + LB_TAB + LB_TAB, LB_TAB)
    
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

                $("#productVal" + dest).val(output);
                
                dest++;
                output = "";
                
            }

        }

        if (output.length > 0) {                    // Set any left-over output
            $("#productVal" + dest).val(output);
        }

    }
    
}

