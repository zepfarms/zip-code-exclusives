
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ZipWaitlistSectionProps {
  zipCode: string;
}

const ZipWaitlistSection = ({ zipCode }: ZipWaitlistSectionProps) => {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  
  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!waitlistEmail || !/\S+@\S+\.\S+/.test(waitlistEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmittingWaitlist(true);
    
    try {
      // Add to waitlist table in Supabase
      const { error } = await supabase
        .from('waitlist')
        .insert({
          email: waitlistEmail,
          zip_code: zipCode
        });
        
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("You've been added to the waitlist!");
      setWaitlistEmail('');
    } catch (error: any) {
      console.error("Error joining waitlist:", error);
      toast.error("Failed to join waitlist: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };
  
  return (
    <div className="mt-6">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
        <h3 className="font-bold text-amber-800">
          This area is already taken
        </h3>
        <p className="mt-2 text-amber-700">
          Would you like to join the waitlist for this zip code?
        </p>
      </div>
      
      <form onSubmit={handleJoinWaitlist} className="mt-4 space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="waitlistEmail" className="text-sm font-medium text-gray-700">
            Your Email
          </label>
          <Input
            id="waitlistEmail"
            type="email"
            placeholder="you@example.com"
            value={waitlistEmail}
            onChange={(e) => setWaitlistEmail(e.target.value)}
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          variant="outline"
          className="w-full border-teal-700 text-teal-700 hover:bg-teal-50"
          disabled={isSubmittingWaitlist}
        >
          {isSubmittingWaitlist ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Join Waitlist'
          )}
        </Button>
      </form>
    </div>
  );
};

export default ZipWaitlistSection;
