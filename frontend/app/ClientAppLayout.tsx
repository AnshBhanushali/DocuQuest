// frontend/app/ClientAppLayout.tsx
"use client";

import React, { ReactNode, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Dropdown,
  Button,
  Input,
  Card,
  Upload,
} from "antd";
import {
  SendOutlined,
  LockFilled,
  PictureFilled,
  DollarCircleFilled,
  GithubOutlined,
  MessageOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  DownOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Sider, Content, Footer, Header } = Layout;
const { Title, Text } = Typography;

// --- New "Synthwave" Metaverse Theme ---
const colors = {
  bg: "#0d0221", // Deep space blue/purple
  surface: "#1a093d", // Darker purple for surfaces
  primary: "#f923e9", // Electric pink/magenta
  secondary: "#00f5d4", // Bright cyan/teal
  text: "#f0f0f0", // Off-white for readability
  textSecondary: "#a7a2c3", // Muted lavender for secondary info
  border: "rgba(249, 35, 233, 0.2)", // Translucent pink border
  gradient: "linear-gradient(135deg, #f923e9 0%, #00f5d4 100%)",
};

// Helper for gradient text
const gradientText: React.CSSProperties = {
  background: colors.gradient,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 700,
};

// --- Stub Data for Conversations ---
const todayConvos = [
  { key: "1", label: "Exploring Neon Grids" },
  { key: "2", label: "Synthwave UI Palettes" },
];
const olderConvos = [{ key: "3", label: "AI Model Integration" }];

const modelOptions = [
    { key: "gpt4o-mini", label: "OpenAI: GPT-4o-Mini" },
    { key: "gpt4-turbo", label: "OpenAI: GPT-4-Turbo" },
    { key: "gemini-1.5-pro", label: "Google: Gemini 1.5 Pro" },
    { key: "claude-3-sonnet", label: "Anthropic: Claude 3 Sonnet" },
];

export default function ClientAppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hasChatted, setHasChatted] = useState(false); // Keeps track of chat state
  const [selectedModel, setSelectedModel] = useState(modelOptions[0]);

  const handleModelChange = (e: { key: React.Key }) => {
    const model = modelOptions.find(m => m.key === e.key);
    if (model) {
        setSelectedModel(model);
    }
  };

  const menuProps = {
    items: modelOptions,
    onClick: handleModelChange,
    style: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
    },
    theme: "dark" as const,
  };

  const handleSend = () => {
    if (!hasChatted) {
      setHasChatted(true);
    }
    // (Actual send logic goes here)
  };

  return (
    <Layout style={{ minHeight: "100vh", background: colors.bg }}>
      {/* --- Sidebar --- */}
      <Sider
        width={240}
        collapsible
        collapsed={collapsed}
        trigger={null} // We use a custom trigger in the header
        onCollapse={setCollapsed}
        style={{
          background: colors.surface,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ padding: "16px", height: "64px", display: "flex", alignItems: "center", gap: 12 }}>
          <AppstoreOutlined style={{ fontSize: "28px", color: colors.secondary }} />
          {!collapsed && (
            <div>
              <Text strong style={{ color: colors.text, fontSize: 16 }}>
                DocuRAG
              </Text>
              <br />
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Synthwave Edition
              </Text>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectable={false}
          style={{ background: "transparent", border: 0 }}
          items={[
            {
              key: "todayHeader",
              type: "group",
              label: <Text style={{ color: colors.textSecondary }}>Today</Text>,
            },
            ...todayConvos,
            {
              key: "prev",
              type: "group",
              label: <Text style={{ color: colors.textSecondary }}>Previous 30 Days</Text>,
            },
            ...olderConvos,
          ]}
        />

        <div style={{ position: "absolute", bottom: 16, width: "100%", paddingInline: 16 }}>
          <Button block type="text" icon={<GithubOutlined />} style={{ color: colors.textSecondary, textAlign: "left" }}>
            {!collapsed && "GitHub"}
          </Button>
          <Button block type="text" icon={<MessageOutlined />} style={{ color: colors.textSecondary, textAlign: "left" }}>
            {!collapsed && "Feedback"}
          </Button>
        </div>
      </Sider>

      {/* --- Main Panel --- */}
      <Layout style={{ background: colors.bg }}>
        <Header
          style={{
            background: "transparent",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            height: 64,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", color: colors.text }}
          />
          {/* You can add more header elements here if needed */}
        </Header>

        <Content
          style={{
            padding: "24px",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* --- Empty-state hero (shown until first message) --- */}
          {!hasChatted && (
            <div style={{ maxWidth: 720, textAlign: "center", marginTop: "10vh" }}>
              <Title level={1} style={{ ...gradientText, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                How can I help you today?
              </Title>
              <Text style={{ color: colors.textSecondary, fontSize: "16px", maxWidth: "500px", margin: "0 auto" }}>
                Ready to assist you with documents, RAG queries, and more. Let’s get started!
              </Text>

              <div style={{ display: "flex", gap: 24, marginTop: 48, flexWrap: "wrap", justifyContent: "center" }}>
                <BenefitCard icon={<LockFilled />} title="Privacy First" desc="Your documents and data remain local" />
                <BenefitCard icon={<PictureFilled />} title="Multimodal" desc="Upload files, images, or text effortlessly" />
                <BenefitCard icon={<DollarCircleFilled />} title="Cost Effective" desc="Leverage powerful AI without the high cost" />
              </div>
            </div>
          )}

          {/* Render the chat history here when `hasChatted` is true */}
          {children}

          <div style={{ flexGrow: 1 }} />
        </Content>

        {/* --- Chat Input & Footer --- */}
        <Footer style={{ background: "transparent", padding: "0 24px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", marginBottom: 12 }}>
              <Dropdown menu={menuProps} placement="topLeft">
                <Button style={{ background: "transparent", color: colors.textSecondary, border: `1px solid ${colors.border}` }}>
                  {selectedModel.label} <DownOutlined />
                </Button>
              </Dropdown>
              <Button type="text" size="small" style={{ color: colors.textSecondary }}> Privacy </Button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, background: colors.surface, borderRadius: 12, padding: "8px", border: `1px solid ${colors.border}` }}>
              <Upload beforeUpload={() => false} multiple showUploadList={false}>
                <Button icon={<PlusOutlined />} type="text" style={{ color: colors.text }} />
              </Upload>
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                placeholder={`Message with ${selectedModel.label.split(":")[1].trim()}`}
                bordered={false}
                style={{ flex: 1, color: colors.text, background: "transparent", resize: "none" }}
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleSend} style={{ background: colors.primary, color: "white" }} />
            </div>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
}

/* --- Reusable small card component --- */
function BenefitCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card
      style={{
        width: 200,
        background: `rgba(26, 9, 61, 0.5)`, // Semi-transparent surface
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        backdropFilter: "blur(10px)",
      }}
      bodyStyle={{ padding: 24, textAlign: "center" }}
      hoverable
    >
      <div style={{ fontSize: 28, color: colors.secondary, marginBottom: 12 }}>{icon}</div>
      <Text strong style={{ color: colors.text, display: "block", marginBottom: 4 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 12, color: colors.textSecondary }}>{desc}</Text>
    </Card>
  );
}