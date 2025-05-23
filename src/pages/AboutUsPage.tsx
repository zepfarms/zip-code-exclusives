
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Target, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>About Us - Real Estate Lead Generation Experts | LeadXclusive</title>
        <meta name="description" content="Learn about LeadXclusive's mission to help real estate professionals succeed with exclusive territory protection and quality lead generation." />
      </Helmet>

      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About LeadXclusive
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                We provide exclusive real estate leads with territory protection, 
                so you never compete for the same opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Core Promise Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Promise
                </h2>
                <p className="text-lg text-gray-600">
                  Simple, effective lead generation that actually works.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center border-0 shadow-sm">
                  <CardContent className="p-8">
                    <div className="mb-4 flex justify-center">
                      <Shield className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      Exclusive Territory
                    </h3>
                    <p className="text-gray-600">
                      One territory, one client. No competition for your leads.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-sm">
                  <CardContent className="p-8">
                    <div className="mb-4 flex justify-center">
                      <Target className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      Quality Leads
                    </h3>
                    <p className="text-gray-600">
                      Pre-qualified sellers who are ready to work with you.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-sm">
                  <CardContent className="p-8">
                    <div className="mb-4 flex justify-center">
                      <Users className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      Real Support
                    </h3>
                    <p className="text-gray-600">
                      Our team is here to help you succeed and grow.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Exist Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">
                    Why We Built This
                  </h2>
                  <div className="space-y-6 text-lg text-gray-700">
                    <p>
                      Real estate professionals deserve better than shared leads and 
                      endless competition. We built LeadXclusive to change that.
                    </p>
                    <p>
                      Our system ensures you get exclusive access to qualified sellers 
                      in your chosen territory. No bidding wars, no racing other investors 
                      to the phone.
                    </p>
                    <p>
                      Just quality leads delivered directly to you.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">What You Get</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Exclusive territory rights</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Pre-qualified seller leads</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Instant lead notifications</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">No long-term contracts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Check if your territory is available and start receiving exclusive leads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/check-availability">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto px-8 py-3 rounded-lg font-semibold">
                    Check Availability
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600 w-full sm:w-auto px-8 py-3 rounded-lg font-semibold">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUsPage;
