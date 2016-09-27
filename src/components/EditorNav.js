import React, { PropTypes } from 'react';


export default class EditorNav extends React.PureComponent {
    render() {
        return (
            <div className="nav">
                <input type="text" id="input-title" placeholder="请输入标题"></input>
                <button className="new-article" title="新建文章"><span className="icon-new"></span></button>
                <button className="del-article" title="删除文章"><span className="icon-del"></span></button>
                <button className="down-article" title="下载文章"><span className="icon-download"></span></button>
                <button className="undo" title="撤销" disabled="true" style={{ backgroundColor: '#555' }}><span className="icon-undo"></span></button>
                <button className="redo" title="恢复" disabled="true" style={{ backgroundColor: '#555' }}><span className="icon-redo"></span></button>
                <button className="show-double" title="双屏显示" disabled="true" style={{ backgroundColor: '#555' }}><span className="icon-double"></span></button>
                <button className="show-editor" title="只显示编辑区" style={{ backgroundColor: '#F5F5F5' }}><span className="icon-editor"></span></button>
                <button className="show-preview" title="只显示预览区" style={{ backgroundColor: '#F5F5F5' }}><span className="icon-preview"></span></button>
                <a title="语法提示" className="show-tips"><span className="icon-tips"></span></a>
                <div className="tips" style={{ display: 'none' }}>
                    <h2>Markdown 简明语法</h2>
                    <a target="_blank" href="http://lutaf.com/markdown-simple-usage.htm">原文地址</a>
                    <h3>基本符号</h3>
                    <ul>
                        <li>*,-,+ 3个符号效果都一样，这3个符号被称为 Markdown符号</li>
                        <li>空白行表示另起一个段落</li>
                        <li>`是表示inline代码，tab是用来标记 代码段，分别对应html的code，pre标签</li>
                    </ul>
                    <h3>换行</h3>
                    <ul>
                        <li>单一段落( &ltp&gt) 用一个空白行</li>
                        <li>连续两个空格 会变成一个 &ltbr&gt</li>
                        <li>连续3个符号，然后是空行，表示 hr横线</li>
                    </ul>
                    <h3>标题</h3>
                    <ul>
                        <li>生成h1--h6,在文字前面加上 1--6个# 来实现</li>
                        <li>文字加粗是通过 文字左右各两个符号</li>
                    </ul>
                    <h3>引用</h3>
                    <ul>
                        <li>在第一行加上 “>”和一个空格，表示代码引用，还可以嵌套</li>
                    </ul>
                    <h3>列表</h3>
                    <ul>
                        <li>使用*,+,-加上一个空格来表示</li>
                        <li>可以支持嵌套</li>
                        <li>有序列表用 数字+英文点+空格来表示</li>
                        <li>列表内容很长，不需要手工输入换行符，css控制段落的宽度，会自动的缩放的</li>
                    </ul>
                    <h3>链接</h3>
                    <ul>
                        <li>直接写 [锚文本](url "可选的title")</li>
                        <li>引用 先定义 [ref_name]:url，然后在需要写入url的地方， 这样使用[锚文本][ref_name]，通常的ref_name一般用数字表示，这样显得专业</li>
                        <li>简写url：用尖括号包裹url 这样生成的url锚文本就是url本身</li>
                    </ul>
                    <h3>插入图片</h3>
                    <ul>
                        <li>一行表示: ![alt_text](url "可选的title")</li>
                        <li>引用表示法: ![alt_text][id],预先定义 [id]:url "可选title"</li>
                        <li>直接使用&ltimg&gt标签，这样可以指定图片的大小尺寸</li>
                    </ul>
                    <h3>特殊符号</h3>
                    <ul>
                        <li>用\\来转义，表示文本中的markdown符号</li>
                        <li>可以在文本种直接使用html标签，但是要注意在使用的时候，前后加上空行</li>
                        <li>文本前后各加一个符号，表示斜体</li>
                    </ul>
                </div>
            </div>
        );
    }
}
