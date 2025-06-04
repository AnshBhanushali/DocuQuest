// app/page.tsx
"use client";

import React from "react";
import {
  Layout,
  Typography,
  Button,
  Card,
  Row,
  Col,
  Steps,
  Upload,
  message,
} from "antd";
import {
  UploadOutlined,
  FilePdfOutlined,
  HourglassOutlined,
  MessageOutlined,
  SafetyOutlined,
  RocketOutlined,
  TranslationOutlined,
  LockOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

// --- Metaverse‐Inspired Theme Colors ---
const DARK_BG = "#0f0f1a";
const SURFACE = "#1e1e2a";
const ACCENT = "#00ffff";
const PRIMARY = "#8a2be2";
const TEXT = "#e0e0e0";
const TEXT_SECONDARY = "#a0a0b0";
const BORDER = "#2a2a3a";

export default function HomePage() {
  // Fake “upload” handler – in your real app, replace this with actual backend API call
  const handleUpload = (file: File) => {
    message.loading({ content: "Uploading and processing...", key: "upload" });
    // Simulate 2s upload + chunking/processing
    setTimeout(() => {
      message.success({ content: "Document processed! Redirecting to chat…", key: "upload", duration: 2 });
      // TODO: redirect to /chat or open chat modal, etc.
      // e.g. router.push("/chat");
    }, 2000);

    // Prevent Upload from auto‐uploading (we handle it manually)
    return false;
  };

  return (
    <Layout style={{ minHeight: "100vh", background: DARK_BG }}>
      {/* Header */}
      <Header
        style={{
          background: SURFACE,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <Title level={3} style={{ color: TEXT, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
          DocuRAG
        </Title>
        <div style={{ display: "flex", gap: 16 }}>
          <Button type="text" style={{ color: TEXT, fontFamily: "'Poppins', sans-serif" }}>
            Home
          </Button>
          <Button type="text" style={{ color: TEXT, fontFamily: "'Poppins', sans-serif" }}>
            Features
          </Button>
          <Button type="text" style={{ color: TEXT, fontFamily: "'Poppins', sans-serif" }}>
            Pricing
          </Button>
          <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT, fontFamily: "'Poppins', sans-serif" }}>
            Sign Up
          </Button>
        </div>
      </Header>

      {/* Content */}
      <Content style={{ padding: "64px 32px", color: TEXT }}>
        {/* Hero Section */}
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            textAlign: "center",
            padding: "80px 0",
          }}
        >
          <Title
            level={1}
            style={{
              background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontFamily: "'Poppins', sans-serif",
              marginBottom: 16,
            }}
          >
            Unlock Your Documents with AI-Powered RAG
          </Title>
          <Paragraph
            style={{
              color: TEXT_SECONDARY,
              fontSize: 18,
              maxWidth: 700,
              margin: "0 auto 32px",
            }}
          >
            Upload any PDF (or Word, TXT, etc.), and our Retrieval-Augmented Generation pipeline will chunk,
            embed, and index it behind the scenes. Once processed, ask anything about your document—DocuRAG
            returns instant, context-aware answers with citations.
          </Paragraph>
          <Upload
            beforeUpload={handleUpload}
            showUploadList={false}
            accept=".pdf,.doc,.docx,.txt"
            style={{ marginTop: 16 }}
          >
            <Button
              size="large"
              type="primary"
              icon={<UploadOutlined />}
              style={{
                background: ACCENT,
                borderColor: ACCENT,
                color: "#000",
                fontFamily: "'Poppins', sans-serif",
                fontSize: 16,
                padding: "12px 32px",
              }}
            >
              Upload Document
            </Button>
          </Upload>
        </div>

        {/* “How It Works” Section */}
        <div
          style={{
            maxWidth: 900,
            margin: "64px auto",
            textAlign: "center",
          }}
        >
          <Title level={2} style={{ color: TEXT, fontFamily: "'Poppins', sans-serif" }}>
            How It Works
          </Title>
          <Steps
            direction="vertical"
            size="small"
            current={0}
            style={{ maxWidth: 600, margin: "0 auto", color: TEXT }}
          >
            <Step
              title="1. Upload"
              description="Select your PDF or text file. Our backend immediately starts chunking and embedding."
              icon={<FilePdfOutlined style={{ color: ACCENT }} />}
            />
            <Step
              title="2. Process"
              description="Behind the scenes, we split the document into chunks, build embeddings, and store them in ChromaDB."
              icon={<HourglassOutlined style={{ color: ACCENT }} />}
            />
            <Step
              title="3. Chat"
              description="As soon as indexing is complete, you’re automatically taken to a chat interface. Ask anything about your document!"
              icon={<MessageOutlined style={{ color: ACCENT }} />}
            />
          </Steps>
        </div>

        {/* Key Features Grid */}
        <div style={{ maxWidth: 1000, margin: "64px auto" }}>
          <Title level={2} style={{ textAlign: "center", color: TEXT, fontFamily: "'Poppins', sans-serif" }}>
            Key Features
          </Title>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  textAlign: "center",
                  boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                }}
                bodyStyle={{ padding: 24 }}
                hoverable
              >
                <TranslationOutlined style={{ fontSize: 32, color: ACCENT, marginBottom: 12 }} />
                <Title level={4} style={{ color: TEXT, fontFamily: "'Poppins', sans-serif" }}>
                  Multilingual Support
                </Title>
                <Text style={{ color: TEXT_SECONDARY, fontFamily: "'Poppins', sans-serif" }}>
                  Upload documents in any language—our pipeline auto-detects, translates, and indexes for you.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  textAlign: "center",
                  boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                }}
                bodyStyle={{ padding: 24 }}
                hoverable
              >
                <RocketOutlined style={{ fontSize: 32, color: ACCENT, marginBottom: 12 }} />
                <Title level={4} style={{ color: TEXT, fontFamily: "'Poppins', sans-serif" }}>
                  Lightning-Fast
                </Title>
                <Text style={{ color: TEXT_SECONDARY, fontFamily: "'Poppins', sans-serif" }}>
                  Our optimized embedding and retrieval system returns answers in under a second.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  textAlign: "center",
                  boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                }}
                bodyStyle={{ padding: 24 }}
                hoverable
              >
                <SafetyOutlined style={{ fontSize: 32, color: ACCENT, marginBottom: 12 }} />
                <Title level={4} style={{ color: TEXT, fontFamily: "'Poppins', sans-serif" }}>
                  Secure & Private
                </Title>
                <Text style={{ color: TEXT_SECONDARY, fontFamily: "'Poppins', sans-serif" }}>
                  All files are encrypted in transit and at rest. Only you can access your uploaded content.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  textAlign: "center",
                  boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                }}
                bodyStyle={{ padding: 24 }}
                hoverable
              >
                <LockOutlined style={{ fontSize: 32, color: ACCENT, marginBottom: 12 }} />
                <Title level={4} style={{ color: TEXT, fontFamily: "'Poppins', sans-serif" }}>
                  Privacy-First Architecture
                </Title>
                <Text style={{ color: TEXT_SECONDARY, fontFamily: "'Poppins', sans-serif" }}>
                  Your documents never leave our secure enclave. We never store raw text—only embeddings.
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Footer / Call to Action */}
      <Footer style={{ background: SURFACE, padding: "48px 32px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <Title level={3} style={{ color: TEXT, fontFamily: "'Poppins', sans-serif" }}>
            Ready to Start?
          </Title>
          <Text style={{ color: TEXT_SECONDARY, fontSize: 16, maxWidth: 600, display: "block", margin: "0 auto 32px", fontFamily: "'Poppins', sans-serif" }}>
            Join thousands of professionals who trust DocuRAG to unlock hidden insights from their documents. 
            Upload your first file and see how quickly you can get answers—no manual reading required.
          </Text>
          <Button
            size="large"
            type="primary"
            icon={<UploadOutlined />}
            style={{
              background: ACCENT,
              borderColor: ACCENT,
              color: "#000",
              fontFamily: "'Poppins', sans-serif",
              fontSize: 16,
              padding: "12px 32px",
            }}
            onClick={() => {
              // Scroll back up to the upload button, for example:
              document.querySelector("button[icon='UploadOutlined']")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Upload Your Document
          </Button>
        </div>
      </Footer>
    </Layout>
  );
}
