import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
interface ZipCodeFormProps {
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  onSubmit: (zipCode: string) => Promise<void>;
  isChecking: boolean;
}
const ZipCodeForm = ({
  zipCode,
  setZipCode,
  onSubmit,
  isChecking
}: ZipCodeFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!zipCode || zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      toast.error("Please enter a valid 5-digit zip code");
      return;
    }
    onSubmit(zipCode);
  };
  return <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
          Enter Zip Code
        </label>
        <Input id="zipCode" placeholder="e.g. 90210" value={zipCode} onChange={e => setZipCode(e.target.value)} className="w-full" maxLength={5} />
      </div>
      <Button type="submit" disabled={isChecking} className="w-full bg-accent-600 hover:bg-accent-500">
        {isChecking ? <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </> : 'Check Availability'}
      </Button>
    </form>;
};
export default ZipCodeForm;