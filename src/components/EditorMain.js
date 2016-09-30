import React from 'react';
import marked from 'marked';
import EditorToolBar from './EditorToolBar';


export default class EditorMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { mainHeight: document.body.clientHeight - 60 };
        this.updateHeight = this.updateHeight.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleTab = this.handleTab.bind(this);
    }

    componentDidMount() {
        this._editor.addEventListener('scroll', this.handleScroll);
        this._preview.addEventListener('scroll', this.handleScroll);
        this._editor.addEventListener('keydown', this.handleTab);
        window.addEventListener('resize', this.updateHeight);
    }

    componentWillUnmount() {
        this._editor.removeEventListener('scroll', this.handleScroll);
        this._preview.removeEventListener('scroll', this.handleScroll);
        this._editor.removeEventListener('keydown', this.handleTab);
        window.removeEventListener('resize', this.updateHeight);
    }

    updateHeight() {
        this.setState({ mainHeight: document.body.clientHeight - 60 });
    }

    handleScroll(event) {
        const target = event.target;
        let other;
        if (target === this._editor) {
            other = this._preview;
        } else {
            other = this._editor;
        }
        // 移除另一个区域的滚动事件 防止循环滚动
        other.removeEventListener('scroll', this.handleScroll);
        // 滚动大小按内容百分比计算
        const percentage = target.scrollTop / (target.scrollHeight - target.offsetHeight);
        other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);
        // 恢复另一个区域的滚动事件
        setTimeout(() => {
            other.addEventListener('scroll', this.handleScroll);
        }, 200);
    }

    // 阻止tab键切换文本框
    handleTab(event) {
        const keyCode = event.keyCode || event.which;
        // tab键码
        if (keyCode === 9) {
            const start = this._editor.selectionStart;
            const end = this._editor.selectionEnd;
            this._editor.value = `${this._editor.value.substring(0, start)}\t${this._editor.value.substring(end)}`;
            this._editor.selectionStart = this._editor.selectionEnd = start + 1;
            event.preventDefault();
        }
    }

    render() {
        const rawMarkup = marked(this.props.editingText.toString(), { sanitize: true });
        const screenShow = this.props.screenShow;
        let width;
        if (screenShow === 2) {
            width = 48;
        } else if (screenShow === 0) {
            width = 100;
        } else {
            width = 0;
        }
        const editorStyle = {
            display: screenShow !== 1 ? 'block' : 'none',
            width: `${width}%`
        };
        const previewStyle = {
            display: screenShow !== 0 ? 'block' : 'none',
            width: `${100 - width}%`
        };
        return (
            <div className="main" style={{ height: `${this.state.mainHeight}px` }}>
                <textarea
                  className="editor"
                  style={ editorStyle }
                  ref={ textarea => this._editor = textarea }
                  onInput={ () => this.props.updateArticle(this._editor.value) }
                  onChange={ () => this.props.updateArticle(this._editor.value) }
                  value={ this.props.editingText }
                >
                </textarea>
                <div
                  className="preview"
                  style={ previewStyle }
                  ref={ div => this._preview = div }
                  dangerouslySetInnerHTML={{ __html: rawMarkup }}
                >
                </div>
                <EditorToolBar
                  editor={ this._editor }
                  updateArticle={ (body) => this.props.updateArticle(body) }
                />
            </div>
        );
    }
}
