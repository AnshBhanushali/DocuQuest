// frontend/app/chat/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import ClientAppLayout from "../ClientAppLayout";
import { Layout, Typography, Input, Button, List, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

interface MessageItem {
  sender: "user" | "assistant";
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendQuestion = async () => {
    const question = inputText.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInputText("");
    setLoading(true);

    try {
      const resp = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, top_k: 3 }),
      });
      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        throw new Error(errJson.detail || "Query failed");
      }
      const data = await resp.json();

      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: data.answer },
      ]);

      if (data.citations?.length) {
        const citationLines = data.citations.map(
          (c: { source: string; chunk_index: string }) =>
            `(source: ${c.source} – chunk #${c.chunk_index})`
        );
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", text: citationLines.join("\n") },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "❗️ Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientAppLayout>
      <Content
        style={{
          padding: "16px",
          background: "#0f0f1a",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#1e1e2a",
            padding: "12px 16px",
            borderRadius: 4,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <Title
            level={4}
            style={{ color: "#e0e0e0", margin: 0, fontFamily: "'Poppins', sans-serif" }}
          >
            Chat with Your Document
          </Title>
        </div>

        <div
          ref={listRef}
          style={{
            background: "#0f0f1a",
            overflowY: "auto",
            flexGrow: 1,
            maxHeight: "60vh",
            marginBottom: 16,
            paddingRight: 8,
          }}
        >
          <List
            size="small"
            dataSource={messages}
            renderItem={(item, idx) => (
              <List.Item
                key={idx}
                style={{
                  border: "none",
                  padding: "4px 8px",
                  justifyContent:
                    item.sender === "user" ? "flex-end" : "flex-start",
                  background: "transparent",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    background:
                      item.sender === "user" ? "#00ffff" : "#1e1e2a",
                    color: item.sender === "user" ? "#000" : "#e0e0e0",
                    padding: "8px 12px",
                    borderRadius: 8,
                    whiteSpace: "pre-wrap",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {item.text}
                </div>
              </List.Item>
            )}
          />
        </div>

        {loading && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Spin tip="Thinking…" />
          </div>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Input.TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question…"
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{
              flex: 1,
              resize: "none",
              background: "#1e1e2a",
              color: "#e0e0e0",
              borderRadius: 8,
              border: `1px solid #2a2a3a`,
              fontFamily: "'Poppins', sans-serif",
            }}
            onPressEnter={(e) => {
              e.preventDefault();
              sendQuestion();
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendQuestion}
            disabled={loading}
            style={{
              background: "#00ffff",
              borderColor: "#00ffff",
              color: "#000",
              borderRadius: 8,
            }}
          />
        </div>
      </Content>
    </ClientAppLayout>
  );
}
