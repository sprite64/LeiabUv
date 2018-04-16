/*  Template Init
    
    Pritam Schönberger 2016

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Produkt - Product
        Mall    - Template
        Båge    - -
*/


// JQuery Ready/Initiation
$(function () {



    /* Button events and control */
    //$("#btnCreateWindowProject").click(function () { window.location.replace("/Project/Create/" + selectedTemplateId); });
    $("#btnCreateWindowProject").click(function () { window.location.replace("/Project/Create/" + selectedTemplateId + "?window=1"); });
    $("#btnCreateDoorProject").click(function () { window.location.replace("/Project/Create/" + selectedTemplateId + "?window=0"); });

    //$("#btnCreateWindowProject").click(function () { window.location.replace("/Project/CreateWindow/" + selectedTemplateId + "?window=1"); });
    //$("#btnCreateWindowProject").click(function () { window.location.replace("/Project/Create?id=" + selectedTemplateId); });
    //$("#btnCreateDoorProject").click(function () { window.location.replace("/Project/CreateDoor/" + selectedTemplateId + "?door=1"); });

    /*
    function deleteTemplate() {
        var id = @Model.id;


    }

    //$("#btnDeleteTemplate").click(function () { lbDeleteTemplate(selectedTemplateId); });
    $("#btnDeleteTemplate").click(function () {
        if (confirm("Vill du radera mallen?")) { 
            //window.location.replace("/Template/Display?deleteTemplateId=" + selectedTemplateId);
            deleteTemplate();
        }
    });
    */


    /*
    function foo(id) {
        var url = '@Url.Action("Details", "Branch", new { id = "__id__" })';
        window.location.href = url.replace('__id__', id);
    }*/


    template.state = LB_TemplateStateIdle;

    //lbTemplateUpdateAndRender("");
    
});

//setInterval(function () { lbTemplateUpdateAndRender(""); }, 300);


