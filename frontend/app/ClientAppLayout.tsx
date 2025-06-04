// frontend/app/ClientAppLayout.tsx
"use client";

import React, { ReactNode, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Dropdown,
  Button,
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

/**
 * -- Metaverse‐Inspired Theme Palettes --
 *
 * Dark: Deep cosmic purple/blue background with neon cyan/purple accents
 * Light: Soft lavender/white background with violet accents
 */
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

// Stub conversation lists & model options (you can modify or remove these)
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
  const [selectedModel, setSelectedModel] = useState(modelOptions[0]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const currentColors = themes[theme];

  // Handler for switching between stub model options
  const handleModelChange = (e: { key: React.Key }) => {
    const m = modelOptions.find((opt) => opt.key === e.key);
    if (m) setSelectedModel(m);
  };

  // Toggle dark/light theme
  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  // Dropdown menu items for “Model Selector”:
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

  // A small reusable “benefit” card (you can remove or repurpose)
  function BenefitCard({
    icon,
    title,
    desc,
    colors,
  }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    colors: typeof themes.dark;
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
        <div style={{ fontSize: 28, color: colors.accent, marginBottom: 12 }}>
          {icon}
        </div>
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

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: currentColors.bg,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ===== Sidebar ===== */}
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
          <AppstoreOutlined
            style={{ fontSize: 28, color: currentColors.accent }}
          />
          {!collapsed && (
            <div>
              <Text
                strong
                style={{ color: currentColors.text, fontSize: 16 }}
              >
                DocuRAG
              </Text>
              <br />
              <Text
                style={{ color: currentColors.textSecondary, fontSize: 12 }}
              >
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
              label: (
                <Text style={{ color: currentColors.textSecondary }}>
                  Today
                </Text>
              ),
            },
            ...todayConvos,
            {
              key: "prev",
              type: "group",
              label: (
                <Text style={{ color: currentColors.textSecondary }}>
                  Previous 30 Days
                </Text>
              ),
            },
            ...olderConvos,
          ]}
        />

        <div
          style={{
            position: "absolute",
            bottom: 16,
            width: "100%",
            paddingInline: 16,
          }}
        >
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

      {/* ===== Main Panel ===== */}
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
            style={{ fontSize: 16, color: currentColors.text }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Model selector dropdown */}
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
                <span style={{ fontSize: 12 }}>
                  {selectedModel.label.replace("OpenAI:", "").trim()}
                </span>
                <DownOutlined style={{ color: currentColors.textSecondary }} />
              </Button>
            </Dropdown>

            {/* Theme toggle */}
            <Switch
              checkedChildren={<SunOutlined />}
              unCheckedChildren={<MoonOutlined />}
              onChange={toggleTheme}
              checked={theme === "light"}
              style={{
                background: theme === "light" ? currentColors.primary : "",
              }}
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
          {/* Always render children.  In /chat/page.tsx, your Chat UI appears here. */}
          {children}
        </Content>

        <Footer style={{ background: "transparent", padding: "12px 24px", textAlign: "center" }}>
          <Text style={{ color: currentColors.textSecondary }}>
            © {new Date().getFullYear()} DocuRAG. All rights reserved.
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
}
