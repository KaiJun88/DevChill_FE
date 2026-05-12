/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState, useRef } from "react";
import { Send, Users, SmilePlus, Smile } from "lucide-react";

const EMOJI_LIST = ["❤️", "😂", "😮", "😢", "🔥", "✨"];

export default function ChatRoom({ currentUser, roomData, socket, roomId }) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [viewerCount, setViewerCount] = useState(1);
  const [showReactFor, setShowReactFor] = useState(null);
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.on("chat_history", (historyMsgs) => {
      if (!Array.isArray(historyMsgs)) return;
      const parsedHistory = historyMsgs.map((msg) =>
        typeof msg === "string" ? JSON.parse(msg) : msg,
      );
      setMessages([
        {
          id: "sys_1",
          username: "Hệ thống",
          text: "Chào mừng đến với phòng chiếu!",
          isSystem: true,
        },
        ...parsedHistory,
      ]);
    });

    socket.on("receive_message", (newMsg) => {
      const parsedMsg =
        typeof newMsg === "string" ? JSON.parse(newMsg) : newMsg;
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === parsedMsg.id)) return prev;
        const updated = [...prev, parsedMsg];
        return updated.length > 100
          ? updated.slice(updated.length - 100)
          : updated;
      });
    });

    socket.on("receive_reaction", (emojiIcon) =>
      triggerEmojiAnimation(emojiIcon),
    );

    socket.on("update_message_reaction", ({ messageId, emoji }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            const currentReactions = msg.reactions || {};
            return {
              ...msg,
              reactions: {
                ...currentReactions,
                [emoji]: (currentReactions[emoji] || 0) + 1,
              },
            };
          }
          return msg;
        }),
      );
    });

    socket.on("viewer_count", (count) => setViewerCount(count));

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
      socket.off("receive_reaction");
      socket.off("update_message_reaction");
      socket.off("viewer_count");
    };
  }, [socket, roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentUser || !socket) return;

    const messageData = {
      roomId,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        avatar_url: currentUser.avatar_url,
      },
      text: chatInput,
    };

    socket.emit("send_message", messageData);
    setChatInput("");
  };

  const handleDropEmoji = (emojiIcon) => {
    if (!socket || !roomId || !currentUser) return;
    triggerEmojiAnimation(emojiIcon);
    socket.emit("send_reaction", { roomId, emoji: emojiIcon });
  };

  const handleReactToMessage = (messageId, emojiIcon) => {
    if (!socket || !roomId || !currentUser) return;
    socket.emit("react_to_message", { roomId, messageId, emoji: emojiIcon });
    setShowReactFor(null);
  };

  const triggerEmojiAnimation = (emojiIcon) => {
    const emojiId = Date.now() + Math.random();
    const randomLeft = Math.floor(Math.random() * 80) + 10;
    setFloatingEmojis((prev) => [
      ...prev,
      { id: emojiId, icon: emojiIcon, left: randomLeft },
    ]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== emojiId));
    }, 2500);
  };

  return (
    <div
      className="w-full lg:w-100 xl:w-112.5 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col shrink-0 h-[50vh] lg:h-[calc(100vh-120px)] overflow-hidden relative font-sans"
      onClick={() => {
        if (showReactFor) setShowReactFor(null);
      }}
    >
      <div className="h-17 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white z-30 relative">
        <div>
          <h3 className="text-slate-900 font-bold text-[17px]">Live Chat</h3>
          <p className="text-[12px] text-slate-400 font-medium mt-0.5">
            Thảo luận văn minh nhé
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100">
          <Users size={14} className="stroke-[2.5px]" />
          <span className="font-bold text-[13px]">{viewerCount}</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[#FAFAFB]">
        <div
          ref={chatContainerRef}
          className="absolute inset-0 overflow-y-auto p-5 space-y-6 custom-scrollbar scroll-smooth pb-10 z-10"
        >
          {messages.map((msg, index) => {
            if (msg.isSystem) {
              return (
                <div
                  key={msg.id || index}
                  className="flex justify-center relative my-4"
                >
                  <span className="text-[11px] font-medium bg-slate-200/60 text-slate-500 px-4 py-1.5 rounded-full backdrop-blur-sm">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const currentUserId = currentUser?.id;
            const isMe =
              msg.socketId === socket?.id ||
              (currentUserId && msg.userId === currentUserId);

            return (
              <div
                key={msg.id}
                className="flex w-full justify-start relative group"
              >
                <div className="flex items-start gap-2 max-w-[85%] relative">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-200 flex items-center justify-center border border-slate-200 mt-0.5">
                    {msg.avatar_url ? (
                      <img
                        src={msg.avatar_url}
                        alt={msg.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <span
                      className="text-[13px] font-bold text-slate-500"
                      style={{ display: msg.avatar_url ? "none" : "flex" }}
                    >
                      {msg.username
                        ? msg.username.charAt(0).toUpperCase()
                        : "?"}
                    </span>
                  </div>
                  <div className="flex flex-col items-start relative">
                    <span className="text-[11px] font-medium mb-1 px-1">
                      {isMe ? (
                        <span className="text-rose-500 font-bold">Bạn</span>
                      ) : (
                        <span className="text-slate-400">{msg.username}</span>
                      )}
                    </span>

                    <div
                      className={`text-[14px] px-4 py-2.5 shadow-sm leading-relaxed rounded-[20px] rounded-tl-lg relative ${
                        isMe
                          ? "bg-rose-500 text-white"
                          : "bg-slate-100 text-slate-800 border border-slate-200"
                      }`}
                    >
                      {msg.text}

                      {msg.reactions &&
                        Object.keys(msg.reactions).length > 0 && (
                          <div className="absolute -bottom-3.5 left-2 flex gap-1 bg-white p-0.5 rounded-full shadow-sm border border-slate-100 z-30">
                            {Object.entries(msg.reactions).map(([e, count]) => (
                              <div
                                key={e}
                                className="flex items-center gap-1 bg-slate-50 text-slate-700 text-[11px] px-1.5 py-0.5 rounded-full"
                              >
                                <span>{e}</span>
                                <span className="font-bold text-slate-600">
                                  {count}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                  {currentUser && (
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 left-[calc(100%+8px)] transition-opacity duration-200 ${
                        showReactFor === msg.id
                          ? "opacity-100 z-50"
                          : "opacity-0 group-hover:opacity-100 z-20"
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReactFor(
                            showReactFor === msg.id ? null : msg.id,
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-md border border-slate-100 transition-transform hover:scale-110 active:scale-95"
                      >
                        <Smile size={15} />
                      </button>

                      {showReactFor === msg.id && (
                        <div
                          className="absolute -top-12.5 -left-2.5 bg-white px-2.5 py-2 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-slate-100 flex gap-1.5 z-100 animate-fade-in whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {EMOJI_LIST.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() =>
                                handleReactToMessage(msg.id, emoji)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:scale-125 hover:-translate-y-1 transition-all text-xl"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 pointer-events-none z-100 overflow-hidden">
          {floatingEmojis.map((item) => (
            <div
              key={item.id}
              className="absolute bottom-0 text-[36px] emoji-float filter drop-shadow-lg"
              style={{ left: `${item.left}%` }}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 shrink-0 z-40 pb-4 pt-2 relative">
        <div className="flex items-center justify-between px-5 py-2 mb-1">
          <div className="flex items-center gap-1">
            <SmilePlus size={16} className="text-slate-400 mr-2" />
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleDropEmoji(emoji)}
                disabled={!currentUser}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 hover:scale-125 rounded-full transition-all text-xl disabled:opacity-30 disabled:hover:scale-100 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSendMessage}
          className="px-5 relative flex items-center"
        >
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={!currentUser}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-14 py-3.5 outline-none text-[14px] font-medium placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all disabled:opacity-60"
            placeholder={
              currentUser ? "Nhập bình luận..." : "Đăng nhập để tham gia chat"
            }
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || !currentUser}
            className="absolute right-7 p-2.5 bg-slate-900 text-white rounded-xl disabled:bg-slate-200 disabled:text-slate-400 hover:bg-black hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </form>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* FIX CHÍNH 3: Chỉnh CSS Animation cho nó bay cao vút lên mượt mà */
        @keyframes floatUp {
          0% { transform: translateY(20px) scale(0.5); opacity: 0; }
          15% { transform: translateY(-20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-600px) scale(1); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .emoji-float { animation: floatUp 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `,
        }}
      />
    </div>
  );
}
