// app/layout.tsx
// This minimal layout is required by Next.js for the root path, even for API routes.
// It simply passes its children through without adding any HTML structure.
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
