import React, { PropTypes } from 'react';
import marked from 'marked';


export default class EditorMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mainHeight: document.body.clientHeight - 60 };
        this.updateHeight = this.updateHeight.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this._editor.addEventListener('scroll', this.handleScroll);
        this._preview.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.updateHeight);
    }

    componentWillUnmount() {
        this._editor.removeEventListener('scroll', this.handleScroll);
        this._preview.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.updateHeight);
    }

    updateHeight() {
        this.setState({ mainHeight: document.body.clientHeight - 60 });
    }

    handleChange() {
        this._preview.innerHTML = this._editor.value;
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

    render() {
        return (
            <div className="main" style={{ height: `${this.state.mainHeight}px` }}>
                <textarea
                  className="editor"
                  style={{ display: 'block', width: '48%' }}
                  ref={ textarea => this._editor = textarea }
                  onInput={ () => this.handleChange() }
                  onChange={ () => this.handleChange() }
                >
                </textarea>
                <div
                  className="preview"
                  style={{ display: 'block', width: '52%' }}
                  ref={ div => this._preview = div }
                >
                </div>
            </div>
        );
    }
}
