import React, { useState, useRef, useEffect } from 'react';
import './App.css';

interface ChatMessage {
  message: string | string[];
  type: 'question' | 'answer';
}

const initialChatMessages: ChatMessage[] = [
  { message: 'Welcome! Ask me a question.', type: 'answer' },
];

const questions: string[] = [
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4"
];

const answers: (string | string[])[] = [
  "Answer 1.",
  "Answer 2.",
  "Answer 3.",
  "Answer 4"
];

const App: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [buttonsVisible, setButtonsVisible] = useState<boolean[]>([true, true, true, true]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat box when chat messages change
    scrollChatToBottom();
  }, [buttonsVisible]);

  const showAnswer = (index: number) => {
    setButtonsVisible(Array(4).fill(false)); // Hide all buttons

    // Fetch the question message
    const questionMessage: ChatMessage = { message: questions[index - 1], type: 'question' };
    setChatMessages(prevMessages => [...prevMessages, questionMessage]);

    setTimeout(() => {
      const answer = answers[index - 1];
      if (Array.isArray(answer)) {
        // If the answer has multiple parts, show them with a delay between each part
        answer.forEach((part, i) => {
          setTimeout(() => {
            const newChatMessage: ChatMessage = { message: part, type: 'answer' };
            setChatMessages(prevMessages => [...prevMessages, newChatMessage]);
            if (i === answer.length - 1) {
              // If it's the last part of the answer, show buttons after a second
              setButtonsVisible(Array(4).fill(true));
            }
          }, i * 500); // Delay for half a second (500 milliseconds) between each part
        });
      } else {
        // Add the answer as a separate message
        const answerMessage: ChatMessage = { message: answer, type: 'answer' };
        setChatMessages(prevMessages => [...prevMessages, answerMessage]);
        // Show buttons after a second for single part answer
        setTimeout(() => {
          setButtonsVisible(Array(4).fill(true));
        }, 1000);
      }
    }, 1000); // Adjust the delay time as needed (in milliseconds)
  };

  const scrollChatToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  return (
    <div className="chat-container">
      <div id='chat-top'>
        <p>Alex's<script type="module" src=""></script> Bot</p>
        <button>X</button>
      </div>
      <div ref={chatBoxRef} id="chat-box" className="chat-box">
        {chatMessages.map((chatMessage, index) => (
          <div key={index} className="chat-message" ref={index === chatMessages.length - 1 ? lastMessageRef : null}>
            <p className={chatMessage.type}>{Array.isArray(chatMessage.message) ? (
              chatMessage.message.map((part, i) => <span key={i}>{part}</span>)
            ) : (
              chatMessage.message
            )}</p>
          </div>
        ))}
        {buttonsVisible.map((visible, index) => (
          visible && <button key={index} onClick={() => showAnswer(index + 1)}>Question {index + 1}</button>
        ))}
      </div>
    </div>
  );
}

export default App;
