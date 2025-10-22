import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Globe, Mail, FileText } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'introduction',
      title: '1. INTRODUCTION',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-3 text-gray-700 leading-relaxed">
            I-Intern Technologies Private Limited ("we," "us," or "our") operates the I-Intern platform 
            ("Platform"). This Privacy Policy explains how we collect, use, disclose, and protect your 
            personal information in compliance with applicable laws, including the Digital Personal Data 
            Protection Act, 2023 (DPDP Act), General Data Protection Regulation (GDPR), and Information 
            Technology Act, 2000.
          </p>
          <p className="mb-3 text-gray-700 leading-relaxed">
            By using our Platform, you consent to the collection and use of your information as described 
            in this Privacy Policy. If you do not agree with this policy, please do not use our services.
          </p>
          <p className="mb-3 text-gray-700 leading-relaxed">
            <strong>Last Updated:</strong> October 19, 2025
          </p>
        </>
      ),
    },
    {
      id: 'data-collection',
      title: '2. INFORMATION WE COLLECT',
      icon: <Database className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">2.1 Information You Provide</h3>
          <p className="mb-2 text-gray-700">We collect information you directly provide when you:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li><strong>Register an Account:</strong> Name, email address, phone number, date of birth, gender</li>
            <li><strong>Create a Profile:</strong> Educational qualifications, work experience, skills, resume/CV, portfolio links</li>
            <li><strong>For Companies:</strong> Company name, registration details, industry, location, authorized representative details</li>
            <li><strong>Post Internships/Apply:</strong> Job descriptions, requirements, application materials</li>
            <li><strong>Communication:</strong> Messages, support tickets, feedback, survey responses</li>
            <li><strong>Payment Information:</strong> Billing details (processed securely through third-party payment gateways)</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">2.2 Automatically Collected Information</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, features used, search queries, click patterns</li>
            <li><strong>Location Data:</strong> Approximate geographic location based on IP address</li>
            <li><strong>Cookies and Similar Technologies:</strong> Session IDs, preferences, analytics data</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">2.3 Information from Third Parties</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Social media login data (if you choose to sign in with Google, LinkedIn, etc.)</li>
            <li>Verification services for company legitimacy</li>
            <li>Educational institutions for credential verification (with your consent)</li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-usage',
      title: '3. HOW WE USE YOUR INFORMATION',
      icon: <UserCheck className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-2 text-gray-700">We use your information for the following purposes:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-2">
            <li><strong>Platform Services:</strong> Account creation, profile management, internship matching, application processing</li>
            <li><strong>AI Features:</strong> Resume building (AURA), interview preparation (IVA), personalized recommendations</li>
            <li><strong>Communication:</strong> Service notifications, application updates, promotional emails (with opt-out option)</li>
            <li><strong>Platform Improvement:</strong> Analytics, feature development, user experience enhancement, bug fixing</li>
            <li><strong>Security:</strong> Fraud prevention, account protection, compliance monitoring</li>
            <li><strong>Legal Compliance:</strong> Responding to legal requests, enforcing terms, protecting rights</li>
            <li><strong>Marketing:</strong> Personalized recommendations, targeted advertising (with your consent)</li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-sharing',
      title: '4. INFORMATION SHARING AND DISCLOSURE',
      icon: <Globe className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">4.1 When We Share Information</h3>
          <p className="mb-2 text-gray-700">We may share your information in the following circumstances:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-2">
            <li><strong>With Companies:</strong> When you apply for internships, companies can view your profile, resume, and application</li>
            <li><strong>With Interns:</strong> Companies can share internship details and requirements with matched candidates</li>
            <li><strong>Service Providers:</strong> Third-party vendors for hosting, analytics, payment processing, email services (under strict data processing agreements)</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets (users will be notified)</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or government authority</li>
            <li><strong>With Your Consent:</strong> Any other sharing explicitly authorized by you</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">4.2 What We Don't Share</h3>
          <p className="mb-2 text-gray-700">We will NEVER:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Sell your personal information to third parties</li>
            <li>Share your contact details with companies before you accept an offer</li>
            <li>Disclose sensitive information without explicit consent</li>
            <li>Use your data for purposes other than those stated in this policy</li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-security',
      title: '5. DATA SECURITY',
      icon: <Lock className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-3 text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-2">
            <li><strong>Encryption:</strong> All data transmitted is encrypted using SSL/TLS protocols</li>
            <li><strong>Secure Storage:</strong> Data is stored on secure servers with access controls</li>
            <li><strong>Authentication:</strong> Multi-factor authentication options available</li>
            <li><strong>Access Control:</strong> Limited employee access on a need-to-know basis</li>
            <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
            <li><strong>Incident Response:</strong> Procedures for handling data breaches</li>
          </ul>
          <p className="mb-3 text-gray-700 leading-relaxed">
            While we implement robust security measures, no system is 100% secure. Users are responsible 
            for maintaining the confidentiality of their account credentials.
          </p>
        </>
      ),
    },
    {
      id: 'user-rights',
      title: '6. YOUR RIGHTS AND CHOICES',
      icon: <Eye className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-2 text-gray-700">Under applicable laws (DPDP Act, GDPR), you have the following rights:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-2">
            <li><strong>Access:</strong> Request a copy of your personal data we hold</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information in your profile</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data (subject to legal retention requirements)</li>
            <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Withdraw Consent:</strong> Opt-out of marketing communications and certain data processing activities</li>
            <li><strong>Object to Processing:</strong> Object to certain uses of your data (e.g., targeted advertising)</li>
            <li><strong>Lodge a Complaint:</strong> File a complaint with the Data Protection Authority</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">6.1 How to Exercise Your Rights</h3>
          <p className="mb-2 text-gray-700">To exercise any of these rights:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Log in to your account and update settings</li>
            <li>Contact us at <a href="mailto:privacy@i-intern.com" className="text-[#1F7368] underline hover:text-[#004F4D]">privacy@i-intern.com</a></li>
            <li>Use the "Delete Account" option in Settings (for account deletion)</li>
          </ul>
          <p className="mb-3 text-gray-700 leading-relaxed">
            We will respond to your request within 30 days as required by law.
          </p>
        </>
      ),
    },
    {
      id: 'cookies',
      title: '7. COOKIES AND TRACKING TECHNOLOGIES',
      icon: <Database className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-3 text-gray-700 leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience, analyze usage, 
            and deliver personalized content.
          </p>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">7.1 Types of Cookies We Use</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for platform functionality (login, security)</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Advertising Cookies:</strong> Deliver relevant ads and measure campaign effectiveness</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">7.2 Managing Cookies</h3>
          <p className="mb-2 text-gray-700">You can control cookies through:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Browser settings (most browsers allow you to block or delete cookies)</li>
            <li>Our cookie consent banner (customize your preferences)</li>
            <li>Account settings (opt-out of non-essential cookies)</li>
          </ul>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Note: Blocking essential cookies may impact platform functionality.
          </p>
        </>
      ),
    },
    {
      id: 'retention',
      title: '8. DATA RETENTION',
      icon: <Database className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-3 text-gray-700 leading-relaxed">
            We retain your personal information for as long as necessary to provide our services and comply 
            with legal obligations:
          </p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-2">
            <li><strong>Active Accounts:</strong> Data retained while account is active</li>
            <li><strong>Deleted Accounts:</strong> Most data deleted within 30 days; some information retained for legal/compliance purposes</li>
            <li><strong>Application Records:</strong> Retained for 3 years for audit and compliance</li>
            <li><strong>Financial Records:</strong> Retained for 7 years as per tax regulations</li>
            <li><strong>Communication Logs:</strong> Retained for 1 year for dispute resolution</li>
          </ul>
          <p className="mb-3 text-gray-700 leading-relaxed">
            After retention periods expire, data is securely deleted or anonymized.
          </p>
        </>
      ),
    },
    {
      id: 'children',
      title: '9. CHILDREN\'S PRIVACY',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Our Platform is not intended for individuals under 18 years of age. We do not knowingly collect 
            personal information from children. If you are under 18, please do not use our services or provide 
            any personal information.
          </p>
          <p className="mb-3 text-gray-700 leading-relaxed">
            If we become aware that we have collected information from a child under 18, we will take steps 
            to delete such information promptly. Parents or guardians who believe their child has provided 
            information should contact us at <a href="mailto:privacy@i-intern.com" className="text-[#1F7368] underline hover:text-[#004F4D]">privacy@i-intern.com</a>.
          </p>
        </>
      ),
    },
    {
      id: 'international',
      title: '10. INTERNATIONAL DATA TRANSFERS',
      icon: <Globe className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Your information may be transferred to and processed in countries other than your country of 
            residence. These countries may have different data protection laws.
          </p>
          <p className="mb-3 text-gray-700 leading-relaxed">
            When we transfer data internationally, we ensure appropriate safeguards are in place:
          </p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Standard Contractual Clauses (SCCs) approved by relevant authorities</li>
            <li>Adequacy decisions by data protection authorities</li>
            <li>Your explicit consent for transfers</li>
          </ul>
        </>
      ),
    },
    {
      id: 'changes',
      title: '11. CHANGES TO THIS PRIVACY POLICY',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-3 text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices, 
            technology, legal requirements, or other factors.
          </p>
          <p className="mb-2 text-gray-700">When we make changes:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>The "Last Updated" date at the top will be revised</li>
            <li>Material changes will be notified via email or prominent notice on the Platform</li>
            <li>You will have the opportunity to review changes before they take effect</li>
            <li>Continued use of the Platform after changes constitutes acceptance</li>
          </ul>
          <p className="mb-3 text-gray-700 leading-relaxed">
            We encourage you to review this Privacy Policy periodically.
          </p>
        </>
      ),
    },
    {
      id: 'contact',
      title: '12. CONTACT US',
      icon: <Mail className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-3 text-gray-700 leading-relaxed">
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
            please contact us:
          </p>
          <div className="bg-[#FFFAF3] p-6 rounded-lg border border-[#63D7C7]/30 mb-4">
            <p className="font-semibold text-[#004F4D] mb-2">I-Intern Technologies Private Limited</p>
            <p className="text-gray-700 mb-1">Data Protection Officer</p>
            <p className="text-gray-700 mb-1">Email: <a href="mailto:privacy@i-intern.com" className="text-[#1F7368] underline hover:text-[#004F4D]">privacy@i-intern.com</a></p>
            <p className="text-gray-700 mb-1">Support: <a href="mailto:support@i-intern.com" className="text-[#1F7368] underline hover:text-[#004F4D]">support@i-intern.com</a></p>
            <p className="text-gray-700 mb-1">Contact Form: <Link to="/contact" className="text-[#1F7368] underline hover:text-[#004F4D]">Contact Us</Link></p>
          </div>
          <p className="mb-3 text-gray-700 leading-relaxed">
            We will respond to your inquiries within 30 days as required by applicable laws.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFAF3] to-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link 
            to="/"
            className="inline-flex items-center text-[#1F7368] hover:text-[#004F4D] transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#004F4D]">
                Privacy Policy
              </h1>
              <p className="text-gray-600 mt-2">
                How we collect, use, and protect your personal information
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>📌 Quick Summary:</strong> We respect your privacy. Your data is encrypted, never sold, 
              and you have full control over your information. Read below for complete details.
            </p>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-[#004F4D] mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Table of Contents
          </h2>
          <nav className="grid md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-[#1F7368] hover:text-[#004F4D] hover:underline transition-colors duration-200 flex items-center gap-2"
              >
                {section.icon}
                <span>{section.title}</span>
              </a>
            ))}
          </nav>
        </motion.div>

        {/* Content Sections */}
        {sections.map((section, index) => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-[#004F4D] mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-lg flex items-center justify-center text-white">
                {section.icon}
              </div>
              {section.title}
            </h2>
            <div className="text-gray-700">
              {section.content}
            </div>
          </motion.section>
        ))}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#1F7368] to-[#004F4D] rounded-xl p-8 text-center text-white mt-8"
        >
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="mb-6 text-[#B3EDEB]">
            Our team is here to help you understand how we protect your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-[#1F7368] rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Contact Us
              </motion.button>
            </Link>
            <Link to="/faq">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/10 backdrop-blur text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                View FAQ
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
