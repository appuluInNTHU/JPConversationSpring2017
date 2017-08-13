$(function(){
    $(document).on('copy', function (e) {
        e.preventDefault();
        $('rt, .cp-ignore').css('visibility', 'hidden');
        e.originalEvent.clipboardData.setData('text', window.getSelection().toString());
        $('rt, .cp-ignore').css('visibility', 'visible');
    });
});
