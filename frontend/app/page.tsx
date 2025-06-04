// app/page.tsx
"use client"; // we need this so that AntD’s Button, Layout, etc. work properly

import React from "react";
import { Layout, Typography, Button, Row, Col, Card } from "antd";
import {
  UploadOutlined,
  FilePdfOutlined,
  SyncOutlined,
  LockOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function HomePage() {
  return (
    <Layout style={{ minHeight: "100vh", background: "#0f0f1a" }}>
      {/* ===== Header ===== */}
      <Header
        style={{
          background: "#1e1e2a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          borderBottom: "1px solid #2a2a3a",
        }}
      >
        <Title level={3} style={{ color: "#e0e0e0", margin: 0, fontFamily: "'Poppins', sans-serif" }}>
          DocuRAG
        </Title>
        <div style={{ display: "flex", gap: 16 }}>
          <Button type="text" style={{ color: "#e0e0e0", fontFamily: "'Poppins', sans-serif" }}>
            Home
          </Button>
          <Button type="text" style={{ color: "#e0e0e0", fontFamily: "'Poppins', sans-serif" }}>
            Features
          </Button>
          <Button type="text" style={{ color: "#e0e0e0", fontFamily: "'Poppins', sans-serif" }}>
            Pricing
          </Button>
          <Button
            type="primary"
            style={{
              background: "#00ffff",
              borderColor: "#00ffff",
              color: "#000",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Sign Up
          </Button>
        </div>
      </Header>

      {/* ===== Hero Section ===== */}
      <Content style={{ background: "#0f0f1a" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            textAlign: "center",
            padding: "100px 16px 60px 16px",
          }}
        >
          <Title
            level={1}
            style={{
              background: "linear-gradient(135deg, #8a2be2 0%, #00ffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Chat with Your PDFs
          </Title>
          <Paragraph
            style={{
              color: "#a0a0b0",
              fontSize: 18,
              maxWidth: 700,
              margin: "16px auto",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Unlock the power of your documents with AI-driven conversations. Get
            instant answers and insights from your PDFs.
          </Paragraph>
          <Button
            size="large"
            type="primary"
            icon={<UploadOutlined />}
            style={{
              background: "#00ffff",
              borderColor: "#00ffff",
              color: "#000",
              fontSize: 16,
              padding: "12px 32px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Upload PDF
          </Button>
        </div>

        {/* ===== Key Features Section ===== */}
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto 80px auto",
            padding: "0 16px",
          }}
        >
          <Title
            level={2}
            style={{ color: "#e0e0e0", textAlign: "center", marginBottom: 32, fontFamily: "'Poppins', sans-serif" }}
          >
            Key Features
          </Title>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={6}>
              <Card
                style={{
                  background: "#1e1e2a",
                  border: "1px solid #2a2a3a",
                  borderRadius: 8,
                }}
                bodyStyle={{ textAlign: "center", padding: 24 }}
                hoverable
              >
                <MessageOutlined
                  style={{ fontSize: 32, color: "#00ffff", marginBottom: 12 }}
                />
                <Title
                  level={4}
                  style={{ color: "#e0e0e0", fontFamily: "'Poppins', sans-serif" }}
                >
                  Interactive Chat
                </Title>
                <Text style={{ color: "#a0a0b0", fontFamily: "'Poppins', sans-serif" }}>
                  Engage in natural conversations with your PDFs, asking
                  questions and receiving instant responses.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                style={{
                  background: "#1e1e2a",
                  border: "1px solid #2a2a3a",
                  borderRadius: 8,
                }}
                bodyStyle={{ textAlign: "center", padding: 24 }}
                hoverable
              >
                <FilePdfOutlined
                  style={{ fontSize: 32, color: "#00ffff", marginBottom: 12 }}
                />
                <Title
                  level={4}
                  style={{ color: "#e0e0e0", fontFamily: "'Poppins', sans-serif" }}
                >
                  Multiple PDFs
                </Title>
                <Text style={{ color: "#a0a0b0", fontFamily: "'Poppins', sans-serif" }}>
                  Upload and analyze multiple PDFs simultaneously,
                  cross-referencing information effortlessly.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                style={{
                  background: "#1e1e2a",
                  border: "1px solid #2a2a3a",
                  borderRadius: 8,
                }}
                bodyStyle={{ textAlign: "center", padding: 24 }}
                hoverable
              >
                <SyncOutlined
                  style={{ fontSize: 32, color: "#00ffff", marginBottom: 12 }}
                />
                <Title
                  level={4}
                  style={{ color: "#e0e0e0", fontFamily: "'Poppins', sans-serif" }}
                >
                  Fast Processing
                </Title>
                <Text style={{ color: "#a0a0b0", fontFamily: "'Poppins', sans-serif" }}>
                  Experience lightning-fast document processing and response
                  times powered by advanced AI.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                style={{
                  background: "#1e1e2a",
                  border: "1px solid #2a2a3a",
                  borderRadius: 8,
                }}
                bodyStyle={{ textAlign: "center", padding: 24 }}
                hoverable
              >
                <LockOutlined
                  style={{ fontSize: 32, color: "#00ffff", marginBottom: 12 }}
                />
                <Title
                  level={4}
                  style={{ color: "#e0e0e0", fontFamily: "'Poppins', sans-serif" }}
                >
                  Secure & Private
                </Title>
                <Text style={{ color: "#a0a0b0", fontFamily: "'Poppins', sans-serif" }}>
                  Your documents are encrypted and processed securely, ensuring
                  your data remains private.
                </Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* ===== CTA Footer Section ===== */}
        <div
          style={{
            background: "#1a1b22",
            padding: "60px 16px",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          <Title level={2} style={{ color: "#e0e0e0", marginBottom: 16, fontFamily: "'Poppins', sans-serif" }}>
            Ready to Chat with Your PDFs?
          </Title>
          <Paragraph
            style={{
              color: "#a0a0b0",
              fontSize: 16,
              maxWidth: 600,
              margin: "0 auto 24px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Join thousands of professionals and students who are already
            benefiting from AI-powered document interactions.
          </Paragraph>
          <Button
            size="large"
            type="primary"
            icon={<UploadOutlined />}
            style={{
              background: "#00ffff",
              borderColor: "#00ffff",
              color: "#000",
              fontSize: 16,
              padding: "12px 32px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Start Now
          </Button>
        </div>
      </Content>

      {/* ===== Footer ===== */}
      <Footer
        style={{
          textAlign: "center",
          background: "#0f0f1a",
          borderTop: "1px solid #2a2a3a",
          padding: "16px 0",
        }}
      >
        <Text style={{ color: "#a0a0b0", fontFamily: "'Poppins', sans-serif" }}>
          © {new Date().getFullYear()} DocuRAG. All rights reserved.
        </Text>
      </Footer>
    </Layout>
  );
}
