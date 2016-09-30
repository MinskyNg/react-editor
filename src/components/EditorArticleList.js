import React from 'react';
import EditorArticleItem from './EditorArticleItem.js';


export default class EditorArticleList extends React.PureComponent {
    render() {
        let articleItems = this.props.articles.map((article, index) => {
            return (
                <EditorArticleItem
                  key={ article.date }
                  index={ index }
                  title={ article.title }
                  date={ article.date }
                  changeEditing={ this.props.changeEditing }
                  delArticle={ this.props.delArticle }
                />
            );
        });
        return (
            <div className="aside" style={{ left: this.props.listVisible ? '0px' : '-250px' }}>
                <h2>文章列表</h2>
                <ul className="article-list">{ articleItems }</ul>
            </div>
        );
    }
}
