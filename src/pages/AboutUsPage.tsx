
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Target, 
  Users, 
  Shield, 
  Heart,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AboutUsPage = () => {
  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Territory Protection",
      description: "Every territory belongs to one client only. No competition for your leads."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Quality Leads",
      description: "We deliver motivated sellers who are ready to work with you."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Dedicated Support",
      description: "Our team is here to help you succeed every step of the way."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Your Success",
      description: "We measure our success by your results and growth."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About Us - Real Estate Lead Generation Experts | LeadXclusive</title>
        <meta name="description" content="Learn about LeadXclusive's mission to help real estate professionals succeed with exclusive territory protection and quality lead generation." />
      </Helmet>

      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About LeadXclusive
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We help real estate professionals succeed by providing exclusive leads 
                with territory protection, so you never compete for the same opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">
                    Built on Real Estate Experience
                  </h2>
                  <div className="space-y-6 text-lg text-gray-700">
                    <p>
                      LeadXclusive was founded with a simple mission: provide real estate 
                      professionals with exclusive, high-quality leads they need to succeed.
                    </p>
                    <p>
                      We understand the challenges you face in today's competitive market. 
                      That's why we developed a system that ensures exclusive territory 
                      rights and delivers motivated sellers ready to work with you.
                    </p>
                    <p>
                      Our approach is straightforward - we focus on quality over quantity 
                      and ensure every lead you receive has real potential.
                    </p>
                  </div>
                </div>

                <Card className="bg-white shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                        <span className="text-gray-700">Proven track record with real estate professionals</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                        <span className="text-gray-700">Exclusive territory protection for every client</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                        <span className="text-gray-700">Focus on lead quality and conversion potential</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                        <span className="text-gray-700">Ongoing support to help you maximize results</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  What We Stand For
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Our core principles guide everything we do.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="text-brand-600 mb-4 flex justify-center">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-brand-700 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-brand-100 mb-8 leading-relaxed">
                To empower real estate professionals with exclusive leads and territory 
                protection, giving them the competitive edge they need to build successful, 
                sustainable businesses.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join real estate professionals who trust us to deliver exclusive leads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/check-availability">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold">
                    Check Territory Availability
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-3 rounded-lg font-semibold">
                    Learn How It Works
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
