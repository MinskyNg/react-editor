import React from 'react';


export default class EditorArticleItem extends React.PureComponent {
    handleDel(event) {
        if (confirm('确定要删除此分类吗?')) {
            this.props.delArticle(this.props.date);
        }
        event.preventDefault();
        event.stopPropagation();
    }

    render() {
        return (
            <li className={ this.props.index !== 0 ? '' : 'active' } title="选择文章"
              onClick={ () => this.props.changeEditing(this.props.date) }
            >
              { this.props.title }
              <a className="delete" title="删除文章"
                onClick={ (e) => this.handleDel(e) }
              ></a>
            </li>
        );
    }
}
