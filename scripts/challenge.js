---
---
{% assign sorted_files = site.data.awesome-list | sort %}
JP_CONTENT=[
{% for hash in sorted_files %}{% assign filename = hash[0] %}{% include awesome-list/js_jp_content.html data_src=filename %}{% endfor %}
];
JP_HINT=[
{% for hash in sorted_files %}{% assign filename = hash[0] %}{% include awesome-list/js_jp_hint.html data_src=filename %}{% endfor %}
];
CH_CONTENT=[
{% for hash in sorted_files %}{% assign filename = hash[0] %}{% include awesome-list/js_ch_content.html data_src=filename %}{% endfor %}
];
PB_BND = [0, 3, 14, 36, 44, 61, 74, 83, 100, 116, 130, 143, 145];
PB_SEL_INIT = [true, true, true, true, true, true, true, true, true, true, true, true];
CH_CD_INIT = 4;
JP_CD_INIT = 7;
pb_sel_prev = null;
chk_sum = 0;
diff_sum = 0;
cur_pbid = -1;
cur_rt = null;

function syncRange(src, tar) {
    return function() {
        var val = $(src).val();
        $(tar).html(val);
    }
}

function verdictStartBtn() {
    if(chk_sum == 0)
        $('#btn-start').addClass('disabled');
    else
        $('#btn-start').removeClass('disabled');
}

function verdictResumeBtn() {
    if(diff_sum == 0)
        $('#btn-resume').removeClass('disabled');
    else
        $('#btn-resume').addClass('disabled');
}

function toggleSel() {
    var sel_id = this.getAttribute('sel');
    if(!(sel_id >= 0 && sel_id < pb_sel.length))
        return;
    var changed = this.checked != pb_sel[sel_id];
    if(changed) {
        chk_sum += (this.checked) ? 1 : -1;
        verdictStartBtn();
    }
    if(pb_sel_prev && changed) {
        diff_sum += (this.checked == pb_sel_prev[sel_id]) ? -1 : 1;
        verdictResumeBtn();
    }
    pb_sel[sel_id] = this.checked;
}

function resetSel() {
    $('.para-check').prop('checked', false).trigger('change');
}

function selectAll() {
    $('.para-check').prop('checked', true).trigger('change');
}

function setJpContent(n, arr) {
    $('#jp-content').html((n >= 0 && n < arr.length) ? arr[n] : '');
}

function setChContent(n) {
    $('#ch-content').html((n >= 0 && n < CH_CONTENT.length) ? CH_CONTENT[n] : '（請作答）');
}

function shuffleArray(arr) {
    var t = arr.length * 100;
    var len = arr.length;
    while(t--) {
        var a = Math.floor(Math.random() * len);
        var b = Math.floor(Math.random() * len);
        var tmp = arr[a] ;
        arr[a] = arr[b];
        arr[b] = tmp;
    }
}

function parseCD() {
    ch_cd = parseInt($('#ch-cd').val());
    jp_cd = parseInt($('#jp-cd').val());
    ch_cd = (ch_cd < 3) ? 3 : ((ch_cd > 7) ? 7 : ch_cd);
    jp_cd = (jp_cd < 0) ? 0 : ((jp_cd > 20) ? 20 : jp_cd);
}

function genProblem() {
    cur_pbid = -1;
    PROBLEM_SET = [];
    for(var i=0; i<12; ++i) {
        if(pb_sel[i]) {
            for(var j = PB_BND[i], j_M = PB_BND[i+1]; j < j_M; ++j)
                PROBLEM_SET.push(j);
        }
    }
    $('#ttpb').html(PROBLEM_SET.length);
    shuffleArray(PROBLEM_SET);
}

function setProgress(progress) {
    $('#pgbar').css('width', progress+'%');
}

function interuptRoutine() {
    if(cur_rt)
        clearTimeout(cur_rt);
    setProgress(0);
}

function hideChContent() {
    setChContent(-1);
    openHintBtn();
    if(jp_cd)
        startJpCD();
}

function banHintBtn() {
    $('#btn-jphint, #btn-chhint').addClass('disabled btn-pager');
}

function openHintBtn() {
    $('#btn-jphint, #btn-chhint').removeClass('disabled btn-pager');
}

function showChHint() {
    if($('#btn-chhint').hasClass('disabled'))
        return;
    setChContent(PROBLEM_SET[cur_pbid]);
    interuptRoutine();
    startChCD();
}

function showJpHint() {
    if($('#btn-jphint').hasClass('disabled'))
        return;
    setChContent(PROBLEM_SET[cur_pbid]);
    setJpContent(PROBLEM_SET[cur_pbid], JP_HINT);
    interuptRoutine();
    startJpCD();
    banHintBtn();
}

function showAns() {
    interuptRoutine();
    setJpContent(PROBLEM_SET[cur_pbid], JP_CONTENT);
    setChContent(PROBLEM_SET[cur_pbid]);
    banHintBtn();
}

function startChCD() {
    $('#pgbar').removeClass('jp');
    var ch_len = CH_CONTENT[PROBLEM_SET[cur_pbid]].length;
    var bonus = (ch_len >= 34) ? 2 : 0;
    var cd = ch_cd + bonus + 1;
    (function stepChCD(){
        --cd;
        var per = (100 * cd) / (ch_cd + bonus);
        setProgress(per);
        if(cd)
            cur_rt = setTimeout(stepChCD, 1000);
        else
            cur_rt = setTimeout(hideChContent, 500);
    })();
    banHintBtn();
}

function startJpCD() {
    $('#pgbar').addClass('jp');
    var ch_len = CH_CONTENT[PROBLEM_SET[cur_pbid]].length;
    var bonus = (ch_len >= 34) ? 3 : 0;
    var cd = jp_cd + bonus  + 1;
    (function stepJpCD(){
        --cd;
        var per = (100 * cd) / (jp_cd + bonus);
        setProgress(per);
        if(cd)
            cur_rt = setTimeout(stepJpCD, 1000);
        else
            cur_rt = setTimeout(showAns, 500);
        if(cd < jp_cd - 2)
            setChContent(-1);
    })();
}

function goNextProblem() {
    ++cur_pbid;
    var id_pb = PROBLEM_SET[cur_pbid];
    if(id_pb >= 0 && id_pb < CH_CONTENT.length) {
        interuptRoutine();
        setChContent(id_pb);
        startChCD();
        setJpContent(-1);
        $('#curpb').html(cur_pbid+1);
    } else {
        pb_sel_prev = null;
        $('#btn-resume').addClass('hidden');
        showParaPanel();
    }
}

function showParaPanel() {
    $('#inner-wrapper').addClass('para-active');
    interuptRoutine();
}

function showStagePanel() {
    goNextProblem();
    $('#inner-wrapper').removeClass('para-active');
}

function saveConfig() {
    Cookies.set('_ch_cd', ch_cd, { expires: 3650, path: '' });
    Cookies.set('_jp_cd', jp_cd, { expires: 3650, path: '' });
    Cookies.set('_pb_sel', pb_sel, { expires: 3650, path: '' });
}

function loadConfig() {
    ch_cd = Cookies.getJSON('_ch_cd');
    jp_cd = Cookies.getJSON('_jp_cd');
    pb_sel = Cookies.getJSON('_pb_sel');
}

function validateConfig() {
    var valid = Number.isInteger(ch_cd);
    if(!(valid && ch_cd >= 3 && ch_cd <= 7))
        ch_cd = CH_CD_INIT;
    valid = Number.isInteger(jp_cd);
    if(!(valid && jp_cd >= 0 && jp_cd <= 20))
        jp_cd = JP_CD_INIT;
    valid = !(pb_sel === undefined || pb_sel.length < 12);
    if(valid) {
        for(var i = 0; i < 12 ; ++i)
            valid &= (pb_sel[i] === true) || (pb_sel[i] === false);
    }
    if(!valid)
        pb_sel = PB_SEL_INIT;
}

function initParaPanel() {
    $('#ch-cd').val(ch_cd);
    $('#jp-cd').val(jp_cd);
    chk_sum = 0;
    for(var i = 0; i < 12; ++i){
        $('.para-check[sel="'+i+'"]').prop('checked', pb_sel[i]);
        chk_sum += pb_sel[i];
    }
}

function startQuiz() {
    if($('#btn-start').hasClass('disabled'))
        return;
    genProblem();
    parseCD();
    showStagePanel();
    saveConfig();
    $('#btn-resume').removeClass('hidden');
}

function pauseQuiz() {
    diff_sum = 0;
    pb_sel_prev = pb_sel.slice();
    verdictResumeBtn();
    showParaPanel();
}

function resumeQuiz() {
    if($('#btn-resume').hasClass('disabled'))
        return;
    --cur_pbid;
    parseCD();
    showStagePanel();
    saveConfig();
}

function track_mouse_pos(e) {
    _mouse_x = e.pageX;
    _mouse_y = e.pageY;
}

function show_ext_link() {
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
    loadConfig();
    validateConfig();
    initParaPanel();
    $('[data-toggle="tooltip"]').tooltip();
    $('#ch-cd').on('input change', syncRange('#ch-cd', '#ch-cd-text')).trigger('change');
    $('#jp-cd').on('input change', syncRange('#jp-cd', '#jp-cd-text')).trigger('change');
    $('.para-check').on('change', toggleSel);
    $('#inner-wrapper').addClass('in');
    $('#btn-sel-reset').click(resetSel);
    $('#btn-sel-all').click(selectAll);
    $('#btn-start').click(startQuiz);
    $('#btn-resume').click(resumeQuiz);
    $('#btn-next').click(goNextProblem);
    $('#btn-ans').click(showAns);
    $('#btn-chhint').click(showChHint);
    $('#btn-jphint').click(showJpHint);
    $('#btn-config').click(pauseQuiz);
    $(window).on('mousemove', track_mouse_pos);
    $(document).on('selectionchange', show_ext_link);
});
