
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  MapPin, 
  UserCheck, 
  Bell, 
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const HowItWorksPage = () => {
  const steps = [
    {
      number: 1,
      title: "Check Area Availability",
      description: "Enter your desired zip code to see if it's available for exclusive lead generation.",
      icon: <MapPin className="h-7 w-7 text-brand-600" />,
      color: "from-blue-50 to-cyan-50 border-blue-100"
    },
    {
      number: 2,
      title: "Claim Your Territory",
      description: "Secure exclusive rights to all leads in that territory with our 7-day free trial.",
      icon: <Target className="h-7 w-7 text-brand-600" />,
      color: "from-green-50 to-emerald-50 border-green-100"
    },
    {
      number: 3,
      title: "Complete Your Profile",
      description: "Set up your contact preferences to receive leads via email, text, or both.",
      icon: <UserCheck className="h-7 w-7 text-brand-600" />,
      color: "from-purple-50 to-violet-50 border-purple-100"
    },
    {
      number: 4,
      title: "Start Receiving Leads",
      description: "Get instant notifications for new, exclusive, qualified seller leads in your area.",
      icon: <Bell className="h-7 w-7 text-brand-600" />,
      color: "from-amber-50 to-yellow-50 border-amber-100"
    },
    {
      number: 5,
      title: "Close More Deals",
      description: "Convert exclusive leads into deals with no competition from other investors.",
      icon: <Zap className="h-7 w-7 text-brand-600" />,
      color: "from-teal-50 to-emerald-50 border-teal-100"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>How It Works - Exclusive Real Estate Seller Leads | LeadXclusive</title>
        <meta name="description" content="Learn how LeadXclusive delivers exclusive real estate seller leads directly to you. Our simple 5-step process ensures you receive qualified leads with no competition." />
      </Helmet>

      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-28 overflow-hidden bg-gradient-to-br from-brand-700 to-brand-800 text-white">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500 opacity-10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
                  How LeadXclusive Works
                </h1>
                <p className="text-xl md:text-2xl text-brand-100 max-w-2xl mx-auto">
                  Our streamlined process delivers exclusive real estate leads directly to you, 
                  with zero competition in your territory.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-10"
              >
                <Link to="/check-availability">
                  <Button size="lg" className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                    Check Territory Availability
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Process Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-16">
                <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our Simple 5-Step Process
                </motion.h2>
                <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
                  From checking availability to closing deals, here's how our exclusive lead generation works.
                </motion.p>
              </div>

              {/* Process Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-brand-200 via-brand-500 to-accent-500 rounded-full"></div>

                {/* Step cards */}
                <div className="space-y-16 md:space-y-24 relative">
                  {steps.map((step, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                      {/* Step number for mobile */}
                      <div className="md:hidden flex justify-center mb-6">
                        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-brand-100 text-brand-700 text-xl font-bold">
                          {step.number}
                        </div>
                      </div>

                      {/* Content side */}
                      <div className={`flex-1 p-6 md:p-8 rounded-2xl shadow-lg bg-gradient-to-br ${step.color} border`}>
                        <div className="flex items-start gap-5">
                          <div className="hidden md:flex h-14 w-14 rounded-full bg-white shadow-md items-center justify-center flex-shrink-0">
                            {step.icon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900 flex items-center">
                              <span className="inline-block h-8 w-8 rounded-full bg-brand-100 text-brand-700 font-bold text-lg mr-3 flex items-center justify-center">
                                {step.number}
                              </span>
                              {step.title}
                            </h3>
                            <p className="text-lg text-gray-700">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Spacer for timeline */}
                      <div className="hidden md:block flex-1"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How We Generate Leads Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-16">
                <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  How We Generate Your Leads
                </motion.h2>
                <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Our AI-powered system identifies and qualifies motivated sellers across the country.
                </motion.p>
              </div>

              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-50 to-brand-50 rounded-3xl border border-gray-200 shadow-xl overflow-hidden"
              >
                <div className="p-8 md:p-12">
                  <div className="space-y-10">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl mr-5">
                        1
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered List Building</h3>
                        <p className="text-gray-700">
                          We've built advanced AI tools that quickly identify potential homeowners who may be interested in selling. 
                          Our system analyzes multiple data sources to create comprehensive lists of property owners.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl mr-5">
                        2
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Channel Outreach</h3>
                        <p className="text-gray-700">
                          Our platform reaches potential sellers through multiple channels to determine interest in receiving offers. 
                          We contact thousands of homeowners daily across the country using automated but personalized communication.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl mr-5">
                        3
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Thorough Qualification Process</h3>
                        <p className="text-gray-700">
                          Interested homeowners are carefully screened about their timeframe, motivation, and price expectations. 
                          This qualification process ensures we only connect you with serious, motivated sellers.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl mr-5">
                        4
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Exclusive Lead Delivery</h3>
                        <p className="text-gray-700">
                          Once qualified, leads are instantly delivered to you—and only you—as the exclusive investor for that zip code. 
                          You'll receive real-time notifications with all the seller's information and property details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-50 via-white to-accent-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-5xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  The LeadXclusive Advantage
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Here's why investors and agents choose our exclusive leads over the competition.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Exclusive Territory Rights",
                    description: "No competing with other investors in your selected area.",
                    color: "from-blue-50 to-cyan-50 border-blue-100"
                  },
                  {
                    title: "Pre-Qualified Leads",
                    description: "Each lead is vetted to ensure they're serious about selling.",
                    color: "from-green-50 to-emerald-50 border-green-100"
                  },
                  {
                    title: "Customizable Notifications",
                    description: "Receive leads via email, text, or both - your choice.",
                    color: "from-purple-50 to-violet-50 border-purple-100"
                  },
                  {
                    title: "No Long-Term Contracts",
                    description: "Month-to-month service that you can cancel anytime.",
                    color: "from-amber-50 to-yellow-50 border-amber-100"
                  },
                  {
                    title: "Lead Management Dashboard",
                    description: "Track and manage all your leads in one convenient place.",
                    color: "from-teal-50 to-emerald-50 border-teal-100"
                  },
                  {
                    title: "Flexible Area Selection",
                    description: "Add multiple zip codes to expand your territory at any time.",
                    color: "from-rose-50 to-red-50 border-rose-100"
                  }
                ].map((advantage, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${advantage.color} border hover:shadow-xl transition-shadow`}
                  >
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <CheckCircle className="h-6 w-6 text-teal-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900">
                          {advantage.title}
                        </h3>
                        <p className="text-gray-700">
                          {advantage.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Section */}
              <motion.div 
                variants={itemVariants}
                className="mt-20 text-center"
              >
                <div className="bg-gradient-to-r from-brand-600 to-brand-800 text-white p-10 rounded-3xl shadow-xl">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    Ready to Start Receiving Exclusive Leads?
                  </h2>
                  <p className="text-xl mb-8 text-brand-100 max-w-2xl mx-auto">
                    Check if your desired zip code is available and secure your exclusive territory today.
                  </p>
                  <Link to="/check-availability">
                    <Button size="lg" className="bg-accent-600 hover:bg-accent-700 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                      Check Territory Availability
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
