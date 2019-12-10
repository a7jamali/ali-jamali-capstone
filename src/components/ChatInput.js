import * as React from 'react';

class ChatInput extends React.Component {
  static propTypes = {
    userID: React.PropTypes.number,
    sendMessage: React.PropTypes.func,
  };

  componentDidMount() {
    this.refs.txtMessage.focus();
  }

  onSubmit = (e) => {
    e.preventDefault();

    // Check if the message is empty
    const message = this.refs.txtMessage.value;
    if (message.length === 0) {
      return;
    }

    // Build a message object and send it
    const messageObj = {
      Who: this.props.userID,
      What: message,
      When: new Date().valueOf(),
    };
    this.props.sendMessage(messageObj);

    // Clear the input field and set focus
    this.refs.txtMessage.value = '';
    this.refs.txtMessage.focus();
  };

  render() {
    const { props, onSubmit } = this;
    return (
      <div className="input__div">
        <form className="input__form" onSubmit={ onSubmit }>
            <div className="input__info">
              <h3 className="input__user">client ID { props.userID }</h3>
              <input className="input__text" ref="txtMessage" type="text" placeholder="aMessage"/>
            </div>
            <div className="input__button-wrapper">
              <button type="submit" className="input__button">
                send message
              </button>
            </div>
        </form>
      </div>
    );
  }
}

export default ChatInput;
