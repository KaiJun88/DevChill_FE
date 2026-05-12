/* eslint-disable react-hooks/immutability */
import { useState, useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getAccessToken, getMe } from "../../../utils/auth";
import { getProfile } from "../../../api/userApi";
import ChatHeader from "./ChatHeader";
import TypingIndicator from "./TypingIndicator";
import FloatingButton from "./FloatingButton";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const BACKEND_SOCKET_URL =
  import.meta.env.VITE_API_URL || "https://dev-chill-be-deploy.vercel.app";

const INITIAL_OPTIONS = [
  "Gợi ý phim hay",
  "Tư vấn gói Premium",
  "Lỗi thanh toán",
  "Hỗ trợ tài khoản",
];

const triggerFireworks = () => {
  const duration = 8 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 999999,
  };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      }),
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      }),
    );
  }, 250);
};

export default function DevChillBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const customNavigate = (to, options) => {
    if (typeof to === "string" && to.includes("/movies/watch/")) {
      const currentUser = getMe() || {};
      if (currentUser?.is_premium !== true) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            type: "text",
            content: personalizeText(
              "Phim này là nội dung độc quyền. Bạn cần nâng cấp tài khoản Premium để trải nghiệm nhé! 👑",
            ),
          },
        ]);
        return;
      }
    }
    navigate(to, options);
  };

  const [sessionKey, setSessionKey] = useState(() => {
    const t = getAccessToken();
    return t ? `devchill_chat_${t.slice(-15)}` : "devchill_chat_guest";
  });

  const [userName, setUserName] = useState(() => {
    return "bạn";
  });

  const personalizeText = useCallback(
    (text) => {
      if (!text) return text;
      let cleanText = text
        .replace(/giửp/g, "giúp")
        .replace(/đưưùc/g, "được")
        .replace(/kô/gi, "không")
        .replace(/nhĩ/g, "nhỉ");
      if (userName.toLowerCase() === "bạn") return cleanText;
      return text
        .replace(/Chào bạn/gi, `Chào ${userName}`)
        .replace(/cho bạn/gi, `cho ${userName}`)
        .replace(/của bạn/gi, `của ${userName}`)
        .replace(/Bạn muốn/g, `${userName} muốn`)
        .replace(/Bạn cần/g, `${userName} cần`)
        .replace(/Bạn chưa/g, `${userName} chưa`)
        .replace(/Bạn kiểm tra/g, `${userName} kiểm tra`)
        .replace(/bạn vui lòng/gi, `${userName} vui lòng`)
        .replace(/bạn chờ/gi, `${userName} chờ`)
        .replace(/bạn xem/gi, `${userName} xem`)
        .replace(/bạn thích/gi, `${userName} thích`);
    },
    [userName],
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (getAccessToken()) {
          const data = await getProfile();
          const name =
            data?.username || data?.name || data?.data?.username || "bạn";
          setUserName(name);
        } else {
          setUserName("bạn");
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      }
    };
    fetchUser();
  }, [sessionKey]);

  useEffect(() => {
    const checkTokenChange = () => {
      const currentToken = getAccessToken();
      const newKey = currentToken
        ? `devchill_chat_${currentToken.slice(-15)}`
        : "devchill_chat_guest";

      if (newKey !== sessionKey) {
        setSessionKey(newKey);
      }
    };

    checkTokenChange();
    window.addEventListener("storage", checkTokenChange);
    const interval = setInterval(checkTokenChange, 1000);

    return () => {
      window.removeEventListener("storage", checkTokenChange);
      clearInterval(interval);
    };
  }, [sessionKey]);

  useEffect(() => {
    const savedChat = localStorage.getItem(sessionKey);
    const displayDanhXung = userName && userName !== "bạn" ? userName : "bạn";

    if (savedChat) {
      let parsed = JSON.parse(savedChat);
      if (parsed.length > 0 && parsed[0].sender === "bot" && parsed[0].id) {
        parsed[0].content = `Chào ${userName || "bạn"}! Mình là AI của DevChill. ${displayDanhXung} đang cần hỗ trợ vấn đề gì nào?`;
        if (parsed.length === 1) {
          parsed[0].options = INITIAL_OPTIONS;
        }
      }
      setMessages(parsed);
    } else {
      setMessages([
        {
          id: Date.now(),
          sender: "bot",
          type: "text",
          content: `Chào ${userName || "bạn"}! Mình là AI của DevChill. ${displayDanhXung} đang cần hỗ trợ vấn đề gì nào?`,
          options: INITIAL_OPTIONS,
        },
      ]);
    }
  }, [sessionKey, userName]);

  useEffect(() => {
    if (messages.length > 0) {
      const messagesToSave = messages.map((m) => ({
        ...m,
        options: undefined,
      }));
      localStorage.setItem(sessionKey, JSON.stringify(messagesToSave));
    }
    scrollToBottom();
  }, [messages, sessionKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearChat = () => {
    localStorage.removeItem(sessionKey);
    const displayDanhXung = userName !== "bạn" ? userName : "Bạn";
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        type: "text",
        content: ` Chào ${displayDanhXung} đang cần hỗ trợ gì nào?`,
        options: INITIAL_OPTIONS,
      },
    ]);
  };
  useEffect(() => {
    socketRef.current = io(BACKEND_SOCKET_URL, {
      auth: { token: getAccessToken() },
      transports: ["websocket", "polling"],
    });
    socketRef.current.on("bot_typing", (data) => {
      setIsTyping(data.isTyping);
    });
    socketRef.current.on("bot_error", (data) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          type: "text",
          content:
            data.error ||
            "Đường truyền tới hệ thống AI đang gián đoạn do quá tải, bạn chờ chút nhé!",
        },
      ]);
    });
    socketRef.current.on("bot_reply", (response) => {
      setIsTyping(false);
      let botMsg = { id: Date.now() + 1, sender: "bot" };

      if (response.action === "redirect_play") {
        const currentUser = getMe() || {};
        if (currentUser?.is_premium !== true) {
          botMsg.type = "text";
          botMsg.content = personalizeText(
            "Phim này là nội dung độc quyền. Bạn cần nâng cấp tài khoản Premium để xem nhé! 👑",
          );
          setMessages((prev) => [...prev, botMsg]);
          return;
        }

        botMsg.type = "text";
        botMsg.content = personalizeText(response.message);
        setMessages((prev) => [...prev, botMsg]);
        setTimeout(() => {
          setIsOpen(false);
          navigate(`/movies/watch/${response.slug}`);
        }, 1500);
        return;
      }

      if (response.action === "redirect_detail") {
        botMsg.type = "text";
        botMsg.content = personalizeText(response.message);
        setMessages((prev) => [...prev, botMsg]);
        setTimeout(() => {
          setIsOpen(false);
          navigate(`/movies/${response.slug}`);
        }, 1500);
        return;
      }

      if (response.action === "redirect_premium") {
        botMsg.type = "text";
        botMsg.content = personalizeText(response.message);
        setMessages((prev) => [...prev, botMsg]);
        setTimeout(() => {
          setIsOpen(false);
          navigate(`/premium`);
        }, 2000);
        return;
      }

      if (response.action === "redirect_support") {
        botMsg.type = "text";
        botMsg.content = personalizeText(response.message);
        setMessages((prev) => [...prev, botMsg]);
        setTimeout(() => {
          setIsOpen(false);
          navigate(`/profile/support`);
        }, 2000);
        return;
      }

      if (response.action === "random_surprise") {
        botMsg.type = "movies";
        botMsg.content = personalizeText(
          response.message ||
            "Tadaa! DevChill đã bốc đại cho bạn siêu phẩm này. Bấm Phát cày luôn cho nóng! 🎉",
        );
        botMsg.payload = response.payload;
        triggerFireworks();
      } else if (response.action === "ask_user") {
        botMsg.type = "text";
        botMsg.content = personalizeText(response.message);
      } else if (response.action === "show_detail") {
        botMsg.type = "movies";
        botMsg.content = "Đây là thông tin chi tiết phim bạn cần:";
        botMsg.payload = response.payload;
      } else if (response.action === "suggest_movies") {
        botMsg.type = "movies";
        botMsg.content = personalizeText(response.message);
        botMsg.payload = response.payload;
        botMsg.watchedMovie = response.watchedMovie;
      } else if (
        Array.isArray(response) ||
        response.action === "user_history"
      ) {
        const dataArr = Array.isArray(response) ? response : response.payload;
        if (!dataArr || dataArr.length === 0) {
          botMsg.type = "text";
          botMsg.content =
            "Mình đã tìm kỹ nhưng không thấy dữ liệu nào khớp. Bạn thử lại xem sao nhé!";
        } else {
          botMsg.type = "movies";
          botMsg.content = "DevChill tìm thấy các kết quả này cho bạn:";
          botMsg.payload = dataArr.slice(0, 10);
        }
      } else {
        botMsg.type = "text";
        botMsg.content =
          personalizeText(response.message) || "Đã xử lý xong yêu cầu của bạn!";
      }

      setMessages((prev) => [...prev, botMsg]);
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [navigate, personalizeText]);
  const handleActionSend = (textToProcess) => {
    if (!textToProcess.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      type: "text",
      content: textToProcess.trim(),
    };

    const currentMessages = [...messages];

    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, options: undefined })),
      userMsg,
    ]);
    setIsTyping(true);

    const chatHistory = currentMessages.slice(-4).map((m) => {
      let text = m.content || "";
      if (m.type === "movies" && m.payload) {
        const movieNames = m.payload.map((p) => p.name || p.title).join(", ");
        text = `[Hệ thống đã trả về danh sách phim: ${movieNames}]`;
      }
      return {
        role: m.sender === "user" ? "user" : "assistant",
        content: text,
      };
    });

    const currentUser = getMe() || {};
    if (socketRef.current) {
      socketRef.current.emit("ask_ai_bot", {
        message: userMsg.content,
        history: chatHistory,
        user: currentUser,
      });
    } else {
      setIsTyping(false);
      toast.error("Mất kết nối đến máy chủ AI, vui lòng tải lại trang!");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = message;
    setMessage("");
    handleActionSend(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      <style>{`
        @keyframes float-bubble {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-bubble {
          animation: float-bubble 3.5s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      <div
        className={`mb-4 w-87.5 sm:w-100 h-137.5 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-50 opacity-0 translate-y-10 pointer-events-none absolute"
        }`}
      >
        <ChatHeader handleClearChat={handleClearChat} setIsOpen={setIsOpen} />

        <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              userName={userName}
              isTyping={isTyping}
              handleActionSend={handleActionSend}
              navigate={customNavigate}
            />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </div>
      <div className={!isOpen ? "animate-float-bubble" : ""}>
        <FloatingButton isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
}
