import React from 'react';
import { AppShell } from '@/widgets/app-shell';
import { RepositoryProvider } from '@/entities/repository';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RepositoryProvider>
      <AppShell>{children}</AppShell>
    </RepositoryProvider>
  );
}
