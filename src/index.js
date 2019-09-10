import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {Comment, Avatar, Form, Button, List, Input} from 'antd';
import moment from 'moment';
import {action, configure, observable} from "mobx";
import {observer} from "mobx-react";

const {TextArea} = Input;

const CommentList = ({comments}) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);

const Editor = ({handleChangeComment, handleChangeAuthor, onSubmit, submitting, value, author}) => (
    <div>
        <Form.Item>
            <Input onChange={handleChangeAuthor} value={author}/>
            <TextArea rows={4} onChange={handleChangeComment} value={value}/>
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

configure({ enforceActions: 'observed' });

const commentsState = observable({
    comments: [],
    submitting: false,
    comment: '',
    author: '',

    handleSubmit() {
        if (!this.comment || !this.comment) {
            return;
        }
        this.submitting = true;

        setTimeout(() => {
                this.submitting = false;
                this.comment = '';
                this.author = '';
                this.comments = [
                    {
                        author: <p>{this.author}</p>,
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content: <p>{this.comment}</p>,
                        datetime: moment().fromNow(),
                    },
                    ...this.comments
                ];
        }, 1000)
    },

    handleChangeComment(e) {
        this.comment = e.target.value;
    },

    handleChangeAuthor(e) {
        this.author = e.target.value;
    }
}, {
    handleChangeComment: action('Change comment'),
    handleChangeAuthor: action('Change author'),
    handleSubmit: action('Submit')
}, {
    name: 'commentsStateObservableObject'
});

@observer class App extends React.Component {

    handleChangeComment = (e) => { this.props.store.handleChangeComment(e) };
    handleChangeAuthor = (e) => { this.props.store.handleChangeAuthor(e) };
    handleSubmit = () => { this.props.store.handleSubmit() };

    render() {
        const {comments, submitting, value, author} = this.props.store;

        return (
            <div>
                <h1>Комментарии</h1>
                {comments.length > 0 && <CommentList comments={comments}/>}
                <Comment
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                        />
                    }
                    content={
                        <Editor
                            handleChangeComment={this.handleChangeComment}
                            handleChangeAuthor={this.handleChangeAuthor}
                            onSubmit={this.handleSubmit}
                            submitting={submitting}
                            value={value}
                            author={author}
                        />
                    }
                />
            </div>
        );
    }
}


ReactDOM.render(<App store={commentsState}/>, document.getElementById('root'));

serviceWorker.unregister();
