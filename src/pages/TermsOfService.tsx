
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Terms of Service | LeadXclusive</title>
        <meta name="description" content="Terms of Service for LeadXclusive - Exclusive real estate leads with no competition." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Terms of Service</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-6">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">1. Company Information</h2>
              <p className="text-gray-600">
                LeadXclusive is a service provided by AutoPilotRE LLC, a company registered in Oklahoma, USA.
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> PO BOX 97, Cromwell, OK 74837<br />
                <strong>Phone:</strong> 405-481-3651<br />
                <strong>Email:</strong> help@leadxclusive.com
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">2. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing or using the LeadXclusive service ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">3. Service Description</h2>
              <p className="text-gray-600">
                LeadXclusive provides exclusive real estate lead generation services, offering one agent or investor per zip code territory. The Service includes lead generation, notification of leads, and a dashboard for managing leads.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">4. Subscription and Billing</h2>
              <p className="text-gray-600">
                The Service is offered on a subscription basis. By subscribing to our Service, you agree to pay the subscription fee for your selected territory. Subscription fees are charged at the beginning of each billing cycle.
              </p>
              <p className="text-gray-600">
                You may cancel your subscription at any time, but we do not provide refunds for the current billing period. Your subscription will continue until the end of the current billing period.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">5. Refund Policy</h2>
              <p className="text-gray-600">
                We do not offer refunds for subscription payments. However, if you are unhappy with the Service, we may offer a free month of service at our discretion. Please contact our support team at help@leadxclusive.com to discuss your concerns.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">6. Territory Exclusivity</h2>
              <p className="text-gray-600">
                We provide exclusive territory rights for the zip code you subscribe to. This means that we will not sell leads within that zip code to any other customer while your subscription is active. If you cancel your subscription, the territory will become available to other customers.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">7. Lead Quality and Quantity</h2>
              <p className="text-gray-600">
                While we strive to provide high-quality leads, we do not guarantee any specific number of leads or conversion rates. The number and quality of leads may vary based on market conditions, seasonality, and other factors outside our control.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">8. User Responsibilities</h2>
              <p className="text-gray-600">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to follow all applicable laws and regulations when using the Service and when contacting leads provided through our platform.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">9. Limitations of Liability</h2>
              <p className="text-gray-600">
                To the maximum extent permitted by law, LeadXclusive and AutoPilotRE LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">10. Termination</h2>
              <p className="text-gray-600">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms of Service. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">11. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">12. Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at:<br />
                Email: help@leadxclusive.com<br />
                Phone: 405-481-3651
              </p>
            </section>
            
            <div className="pt-4 text-sm text-gray-500">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
