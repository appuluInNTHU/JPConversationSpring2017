function collapse_menu(){
    $(".navbar-collapse").collapse('hide');
}

function update_boundary(){
    _scrollTop_Max = $(document).height() - $(window).height() - 100;
    _scrollTop_Max = (_scrollTop_Max < 0) ? 0 : _scrollTop_Max;
    toggle_btn_top();
}

function toggle_btn_top(){
    var x = $(window).scrollTop();
    if( (x > _scrollTop_Max) || (x > ($(window).height() << 1)) )
        $('#btn-top').removeClass('loading');
    else
        $('#btn-top').addClass('loading');
}

function back_to_top(){
    $('html, body').animate({
        scrollTop: 0
    }, 700, function(){
        window.location.hash = '#';
    });
}

$(function(){
    // collapse menu on click
    $(window).click(collapse_menu).scroll(collapse_menu);
    // back to top button
    $(window).resize(update_boundary);
    $(window).scroll(toggle_btn_top);
    update_boundary();
    $('#btn-top').click(back_to_top);
});
