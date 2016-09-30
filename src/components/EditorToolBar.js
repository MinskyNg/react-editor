import React from 'react';


export default class EditorToolBar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.map = {
            heading: '## 请输入标题',
            strong: '**请输入文字**',
            italic: '*请输入文字*',
            code: '\t 请输入代码',
            img: '![图片说明](图片地址)',
            url: '[链接说明](链接地址)',
            ul: '* 请输入列表项',
            ol: '1. 请输入列表项',
            quote: '> 请输入引用',
            line: '-------'
        };
    }

    insertText(type) {
        const text = this.map[type];
        const editor = this.props.editor;
        // IE
        if (document.selection) {
            const sel = document.selection.createRange();
            // 没有选中文本直接插入文字
            if (sel.text === '') {
                sel.text = text;
            // 有选中文本则为文本添加标签
            } else {
                switch (type) {
                    case 'heading':
                        sel.text = `## ${sel.text}`;
                        break;
                    case 'strong':
                        sel.text = `**${sel.text}**`;
                        break;
                    case 'italic':
                        sel.text = `*${sel.text}*`;
                        break;
                    case 'code':
                        sel.text = `\t ${sel.text}`;
                        break;
                    case 'img':
                        sel.text = `![图片说明](${sel.text})`;
                        break;
                    case 'url':
                        sel.text = `[链接说明](${sel.text})`;
                        break;
                    case 'ul':
                        sel.text = `* ${sel.text}`;
                        break;
                    case 'ol':
                        sel.text = `1. ${sel.text}`;
                        break;
                    case 'quote':
                        sel.text = `> ${sel.text}`;
                        break;
                    default:
                        sel.text = '-------';
                }
            }
        // 非IE
        } else if (typeof editor.selectionStart === 'number' && typeof editor.selectionEnd === 'number') {
            // 获取文本起始点和结束点
            const startPos = editor.selectionStart;
            const endPos = editor.selectionEnd;
            // 记录光标位置
            let cursorPos = startPos;
            // 编辑区文本
            const tmpText = editor.value;
            // 没有选中区域时
            if (startPos === endPos) {
                // 直接插入文本
                editor.value = tmpText.substring(0, startPos) + text + tmpText.substring(endPos, tmpText.length);
                // 移动光标
                cursorPos += text.length;
                // 改变选中区域
                switch (type) {
                    case 'heading':
                    case 'code':
                    case 'quote':
                        editor.selectionStart = cursorPos - 5;
                        editor.selectionEnd = cursorPos;
                        break;
                    case 'strong':
                        editor.selectionStart = cursorPos - 7;
                        editor.selectionEnd = cursorPos - 2;
                        break;
                    case 'italic':
                        editor.selectionStart = cursorPos - 6;
                        editor.selectionEnd = cursorPos - 1;
                        break;
                    case 'img':
                    case 'url':
                        editor.selectionStart = cursorPos - 5;
                        editor.selectionEnd = cursorPos - 1;
                        break;
                    case 'ul':
                    case 'ol':
                        editor.selectionStart = cursorPos - 6;
                        editor.selectionEnd = cursorPos;
                        break;
                    default:
                        editor.selectionStart = editor.selectionEnd = cursorPos;
                }
                // 存在选中区域
            } else {
                let replaceText;
                switch (type) {
                    case 'heading':
                        replaceText = `## ${tmpText.substring(startPos, endPos)}`;
                        break;
                    case 'strong':
                        replaceText = `**${tmpText.substring(startPos, endPos)}**`;
                        break;
                    case 'italic':
                        replaceText = `*${tmpText.substring(startPos, endPos)}*`;
                        break;
                    case 'code':
                        replaceText = `\t ${tmpText.substring(startPos, endPos)}`;
                        break;
                    case 'img':
                        replaceText = `![图片说明](${tmpText.substring(startPos, endPos)})`;
                        break;
                    case 'url':
                        replaceText = `[链接说明](${tmpText.substring(startPos, endPos)})`;
                        break;
                    case 'ul':
                        replaceText = `* ${tmpText.substring(startPos, endPos)}`;
                        break;
                    case 'ol':
                        replaceText = `1. ${tmpText.substring(startPos, endPos)}`;
                        break;
                    case '>quote':
                        replaceText = `> ${tmpText.substring(startPos, endPos)}`;
                        break;
                    default:
                        replaceText = '-------';
                }
                editor.value = tmpText.substring(0, startPos) + replaceText + tmpText.substring(endPos, tmpText.length);
            }
            // 找不到光标
        } else {
            editor.value += text;
        }
        editor.focus();
        this.props.updateArticle(editor.value);
    }

    render() {
        return (
            <div className="toolbar">
                <button className="add-heading" title="添加标题"
                  onClick={ () => this.insertText('heading') }
                >
                    <span className="icon-heading"></span>
                </button>
                <button className="add-strong" title="添加粗体"
                  onClick={ () => this.insertText('strong') }
                >
                    <span className="icon-strong"></span>
                </button>
                <button className="add-italic" title="添加斜体"
                  onClick={ () => this.insertText('italic') }
                >
                    <span className="icon-italic"></span>
                </button>
                <button className="add-code" title="添加代码"
                  onClick={ () => this.insertText('code') }
                >
                    <span className="icon-code"></span>
                </button>
                <button className="add-link" title="添加链接"
                  onClick={ () => this.insertText('url') }
                >
                    <span className="icon-link"></span>
                </button>
                <button className="add-img" title="添加图片"
                  onClick={ () => this.insertText('img') }
                >
                    <span className="icon-img"></span>
                </button>
                <button className="add-ul" title="添加无序列表"
                  onClick={ () => this.insertText('ul') }
                >
                    <span className="icon-ul"></span>
                </button>
                <button className="add-ol" title="添加有序列表"
                  onClick={ () => this.insertText('ol') }
                >
                    <span className="icon-ol"></span>
                </button>
                <button className="add-quote" title="添加块引用"
                  onClick={ () => this.insertText('quote') }
                >
                    <span className="icon-quote"></span>
                </button>
                <button className="add-line" title="添加分割线"
                  onClick={ () => this.insertText('line') }
                >
                    <span className="icon-line"></span>
                </button>
            </div>
        );
    }
}
