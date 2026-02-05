import { useState, useRef, useEffect } from "react";
import { socket } from "../scoket";
export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello, How can i help you today" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handler = (msg) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("bot_message", handler);
    return () => {
      socket.off("bot_message", handler);
    };
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
    /*  Container */
    <div className="h-screen w-screen   bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      {/* The chatbot Main div! */}
      <div className="w-full max-w-3xl h-[90vh] bg-white/10 backdrop-blur rounded-2xl shadow-2xl flex flex-col">
        {/* Header of the chatbot */}
        <div className="border-b border-white/30 h-16 flex items-center gap3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex  items-center justify-center text-white font-bold">
            AI
          </div>
          <div className="text-white font-semibold px-10">
            Chatbot Made by Rizik
          </div>
        </div>
        {/* Messages template */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`
                max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-indigo-500 text-white rounded-br-none"
                    : "mr-auto bg-white/20 text-white rounded-bl-none"
                }
                `}
            >
              {m.content}
            </div>
          ))}
          {isTyping && (
            <div className="mr-auto bg-white/20 px-4 py-2 rounded-xl text-white flex gap-1 w-fit">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}

        <div className="p-4 border-t border-white/10 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="We happy to help you"
            className="flex-1 rounded-lg px-4 py-2 bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-900 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
