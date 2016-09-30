import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { showList, addArticle, delArticle, updateArticle,
    updateTitle, changeEditing, changeScreen } from '../actions';
import EditorNav from '../components/EditorNav';
import EditorMain from '../components/EditorMain';
import EditorArticleList from '../components/EditorArticleList';


class EditorApp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { undoStack: [], redoStack: [] };
        this.handleDrop = this.handleDrop.bind(this);
    }

    componentDidMount() {
        this.timer = setTimeout(() => this.setStack(), 2000);
        document.addEventListener('drop', this.handleDrop);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        document.removeEventListener('drop', this.handleDrop);
    }

    setStack() {
        const undoStack = [...this.state.undoStack];
        if (undoStack[undoStack.length - 1] !== this.props.editing.body) {
            if (undoStack.length > 50) {
                undoStack.shift();
            }
            undoStack.push(this.props.editing.body);
            this.setState({ undoStack });
        }
        this.timer = setTimeout(() => this.setStack(), 2000);
    }

    handleUndo() {
        const undoStack = [...this.state.undoStack];
        const redoStack = [...this.state.redoStack];
        if (undoStack.length > 1) {
            const body = undoStack[undoStack.length - 2];
            redoStack.push(undoStack.pop());
            this.setState({ undoStack, redoStack });
            this.props.dispatch(updateArticle(body));
        }
    }

    handleRedo() {
        const undoStack = [...this.state.undoStack];
        const redoStack = [...this.state.redoStack];
        if (redoStack.length > 0) {
            const body = redoStack.pop();
            undoStack.push(body);
            this.setState({ undoStack, redoStack });
            this.props.dispatch(updateArticle(body));
        }
    }

    handleDrop() {
        // 文件读取API
        const reader = new FileReader();
        reader.onload = evt => {
            let date = new Date();
            date = `${date.getFullYear()}-${date.getMonth() + 1}-
                  ${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            // 创建新文章并初始化
            this.props.dispatch(addArticle(date));
            this.props.dispatch(updateArticle(evt.target.result));
        };
        reader.readAsText(event.dataTransfer.files[0]);
        event.preventDefault();
    }

    render() {
        const { dispatch, editing, articles, listVisible, screenShow } = this.props;
        return (
            <div>
                <div className="wrapper" style={{ left: listVisible ? '250px' : '0px' }}>
                    <EditorNav
                      {...editing}
                      undo={ this.state.undoStack.length <= 1 }
                      redo={ this.state.redoStack.length === 0 }
                      screenShow={ screenShow }
                      updateTitle={ title => dispatch(updateTitle(title)) }
                      addArticle={ date => {
                          this.setState({ undoStack: [], redoStack: [] });
                          dispatch(addArticle(date));
                      } }
                      delArticle={ date => {
                          this.setState({ undoStack: [], redoStack: [] });
                          dispatch(delArticle(date));
                      } }
                      handleUndo={ () => this.handleUndo() }
                      handleRedo={ () => this.handleRedo() }
                      changeScreen={ show => dispatch(changeScreen(show)) }
                    />
                    <EditorMain
                      screenShow={ screenShow }
                      editingText={ editing.body }
                      updateArticle={ body => {
                          this.setState({ redoStack: [] });
                          dispatch(updateArticle(body));
                      } }
                    />
                    <a title="文章列表" className="show-articles"
                      onClick={ () => dispatch(showList()) }
                    >
                        <span
                          className={ listVisible ? 'icon-arrow_left' : 'icon-arrow_right' }
                        ></span>
                    </a>
                </div>
                <EditorArticleList
                  listVisible={ listVisible }
                  articles={ articles }
                  changeEditing={ date => {
                      this.setState({ undoStack: [], redoStack: [] });
                      dispatch(changeEditing(date));
                  } }
                  delArticle={ date => dispatch(delArticle(date)) }
                />
                <div className="modal" style = {{ display: listVisible ? 'block' : 'none' }}>
                </div>
            </div>
        );
    }
}

EditorApp.PropTypes = {
    editing: PropTypes.shape({
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
    }).isRequired,
    articles: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
    }).isRequired).isRequired,
    listVisible: PropTypes.bool.isRequired,
    screenShow: PropTypes.number.isRequired
};

function selector(state) {
    return {
        editing: state.get('articles').get(0).toJS(),
        articles: state.get('articles').toJS(),
        listVisible: state.get('listVisible'),
        screenShow: state.get('screenShow')
    };
}

export default connect(selector)(EditorApp);
