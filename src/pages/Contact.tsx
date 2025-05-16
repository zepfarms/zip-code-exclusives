
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-gray-600">
                Have questions about our exclusive leads? Reach out to our team and we'll get back to you shortly.
              </p>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
              <ContactForm />
            </div>
            
            <div className="mt-12 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Other Ways to Reach Us
              </h2>
              <div className="flex flex-col md:flex-row justify-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-700">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-600">help@leadxclusive.com</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-700">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Support Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9AM - 5PM EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
