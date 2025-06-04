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
  Switch,
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
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";

const { Sider, Content, Footer, Header } = Layout;
const { Title, Text } = Typography;

const themes = {
  dark: {
    bg: "#0f0f1a",
    surface: "#1e1e2a",
    primary: "#8a2be2",
    accent: "#00ffff",
    text: "#e0e0e0",
    textSecondary: "#a0a0b0",
    border: "#2a2a3a",
  },
  light: {
    bg: "#f0f0f5",
    surface: "#ffffff",
    primary: "#8a2be2",
    accent: "#00ffff",
    text: "#1b1b1f",
    textSecondary: "#5a5a6a",
    border: "#e0e0eb",
  },
};

const todayConvos = [
  { key: "1", label: "UI/UX Improvement" },
  { key: "2", label: "State Management" },
];
const olderConvos = [{ key: "3", label: "Initial Project Setup" }];
const modelOptions = [
  { key: "gpt4o-mini", label: "OpenAI: GPT-4o-Mini" },
  { key: "gpt4-turbo", label: "OpenAI: GPT-4-Turbo" },
  { key: "gemini-1.5-pro", label: "Google: Gemini 1.5 Pro" },
  { key: "claude-3-sonnet", label: "Anthropic: Claude 3 Sonnet" },
];

export default function ClientAppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hasChatted, setHasChatted] = useState(false);
  const [selectedModel, setSelectedModel] = useState(modelOptions[0]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const currentColors = themes[theme];

  const handleModelChange = (e: { key: React.Key }) => {
    const model = modelOptions.find((m) => m.key === e.key);
    if (model) setSelectedModel(model);
  };

  const handleSend = () => {
    if (!hasChatted) setHasChatted(true);
    // (Actual send logic goes here, but in this layout we just note that sending has started.)
  };

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  const gradientText: React.CSSProperties = {
    background: `linear-gradient(135deg, ${currentColors.primary} 0%, ${currentColors.accent} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    fontFamily: "'Poppins', sans-serif",
  };

  const menuProps = {
    items: modelOptions.map((opt) => ({
      key: opt.key,
      label: (
        <Text style={{ color: currentColors.text, fontFamily: "'Poppins', sans-serif" }}>
          {opt.label}
        </Text>
      ),
    })),
    onClick: handleModelChange,
    style: {
      backgroundColor: currentColors.surface,
      border: `1px solid ${currentColors.border}`,
      boxShadow:
        theme === "dark"
          ? "0 4px 12px rgba(0, 0, 0, 0.5)"
          : "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <Layout style={{ minHeight: "100vh", background: currentColors.bg, fontFamily: "'Poppins', sans-serif" }}>
      {/* Sidebar */}
      <Sider
        width={240}
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{
          background: currentColors.surface,
          borderRight: `1px solid ${currentColors.border}`,
          resize: "horizontal",
          overflow: "auto",
          minWidth: 80,
          maxWidth: 400,
        }}
      >
        <div
          style={{
            padding: "16px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <AppstoreOutlined style={{ fontSize: "28px", color: currentColors.accent }} />
          {!collapsed && (
            <div>
              <Text strong style={{ color: currentColors.text, fontSize: 16 }}>
                DocuRAG
              </Text>
              <br />
              <Text style={{ color: currentColors.textSecondary, fontSize: 12 }}>
                Advanced Edition
              </Text>
            </div>
          )}
        </div>

        <Menu
          theme={theme}
          mode="inline"
          selectable={false}
          style={{ background: "transparent", border: 0 }}
          items={[
            {
              key: "todayHeader",
              type: "group",
              label: <Text style={{ color: currentColors.textSecondary }}>Today</Text>,
            },
            ...todayConvos,
            {
              key: "prev",
              type: "group",
              label: <Text style={{ color: currentColors.textSecondary }}>Previous 30 Days</Text>,
            },
            ...olderConvos,
          ]}
        />

        <div style={{ position: "absolute", bottom: 16, width: "100%", paddingInline: 16 }}>
          <Button
            block
            type="text"
            icon={<GithubOutlined />}
            style={{
              color: currentColors.textSecondary,
              textAlign: "left",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {!collapsed && "GitHub"}
          </Button>
          <Button
            block
            type="text"
            icon={<MessageOutlined />}
            style={{
              color: currentColors.textSecondary,
              textAlign: "left",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {!collapsed && "Feedback"}
          </Button>
        </div>
      </Sider>

      {/* Main Panel */}
      <Layout style={{ background: currentColors.bg }}>
        <Header
          style={{
            background: currentColors.surface,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            borderBottom: `1px solid ${currentColors.border}`,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", color: currentColors.text }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Model Selector */}
            <Dropdown menu={menuProps} placement="bottomRight" arrow trigger={["click"]}>
              <Button
                size="small"
                style={{
                  background: currentColors.surface,
                  border: `1px solid ${currentColors.border}`,
                  color: currentColors.text,
                  fontFamily: "'Poppins', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 12 }}>{selectedModel.label.replace("OpenAI:", "").trim()}</span>
                <DownOutlined style={{ color: currentColors.textSecondary }} />
              </Button>
            </Dropdown>

            {/* Theme Toggle */}
            <Switch
              checkedChildren={<SunOutlined />}
              unCheckedChildren={<MoonOutlined />}
              onChange={toggleTheme}
              checked={theme === "light"}
              style={{ background: theme === "light" ? currentColors.primary : "" }}
            />
          </div>
        </Header>

        <Content
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: currentColors.bg,
          }}
        >
          {!hasChatted && (
            <div style={{ maxWidth: 720, textAlign: "center", marginTop: "10vh" }}>
              <Title
                level={1}
                style={{
                  ...gradientText,
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  marginBottom: 16,
                }}
              >
                How can I help you today?
              </Title>
              <Text
                style={{
                  color: currentColors.textSecondary,
                  fontSize: "18px",
                  maxWidth: "550px",
                  margin: "0 auto 40px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Leverage powerful AI with a clear, responsive interface. Ready to get started?
              </Text>

              <div
                style={{
                  display: "flex",
                  gap: 24,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <BenefitCard
                  colors={currentColors}
                  icon={<LockFilled />}
                  title="Privacy First"
                  desc="Your documents and data remain local"
                />
                <BenefitCard
                  colors={currentColors}
                  icon={<PictureFilled />}
                  title="Multimodal"
                  desc="Upload files, images, or text"
                />
                <BenefitCard
                  colors={currentColors}
                  icon={<DollarCircleFilled />}
                  title="Cost Effective"
                  desc="No exorbitant enterprise costs"
                />
              </div>
            </div>
          )}

          {/* This is where the “children” (your chat UI) will render */}
          {children}

          <div style={{ flexGrow: 1 }} />
        </Content>

        <Footer
          style={{
            background: "transparent",
            padding: "0 24px 24px",
          }}
        >
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: currentColors.surface,
                borderRadius: 12,
                padding: "8px 12px",
                border: `1px solid ${currentColors.border}`,
                boxShadow:
                  theme === "dark"
                    ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                    : "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Upload beforeUpload={() => false} multiple showUploadList={false}>
                <Button icon={<PlusOutlined />} type="text" style={{ color: currentColors.text }} />
              </Upload>
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                placeholder={`Message with ${selectedModel.label.split(":")[1].trim()}`}
                bordered={false}
                style={{
                  flex: 1,
                  color: currentColors.text,
                  background: "transparent",
                  resize: "none",
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                style={{
                  background: currentColors.accent,
                  borderColor: currentColors.accent,
                  color: "#000",
                }}
              />
            </div>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
}

function BenefitCard({
  icon,
  title,
  desc,
  colors,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  colors: any;
}) {
  return (
    <Card
      style={{
        width: 210,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        boxShadow:
          colors.bg === themes.dark.bg
            ? "0 8px 24px rgba(0,0,0,0.3)"
            : "0 8px 24px rgba(0,0,0,0.05)",
      }}
      bodyStyle={{ padding: 24, textAlign: "center" }}
      hoverable
    >
      <div style={{ fontSize: 28, color: colors.accent, marginBottom: 12 }}>{icon}</div>
      <Text
        strong
        style={{
          color: colors.text,
          display: "block",
          marginBottom: 4,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: colors.textSecondary,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {desc}
      </Text>
    </Card>
  );
}
