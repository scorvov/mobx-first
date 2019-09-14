import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from "mobx-react";
import {Avatar, Button, Comment, Form, Icon, Input, List, Skeleton} from "antd";
import {action, configure, observable} from "mobx";
import moment from "moment";

const {TextArea} = Input;

const CommentList = ({comments, deleteComment}) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={(item, index) => (
            <List.Item
                actions={[<Icon type="delete" onClick={() => deleteComment(index)}/>]}
            >
                <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                        avatar={
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        }
                        title={<a href="https://ant.design">{item.author}</a>}
                        description={item.content}
                    />
                </Skeleton>
            </List.Item>
        )}
    />
);

const Editor = ({handleChangeComment, handleChangeAuthor, onSubmit, submitting, comment, author}) => (
    <div>
        <Form.Item>
            <Input onChange={handleChangeAuthor} value={author} placeholder={"Автор"}/>
            <TextArea rows={4} onChange={handleChangeComment} value={comment} placeholder={"Текст комментария"}/>
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

    toogleSubmitting() {
        this.submitting = !this.submitting;
    },

    handleChangeComment(e) {
        this.comment = e.target.value;
    },

    handleChangeAuthor(e) {
        this.author = e.target.value;
    },
    nullValues() {
        this.comment = '';
        this.author = '';
    },
    setComments() {
        this.comments = [
            {
                author: <p>{this.author}</p>,
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                content: <p>{this.comment}</p>,
                datetime: moment().fromNow(),
            },
            ...this.comments
        ];
    },
    deleteComment(index) {
        console.log(index);
        this.comments = this.comments.filter((comment, idx) => idx !== index)
    },
    handleSubmit() {
        if (!this.comment || !this.comment) {
            return;
        }
        this.toogleSubmitting();

        setTimeout(() => {
            this.toogleSubmitting();
            this.setComments();
            this.nullValues();
        }, 1000)
    },
}, {
    handleChangeComment: action('Change comment'),
    handleChangeAuthor: action('Change author'),
    handleSubmit: action('Submit'),
    toogleSubmitting: action,
    nullValues:action,
    setComments:action,
    deleteComment: action
}, {
    name: 'commentsStateObservableObject'
});

@observer class App extends React.Component {

    handleChangeComment = (e) => { this.props.store.handleChangeComment(e) };
    handleChangeAuthor = (e) => { this.props.store.handleChangeAuthor(e) };
    handleSubmit = () => { this.props.store.handleSubmit() };
    deleteComment = (index) => { this.props.store.deleteComment(index)};

    render() {

        const {comments, submitting, comment, author} = this.props.store;

        return (
            <div>
                <h1>Комментарии</h1>
                {comments.length > 0 && <CommentList deleteComment={this.deleteComment} comments={comments}/>}
                <Comment
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Ava"
                        />
                    }
                    content={
                        <Editor
                            handleChangeComment={this.handleChangeComment}
                            handleChangeAuthor={this.handleChangeAuthor}
                            onSubmit={this.handleSubmit}
                            submitting={submitting}
                            comment={comment}
                            author={author}
                        />
                    }
                />
            </div>
        );
    }
}

ReactDOM.render(<App store={commentsState}/>, document.getElementById('root'));

