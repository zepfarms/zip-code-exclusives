
import React from 'react';
import Header from '@/components/Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
