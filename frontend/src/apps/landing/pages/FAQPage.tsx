import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FAQAccordion } from '../components/FAQAccordion';

interface FAQSection {
  title: string;
  icon: React.ReactNode;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqSections: FAQSection[] = [
    {
      title: 'General',
      icon: <HelpCircle className="w-6 h-6" />,
      items: [
        {
          question: 'What is i-Intern?',
          answer: 'i-Intern is an AI-powered internship and recruitment platform that connects talented students with verified companies. We provide a comprehensive ecosystem featuring smart matching algorithms, AI-powered resume building, virtual interview assistance (IVA), and career guidance through our AURA assistant.'
        },
        {
          question: 'Is i-Intern free to use?',
          answer: 'Yes! i-Intern is completely free for interns and students. You can create a profile, apply to unlimited internships, use our AI tools, and access all features at no cost. Companies may have premium posting options and advanced features available through subscription plans.'
        },
        {
          question: 'How do I contact support?',
          answer: 'You can reach our support team through multiple channels: visit our Contact page, email us at support@i-intern.com, or use the live chat feature available in your dashboard. We typically respond within 24 hours during business days.'
        },
        {
          question: 'What makes i-Intern different from other platforms?',
          answer: 'i-Intern stands out with its AI-powered features including intelligent candidate-internship matching, AURA (our career guidance assistant), IVA (virtual interview practice), automated resume building, and a focus on verified, quality internship opportunities. We also provide real-time application tracking and personalized recommendations.'
        },
        {
          question: 'Is my data secure on i-Intern?',
          answer: 'Absolutely. We take data security seriously and comply with industry standards and regulations including GDPR and DPDP Act. All personal information is encrypted, and we never share your data with third parties without your explicit consent. You have full control over your privacy settings.'
        }
      ]
    },
    {
      title: 'For Interns',
      icon: <MessageCircle className="w-6 h-6" />,
      items: [
        {
          question: 'How do I apply for an internship?',
          answer: 'Applying is simple! First, create your account and complete your profile. Browse available internships on the dashboard, click on any listing to view details, and hit the "Apply Now" button. You can attach your resume or use our AI Resume Builder to create one instantly. Track all your applications in the "My Applications" section.'
        },
        {
          question: 'Can I update my resume and profile later?',
          answer: 'Yes, absolutely! You can update your resume, profile information, skills, work experience, and projects anytime from your dashboard. Simply navigate to the "Profile" section and make your changes. We recommend keeping your profile updated to improve your match score with relevant internships.'
        },
        {
          question: 'How do I track my application status?',
          answer: 'All your application statuses are visible in the "My Applications" section of your dashboard. You\'ll see real-time updates including: Applied, Under Review, Interview Scheduled, Offer Sent, Accepted, or Rejected. You\'ll also receive email notifications and in-app alerts for any status changes.'
        },
        {
          question: 'What is the AI Resume Builder and how do I use it?',
          answer: 'Our AI Resume Builder helps you create professional, ATS-friendly resumes in minutes. Simply answer a few questions about your education, experience, and skills, and our AI will generate a polished resume with optimal formatting. You can customize it, download in multiple formats (PDF, DOCX), and use it for applications.'
        },
        {
          question: 'How does the matching algorithm work?',
          answer: 'Our smart matching algorithm analyzes your profile (skills, education, interests, experience) and compares it with internship requirements. Each listing shows a match percentage indicating how well you fit the role. Higher matches mean better alignment with the position requirements, helping you focus on the best opportunities.'
        },
        {
          question: 'Can I save internships to apply later?',
          answer: 'Yes! You can bookmark any internship by clicking the bookmark icon on the listing. All saved internships appear in your "Saved Internships" section, making it easy to review and apply when you\'re ready.'
        },
        {
          question: 'What is AURA and how can it help me?',
          answer: 'AURA (AI University & Resume Assistant) is your personal career guidance assistant. Ask AURA anything about career planning, resume tips, interview preparation, skill development, or internship search strategies. AURA provides personalized advice based on your profile and goals, available 24/7 in your dashboard.'
        }
      ]
    },
    {
      title: 'For Companies',
      icon: <Mail className="w-6 h-6" />,
      items: [
        {
          question: 'How do I post an internship?',
          answer: 'After creating your company account, navigate to your company dashboard and click "Post New Internship." Fill in the internship details including title, description, requirements, stipend, duration, location, and required skills. Once submitted, your posting will be reviewed and published within 24 hours.'
        },
        {
          question: 'Can I edit or close a listing after posting?',
          answer: 'Yes! You have full control over your internship listings. Go to "My Internships" in your dashboard, select the internship you want to modify, and choose "Edit" to update details or "Close" to deactivate the listing. Closed listings won\'t accept new applications but existing applications remain accessible.'
        },
        {
          question: 'Is there a verification process for companies?',
          answer: 'Yes, we verify all companies to maintain a trusted ecosystem. During registration, you\'ll need to provide company registration documents, official email domain verification, and contact details. Our team reviews submissions within 2-3 business days. Verified companies receive a badge on their profile.'
        },
        {
          question: 'How do I view and manage applications?',
          answer: 'All applications for your internships appear in the "Applications" section of your dashboard. You can filter by internship, status, or date. View candidate profiles, resumes, match scores, and manage application status (Under Review, Interview, Offer Sent, Hired, Rejected). You can also send offer letters directly through the platform.'
        },
        {
          question: 'What is the match score and how does it work?',
          answer: 'The match score (percentage) indicates how well a candidate\'s profile aligns with your internship requirements. It\'s calculated using our AI algorithm that compares candidate skills, education, and experience with your job posting. Higher scores mean better alignment, helping you identify top candidates quickly.'
        },
        {
          question: 'Can I contact candidates directly?',
          answer: 'You can view candidate contact details (email, phone) only after they accept your offer or are hired. This policy protects candidate privacy while allowing communication at appropriate stages. Use the in-platform messaging system to communicate during the application process.'
        },
        {
          question: 'Are there any fees for posting internships?',
          answer: 'Basic internship posting is free with a limit on active postings. For unlimited postings, priority visibility, advanced analytics, and premium features, we offer subscription plans. Visit our Pricing page or contact sales@i-intern.com for details on premium plans.'
        }
      ]
    }
  ];

  // Filter FAQ items based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return faqSections;

    const query = searchQuery.toLowerCase();
    return faqSections
      .map(section => ({
        ...section,
        items: section.items.filter(
          item =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        )
      }))
      .filter(section => section.items.length > 0);
  }, [searchQuery, faqSections]);

  const totalResults = filteredSections.reduce(
    (sum, section) => sum + section.items.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFAF3] to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#004F4D] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find quick answers to the most common questions from interns and companies
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#63D7C7] focus:outline-none focus:ring-2 focus:ring-[#63D7C7]/20 transition-all duration-300 text-gray-700 bg-white shadow-md"
            />
            {searchQuery && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                {totalResults} result{totalResults !== 1 ? 's' : ''}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {filteredSections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                Try different keywords or browse all questions below
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-6 py-2 bg-[#1F7368] text-white rounded-lg hover:bg-[#004F4D] transition-colors duration-300"
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            filteredSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                className="mb-12"
              >
                {/* Section Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-lg text-white">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#004F4D]">
                      {section.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {section.items.length} question{section.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Accordion */}
                <FAQAccordion items={section.items} />
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#1F7368] to-[#004F4D]">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-full mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-[#B3EDEB] text-lg mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-[#1F7368] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact Support</span>
                </motion.button>
              </Link>
              <motion.a
                href="mailto:support@i-intern.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>support@i-intern.com</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
