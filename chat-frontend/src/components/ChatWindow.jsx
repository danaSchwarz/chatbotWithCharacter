import { useState, useEffect, useRef } from "react";

function ChatWindow({ details, onClose }) {
    const [personality, setPersonality] = useState(() => {
        const saved = localStorage.getItem("personality");
        return saved ? JSON.parse(saved) : details || null;
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem("chatHistory");
        return saved ? JSON.parse(saved) : [];
    });

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (details) {
            setPersonality(details);
        }

        if (personality) {
            localStorage.setItem("personality", JSON.stringify(personality));
        }

        if (history.length === 0) {
            loadGreeting();
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("chatHistory", JSON.stringify(history));
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [history]);



    const loadGreeting = () => {
        setLoading(true);
        fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ history: [], personality }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) alert("Error: " + data.error);
                else setHistory([{ role: "assistant", content: data.response }]);
            })
            .catch((err) => alert("Request failed: " + err.message))
            .finally(() => setLoading(false));
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newHistory = [...history, { role: "user", content: input }];
        setHistory(newHistory);
        setLoading(true);
        setInput("");

        try {
            const res = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history: newHistory, personality }),
            });

            const data = await res.json();

            if (data.error) {
                alert("Error: " + data.error);
            } else {
                setHistory((prev) => [...prev, { role: "assistant", content: data.response }]);
            }
        } catch (error) {
            alert("Request failed: " + error.message);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        localStorage.removeItem("chatHistory");
        setHistory([]);
        setInput("");
        loadGreeting();
    };

    const spinnerStyle = {
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #007bff",
        borderRadius: "50%",
        width: "18px",
        height: "18px",
        animation: "spin 1s linear infinite",
        marginLeft: "10px",
    };

    const handleChatClose = () => {
        localStorage.removeItem("chatHistory");
        setHistory([]);
        setInput("");
        localStorage.removeItem("personality");
        setPersonality(null);
        setLoading(false);
        onClose();
    }

    return (
        <>
            <div
                style={{
                    maxWidth: 600,
                    margin: "10px auto",
                    fontFamily: "Arial, sans-serif",
                    position: "relative",
                    height: "90vh",
                }}
            >
                <h3>{details.name}</h3>
                <p>{details.title}</p>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        height: "50%",
                        overflowY: "auto",
                        marginBottom: 10,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 8,
                    }}
                >
                    {history.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                marginBottom: 12,
                                textAlign: msg.role === "user" ? "right" : "left",
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "8px 12px",
                                    borderRadius: 16,
                                    backgroundColor: msg.role === "user" ? "#007bff" : "#e5e5ea",
                                    color: msg.role === "user" ? "white" : "black",
                                    maxWidth: "80%",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <textarea
                    rows={3}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    style={{ width: "100%", padding: 10, fontSize: 16 }}
                    disabled={loading}
                />

                <div className="row" style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>

                    <button
                        onClick={() => handleChatClose()}
                        className="btn btn-secondary col-3"
                    >
                        Exit Chat
                    </button>
                    <button
                        onClick={clearChat}
                        disabled={loading}
                        className="btn btn-danger col-3"
                    >
                        Clear Chat
                    </button>

                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="btn btn-primary col-3 d-flex align-items-center justify-content-center gap-1"
                    >
                        {loading ? (
                            <>
                                <span>Sending...</span>
                                <div style={spinnerStyle}></div>
                            </>
                        ) : (
                            "Send"
                        )}
                    </button>



                </div>

                <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
            </div>
        </>
    );
}

export default ChatWindow;
