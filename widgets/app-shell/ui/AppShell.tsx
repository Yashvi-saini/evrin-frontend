'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Responsive Scientific Sidebar (Desktop Permanent + Mobile Off-Canvas Drawer) */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Operational Viewport */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-[#f8fafc] dark:bg-[#0A0A0A]">
          {children}
        </main>
      </div>
    </div>
  );
}
