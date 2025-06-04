// app/layout.tsx
import React, { ReactNode } from "react";
// app/layout.tsx
import ClientAppLayout from "./ClientAppLayout"


// This file must remain a Server Component: do NOT add "use client" here.
// We will import a separate Client Component (ClientAppLayout) below.

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0d0e13", color: "#ffffff" }}>
        {/* 
          Instead of embedding hooks/useState in this file, 
          we render our ClientAppLayout here (which is a Client Component).
        */}
        <ClientAppLayout>{children}</ClientAppLayout>
      </body>
    </html>
  );
}
