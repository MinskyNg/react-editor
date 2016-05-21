/*
一些初始化
*/

// 标题输入区
var inputTitle = document.getElementById('input-title');
// 编辑区
var editor = document.getElementById('code');
var $editor = $(editor);
// 预览区
var preview = document.getElementById('preview');
var $preview = $(preview);
// 创建markdown转换对象并设置代码高亮
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
// undo redo按钮
var $undo = $('.undo');
var $redo = $('.redo');
// undo redo 记录栈
var undoLog = [];
var redoLog = [];
// 区域显示按钮
var $showDouble = $('.show-double');
var $showEditor = $('.show-editor');
var $showPreview = $('.show-preview');
// 文章列表
var $articleList = $('.article-list');
// 备用文章
articleSpare = JSON.stringify([
        { title: '文章1', body: '# 文章1', date: '2016-5-20 20:41:48' },
        { title: '文章2', body: '# 文章2', date: '2016-5-20 20:41:49' }]
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


// 将文章保存到本地
var  saveArticle = function() {
    articleStorage = JSON.stringify(articleSource);
    localStorage.setItem('article', articleStorage);
}


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
var $divs = $('#code, #preview');
var handleScroll = function() {
    // 移除另一个区域的滚动事件 防止循环滚动
    var $other = $divs.not(this).off('scroll');
    var other = $other.get(0);
    // 滚动大小按内容百分比计算
    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
    other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);
    // 恢复另一个区域的滚动事件
    setTimeout(function() {
        $other.on('scroll', handleScroll);
    }, 200);
}
$divs.on('scroll', handleScroll);


// 记录标题变动
inputTitle.addEventListener('change', function() {
    // 若输入为空则取日期为标题
    article.title = inputTitle.value || article.date;
    // XSS输入过滤
    article.title = article.title.replace(/[<>'&]/g, function(match) {
            switch (match) {
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '&':
                    return '&amp;';
                case '\'':
                    return '&quot;';
         }
     });
    // 长标题截短
    var title = article.title;
    title  = (title.length < 11) ? title : title.substring(0, 10) + '...';
    $articleList.find('li[alt="' + article.date + '"]').html(title + '<a class="delete" title="删除文章"></a>');
    saveArticle();
});


// 定时记录编辑区并自动保存
function setLog() {
    if (undoLog[undoLog.length - 1] !== editor.value) {
        // 防止存储数据栈过深
        if (undoLog.length > 50) {
            undoLog.shift();
        }
        undoLog[undoLog.length] = editor.value;
        article.body = editor.value;
        articleStorage = JSON.stringify(articleSource);
        localStorage.setItem('article', articleStorage);
    }
    timer = setTimeout(setLog, 800);
}
setLog();


/*
工具栏
*/

// 新建文章
$('.new-article').click(function() {
    // 关闭自动保存
    clearTimeout(timer);
    // 清除记录栈
    undoLog = [];
    redoLog = [];
    $undo.attr('disabled', true).css('background-color', '#555');
    $redo.attr('disabled', true).css('background-color', '#555');
    article = { title: '新建文章', body: '', date: '' };
    articleSource.push(article);
    // 设置日期
    var now = new Date();
    article.date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    // 设置标题，编辑区和预览区
    inputTitle.value = article.title;
    editor.value = article.body;
    preview.innerHTML = md.render(editor.value);
    // 添加到文章列表
    $('.active').removeClass('active');
    $articleList.prepend('<li class="active" alt="' + article.date + '" title="选择文章">' + article.title + '<a class="delete" title="删除文章"></a></li>');
    // 重启自动保存
    setLog();
});

// 删除当前文章
$('.del-article').click(function() {
    var date = article.date;
    var length = $articleList.children().length;
    for (var i = 0; i < length; i++) {
        if ($($articleList.children()[i]).is('.active')) {
            $($articleList.children()[i]).find('.delete').click();
        }
    }
});

// 保存文章到本地
$('.down-article').click(function() {
    var name = article.title + '.md';
    var blob = new Blob([article.body], {type: 'text/plain'});
    if (window.saveAs) {
        // IE
        window.saveAs(blob, name);
    } else if (navigator.saveBlob) {
        // IE
        navigator.saveBlob(blob, name);
    } else {
        // Chrome Firefox
        url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute('href', url);
        link.setAttribute('download', name);
        // 点击下载事件模拟
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    }
});

// undo
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
    saveArticle();
});

// redo
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
    saveArticle();
});

// 双屏显示
$showDouble.click(function() {
    $editor.css({'display': 'block', 'width': '48%'});
    $preview.css({'display': 'block', 'width': '52%'});
    $showDouble.attr('disabled', true).css('background-color', '#555');
    $showEditor.attr('disabled', false).css('background-color', '#fcfcfc');
    $showPreview.attr('disabled', false).css('background-color', '#fcfcfc');
});

// 只显示编辑区
$showEditor.click(function() {
    $editor.css({'display': 'block', 'width': '100%'});
    $preview.css({'display': 'none', 'width': '0%'});
    $showEditor.attr('disabled', true).css('background-color', '#555');
    $showDouble.attr('disabled', false).css('background-color', '#fcfcfc');
    $showPreview.attr('disabled', false).css('background-color', '#fcfcfc');
});

// 只显示预览区
$showPreview.click(function() {
    $editor.css({'display': 'none', 'width': '0%'});
    $preview.css({'display': 'block', 'width': '100%'});
    $showPreview.attr('disabled', true).css('background-color', '#555');
    $showEditor.attr('disabled', false).css('background-color', '#fcfcfc');
    $showDouble.attr('disabled', false).css('background-color', '#fcfcfc');
});

// 语法提示
$('.show-tips').click(function() {
    if ($('.tips').css('display') === 'none') {
        $('.tips').css('display', 'block');
    } else {
        $('.tips').css('display', 'none');
    }
});

// 文件拖拽上传
document.addEventListener('drop', function(event) {
    event.preventDefault();
    event.stopPropagation();
    // 文件读取API
    var reader = new FileReader();
    reader.onload = function(evt) {
        // 创建新文章并初始化
        $('.new-article').click();
        editor.value = evt.target.result;
        article.body = editor.value;
        preview.innerHTML = md.render(editor.value);
        saveArticle();
    };
    reader.readAsText(event.dataTransfer.files[0]);
}, false);


/*
侧边栏
*/

// 初始化文章列表
(function() {
    for (var i = articleSource.length - 1; i >= 0; i--) {
        var articleItem = articleSource[i];
        // 长标题截短
        var title = articleItem.title;
        title  = (title.length < 11) ? title : title.substring(0, 10) + '...';
        $articleList.append('<li alt="' + articleItem.date + '" title="选择文章">' + title + '<a class="delete" title="删除文章"></a></li>');
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
            // 获取父元素
            var $targetLi = $target.parent('li');
            // 如果删除的是当前编辑文章
            if ($targetLi.is('.active')) {
                // 切换到其他文章
                if ($targetLi.next().is('li')) {
                    $targetLi.next().click();
                } else if ($targetLi.prev().is('li')) {
                    $targetLi.prev().click();
                } else {
                    // 若无其他文章则新建
                    $('.new-article').click();
                }
            }
            // 根据日期查找文章
            var date = $targetLi.attr('alt');
            $targetLi.remove();
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
    saveArticle();
});