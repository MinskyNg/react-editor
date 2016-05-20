// 标题输入区
var inputTitle = document.getElementById('input-title');
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
// 自动保存定时器
var timer;
// undo redo
var $undo = $('.undo');
var $redo = $('.redo');
// undo redo 记录栈
var undoLog = [];
var redoLog = [];
// 文章列表
var $articleList = $('.article-list');
// 备用文章
articleSpare = JSON.stringify([
        { title: '标题1', body: '这是内容1', date: '2016-5-20 20:41:48' },
        { title: '标题2', body: '这是内容2', date: '2016-5-20 20:41:49' }]
);
// 获取本地存储文章
var articleStorage = localStorage.getItem('article') || articleSpare;
var articleSource = JSON.parse(articleStorage);
// 选择最近一次编辑的文章作为当前文章
var article = articleSource[articleSource.length - 1];
// 重新编辑设置日期
var now = new Date();
article.date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
// 设置标题，编辑区和预览区
inputTitle.value = article.title;
editor.value = article.body;
preview.innerHTML = md.render(editor.value);


// 动态设置主区域高度
$('#main').height(document.body.clientHeight - 60);
$(window).resize(function() {
    $('#main').height(document.body.clientHeight - 60);
});


// 实时预览
$editor.on('input propertychange', function() {
    preview.innerHTML = md.render(editor.value);
    // redo不可用 undo可用
    redoLog = [];
    $redo.attr('disabled', true).css('background-color', '#555');
    $undo.attr('disabled', false).css('background-color', '#fcfcfc');
});


// 编辑区和预览区设置同步滚动
var $divs = $('#editor, #preview');
var handleScroll = function() {
    // 移除另一个区域的滚动事件 防止循环滚动
    var $other = $divs.not(this).off('scroll');
    var other = $other.get(0);
    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
    other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);
    // 恢复另一个区域的滚动事件
    setTimeout(function() {
        $other.on('scroll', handleScroll);
    }, 300);
}
$divs.on('scroll', handleScroll);


// 记录标题变动
inputTitle.addEventListener('change', function() {
    // 若输入为空则取日期为标题
    article.title = inputTitle.value || article.date;
    $articleList.find('li[alt="' + article.date + '"]').text(article.title);
    articleStorage = JSON.stringify(articleSource);
    localStorage.setItem('article', articleStorage);
});


// 隔段时间记录编辑区并自动保存
function setLog() {
    if (undoLog[undoLog.length - 1] !== editor.value) {
        undoLog[undoLog.length] = editor.value;
        article.body = editor.value;
        articleStorage = JSON.stringify(articleSource);
        localStorage.setItem('article', articleStorage);
    }
    timer = setTimeout(setLog, 1500);
}
setLog();

// undo按钮事件
$undo.click(function() {
    redoLog.push(undoLog.pop());
    $editor.val(undoLog[undoLog.length - 1]).blur();
    // 当记录栈没有内容时，设置按钮不可用
    if (!undoLog[undoLog.length - 1]) {
        $undo.attr('disabled', true).css('background-color', '#555');
    }
    $redo.attr('disabled', false).css('background-color', '#fcfcfc');
    preview.innerHTML = md.render(editor.value);
    article.body = editor.value;
    articleStorage = JSON.stringify(articleSource);
    localStorage.setItem('article', articleStorage);
});

// redo按钮事件
$redo.click(function() {
    var redoTxt = redoLog.pop();
    undoLog.push(redoTxt);
    // 当记录栈没有内容时，设置按钮不可用
    if (!redoLog[redoLog.length - 1]) {
        $redo.attr('disabled', true).css('background-color', '#555');
    }
    $undo.attr('disabled', false).css('background-color', '#fcfcfc');
    $editor.val(redoTxt).blur();
    preview.innerHTML = md.render(editor.value);
    article.body = editor.value;
    articleStorage = JSON.stringify(articleSource);
    localStorage.setItem('article', articleStorage);
});


// 语法提示
$('.show-tips').click(function() {
    if ($('.tips').css('display') === 'none') {
        $('.tips').css('display', 'block');
    } else {
        $('.tips').css('display', 'none');
    }
});


// 初始化文章列表
(function() {
    for (var i = articleSource.length - 1; i >= 0; i--) {
        var articleItem = articleSource[i];
        $articleList.append('<li alt="' + articleItem.date + '" title="选择文章">' + articleItem.title + '<a class="delete" title="删除文章"></a></li>');
    }
    $('.article-list li:first-child').addClass('active');
})();


// 显示文章列表
$('#show-article').click(function() {
    if ($('.aside').css('left') === '0px') {
        $('#show-article').css('background-image', 'url(../img/arrow_right.png)');
        $('.aside').css('left', '-250px');
        $('#show-article').css('left', '0px');
        $('.modal').css('display', 'none');
        $('.wrapper').css('left', '0px');
        // 重启自动保存
        setLog();
    } else {
        $('#show-article').css('background-image', 'url(../img/arrow_left.png)');
        $('.aside').css('left', '0px');
        $('#show-article').css('left', '250px');
        $('.modal').css('display', 'block');
        $('.wrapper').css('left', '250px');
        // 关闭自动保存
        clearTimeout(timer);
    }
});

// 删除和选择文章事件
$articleList.click(function(event) {
    var $target = $(event.target);
    if ($target.is('.delete')) {
        if (confirm('确定要删除此文章吗?')) {
            // 根据日期查找文章
            var date = $target.parent('li').attr('alt');
            $target.parent('li').remove();
            for (var i = 0; i < articleSource.length; i++) {
                if (articleSource[i].date === date) {
                    articleSource.splice(i, 1);
                    break;
                }
            }
        }
    } else if ($target.is('li') && !$target.is('.active')) {
        // 清除记录栈
        undoLog = [];
        redoLog = [];
        $undo.attr('disabled', true).css('background-color', '#555');
        $redo.attr('disabled', true).css('background-color', '#555');
        var date = $target.attr('alt');
        $('.active').removeClass('active');
        $target.addClass('active');
        for (var i = 0; i < articleSource.length; i++) {
            if (articleSource[i].date === date) {
                // 将选择的文章放入列表底部
                article = articleSource[i];
                articleSource.push(articleSource[i]);
                articleSource.splice(i, 1);
                // 重新编辑设置日期
                var now = new Date();
                article.date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
                $target.attr('alt', article.date);
                // 设置标题，编辑区和预览区
                inputTitle.value = article.title;
                editor.value = article.body;
                preview.innerHTML = md.render(editor.value);
                break;
            }
        }
    }
    articleStorage = JSON.stringify(articleSource);
    localStorage.setItem('article', articleStorage);
});