import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaSpinner,
  FaCopy,
  FaChartLine,
  FaExclamationTriangle,
  FaLightbulb,
  FaTimes,
  FaComments,
  FaMinus,
} from "react-icons/fa";
import { askHealthChatbot } from "../../services/healthChatbotService";

const HealthSupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Xin chào! Tôi là trợ lý sức khỏe AI. Hãy hỏi tôi về tình trạng sức khỏe của bạn!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    "Tình trạng của tôi như thế nào",
    "Chiều cao cân nặng của tôi",
    "Huyết áp của tôi thế nào?",
    "BMI của tôi",
    "Lời khuyên về chế độ ăn",
    "Cách cải thiện giấc ngủ",
    "Đường huyết của tôi",
    "Nhịp tim của tôi",
    "Tôi có nên tập thể dục không?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Show notification for new bot messages when chat is closed
    if (
      !isOpen &&
      messages.length > 1 &&
      messages[messages.length - 1].type === "bot"
    ) {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    // Auto-close quick actions when chat is minimized
    if (isMinimized) {
      setShowQuickActions(false);
    }
  }, [isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");

    handleAIResponse(messageToSend);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép!");
  };

  // Function to format message content with simple markdown parsing (widget version)
  const formatMessageContent = (content) => {
    if (!content) return content;

    try {
      // Split by | for line breaks first
      const lines = content
        .split("|")
        .map((line) => line.trim())
        .filter((line) => line);

      const formattedLines = lines.map((line) => {
        // Process markdown in each line
        let formattedLine = line
          // Bold text: **text** -> <strong>text</strong>
          .replace(
            /\*\*(.*?)\*\*/g,
            '<strong class="font-semibold text-gray-900">$1</strong>'
          )
          // Arrow: → -> styled arrow
          .replace(/→/g, '<span class="mx-1 text-blue-500 text-xs">→</span>')
          // Bullet points: • -> styled bullets (smaller for widget)
          .replace(
            /^•\s*(.+)/g,
            '<div class="flex items-start ml-2 mb-1"><span class="text-blue-500 mr-1 mt-0.5 text-xs">•</span><span class="text-xs">$1</span></div>'
          )
          // Headers starting with common keywords (smaller for widget)
          .replace(
            /^(Hướng dẫn:|Lưu ý:|Khuyến nghị:|Note:)\s*(.+)/g,
            (match, keyword, rest) => {
              if (keyword.includes("Lưu ý") || keyword.includes("Note")) {
                return `<div class="bg-yellow-50 border-l-2 border-yellow-400 p-2 my-1 rounded-r text-xs">
                        <div class="flex items-center">
                          <span class="text-yellow-600 mr-1">⚠️</span>
                          <span class="font-semibold text-yellow-800">${keyword}</span>
                        </div>
                        <div class="mt-1 text-yellow-700">${rest}</div>
                      </div>`;
              } else {
                return `<div class="bg-blue-50 border-l-2 border-blue-400 p-2 my-1 rounded-r text-xs">
                        <div class="flex items-center">
                          <span class="text-blue-600 mr-1">ℹ️</span>
                          <span class="font-semibold text-blue-800">${keyword}</span>
                        </div>
                        <div class="mt-1 text-blue-700">${rest}</div>
                      </div>`;
              }
            }
          );

        return formattedLine;
      });

      return formattedLines.join('<br class="my-1" />');
    } catch (error) {
      console.error("Error formatting message:", error);
      return content; // Return original if error
    }
  };

  const sendQuickMessage = (message) => {
    setInputMessage(message);
    setShowQuickActions(false);
    // Auto send the message
    setTimeout(() => {
      if (message.trim()) {
        const userMessage = {
          id: Date.now(),
          type: "user",
          content: message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");
        handleAIResponse(message);
      }
    }, 100);
  };

  const handleAIResponse = async (question) => {
    setIsLoading(true);
    try {
      const data = await askHealthChatbot(question);
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: data.text,
        structured: data.structured,
        confidence: data.confidence,
        meta: data.meta,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Không thể kết nối với trợ lý AI. Vui lòng thử lại!");

      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  const renderStructuredData = (structured) => {
    if (!structured) return null;

    return (
      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs">
        <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
          <FaChartLine className="mr-1 text-xs" />
          Chi tiết:
        </h5>

        {/* Conclusion */}
        {structured.conclusion && (
          <div className="mb-2">
            <p className="font-medium text-gray-800 text-xs">
              {structured.conclusion}
            </p>
          </div>
        )}

        {/* Numbers/Vital Signs */}
        {structured.numbers && structured.numbers.length > 0 && (
          <div className="mb-2">
            <h6 className="font-medium text-gray-700 mb-1 text-xs">Chỉ số:</h6>
            <div className="space-y-1">
              {structured.numbers.map((number, index) => (
                <div key={index} className="flex items-center text-xs">
                  <span className="font-medium">{number.name}:</span>
                  <span className="ml-1">
                    {number.value} {number.unit}
                  </span>
                  {number.date && (
                    <span className="ml-1 text-gray-500">({number.date})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions/Recommendations */}
        {structured.actions && structured.actions.length > 0 && (
          <div className="mb-2">
            <h6 className="font-medium text-green-700 mb-1 flex items-center text-xs">
              <FaLightbulb className="mr-1 text-xs" />
              Khuyến nghị:
            </h6>
            <ul className="space-y-1">
              {structured.actions.map((action, index) => (
                <li key={index} className="text-xs text-green-800 flex">
                  <span className="mr-1">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cautions */}
        {structured.cautions && structured.cautions.length > 0 && (
          <div>
            <h6 className="font-medium text-red-700 mb-1 flex items-center text-xs">
              <FaExclamationTriangle className="mr-1 text-xs" />
              Cảnh báo:
            </h6>
            <ul className="space-y-1">
              {structured.cautions.map((caution, index) => (
                <li key={index} className="text-xs text-red-800 flex">
                  <span className="mr-1">⚠️</span>
                  <span>{caution}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Check if user is logged in
  const isLoggedIn =
    localStorage.getItem("token") && localStorage.getItem("patientId");

  // Don't show widget if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Chat Widget */}
      {isOpen && (
        <div
          className={`bg-white rounded-lg shadow-2xl border border-gray-200 mb-4 transition-all duration-300 transform ${
            isMinimized ? "w-80 h-16" : "w-80 h-96"
          } animate-in slide-in-from-right-1 slide-in-from-bottom-1`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center">
              <div className="relative">
                <FaRobot className="text-lg mr-2" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h4 className="font-bold text-sm">Trợ lý AI</h4>
                <p className="text-xs opacity-90">
                  {isLoading ? "Đang phân tích..." : "Sẵn sàng hỗ trợ"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={isMinimized ? maximizeChat : minimizeChat}
                className="text-white hover:bg-blue-700 p-1 rounded"
              >
                <FaMinus className="text-xs" />
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-blue-700 p-1 rounded"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          </div>

          {/* Messages - only show when not minimized */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-3 h-64 bg-gray-50">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-2 text-xs ${
                          message.type === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0 mt-1">
                            {message.type === "user" ? (
                              <FaUser className="text-xs" />
                            ) : (
                              <FaRobot className="text-xs text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            {message.type === "bot" ? (
                              <div
                                className="text-xs leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: formatMessageContent(message.content),
                                }}
                              />
                            ) : (
                              <p className="text-xs leading-relaxed">
                                {message.content}
                              </p>
                            )}

                            {/* Render structured data for bot messages */}
                            {message.type === "bot" &&
                              message.structured &&
                              renderStructuredData(message.structured)}

                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {message.type === "bot" && (
                                <button
                                  onClick={() =>
                                    copyToClipboard(message.content)
                                  }
                                  className="text-xs opacity-70 hover:opacity-100 flex items-center ml-2"
                                >
                                  <FaCopy className="text-xs" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg p-2 flex items-center space-x-2">
                        <FaSpinner className="animate-spin text-blue-500 text-xs" />
                        <span className="text-xs text-gray-600">
                          Đang phân tích...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Hỏi về sức khỏe..."
                    className="flex-1 p-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane className="text-xs" />
                  </button>
                </div>

                {/* Quick suggestions */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <button
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors flex items-center"
                    disabled={isLoading}
                  >
                    <FaLightbulb className="mr-1 text-xs" />
                    Gợi ý
                  </button>
                  {showQuickActions &&
                    quickActions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => sendQuickMessage(suggestion)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                        disabled={isLoading}
                      >
                        {suggestion}
                      </button>
                    ))}
                </div>

                {/* Extended quick actions */}
                {showQuickActions && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <h6 className="text-xs font-semibold text-gray-700 mb-2">
                      Câu hỏi thường gặp:
                    </h6>
                    <div className="grid grid-cols-1 gap-1">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => sendQuickMessage(action)}
                          className="text-left px-2 py-1 text-xs bg-white text-gray-700 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors border border-gray-100"
                          disabled={isLoading}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <div className="relative group">
        <button
          onClick={toggleChat}
          className={`relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
            isOpen ? "scale-95" : "scale-100 hover:scale-110"
          }`}
        >
          <FaComments className="text-xl" />

          {/* New message indicator */}
          {hasNewMessage && !isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          )}

          {/* Loading indicator on button */}
          {isLoading && isOpen && (
            <div className="absolute inset-0 rounded-full bg-blue-400 flex items-center justify-center">
              <FaSpinner className="animate-spin text-white" />
            </div>
          )}

          {/* Pulse animation when closed */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
          )}
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {isOpen ? "Đóng chat" : "Trợ lý sức khỏe AI"}
          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    </div>
  );
};

export default HealthSupportChatWidget;
