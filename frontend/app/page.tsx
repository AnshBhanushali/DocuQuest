// app/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layout,
  Typography,
  Button,
  Row,
  Col,
  Card,
  Upload,
  notification,
  Spin,
} from "antd";
import {
  UploadOutlined,
  FilePdfOutlined,
  SyncOutlined,
  SafetyCertificateOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  UserAddOutlined,
  TeamOutlined,
  RocketOutlined,
  DownOutlined,
} from "@ant-design/icons";




// After successful upload/processing:



const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

// — Single dark‐mode palette —
const colors = {
  bg: "#0a0d14",        // Very dark navy
  surface: "#121724",   // Slightly lighter panel color
  accent: "#3b82f6",    // Bright blue accent
  textPrimary: "#e2e2e2",
  textSecondary: "#8a8d94",
  border: "#1f2530",
};

export default function HomePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Called when a file is selected
  const beforeUploadHandler = async (file: File) => {
    setIsProcessing(true);

    // Build FormData
    const formData = new FormData();
    formData.append("file", file);

    try {
      const resp = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        throw new Error(errJson.detail || "Upload failed");
      }

      notification.success({
        message: "Document processed",
        description: "Redirecting to chat…",
        placement: "bottomRight",
      });

      // Give a brief moment for notification to show
      setTimeout(() => {
        router.push("/chat");
      }, 500);
    } catch (err: any) {
      console.error(err);
      notification.error({
        message: "Upload Error",
        description: err.message || "Something went wrong during upload.",
        placement: "bottomRight",
      });
      setIsProcessing(false);
    }

    // Prevent automatic Upload behavior:
    return false;
  };

  // Smooth‐scroll to “How It Works” section
  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout style={{ minHeight: "100vh", background: colors.bg }}>
      {/* ===== Header ===== */}
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: colors.surface,
          padding: "0 32px",
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <HomeOutlined style={{ fontSize: 26, color: colors.accent }} />
          <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
            DocuQuest
          </Title>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/" style={{ color: colors.textPrimary, fontSize: 16 }}>
            <HomeOutlined /> Home
          </Link>
          <Link
            href="#how-it-works"
            style={{ color: colors.textPrimary, fontSize: 16 }}
          >
            <InfoCircleOutlined /> How It Works
          </Link>
          <Link
            href="#benefits"
            style={{ color: colors.textPrimary, fontSize: 16 }}
          >
            <TeamOutlined /> Benefits
          </Link>
          <Link
            href="#start"
            style={{ color: colors.textPrimary, fontSize: 16 }}
          >
            <RocketOutlined /> Get Started
          </Link>
        </nav>
      </Header>

      {/* ===== Hero Section (Full Screen) ===== */}
      <Content style={{ background: colors.bg }}>
        <div
          style={{
            position: "relative",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "0 16px",
            color: colors.textPrimary,
            overflow: "hidden",
          }}
        >
          {/* Background decorative PDF icon */}
          <FilePdfOutlined
            style={{
              position: "absolute",
              top: "1%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "20rem",
              color: colors.accent,
              opacity: 0.05,
              pointerEvents: "none",
            }}
          />

          {/* Main Hero Text */}
          <Title
            level={1}
            style={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, #59e0ff 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              marginBottom: 16,
              zIndex: 1,
            }}
          >
            Conversational Document Explorer
          </Title>
          <Paragraph
            style={{
              color: colors.textSecondary,
              fontSize: 18,
              maxWidth: 700,
              margin: "0 auto 32px",
              zIndex: 1,
            }}
          >
            Instantly query PDFs, DOCXs, or TXTs. Find answers, summaries, and
            insights—no manual search needed.
          </Paragraph>

          {/* Three “pillars” underneath */}
          <div style={{ display: "flex", gap: 24, marginBottom: 32, zIndex: 1 }}>
            <Text
              style={{
                color: colors.accent,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Secure
            </Text>
            <Text
              style={{
                color: colors.accent,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Instant
            </Text>
            <Text
              style={{
                color: colors.accent,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Intelligent
            </Text>
          </div>

          {/* Upload Button (triggers beforeUploadHandler) */}
          <Upload
            accept=".pdf,.docx,.txt"
            multiple={false}
            showUploadList={false}
            beforeUpload={beforeUploadHandler}
          >
            <Button
              size="large"
              type="primary"
              icon={<UploadOutlined />}
              style={{
                background: colors.accent,
                borderColor: colors.accent,
                color: "#000",
                fontSize: 16,
                padding: "12px 40px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                zIndex: 1,
              }}
            >
              Browse Document
            </Button>
          </Upload>

          {/* Down arrow to scroll */}
          <DownOutlined
            onClick={scrollToHowItWorks}
            style={{
              position: "absolute",
              bottom: 32,
              fontSize: "2rem",
              color: colors.textSecondary,
              cursor: "pointer",
              zIndex: 1,
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as any).style.transform = "translateY(5px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as any).style.transform = "translateY(0px)";
            }}
          />

          {/* Full‐screen spinner overlay */}
          {isProcessing && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <Spin
                tip="Processing your document…"
                size="large"
                style={{ color: "#fff" }}
              />
            </div>
          )}
        </div>

        {/* ===== How It Works Section ===== */}
        <div
          id="how-it-works"
          style={{
            background: colors.surface,
            padding: "60px 16px",
            textAlign: "center",
          }}
        >
          <Title
            level={2}
            style={{ color: colors.textPrimary, marginBottom: 24 }}
          >
            How It Works
          </Title>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  textAlign: "center",
                  padding: "24px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  transition: "transform 0.2s ease",
                }}
                hoverable
                onMouseEnter={(e) => {
                  (e.currentTarget as any).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as any).style.transform = "translateY(0)";
                }}
              >
                <FilePdfOutlined
                  style={{
                    fontSize: 48,
                    color: colors.accent,
                    marginBottom: 16,
                  }}
                />
                <Title level={4} style={{ color: colors.textPrimary }}>
                  Step 1: Upload Your File
                </Title>
                <Text style={{ color: colors.textSecondary }}>
                  Choose a PDF, DOCX, or TXT. We securely index it in seconds.
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  textAlign: "center",
                  padding: "24px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  transition: "transform 0.2s ease",
                }}
                hoverable
                onMouseEnter={(e) => {
                  (e.currentTarget as any).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as any).style.transform = "translateY(0)";
                }}
              >
                <SyncOutlined
                  style={{
                    fontSize: 48,
                    color: colors.accent,
                    marginBottom: 16,
                  }}
                />
                <Title level={4} style={{ color: colors.textPrimary }}>
                  Step 2: AI‐Powered Analysis
                </Title>
                <Text style={{ color: colors.textSecondary }}>
                  Our AI indexes your document so you can query instantly.
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  textAlign: "center",
                  padding: "24px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  transition: "transform 0.2s ease",
                }}
                hoverable
                onMouseEnter={(e) => {
                  (e.currentTarget as any).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as any).style.transform = "translateY(0)";
                }}
              >
                <SafetyCertificateOutlined
                  style={{
                    fontSize: 48,
                    color: colors.accent,
                    marginBottom: 16,
                  }}
                />
                <Title level={4} style={{ color: colors.textPrimary }}>
                  Step 3: Ask & Discover
                </Title>
                <Text style={{ color: colors.textSecondary }}>
                  Chat with your document. Receive answers and insights instantly.
                </Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* ===== Benefits Section ===== */}
        <div
          id="benefits"
          style={{
            background: colors.bg,
            padding: "60px 16px",
            textAlign: "center",
          }}
        >
          <Title
            level={2}
            style={{ color: colors.textPrimary, marginBottom: 24 }}
          >
            Why DocuQuest?
          </Title>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  textAlign: "center",
                  padding: "24px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
                hoverable
              >
                <Title level={4} style={{ color: colors.accent }}>
                  Always Current
                </Title>
                <Text style={{ color: colors.textSecondary }}>
                  Models are continuously updated so answers remain accurate.
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  textAlign: "center",
                  padding: "24px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
                hoverable
              >
                <Title level={4} style={{ color: colors.accent }}>
                  Enterprise‐Grade Privacy
                </Title>
                <Text style={{ color: colors.textSecondary }}>
                  Documents remain encrypted and private—always.
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  textAlign: "center",
                  padding: "24px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
                hoverable
              >
                <Title level={4} style={{ color: colors.accent }}>
                  Format Agnostic
                </Title>
                <Text style={{ color: colors.textSecondary }}>
                  Supports PDF, DOCX, TXT, and more—one tool for all your files.
                </Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* ===== Call‐to‐Action Section ===== */}
        <div
          id="start"
          style={{
            background: colors.surface,
            padding: "80px 16px",
            textAlign: "center",
          }}
        >
          <Title
            level={2}
            style={{ color: colors.textPrimary, marginBottom: 24 }}
          >
            Ready to Transform Your Documents?
          </Title>
          <Paragraph
            style={{
              color: colors.textSecondary,
              fontSize: 16,
              maxWidth: 600,
              margin: "0 auto 32px",
            }}
          >
            Join professionals and academics who have streamlined workflows by
            turning static files into dynamic, conversational experiences.
          </Paragraph>
          <Upload
            accept=".pdf,.docx,.txt"
            showUploadList={false}
            beforeUpload={beforeUploadHandler}
          >
            <Button
              size="large"
              type="primary"
              icon={<UploadOutlined />}
              style={{
                background: colors.accent,
                borderColor: colors.accent,
                color: "#000",
                fontSize: 16,
                padding: "12px 40px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              Upload &amp; Explore
            </Button>
          </Upload>
        </div>
      </Content>

      {/* ===== Footer ===== */}
      <Footer
        style={{
          textAlign: "center",
          background: colors.bg,
          borderTop: `1px solid ${colors.border}`,
          padding: "24px 0",
          color: colors.textSecondary,
        }}
      >
        © {new Date().getFullYear()} DocuQuest. All rights reserved.
      </Footer>
    </Layout>
  );
}
