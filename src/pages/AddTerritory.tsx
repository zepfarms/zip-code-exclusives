
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ZipCodeForm from '@/components/zip-checker/ZipCodeForm';
import ZipAvailableSection from '@/components/zip-checker/ZipAvailableSection';
import ZipWaitlistSection from '@/components/zip-checker/ZipWaitlistSection';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from 'lucide-react';
import AddTerritoryCard from '@/components/dashboard/AddTerritoryCard';

const AddTerritory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to add a territory");
        navigate('/login');
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, [navigate]);

  const handleTerritoryAdded = () => {
    // This function will be called after successful territory addition
    toast.success("Territory added successfully!");
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-brand-600" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Add New Territory</h1>
          
          {isAuthenticated && (
            <AddTerritoryCard onTerritoryAdded={handleTerritoryAdded} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddTerritory;
