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

function track_mouse_pos(e){
    _mouse_x = e.pageX;
    _mouse_y = e.pageY;
}

function show_ext_link(){
    $('rt, .cp-ignore').css('visibility', 'hidden');
    var sel = window.getSelection().toString();
    $('rt, .cp-ignore').css('visibility', 'visible');
    $('#btn-ext-end').prop('href', "http://end-proj.herokuapp.com/?q=" + sel);
    $('#ojad-text').val(sel);
    if(sel === "")
        hide_ext_link();
    else
        $('#ext-link').css({ top: _mouse_y+20+'px', left: (_mouse_x-60)+'px'}).removeClass('hidden');
}

function hide_ext_link(){
    $('#ext-link').addClass('hidden');
}

$(function(){
    // auto scroll to hash
    if(location.hash) scr_shift();
    $('div[id^="L"]>a').click(scr_to_hash_clk());
    $(window).on('hashchange', scr_to_hash_ld());
    // utilities on selection
    $(window).on('mousemove', track_mouse_pos);
    $(document).on('selectionchange', show_ext_link);
    // hint on pager
    $('[data-toggle="tooltip"]').tooltip();
    // load ruby config
    $('#ruby-switch').on('change', toggle_furigana);
    if(!Cookies.get('noruby'))
        $('#ruby-switch').prop("checked", true).trigger('change');
})
