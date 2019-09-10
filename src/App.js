import React from 'react';
import "./App.css"
import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import moment from 'moment';

const { TextArea } = Input;

const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);

const Editor = ({ onChange1, onChange2, onSubmit, submitting, value, author }) => (
    <div>
        <Form.Item>
            <Input onChange={onChange2} value={author}/>
            <TextArea rows={4} onChange={onChange1} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

export class App extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
    };

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                author: '',
                comments: [
                    {
                        author: <p>{this.state.author}</p>,
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content: <p>{this.state.value}</p>,
                        datetime: moment().fromNow(),
                    },
                    ...this.state.comments,
                ],
            });
        }, 1000);
    };

    handleChange1 = e => {
        this.setState({
            value: e.target.value,
        });
    };

    handleChange2 = e => {
        this.setState({
            author: e.target.value,
        });
    };

    render() {
        const { comments, submitting, value, author } = this.state;

        return (
            <div>
                <h1>Комментарии</h1>
                {comments.length > 0 && <CommentList comments={comments} />}
                <Comment
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                        />
                    }
                    content={
                        <Editor
                            onChange1={this.handleChange1}
                            onChange2={this.handleChange2}
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

