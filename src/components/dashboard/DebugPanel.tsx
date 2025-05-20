
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const DebugPanel = ({ userId, territories, leads, refreshData }: { 
  userId: string | null,
  territories: any[],
  leads: any[],
  refreshData: (force: boolean) => Promise<void>
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiResponses, setApiResponses] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const testUserProfile = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      setApiResponses(prev => ({
        ...prev,
        userProfile: { data, error }
      }));
    } catch (error) {
      setApiResponses(prev => ({
        ...prev,
        userProfile: { error }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testTerritories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('territories')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true);
      
      setApiResponses(prev => ({
        ...prev,
        territories: { data, error }
      }));
    } catch (error) {
      setApiResponses(prev => ({
        ...prev,
        territories: { error }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .eq('archived', false);
      
      setApiResponses(prev => ({
        ...prev,
        leads: { data, error }
      }));
    } catch (error) {
      setApiResponses(prev => ({
        ...prev,
        leads: { error }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testAll = async () => {
    await testUserProfile();
    await testTerritories();
    await testLeads();
  };

  return (
    <Card className="mb-6 bg-gray-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex justify-between items-center">
          <span>Debug Panel (Developer Tool)</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 text-xs">
          <div className="mb-4">
            <h3 className="font-bold mb-1">Application State:</h3>
            <ul className="pl-4 space-y-1">
              <li><strong>User ID:</strong> {userId || 'Not logged in'}</li>
              <li><strong>Territories Count:</strong> {territories?.length || 0}</li>
              <li><strong>Leads Count:</strong> {leads?.length || 0}</li>
              <li>
                <strong>Local Storage:</strong>
                <ul className="pl-4">
                  <li>lastZipCode: {localStorage.getItem('lastZipCode') || 'Not set'}</li>
                  <li>lastLeadType: {localStorage.getItem('lastLeadType') || 'Not set'}</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-1">API Test Actions:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={testUserProfile} disabled={isLoading}>
                Test Profile API
              </Button>
              <Button size="sm" variant="outline" onClick={testTerritories} disabled={isLoading}>
                Test Territories API
              </Button>
              <Button size="sm" variant="outline" onClick={testLeads} disabled={isLoading}>
                Test Leads API
              </Button>
              <Button size="sm" variant="outline" onClick={testAll} disabled={isLoading}>
                Test All APIs
              </Button>
              <Button size="sm" variant="outline" onClick={() => refreshData(true)} disabled={isLoading}>
                Force Refresh Data
              </Button>
            </div>
          </div>

          {Object.keys(apiResponses).length > 0 && (
            <div>
              <h3 className="font-bold mb-1">API Responses:</h3>
              <div className="bg-gray-100 p-2 rounded max-h-48 overflow-auto">
                <pre>{JSON.stringify(apiResponses, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default DebugPanel;
