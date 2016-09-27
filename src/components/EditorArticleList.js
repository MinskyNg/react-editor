import React, { PropTypes } from 'react';


export default class EditorArticleList extends React.PureComponent {
    render() {
        return (
            <div className="aside" style={{ left: '-250px' }}>
                <h2>文章列表</h2>
                <ul className="article-list">
                </ul>
            </div>
        );
    }
}
