import React from 'react';
import { connect } from 'react-redux';
import ChatInput from '../components/ChatInput';
import ChatHistory from '../components/ChatHistory';
import { setCurrentUserID, addMessage, addHistory } from '../actions';

function mapStateToProps(state) {
  return {
    history: state.app.get('messages').toJS(),
    userID: state.app.get('userID'),
    lastMessageTimestamp: state.app.get('lastMessageTimestamp'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addMessage: (message) => dispatch(addMessage(message)),
    setUserID: (userID) => dispatch(setCurrentUserID(userID)),
    addHistory: (messages, timestamp) => dispatch(addHistory(messages, timestamp)),
  };
}

class App extends React.Component {
  static propTypes = {
    history: React.PropTypes.array,
    userID: React.PropTypes.number,
    addMessage: React.PropTypes.func,
    setUserID: React.PropTypes.func,
    addHistory: React.PropTypes.func,
    lastMessageTimestamp: React.PropTypes.string,
  };

  componentDidMount() {
    const ID = Math.round(Math.random(0) * 7);
    this.props.setUserID(ID);
    this.PubNub = PUBNUB.init({
      publish_key: 'pub-c-dbf851a3-4c3d-44ad-a1cd-ba7e1ce2ba3d',
      subscribe_key: 'sub-c-ac59f6c0-1b18-11ea-b79a-866798696d74',
      ssl: (location.protocol.toLowerCase() === 'https:'),
    });
    this.PubNub.subscribe({
      channel: 'ReactChat',
      message: this.props.addMessage,
    });
    this.fetchHistory();
  }

  render() {
    const { props, sendMessage, fetchHistory } = this;
    return (
      <div className="chat__app">
        <ChatHistory history={ props.history } fetchHistory={ fetchHistory } />
        <ChatInput userID={ props.userID } sendMessage={ sendMessage } />
      </div>
    );
  }

  fetchHistory = () => {
    const { props } = this;
    this.PubNub.history({
      channel: 'ReactChat',
      count: 15,
      start: props.lastMessageTimestamp,
      callback: (data) => {
        // data is Array(3), where index 0 is an array of messages
        // and index 1 and 2 are start and end dates of the messages
        props.addHistory(data[0], data[1]);
      },
    });
  }

  sendMessage = (message) => {
    this.PubNub.publish({
      channel: 'ReactChat',
      message: message,
    });
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
