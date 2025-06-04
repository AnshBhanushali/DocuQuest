// app/upload/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Button, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth, AuthProvider } from "../context/AuthContext";
import type { UploadFile, RcFile } from "antd/lib/upload/interface";

const { Title, Text } = Typography;

function UploadForm() {
  const router = useRouter();
  const { role, isAuthenticated, signOut } = useAuth();

  // Track the list of selected files:
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Decide max uploads by role:
  //  guest  → max 1 
  //  user   → max 5 
  //  admin  → unlimited (treat as a very large number)
  const maxUploadsForRole = role === "admin" ? 9999 : role === "user" ? 5 : 1;

  // Prevent uploading more than allowed
  const beforeUpload = (file: RcFile) => {
    if (fileList.length >= maxUploadsForRole) {
      message.error(
        `As a ${role.toUpperCase()}, you can upload up to ${maxUploadsForRole} ${
          maxUploadsForRole > 1 ? "files" : "file"
        }.`
      );
      return Upload.LIST_IGNORE; // block this file
    }
    return true;
  };

  const onUploadChange = (info: { fileList: UploadFile[] }) => {
    // Only keep up to maxUploadsForRole files
    const newList = info.fileList.slice(0, maxUploadsForRole);
    setFileList(newList);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        color: "#e0e0e0",
        padding: "40px",
      }}
    >
      <Title level={2} style={{ color: "#e0e0e0" }}>
        Document Upload
      </Title>

      <Text style={{ color: "#c0c0c0" }}>
        You are signed in as <strong>{role.toUpperCase()}</strong>.
      </Text>
      <br />
      <br />

      <Upload
        accept=".pdf,.docx,.txt"
        multiple={role === "admin" ? true : maxUploadsForRole > 1}
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={onUploadChange}
        action={undefined} // we’re not actually posting to a server right now
      >
        <Button
          icon={<UploadOutlined />}
          style={{
            background: "#00ffff",
            borderColor: "#00ffff",
            color: "#000",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Select File{role !== "admin" && ` (max ${maxUploadsForRole})`}
        </Button>
      </Upload>

      {fileList.length > 0 && (
        <ul style={{ marginTop: 16, color: "#c0c0c0" }}>
          {fileList.map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      )}

      <br />
      <Button
        type="default"
        onClick={() => {
          signOut();
          router.push("/login");
        }}
        style={{
          background: "#2a2a2a",
          color: "#e0e0e0",
          border: "1px solid #444",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}

export default function UploadPageWrapper() {
  return (
    <AuthProvider>
      <UploadForm />
    </AuthProvider>
  );
}
