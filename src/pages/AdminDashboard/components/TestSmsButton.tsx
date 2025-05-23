
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TestSmsButton = () => {
  const [isSending, setIsSending] = useState(false);
  
  const handleSendTestSms = async () => {
    try {
      setIsSending(true);
      
      // Call the test-sms edge function
      const { data, error } = await supabase.functions.invoke('test-sms');
      
      if (error) {
        console.error("Error calling test-sms function:", error);
        toast.error("Failed to send test SMS: " + error.message);
        return;
      }
      
      console.log("Test SMS result:", data);
      
      if (data.success) {
        toast.success("Test SMS sent successfully!");
      } else {
        toast.error("Failed to send test SMS: " + (data.details?.error || "Unknown error"));
      }
      
    } catch (error: any) {
      console.error("Error sending test SMS:", error);
      toast.error("Error sending test SMS: " + error.message);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Button 
      onClick={handleSendTestSms}
      disabled={isSending}
      variant="outline"
      className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 ml-2"
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      {isSending ? "Sending..." : "Send Test SMS"}
    </Button>
  );
};

export default TestSmsButton;
