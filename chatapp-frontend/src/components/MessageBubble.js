function MessageBubble({ message }) {
    return (
      <div className="chat-bubble">
        <p>{message.content}</p>
        <span className="text-xs text-gray-400">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    );
  }
  
  export default MessageBubble;
  