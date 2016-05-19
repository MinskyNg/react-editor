// 编辑区
var editor = document.getElementById('editor');
var $editor = $(editor);
// 预览区
var preview = document.getElementById('preview');
var $preview = $(preview);
// markdown转换对象
var md = markdownit({
    highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {}
        }
        return '';
    }
});
// undo redo 对象
var $undo = $('#undo');
var $redo = $('#redo');
    // undo redo 记录栈
var undoLog = [];
var redoLog = [];


// 动态设置主区域高度
$('#main').height(document.body.clientHeight - 60);
$(window).resize(function() {
    $('#main').height(document.body.clientHeight - 60);
});


// 实时预览
preview.innerHTML = md.render(editor.value);
$editor.on('input propertychange', function() {
    preview.innerHTML = md.render(editor.value);
    // redo不可用 undo可用
    redoLog = [];
    $redo.attr('disabled', true).css('background-color', '#555');
    $undo.attr('disabled', false).css('background-color', '#fcfcfc');
});

// 自动保存


// 编辑区和预览区设置同步滚动
var $divs = $('#editor, #preview');
var handleScroll = function() {
    // 移除另一个区域的滚动事件 防止循环滚动
    var $other = $divs.not(this).off('scroll'),
        other = $other.get(0);
    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
    other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);
    // 恢复另一个区域的滚动事件
    setTimeout(function() {
        $other.on('scroll', handleScroll);
    }, 200);
}
$divs.on('scroll', handleScroll);


// 初始化文章列表

// 显示文章列表
$('#show-article').click(function() {
    if ($('.aside').css('left') === '0px') {
        $('#show-article').css('background-image', 'url(../img/arrow_right.png)')
        $('.aside').css('left', '-200px');
        $('.modal').css('display', 'none');
        $('.wrapper').css('left', '0px');
    } else {
        $('#show-article').css('background-image', 'url(../img/arrow_left.png)')
        $('.aside').css('left', '0px');
        $('.modal').css('display', 'block');
        $('.wrapper').css('left', '200px');
    }
});


// undo redo设置
// 每隔段时间记录编辑区
function setLog() {
    if (undoLog[undoLog.length - 1] !== $editor.val()) {
        undoLog[undoLog.length] = $editor.val();
    }
    setTimeout(setLog, 1000);
}
setLog();

// undo按钮事件
$undo.click(function() {
    redoLog.push(undoLog.pop());
    $editor.val(undoLog[undoLog.length - 1]).blur();
    // 当记录栈没有内容时，设置按钮不可用
    if (!undoLog[undoLog.length - 1]) {
        $undo.attr('disabled', true).css('background-color', '#555');;
    }
    $redo.attr('disabled', false).css('background-color', '#fcfcfc');;
    preview.innerHTML = md.render(editor.value);
});

// redo按钮事件
$redo.click(function() {
    var redoTxt = redoLog.pop();
    undoLog.push(redoTxt);
    // 当记录栈没有内容时，设置按钮不可用
    if (!redoLog[redoLog.length - 1]) {
        $redo.attr('disabled', true).css('background-color', '#555');;
    }
    $undo.attr('disabled', false).css('background-color', '#fcfcfc');;
    $editor.val(redoTxt).blur();
    preview.innerHTML = md.render(editor.value);
})

// 事件代理