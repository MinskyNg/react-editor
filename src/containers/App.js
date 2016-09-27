import React, { PropTypes } from 'react';
import EditorNav from '../components/EditorNav';
import EditorMain from '../components/EditorMain';
import EditorToolBar from '../components/EditorToolBar';
import EditorForm from '../components/EditorForm';
import EditorArticleList from '../components/EditorArticleList';


export default class EditorApp extends React.PureComponent {
    render() {
        return (
            <div>
                <div className="wrapper" style={{ left: '0px' }}>
                    <EditorNav />
                    <EditorMain />
                    <EditorToolBar />
                </div>
                <EditorArticleList />
                <EditorForm />
                <a title="文章列表" className="show-article" style={{ left: '0px' }}><span className="icon-arrow_right"></span></a>
                <div className="modal">
                </div>
            </div>
        );
    }
}
