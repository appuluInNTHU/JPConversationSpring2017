BANNER_MAX = 3;
banner_cur = 1;

function __banner() {
    return $('#banner'+banner_cur);
}

function __bg() {
    return $('#bg'+banner_cur);
}

function switch_banner() {
    __banner().addClass('pic-loading');
    __bg().addClass('pic-loading');
    ++banner_cur;
    if(banner_cur > BANNER_MAX)
        banner_cur -= BANNER_MAX;
    setTimeout(function() {
        __banner().removeClass('pic-loading');
        __bg().removeClass('pic-loading');
    }, 200);
}

function scr_to_hash_fnb(e) {
        $(".navbar-collapse").collapse('hide');
        if (this.hash !== "") {
            e.preventDefault();
            var hash = this.hash;
            var back = $(this).parent().hasClass('active');
            $('html, body').animate({
                scrollTop: back ? 0 : $(hash).offset().top
            }, 700, function(){
                window.location.hash = back ? '#' : hash;
            });
        }
}

function toggle_section() {
    var x = $('#schedule').offset().top;
    var y = $(window).scrollTop();
    if(y < 100) {
        $('.title').removeClass('loading');
        $('.section').removeClass('active');
    } else {
        $('.title').addClass('loading');
        $('.section').addClass('active');
        if(y < x - $(window).height()*13/20) {
            $('#schedule').removeClass('more');
        } else {
            $('#schedule').addClass('more');
        }
    }
}

function show_banner(){
    $('#banner-container, #more-wrapper').css('opacity', 1);
}

$(function(){
    // bootstrap scrollspy
    $('body').scrollspy({ target: '#menu-item', offset: 60 });

    // auto scrolling (click base)
    $('.auto-scroll').click(scr_to_hash_fnb);

    // opacity of panels on scrolling
    $(window).scroll(toggle_section);
    toggle_section();

    // switch banner every 10 second
    setInterval(switch_banner, 10000);

    // show banner image
    $(window).on('load', show_banner);
    setTimeout(show_banner, 3000);
});
