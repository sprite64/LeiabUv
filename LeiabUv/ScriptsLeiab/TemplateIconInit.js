/*  Template Init
    
    Pritam Schönberger 2016

    Notes: Words SV/EN
        Karm    - Frame
        Post    - Post
        Luft    - Pane
        Profil  - Profile
        Mall    - Template
        Båge    - -
*/


// JQuery Ready/Initiation
$(function () {

    /* Button events and control */
    $("#btnCreateProject").click(function () { window.location.replace("/Project/Create?id=" + selectedTemplateId); });

    function foo(id) {
        var url = '@Url.Action("Details", "Branch", new { id = "__id__" })';
        window.location.href = url.replace('__id__', id);
    }


    template.state = LB_TemplateStateIdle;

    //lbTemplateUpdateAndRender("");
    
});

//setInterval(function () { lbTemplateUpdateAndRender(""); }, 300);


