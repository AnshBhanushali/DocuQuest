// frontend/app/chat/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Layout, Typography, Input, Button, List, Spin, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  HistoryOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Sider, Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface MessageItem {
  sender: "user" | "assistant";
  text: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  // Scroll‐to‐bottom whenever messages change
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = listContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const sendQuestion = async () => {
    const question = inputText.trim();
    if (!question) return;

    // 1) Append user's question immediately
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInputText("");
    setLoading(true);

    try {
      // 2) Hit your backend /query endpoint
      const resp = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, top_k: 3 }),
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        throw new Error(errJson.detail || "Query failed");
      }

      const data = await resp.json();
      // 3) Append the assistant’s answer
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: data.answer },
      ]);

      // 4) Append citations if any
      if (Array.isArray(data.citations) && data.citations.length > 0) {
        const citationTexts = data.citations.map(
          (c: { source: string; chunk_index: string }) =>
            `(source: ${c.source} – chunk #${c.chunk_index})`
        );
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", text: citationTexts.join("\n") },
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
    <Layout style={{ minHeight: "100vh" }}>
      {/* ===== Sidebar ===== */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={200}
        style={{
          background: "#1e1e2a",
          borderRight: "1px solid #2a2a3a",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: collapsed ? 0 : "0 16px",
            background: "#0f0f1a",
          }}
        >
          {!collapsed && (
            <Title
              level={4}
              style={{
                color: "#e0e0e0",
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              DocuQuest
            </Title>
          )}
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{ color: "#e0e0e0" }}
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["home"]}
          style={{ marginTop: 16, background: "#1e1e2a" }}
          items={[
            {
              key: "home",
              icon: <HomeOutlined style={{ fontSize: 18, color: "#e0e0e0" }} />,
              label: (
                <Link href="/" style={{ color: "#e0e0e0" }}>
                  Home
                </Link>
              ),
            },
            {
              key: "history",
              icon: (
                <HistoryOutlined style={{ fontSize: 18, color: "#e0e0e0" }} />
              ),
              label: collapsed ? null : (
                <span style={{ color: "#e0e0e0" }}>Chat History</span>
              ),
            },
          ]}
        />
      </Sider>

      {/* ===== Main Layout ===== */}
      <Layout style={{ background: "#0f0f1a" }}>
        {/* ===== Header ===== */}
        <Header
          style={{
            background: "#1e1e2a",
            borderBottom: "1px solid #2a2a3a",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          <Title
            level={3}
            style={{
              color: "#e0e0e0",
              margin: 0,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Chat with Your Document
          </Title>
        </Header>

        {/* ===== Content (Messages List) ===== */}
        <Content
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 128px)", // account for header + footer
          }}
        >
          {/* Messages Container */}
          <div
            ref={listContainerRef}
            style={{
              flexGrow: 1,
              overflowY: "auto",
              paddingRight: 8,
              marginBottom: 16,
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

          {/* “Thinking…” Spinner */}
          {loading && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Spin tip="Thinking…" />
            </div>
          )}

          {/* ===== Input Area ===== */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginTop: "auto",
            }}
          >
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

        {/* ===== Footer ===== */}
        <Footer
          style={{
            textAlign: "center",
            background: "#1e1e2a",
            color: "#a0a0b0",
            borderTop: "1px solid #2a2a3a",
            padding: "12px 0",
          }}
        >
          <Text style={{ fontFamily: "'Poppins', sans-serif" }}>
            © {new Date().getFullYear()} DocuQuest. All rights reserved.
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
}
