import { useState, useRef, useEffect } from "react";
import { socket } from "../scoket";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handler = (msg) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("bot_message", handler);
    return () => socket.off("bot_message", handler);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    socket.emit("user_message", userMsg);
    setInput("");
  };

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-0 sm:px-4">

      {/* Chat Card */}
      <div className="w-full sm:max-w-3xl h-full sm:h-[92vh] bg-white/10 backdrop-blur rounded-none sm:rounded-2xl shadow-2xl flex flex-col">

        {/* Header */}
        <div className="h-14 sm:h-16 px-4 flex items-center gap-3 border-b border-white/20">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <span className="text-white font-semibold text-sm sm:text-base">
            Chatbot by Rizik
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-indigo-500 text-white rounded-br-md"
                  : "mr-auto bg-white/20 text-white rounded-bl-md"
              }`}
            >
              {m.content}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="mr-auto bg-white/20 px-4 py-2 rounded-2xl text-white flex gap-1 w-fit">
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input (sticky on mobile) */}
        <div className="p-3 sm:p-4 border-t border-white/10 flex gap-2 bg-slate-900/40 backdrop-blur">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message…"
            className="flex-1 rounded-xl px-4 py-2 bg-white/90 text-slate-900 text-sm focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-semibold active:scale-95 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
