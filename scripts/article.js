function scr_to_hash_clk() {
    return function(e) {
        $('.navbar-collapse').collapse('hide');
        if (this.hash !== "") {
            e.preventDefault();
            var hash = this.hash;
            var tar = $(hash).offset().top;
            $('html, body').animate({
                scrollTop: tar < 60 ? tar : tar-60
            }, 300, function(){
                window.location.hash = hash;
            });
        }
    };
}

function scr_to_hash_ld() {
    return function(e) {
        $('.navbar-collapse').collapse('hide');
        var hash = window.location.hash;
        if (hash !== "") {
            var tar = $(hash).offset().top;
            $('html, body').animate({
                scrollTop: tar < 60 ? tar : tar-60
            }, 300);
        }
    };
}

function scr_shift() {
    if($(window).height()+$(window).scrollTop() < $(document).height() - 60)
        scrollBy(0, -60);
}

function toggle_furigana() {
    if(this.checked) {
        $('#article-container').removeClass('noruby');
        Cookies.remove('noruby');
    } else {
        $('#article-container').addClass('noruby');
        Cookies.set('noruby', true, { expires: 3650 });
    }
}

$(function(){
    if(location.hash) scr_shift();
    $('div[id^="L"]>a').click(scr_to_hash_clk());
    $(window).on('hashchange', scr_to_hash_ld());
    $('[data-toggle="tooltip"]').tooltip();
    $('#ruby-switch').on('change', toggle_furigana);
    if(!Cookies.get('noruby'))
        $('#ruby-switch').prop("checked", true).trigger('change');
})
