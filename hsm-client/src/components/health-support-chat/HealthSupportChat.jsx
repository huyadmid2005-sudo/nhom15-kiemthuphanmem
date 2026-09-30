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
} from "react-icons/fa";
import { askHealthChatbot } from "../../services/healthChatbotService";

const HealthSupportChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Xin chào! Tôi là trợ lý sức khỏe AI của bạn. Hãy hỏi tôi về tình trạng sức khỏe, chỉ số sinh hiệu hoặc bất kỳ câu hỏi sức khỏe nào!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const data = await askHealthChatbot(inputMessage);
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

  // Function to format message content with simple markdown parsing
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
          .replace(/→/g, '<span class="mx-2 text-blue-500">→</span>')
          // Bullet points: • -> styled bullets
          .replace(
            /^•\s*(.+)/g,
            '<div class="flex items-start ml-4 mb-1"><span class="text-blue-500 mr-2 mt-1 text-sm">•</span><span>$1</span></div>'
          )
          // Headers starting with common keywords
          .replace(
            /^(Hướng dẫn:|Lưu ý:|Khuyến nghị:|Note:)\s*(.+)/g,
            (match, keyword, rest) => {
              if (keyword.includes("Lưu ý") || keyword.includes("Note")) {
                return `<div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 my-2 rounded-r">
                        <div class="flex items-center">
                          <span class="text-yellow-600 mr-2">⚠️</span>
                          <span class="font-semibold text-yellow-800">${keyword}</span>
                        </div>
                        <div class="mt-1 text-yellow-700">${rest}</div>
                      </div>`;
              } else {
                return `<div class="bg-blue-50 border-l-4 border-blue-400 p-3 my-2 rounded-r">
                        <div class="flex items-center">
                          <span class="text-blue-600 mr-2">ℹ️</span>
                          <span class="font-semibold text-blue-800">${keyword}</span>
                        </div>
                        <div class="mt-1 text-blue-700">${rest}</div>
                      </div>`;
              }
            }
          );

        return formattedLine;
      });

      return formattedLines.join('<br class="my-2" />');
    } catch (error) {
      console.error("Error formatting message:", error);
      return content; // Return original if error
    }
  };

  const renderStructuredData = (structured) => {
    if (!structured) return null;

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
          <FaChartLine className="mr-2" />
          Thông tin chi tiết:
        </h4>

        {/* Conclusion */}
        {structured.conclusion && (
          <div className="mb-3">
            <p className="font-medium text-gray-800">{structured.conclusion}</p>
          </div>
        )}

        {/* Numbers/Vital Signs */}
        {structured.numbers && structured.numbers.length > 0 && (
          <div className="mb-3">
            <h5 className="font-medium text-gray-700 mb-2">
              Chỉ số sinh hiệu:
            </h5>
            <div className="space-y-1">
              {structured.numbers.map((number, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="font-medium">{number.name}:</span>
                  <span className="ml-2">
                    {number.value} {number.unit}
                  </span>
                  {number.date && (
                    <span className="ml-2 text-gray-500">({number.date})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions/Recommendations */}
        {structured.actions && structured.actions.length > 0 && (
          <div className="mb-3">
            <h5 className="font-medium text-green-700 mb-2 flex items-center">
              <FaLightbulb className="mr-1" />
              Khuyến nghị:
            </h5>
            <ul className="space-y-1">
              {structured.actions.map((action, index) => (
                <li key={index} className="text-sm text-green-800 flex">
                  <span className="mr-2">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cautions */}
        {structured.cautions && structured.cautions.length > 0 && (
          <div className="mb-3">
            <h5 className="font-medium text-red-700 mb-2 flex items-center">
              <FaExclamationTriangle className="mr-1" />
              Cảnh báo:
            </h5>
            <ul className="space-y-1">
              {structured.cautions.map((caution, index) => (
                <li key={index} className="text-sm text-red-800 flex">
                  <span className="mr-2">⚠️</span>
                  <span>{caution}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-190px)] min-h-[480px] max-h-[720px] w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center p-4 bg-sky-600 text-white">
        <FaRobot className="text-2xl mr-3" />
        <div>
          <h3 className="font-bold text-lg">Trợ lý Sức khỏe AI</h3>
          <p className="text-sm opacity-90">Hỗ trợ tư vấn sức khỏe 24/7</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3 sm:max-w-[80%] ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  {message.type === "user" ? (
                    <FaUser className="text-sm" />
                  ) : (
                    <FaRobot className="text-sm text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  {message.type === "bot" ? (
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(message.content),
                      }}
                    />
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}

                  {/* Render structured data for bot messages */}
                  {message.type === "bot" &&
                    message.structured &&
                    renderStructuredData(message.structured)}

                  {/* Confidence score */}
                  {message.type === "bot" && message.confidence && (
                    <div className="mt-2 text-xs opacity-70">
                      Độ tin cậy: {Math.round(message.confidence * 100)}%
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.type === "bot" && (
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="text-xs opacity-70 hover:opacity-100 flex items-center"
                      >
                        <FaCopy className="mr-1" />
                        Sao chép
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
            <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
              <FaSpinner className="animate-spin text-blue-500" />
              <span className="text-sm text-gray-600">Đang phân tích...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-3 sm:p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Hỏi về tình trạng sức khỏe của bạn..."
            className="min-w-0 flex-1 resize-none rounded-2xl border border-slate-300 p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl bg-sky-600 px-4 py-2 text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaPaperPlane />
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Tình trạng của tôi như thế nào",
            "Chiều cao của tôi",
            "Huyết áp của tôi thế nào?",
            "BMI của tôi",
            "Lời khuyên về chế độ ăn",
            "Cách cải thiện giấc ngủ",
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(suggestion)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthSupportChat;
