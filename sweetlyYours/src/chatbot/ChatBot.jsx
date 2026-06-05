import React, {useState, useRef, useEffect} from "react";
import floatingIcon from "../assets/Images/floatingIcon.gif";
import { chatbotEndpoints } from "../services/apis";
import { apiConnector } from "../services/apiconnector";
import { useNavigate } from "react-router-dom";



const ChatBot = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false);
       const [messages, setMessages] = useState([
        {
            sender: "bot",
    text: "Hi 👋 What are you celebrating today?", 
        }
    ]);
const navigate = useNavigate();



const chatEndRef = useRef(null);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, loading]);
   

    const { CHAT_API } = chatbotEndpoints;



    // send function

const handleSend = async () => {
  if (!message.trim()) return;

  const userMessage = message;

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userMessage,
    },
  ]);

  setMessage("");
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

const response = await apiConnector(
  "POST",
  CHAT_API,
  {
    message: userMessage,
  },
  {
    Authorization: `Bearer ${token}`,
  }
);

    console.log(response.data);
    console.log(response.data.products);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: response.data.reply,
        products:
          response.data.products || [],
      },
    ]);
  } catch (error) {
    console.log("Chat Error:", error);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text:
          "Sorry, something went wrong 😔",
      },
    ]);
  } finally {
    setLoading(false);
  }
};


    return (
       <>
      {/* Chat Window */}
      <div
  className={`fixed bottom-28 right-5 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ${
    isOpen
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-10 pointer-events-none"
  }`}
>
  {/* Header */}
  <div className="bg-[#6D2932] text-white p-4 flex justify-between items-center">
    <h2 className="font-semibold">
      Sweetly Assistant 🐻
    </h2>

    <button
      onClick={() => setIsOpen(false)}
      className="text-xl"
    >
      ×
    </button>
  </div>

  {/* Messages */}
 <div className="h-80 p-4 overflow-y-auto">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`mb-3 flex ${
        msg.sender === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`p-3 rounded-xl max-w-[85%] ${
          msg.sender === "user"
            ? "bg-[#6D2932] text-white"
            : "bg-pink-100"
        }`}
      >
        <div>{msg.text}</div>

        {msg.products?.length > 0 && (
          <div className="mt-3 space-y-3">
            {msg.products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg border overflow-hidden"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-28 object-cover"
                />

                <div className="p-2">
                  <h3 className="font-semibold text-sm">
                    {product.name}
                  </h3>

                  <p className="text-[#6D2932] font-bold">
                    ₹{product.price}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/product/${product._id}`
                      )
                    }
                    className="mt-2 w-full bg-[#6D2932] text-white text-sm py-2 rounded-lg"
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ))}

  {loading && (
    <div className="flex justify-start mb-3">
      <div className="bg-pink-100 p-3 rounded-xl">
        🍰 Thinking...
      </div>
    </div>
  )}

  <div ref={chatEndRef} />
</div>

  {/* Input */}
  <div className="border-t p-3 flex gap-2">
    <input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  }}
  placeholder="Type your message..."
  className="flex-1 border rounded-lg px-3 py-2 outline-none"
/>

 <button
    onClick={handleSend}
    className="bg-[#6D2932] text-white px-4 rounded-lg"
  >
    Send
  </button>
  </div>
</div>

      {/* Floating GIF */}
{!isOpen && (
  <div className="fixed bottom-5 right-5 z-50">
    <button onClick={() => setIsOpen(true)}>
      <img
        src={floatingIcon}
        alt="Assistant"
        className="w-32 h-32 cursor-pointer"
      />
    </button>
  </div>
)}
    </>
    )
}



export default ChatBot;