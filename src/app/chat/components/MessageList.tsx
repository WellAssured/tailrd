import * as React from 'react';
import { Input, Icon } from 'antd';
import { Element, scroller } from 'react-scroll';
import { CognitoUser } from 'amazon-cognito-identity-js';

import Message, { IMessage } from './Message';

interface IMessageListProps {
  handleNewMessage: ({}: {convoId: string, content: string}) => void;
  handlePhotoUpload: (photo: Photo) => Promise<{}>;
  messages: Array<IMessage>;
  activeConversationId: string;
  currentUser: CognitoUser;
  participants: Array<{
    cognitoId: string;
    username: string;
  }>;
}
interface IMessageListState {
  message: string;
  photo: Photo;
  sendingMessage: boolean;
}

export interface Photo {
  name: string;
  type: string;
  size: number;
  status: string;
  data: string | ArrayBuffer;
  uploadProgress: number;
  updateProgress: ({}) => void;
};

const PHOTO_STATUS = { NO_PHOTO: 'No Photo', LOADING: 'Loading', READY: 'Ready', SUCCESS: 'Sucess', ERROR: 'Error' };
const initialPhotoState = {
  name: '',
  type: '',
  size: 0,
  status: PHOTO_STATUS.NO_PHOTO,
  data: '',
  uploadProgress: 0,
  updateProgress: (progress) => console.log(`Uploaded: ${progress.loaded}/${progress.total}`),
};

class MessageList extends React.Component<IMessageListProps, IMessageListState> {
  constructor(props: IMessageListProps) {
    super(props);
    this.state = {
      message: '',
      photo: initialPhotoState,
      sendingMessage: false,
    };
  }

  componentDidMount() {
    scroller.scrollTo('bottom', {containerId: 'messageList'});
  }
  componentDidUpdate(prevProps: IMessageListProps) {
    if (this.props.messages.length !== prevProps.messages.length) {
      scroller.scrollTo('bottom', {containerId: 'messageList'});
    }
  }

  messageReadyToSend() {
    if (this.state.photo.status === PHOTO_STATUS.NO_PHOTO) {
      return this.state.message.length !== 0;
    }
    return this.state.photo.status === PHOTO_STATUS.READY;
  }

  sendMessage = () => {
    let content = '';
    let data;
    if (this.state.photo.status === PHOTO_STATUS.READY) {
      data = this.props.handlePhotoUpload(this.state.photo)
    } else if (this.state.message.length > 0) {
      content = this.state.message;
    }
    this.setState({ message: '', photo: initialPhotoState, sendingMessage: true });
    this.props.handleNewMessage({convoId: this.props.activeConversationId, content: (content || data)});
  }

  handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !(e.altKey || e.ctrlKey)) {  // https://www.w3.org/TR/uievents-key/#keys-whitespace
      e.preventDefault();
      this.sendMessage();
    }
  }

  handleInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({ message: e.currentTarget.value });
  }

  handlePhotoChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0];
      const photoToUpload = {
        name: file.name,
        type: file.type,
        size: file.size,
        status: PHOTO_STATUS.LOADING,
        data: '' as string | ArrayBuffer,
        uploadProgress: 0
      };
      this.setState({ photo: photoToUpload });
      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result === null) {
          photoToUpload.status = PHOTO_STATUS.ERROR;
        } else {
          photoToUpload.data = fileReader.result;
          photoToUpload.status = PHOTO_STATUS.READY;
        }
        this.setState({ photo: photoToUpload });
      };
      fileReader.onprogress = (readerProgressEvent) => {
        const photoInProgress = this.state.photo;
        photoInProgress.uploadProgress = Math.round((readerProgressEvent.loaded * 100) / readerProgressEvent.total);
        this.setState({ photo: photoInProgress });
      };
      fileReader.readAsArrayBuffer(file);

    } else {
      this.setState({ photo: initialPhotoState });
    }
  }

  renderPhoto = () => {
    switch (this.state.photo.status) {
    case PHOTO_STATUS.LOADING:
      return <div>{PHOTO_STATUS.LOADING}</div>;
    default:
      return <div>{this.state.photo.name}</div>;
    }
  }

  renderMessageInput() {
    return (
      <div className="message-box-container">
        <div className="message-box">
          <label className="photo-input-container">
            <Icon type="camera" />
            <Input id="photo-input" type="file" accept="image/*" capture="environment" onChange={this.handlePhotoChange} />
          </label>
          { this.state.photo.status !== PHOTO_STATUS.NO_PHOTO ? this.renderPhoto() :
            <Input.TextArea
              value={this.state.message}
              placeholder={
                this.props.participants.length > 2 ? 
                  'Message this group' :
                  `Message ${this.props.participants.find(p => p.username !== this.props.currentUser.getUsername())!.username}`
              }
              autosize={{ maxRows: 6 }}
              onChange={this.handleInputChange}
              onKeyDown={this.handleInputKeyDown}
              autoFocus={true}
            />
          }
          <Icon
            type="up-circle"
            theme="outlined"
            className={`send-message-button ${this.messageReadyToSend() ? '' : 'cannot-send'}`}
            onClick={this.sendMessage}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="messageList-messageBox">
        <div className="messageList-title">Chat with {this.props.participants.find(p => p.username !== this.props.currentUser.getUsername())!.username}</div>
        <div className="chat-list messageList" id="messageList">
          {[...this.props.messages].reverse().map((c, i) => {
            const pSender = this.props.participants.find(p => p.cognitoId === c.sender);
            const sender = pSender === undefined ? 'Unknown' : pSender.username;
            return (
              <div
                key={`convo-${i}`}
                className={`message-container message-float-${sender === this.props.currentUser.getUsername() ? 'right' : 'left'}`}
              >
                <Message message={{ ...c, ...{ sender }}} />
              </div>
            );
          })}
          <Element name="bottom" />
        </div>
        {this.renderMessageInput()}
      </div>
    );
  }
}

export default MessageList;
