import React, { useEffect, useState } from "react";
import { Message, MessageData } from "./components/message";
import { AuthProvider, useAuth } from "./contexts/authContext";
import Window from "./components/window";
import * as Icon from "react-feather";
import "./App.css";
import { onMessage, sendMessage } from "./firebase";

function App() {
  const [messages, setMessages] = useState<MessageData[]>([
    {
      authorID: "app",
      content: "Welcome to msngr2! The realtime anonymous chat app!",
    },
  ]);

  useEffect(() => {
    onMessage((snapshot) => {
      const value = snapshot.val();
      if (value) {
        // Get snapshot values, and flatten array.
        const data = (Object.values(snapshot.val()) as MessageData[][]).flat();

        setMessages((m) => m.concat([...data]));
      } else {
        // In case the snapshot is empty, just add nothing initially.
        setMessages((m) => m);
      }
    });
  }, []);

  function handleSend(authorID: string, content: string) {
    sendMessage({
      authorID,
      content,
    });
  }

  return (
    <div className="App light-theme">
      <AuthProvider>
        <>
          <span className="f-titlebar">
            <h1>msngr2</h1>
          </span>
          <Window items={messages} autoScrollToBottom>
            {({ index }) => <Message data={messages[index]} />}
          </Window>
          <TextArea handleSend={handleSend} />
        </>
      </AuthProvider>
    </div>
  );
}

function TextArea(props: {
  handleSend: (authorID: string, content: string) => void;
}) {
  const currentUser = useAuth();
  const [content, setContent] = useState("");

  function handleSend(content: string) {
    setContent("");
    props.handleSend(currentUser?.uid ?? "", content);
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
  }

  function validMessage() {
    return content.length > 1 && content.length <= 2000;
  }

  return (
    <span className="f-textarea-wrp">
      <textarea
        onChange={(e) => handleChange(e)}
        onKeyUp={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            if (validMessage()) {
              handleSend(content);
            }
          }
        }}
        value={content}
        maxLength={3000}
      />
      <button
        className="f-big-btn"
        disabled={!validMessage()}
        onClick={() => handleSend(content)}
      >
        <Icon.Send />
      </button>
    </span>
  );
}

export default App;
