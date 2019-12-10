import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class ChatHistory extends React.Component {
  static propTypes = {
    history: React.PropTypes.array,
    fetchHistory: React.PropTypes.func,
  };

  componentWillUpdate(nextProps) {
    this.historyChanged = nextProps.history.length !== this.props.history.length;
    if (this.historyChanged) {
      const { messageList } = this.refs;
      const scrollPos = messageList.scrollTop;
      const scrollBottom = (messageList.scrollHeight - messageList.clientHeight);
      this.scrollAtBottom = (scrollBottom === 0) || (scrollPos === scrollBottom);
      if (!this.scrollAtBottom) {
        const numMessages = messageList.childNodes.length;
        this.topMessage = numMessages === 0 ? null : messageList.childNodes[0];
      }
    }
  }

  componentDidUpdate() {
    if (this.historyChanged) {
      if (this.scrollAtBottom) {
        this.scrollToBottom();
      }
      if (this.topMessage) {
        ReactDOM.findDOMNode(this.topMessage).scrollIntoView();
      }
    }
  }

  onScroll = () => {
    const { refs, props } = this;
    const scrollTop = refs.messageList.scrollTop;
    if (scrollTop === 0) {
      props.fetchHistory();
    }
  };

  render() {
    const { props, onScroll } = this;
    return (
      <ul className="chat__room" ref="messageList" onScroll={ onScroll }>
        { props.history.map((messageObj) => {
          const messageDate = new Date(messageObj.When);
          const messageDateTime = messageDate.toLocaleTimeString('en-CA', { hourCycle: 'h23' });
          return (
            <li className="chat__cell" key={ messageObj.When }>
                <h3 className="chat__message">{ messageObj.What }</h3>
                <div className="chat__info">
                <h3 className="chat__name">Client No. { messageObj.Who }</h3>
                <h3 className="chat__date">{ messageDateTime }</h3>
                </div>
                <div className="chat__overlay">
                {/* <h3 className="chat__overlay-text">hidden</h3> */}
                </div>
            </li>
          );
        }) }
      </ul>
    );
  }

  static scrollAtBottom = true;

  scrollToBottom = () => {
    const { messageList } = this.refs;
    const scrollHeight = messageList.scrollHeight;
    const height = messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }
}
