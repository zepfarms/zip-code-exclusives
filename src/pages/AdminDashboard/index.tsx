
import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import TerritoriesTable from './components/TerritoriesTable';
import UsersTable from './components/UsersTable';
import LeadsTable from './components/LeadsTable';
import AddLeadForm from './components/AddLeadForm';
import AddTerritoryForm from './components/AddTerritoryForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import TestSmsButton from './components/TestSmsButton';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const renderAddButton = () => {
    if (activeTab === 'territories') {
      return (
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Territory'}
        </Button>
      );
    } else if (activeTab === 'leads') {
      return (
        <div className="flex items-center">
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add Lead'}
          </Button>
          <TestSmsButton />
        </div>
      );
    }
    return null;
  };
  
  return (
    <AdminLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          {renderAddButton()}
        </div>
        
        {showAddForm && activeTab === 'territories' && (
          <div className="mb-8">
            <AddTerritoryForm onComplete={() => setShowAddForm(false)} />
          </div>
        )}
        
        {showAddForm && activeTab === 'leads' && (
          <div className="mb-8">
            <AddLeadForm onComplete={() => setShowAddForm(false)} />
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="territories">Territories</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <LeadsTable />
          </TabsContent>
          
          <TabsContent value="territories">
            <TerritoriesTable />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersTable />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
