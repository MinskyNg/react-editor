import React, { PropTypes } from 'react';


export default class EditorToolBar extends React.PureComponent {
    render() {
        return (
            <div className="toolbar">
                <button className="add-heading" title="添加标题"><span className="icon-heading"></span></button>
                <button className="add-strong" title="添加粗体"><span className="icon-strong"></span></button>
                <button className="add-italic" title="添加斜体"><span className="icon-italic"></span></button>
                <button className="add-code" title="添加代码"><span className="icon-code"></span></button>
                <button className="add-link" title="添加链接"><span className="icon-link"></span></button>
                <button className="add-img" title="添加图片"><span className="icon-img"></span></button>
                <button className="add-ul" title="添加无序列表"><span className="icon-ul"></span></button>
                <button className="add-ol" title="添加有序列表"><span className="icon-ol"></span></button>
                <button className="add-quote" title="添加块引用"><span className="icon-quote"></span></button>
                <button className="add-line" title="添加分割线"><span className="icon-line"></span></button>
            </div>
        );
    }
}
