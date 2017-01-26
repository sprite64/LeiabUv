/*  Template Init
    
    Pritam Schönberger 2016, 2017

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

    $("#btnSelectTemplate").click(function () { window.location.replace("/Template/Show"); });      // Redirect to template gallery to select a template

});


setInterval(function () { lbProjectUpdateAndRender(""); }, 300);

