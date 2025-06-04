// app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Divider, Space, message } from "antd";
import { useAuth, AuthProvider } from "../context/AuthContext";

const { Title, Text } = Typography;

function LoginForm() {
  const router = useRouter();
  const { signIn, skip, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  // If already signed in, redirect back to home
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true);
    const success = signIn(values.username, values.password);
    if (success) {
      router.push("/");
    } else {
      message.error("Both fields are required.");
    }
    setLoading(false);
  };

  const handleSkip = () => {
    skip();
    router.push("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          padding: "32px",
          background: "#1e1e2a",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <Title
          level={2}
          style={{
            color: "#e0e0e0",
            textAlign: "center",
            marginBottom: 24,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Sign In
        </Title>
        <Form name="login" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label={<Text style={{ color: "#c0c0c0" }}>Email</Text>}
            name="username"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="admin@example.com or any email"
              style={{
                background: "#0f0f1a",
                color: "#e0e0e0",
                borderRadius: 4,
                border: "1px solid #2a2a3a",
                fontFamily: "'Poppins', sans-serif",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<Text style={{ color: "#c0c0c0" }}>Password</Text>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="your password"
              style={{
                background: "#0f0f1a",
                color: "#e0e0e0",
                borderRadius: 4,
                border: "1px solid #2a2a3a",
                fontFamily: "'Poppins', sans-serif",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                background: "#00ffff",
                borderColor: "#00ffff",
                color: "#000",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ borderColor: "#2a2a3a" }}>OR</Divider>

        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="default"
            onClick={handleSkip}
            block
            style={{
              background: "#2a2a3a",
              color: "#e0e0e0",
              border: "1px solid #444",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Skip Sign In (Continue as Guest)
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default function LoginPageWrapper() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
