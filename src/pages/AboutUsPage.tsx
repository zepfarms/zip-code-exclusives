
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-brand-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                About LeadXclusive
              </h1>
              <p className="text-xl text-gray-600">
                Founded by real estate investors for real estate investors and agents
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg mx-auto">
                <h2>Our Story</h2>
                <p>
                  LeadXclusive was founded by a team of former real estate investors and flippers who 
                  saw a major problem in the industry: the high cost and low quality of leads being sold 
                  to multiple investors in the same area.
                </p>
                <p>
                  After years of purchasing leads from various providers and competing with dozens of 
                  other investors for the same opportunities, we knew there had to be a better way. 
                  We wanted to create a service that offered exclusive territory rights at an affordable price, 
                  ensuring that each client would have the best chance of closing deals without unnecessary 
                  competition.
                </p>
                <h2>Our Mission</h2>
                <p>
                  Our mission is simple: provide high-quality, exclusive real estate leads to investors 
                  and agents at a fair price. We believe that by limiting each territory to one client, 
                  we can create a win-win situation where motivated sellers get fewer calls and our clients 
                  get higher conversion rates.
                </p>
                <h2>Real Estate Experience</h2>
                <p>
                  With over 20 years of combined experience in real estate investing, flipping, and 
                  wholesaling, our team understands what makes a good lead. We've personally closed 
                  hundreds of deals and know the challenges that investors and agents face in today's 
                  competitive market.
                </p>
                <p>
                  This experience allows us to pre-screen leads effectively, ensuring that you're only 
                  receiving qualified opportunities with motivated sellers. We focus on quality over quantity, 
                  which is why our clients typically see higher conversion rates compared to traditional 
                  lead generation services.
                </p>
                <h2>Our Approach</h2>
                <p>
                  Unlike many lead generation companies, we don't sell the same leads to multiple buyers. 
                  Each zip code is exclusive to one client, giving you the competitive advantage of being 
                  the only investor or agent receiving these opportunities in your area.
                </p>
                <p>
                  We use a combination of online and offline marketing strategies to generate leads from 
                  motivated sellers. Our proprietary screening process helps identify the most promising 
                  opportunities before they're sent to you, saving you time and improving your chances of 
                  closing deals.
                </p>
                <h2>Get Started Today</h2>
                <p>
                  Ready to secure your exclusive territory? Check availability for your desired zip 
                  code and start receiving qualified, exclusive leads today.
                </p>
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
