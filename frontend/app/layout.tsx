// app/layout.tsx
import React, { ReactNode } from "react";
import "antd/dist/reset.css"; // Load AntD v5 reset CSS

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Load Poppins font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
        {/* Inline global overrides to remove focus outlines */}
        <style>{`
          *:focus {
            outline: none !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: #0f0f1a;
            color: #e0e0e0;
            font-family: 'Poppins', sans-serif;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
