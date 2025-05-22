
import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
