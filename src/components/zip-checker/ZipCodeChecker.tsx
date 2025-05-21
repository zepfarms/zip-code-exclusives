import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ZipCodeForm from './ZipCodeForm';
import ZipAvailableSection from './ZipAvailableSection';
import ZipWaitlistSection from './ZipWaitlistSection';

type AvailabilityStatus = boolean | null;

const ZipCodeChecker = () => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [investorAvailable, setInvestorAvailable] = useState<AvailabilityStatus>(null);
  const [realtorAvailable, setRealtorAvailable] = useState<AvailabilityStatus>(null);
  const navigate = useNavigate();

  const checkZipCodeAvailability = async (zip: string) => {
    const clean
