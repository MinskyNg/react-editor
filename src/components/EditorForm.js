import React, { PropTypes } from 'react';


export default class EditorForm extends React.PureComponent {
    render() {
        return (
            <div className="form-wrapper" style={{ display: 'none' }}>
                <form>
                    <input className="input-word" type="text" placeholder="请输入说明"></input>
                    <input className="input-address" type="text" placeholder="请输入地址"></input>
                    <button className="cancel">取消</button>
                    <button className="submit">确定</button>
                </form>
            </div>
        );
    }
}
