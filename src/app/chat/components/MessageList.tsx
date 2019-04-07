import * as React from 'react';
import { AxiosPromise, AxiosResponse } from 'axios';
import { Input, Icon, Button } from 'antd';
import { Element, scroller } from 'react-scroll';
import { CognitoUser } from 'amazon-cognito-identity-js';

import Message, { IMessage } from './Message';

interface IMessageListProps {
  handleNewTextMessage: ({}: {convoId: string, content: string}) => void;
  handleNewPhotoMessage: ({}: {convoId: string, key: string}) => void;
  handlePhotoUpload: (convoId: string, photo: IPhoto) => AxiosPromise<any>;
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
  photo: IPhoto;
  sendingMessage: boolean;
}

export interface IPhoto {
  name: string;
  type: string;
  size: number;
  status: string;
  data: ArrayBuffer;
  uploadProgress: number;
  updateProgress: ({}: ProgressEvent) => void;
}

const PHOTO_STATUS = { NO_PHOTO: 'No Photo', LOADING: 'Loading', READY: 'Ready', SUCCESS: 'Sucess', ERROR: 'Error' };
const initialPhotoState = {
  name: '',
  type: '',
  size: 0,
  status: PHOTO_STATUS.NO_PHOTO,
  data: new ArrayBuffer(0),
  uploadProgress: 0,
  updateProgress: (progress: ProgressEvent) => console.log(`Uploaded: ${progress.loaded}/${progress.total}`),
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

  sendTextMessage = () => {
    this.props.handleNewTextMessage({convoId: this.props.activeConversationId, content: this.state.message});
    this.setState({ message: '', photo: initialPhotoState, sendingMessage: true });
  }

  sendPhoto = (key: string) => {
    this.props.handleNewPhotoMessage({convoId: this.props.activeConversationId, key});
    this.setState({ message: '', photo: initialPhotoState, sendingMessage: true });
  }

  handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !(e.altKey || e.ctrlKey)) {  // https://www.w3.org/TR/uievents-key/#keys-whitespace
      e.preventDefault();
      this.sendTextMessage();
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
        data: new ArrayBuffer(0),
        uploadProgress: 0,
        updateProgress: initialPhotoState.updateProgress
      };
      this.setState({ photo: photoToUpload });
      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result === null) {
          photoToUpload.status = PHOTO_STATUS.ERROR;
        } else {
          photoToUpload.data = fileReader.result as ArrayBuffer;
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

  handlePhotoCancel = () => this.setState({ photo: initialPhotoState });

  handlePhotoUploadFinished = (result: AxiosResponse<any>) => {
    if (result.status < 300) {
      console.log('successful upload');
      this.setState({ photo: initialPhotoState });
      this.sendPhoto(result.config.data.get('key'));
    } else {
      console.log('upload failed');
    }
  }

  renderPhoto = () => {
    switch (this.state.photo.status) {
    case PHOTO_STATUS.LOADING:
      return <div className="photo-input-display">{PHOTO_STATUS.LOADING}</div>;
    default:
      return (
        <div className="photo-input-display">
          <img className="photo-input-image" width="40%" src={`data:${this.state.photo.type};base64,${Buffer.from(this.state.photo.data).toString('base64')}`} />
          <Button className="cancel-upload-button" shape="circle" icon="close" onClick={this.handlePhotoCancel}/>
        </div>
      );
    }
  }

  renderMessageInput() {
    return (
      <div className="message-box-container">
        <div className="message-box">
          <label className="photo-input-container">
            <Icon type="camera" />
            <Input hidden={true} id="photo-input" type="file" accept="image/*" onChange={this.handlePhotoChange} value={undefined}/>
          </label>
          { this.state.photo.status !== PHOTO_STATUS.NO_PHOTO ? this.renderPhoto() :
            <Input.TextArea
              value={this.state.message}
              placeholder={
                this.props.participants.length > 2 ? 
                  'Message this group' :
                  `Message ${this.props.participants.find(p => p.username !== this.props.currentUser.getUsername())!.username}`
              }
              style={{textAlign: 'right'}}
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
            onClick={
              this.state.photo.status === PHOTO_STATUS.NO_PHOTO ?
                this.sendTextMessage :
                () => this.props.handlePhotoUpload(this.props.activeConversationId, this.state.photo).then(res => this.handlePhotoUploadFinished(res))
            }
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
