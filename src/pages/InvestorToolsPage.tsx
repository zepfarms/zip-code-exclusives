
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calculator, FileText, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const InvestorToolsPage = () => {
  const features = [
    {
      icon: Calculator,
      title: "Deal Analysis",
      description: "Comprehensive calculators for rental properties, fix-and-flip deals, and BRRRR strategies"
    },
    {
      icon: FileText,
      title: "Document Templates", 
      description: "Professional contracts, agreements, and forms for all your real estate transactions"
    },
    {
      icon: TrendingUp,
      title: "Market Analytics",
      description: "Track market trends, property values, and investment opportunities in your area"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Organize your contractors, agents, lenders, and other team members in one place"
    },
    {
      icon: DollarSign,
      title: "Financial Tracking",
      description: "Monitor your portfolio performance, cash flow, and return on investment"
    },
    {
      icon: Clock,
      title: "Task Automation",
      description: "Automate repetitive tasks and streamline your investment workflow"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Investor Tools - AutoPilotRE | Free Real Estate Investment Platform</title>
        <meta name="description" content="Discover AutoPilotRE.com - a comprehensive free platform for real estate investors with deal analysis tools, market analytics, and business management features." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-brand-700 to-brand-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Free Tools for <span className="text-accent-500">Real Estate Investors</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-10">
                AutoPilotRE.com provides everything you need to analyze deals, manage your business, and scale your real estate investment portfolio - completely free.
              </p>
              <a 
                href="https://autopilotre.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="px-8 py-6 text-lg bg-accent-600 hover:bg-accent-700 group">
                  Visit AutoPilotRE.com
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* What is AutoPilotRE Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  What is AutoPilotRE?
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  AutoPilotRE.com is a comprehensive, free platform designed specifically for real estate investors. 
                  Whether you're just starting out or managing a large portfolio, AutoPilotRE provides the tools 
                  and resources you need to make informed investment decisions and streamline your business operations.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8 mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why We Created AutoPilotRE</h3>
                <p className="text-gray-700 leading-relaxed">
                  As the team behind LeadXclusive, we understand the challenges real estate investors face. 
                  While LeadXclusive focuses on providing you with exclusive seller leads, we recognized that 
                  investors also need powerful tools to analyze those opportunities and manage their growing businesses. 
                  That's why we created AutoPilotRE - to give you everything you need to succeed, at no cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Every Investor
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From deal analysis to portfolio management, AutoPilotRE has everything you need to run your investment business efficiently.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-accent-100 rounded-lg mr-3">
                      <feature.icon className="h-6 w-6 text-accent-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Complements LeadXclusive */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Perfect Complement to LeadXclusive
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                LeadXclusive provides you with exclusive seller leads in your territory, and AutoPilotRE gives you 
                the tools to analyze those opportunities and manage your business. Together, they create a complete 
                solution for real estate investors looking to scale their operations.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-brand-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-brand-700 mb-3">LeadXclusive</h3>
                  <p className="text-gray-700">Provides exclusive seller leads with no competition in your zip code territory.</p>
                </div>
                <div className="bg-accent-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-accent-700 mb-3">AutoPilotRE</h3>
                  <p className="text-gray-700">Analyzes those leads and helps you manage your entire investment business.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-brand-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Take Your Investment Business to the Next Level?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Start using AutoPilotRE today - it's completely free and will help you make better investment decisions.
            </p>
            <a 
              href="https://autopilotre.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="px-8 py-6 text-lg bg-accent-600 hover:bg-accent-700 group">
                Get Started with AutoPilotRE
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default InvestorToolsPage;
