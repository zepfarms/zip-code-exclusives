
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Target, 
  Users, 
  Trophy, 
  Heart, 
  Building,
  TrendingUp,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  Home,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Animation variants
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

const floatVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const AboutUsPage = () => {
  const stats = [
    {
      number: "10+",
      label: "Years Experience",
      icon: <Calendar className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "100+",
      label: "Successful Partnerships",
      icon: <Users className="h-8 w-8" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "98%",
      label: "Client Satisfaction",
      icon: <Star className="h-8 w-8" />,
      color: "from-yellow-500 to-orange-500"
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: <Heart className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const values = [
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Exclusive Territory Protection",
      description: "Your investment deserves protection. We ensure every territory belongs to one client only.",
      color: "from-blue-50 to-indigo-50 border-blue-200"
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: "Quality Lead Generation",
      description: "We focus on delivering motivated sellers who are ready to work with you.",
      color: "from-emerald-50 to-green-50 border-emerald-200"
    },
    {
      icon: <Heart className="h-12 w-12" />,
      title: "Genuine Partnership",
      description: "Your success drives our mission. We're here to support your real estate journey.",
      color: "from-rose-50 to-pink-50 border-rose-200"
    },
    {
      icon: <Lightbulb className="h-12 w-12" />,
      title: "Continuous Improvement",
      description: "We constantly evolve our processes to better serve you and generate better results.",
      color: "from-amber-50 to-yellow-50 border-amber-200"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About Us - Experienced Real Estate Professionals | LeadXclusive</title>
        <meta name="description" content="Learn about LeadXclusive's experienced team of real estate professionals dedicated to helping you succeed with exclusive lead generation services." />
      </Helmet>

      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background with gradient and patterns */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-800 to-teal-800"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent-500 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400 rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-4xl mx-auto text-center text-white"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                  <Building className="h-5 w-5" />
                  <span className="text-sm font-medium">Real Estate Professionals</span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  Experience You Can Trust,
                  <span className="block bg-gradient-to-r from-accent-400 to-yellow-400 bg-clip-text text-transparent">
                    Results You Deserve
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto leading-relaxed">
                  We're dedicated professionals who understand the real estate market and are 
                  committed to helping you achieve your goals through exclusive lead generation.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/check-availability">
                  <Button size="lg" className="bg-white text-brand-800 hover:bg-gray-100 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all font-semibold">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-800 px-8 py-6 text-lg rounded-full font-semibold transition-all">
                    Learn Our Process
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating elements */}
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="absolute top-1/4 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"
          />
          <motion.div
            variants={floatVariants}
            animate="animate"
            style={{ animationDelay: "2s" }}
            className="absolute bottom-1/4 right-10 w-16 h-16 bg-accent-500/20 rounded-full blur-xl"
          />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Our Commitment to Excellence
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Years of experience helping real estate professionals succeed.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center group"
                  >
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-gradient-to-br from-brand-50 via-white to-teal-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-6xl mx-auto"
            >
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div variants={itemVariants}>
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 rounded-full px-4 py-2 text-sm font-medium mb-6">
                      <Trophy className="h-4 w-4" />
                      Our Story
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                      Built on Experience, Driven by Results
                    </h2>
                  </div>

                  <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                    <p>
                      LeadXclusive was founded with a simple mission: to provide real estate 
                      professionals with the exclusive, high-quality leads they need to succeed.
                    </p>
                    <p>
                      Our team understands the challenges you face in today's competitive market. 
                      That's why we've developed a system that ensures <strong>exclusive territory rights </strong> 
                      and delivers motivated sellers who are ready to work with you.
                    </p>
                    <p>
                      We believe in building genuine partnerships with our clients, providing ongoing 
                      support, and continuously improving our services to help you achieve your goals.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="lg:pl-8">
                  <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
                    <CardContent className="p-8">
                      <div className="mb-6">
                        <Users className="h-12 w-12 text-brand-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">Proven track record of success</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">Dedicated to your growth</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">Exclusive territory protection</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">Continuous support and guidance</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-accent-100 text-accent-700 rounded-full px-4 py-2 text-sm font-medium mb-6">
                  <Heart className="h-4 w-4" />
                  Our Core Values
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  What Drives Us Every Day
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  These principles guide how we serve you and deliver results.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group"
                  >
                    <Card className={`h-full bg-gradient-to-br ${value.color} border-2 hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                      <CardContent className="p-8">
                        <div className="text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                          {value.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">
                          {value.title}
                        </h3>
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-brand-900 to-teal-900 text-white relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-500 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Our Mission & Vision
                </h2>
                <p className="text-xl text-brand-100">
                  Helping you succeed in real estate.
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-12">
                <motion.div variants={itemVariants}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-full">
                    <Target className="h-12 w-12 text-accent-400 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                    <p className="text-lg text-brand-100 leading-relaxed">
                      To help real estate professionals succeed by providing exclusive, 
                      high-quality leads that eliminate competition and maximize 
                      opportunities for meaningful connections with motivated sellers.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-full">
                    <TrendingUp className="h-12 w-12 text-accent-400 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                    <p className="text-lg text-brand-100 leading-relaxed">
                      To become the most trusted partner for real estate professionals 
                      seeking exclusive leads, empowering them to build successful 
                      businesses through our dedication to quality and service.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-4xl mx-auto text-center text-white"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Experience the Difference?
                </h2>
                <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
                  Join the real estate professionals who trust us to deliver 
                  exclusive leads and exceptional service.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/check-availability">
                    <Button size="lg" className="bg-white text-brand-800 hover:bg-gray-100 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all font-semibold">
                      Check Territory Availability
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/how-it-works">
                    <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-800 px-8 py-6 text-lg rounded-full font-semibold transition-all">
                      Learn How It Works
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

export default AboutUsPage;
