'use client';

import { useAuth } from '@/providers/auth-provider';

export default function DashboardPage() {
  const { agency } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {agency?.name}!</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder stats cards */}
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Total Posts</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Scheduled</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Published Today</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Connected Accounts</p>
        </div>
      </div>
    </div>
  );
}
