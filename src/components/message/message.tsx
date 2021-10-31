import React from "react";
import { useAuth } from "../../contexts/authContext";
import "./message.css";

export interface MessageData {
  authorID: string;
  content: string;
}

export function Message(props: { data?: MessageData }) {
  const currentUser = useAuth();
  const ownMessage = props.data?.authorID === currentUser?.uid ? true : false;

  return (
    <div
      className="f-message"
      style={
        ownMessage
          ? {
              alignSelf: "flex-end",
              backgroundColor: "var(--main)",
              borderRadius: "0.6rem 0 0.6rem 0.6rem",
            }
          : {
              alignSelf: "flex-start",
              borderRadius: "0 0.6rem 0.6rem 0.6rem",
            }
      }
    >
      <pre>{props.data?.content}</pre>
      {/* {props.data?.authorID === "app" ? (
        <button>
          <small>(This is only visible to you. Click to hide.)</small>
        </button>
      ) : null} */}
    </div>
  );
}
