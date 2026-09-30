import { useState, useRef, useEffect } from "react";
import { FaComments, FaPaperPlane, FaRobot, FaUser, FaTimes, FaMinus, FaSpinner } from "react-icons/fa";
import { askHealthChatbot } from "../../services/healthChatbotService";

const LandingAIChat = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);
	const [messages, setMessages] = useState([
		{ id: 1, type: "bot", content: "Xin chào! Tôi là trợ lý HMS. Tôi có thể giới thiệu về web và hướng dẫn bạn.", timestamp: new Date() },
	]);
	const [inputMessage, setInputMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const endRef = useRef(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isOpen]);

	const toggle = () => {
		setIsOpen((v) => !v);
		if (!isOpen) setIsMinimized(false);
	};

	const send = async () => {
		if (!inputMessage.trim()) return;
		const user = { id: Date.now(), type: "user", content: inputMessage, timestamp: new Date() };
		setMessages((m) => [...m, user]);
		const q = inputMessage;
		setInputMessage("");
		setLoading(true);
		try {
			const data = await askHealthChatbot(q, { includeAuth: false });
			if (data && data.text) {
				setMessages((m) => [...m, { id: Date.now() + 1, type: "bot", content: data.text, timestamp: new Date() }]);
			} else {
				setMessages((m) => [...m, { id: Date.now() + 1, type: "bot", content: "Xin lỗi, không nhận được phản hồi. Vui lòng thử lại sau.", timestamp: new Date() }]);
			}
		} catch (e) {
			console.error("Landing AI chat error", e);
			setMessages((m) => [...m, { id: Date.now() + 1, type: "bot", content: "Lỗi kết nối. Vui lòng thử lại sau.", timestamp: new Date() }]);
		} finally {
			setLoading(false);
		}
	};

	const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{isOpen && (
				<div className={`bg-white rounded-lg shadow-lg border border-gray-200 mb-4 ${isMinimized ? 'w-72 h-14' : 'w-80 h-96'}`}>
					<div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
						<div className="flex items-center gap-2">
							<FaRobot />
							<div>
								<div className="text-sm font-semibold">Trợ lý HMS</div>
								<div className="text-xs opacity-90">{loading ? 'Đang xử lý...' : 'Sẵn sàng'}</div>
							</div>
						</div>
						<div className="flex items-center gap-1">
							<button onClick={() => setIsMinimized((v) => !v)} className="p-1"><FaMinus /></button>
							<button onClick={toggle} className="p-1"><FaTimes /></button>
						</div>
					</div>

					{!isMinimized && (
						<div className="flex flex-col h-full">
							<div className="flex-1 overflow-auto p-3 bg-gray-50">
								<div className="space-y-2">
									{messages.map((m) => (
										<div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
											<div className={`${m.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border'} rounded-lg p-2 max-w-[80%] text-xs`}>
												<div className="flex items-start gap-2">
													<div className="flex-shrink-0">{m.type === 'user' ? <FaUser /> : <FaRobot />}</div>
													<div>{m.content}</div>
												</div>
												<div className="text-[10px] opacity-60 mt-1">{new Date(m.timestamp).toLocaleTimeString()}</div>
											</div>
										</div>
									))}
									<div ref={endRef} />
								</div>
							</div>

							<div className="p-3 border-t bg-white rounded-b-lg">
								<div className="flex gap-2">
									<input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={onKey} className="flex-1 p-2 border rounded text-sm" placeholder="Hỏi về dịch vụ hoặc cách sử dụng..." />
									<button onClick={send} disabled={loading || !inputMessage.trim()} className="px-3 bg-blue-600 text-white rounded">
										{loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}

			<button onClick={toggle} className="relative bg-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform">
				<FaComments />
			</button>
		</div>
	);
};

export default LandingAIChat;
