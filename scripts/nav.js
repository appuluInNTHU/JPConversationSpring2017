function collapse_menu(){
    $(".navbar-collapse").collapse('hide');
}

$(function(){
    // collapse menu on click
    $(window).click(collapse_menu).scroll(collapse_menu);
});
