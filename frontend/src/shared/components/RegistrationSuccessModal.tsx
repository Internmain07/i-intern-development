import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  userName?: string;
  onComplete?: () => void;
  onNavigateToProfile?: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  isOpen,
  userName = 'Student',
  onComplete,
  onNavigateToProfile
}) => {
  const navigate = useNavigate();

  // Handle keyboard escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleNavigateToProfile = () => {
    if (onNavigateToProfile) {
      onNavigateToProfile();
    }
    // Navigate to Build Profile page
    navigate('/interns/edit-profile');
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    }
    // Navigate to main dashboard
    navigate('/interns/dashboard');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleSkip}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {/* Gradient Header Background */}
              <div className="relative h-32 bg-gradient-to-r from-[#1F7368] via-[#63D7C7] to-[#004F4D] overflow-hidden">
                {/* Animated background elements */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute top-2 left-4 w-8 h-8 bg-white/20 rounded-full blur-md"></div>
                  <div className="absolute bottom-4 right-6 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
                </motion.div>

                {/* Centered Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 100 }}
                  >
                    <div className="relative">
                      {/* Pulsing background circle */}
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <CheckCircle size={64} className="text-white relative z-10" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 text-center relative">
                {/* Decorative sparkles */}
                <motion.div
                  className="absolute top-0 right-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Sparkles size={20} className="text-[#1F7368]/30" />
                </motion.div>

                {/* Main Title */}
                <motion.h2
                  className="text-2xl font-bold text-[#004F4D] mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  🎉 Registration Successful!
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  className="text-gray-600 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Welcome to I-Intern, {userName}! Your account has been created successfully.
                </motion.p>

                {/* Info Card */}
                <motion.div
                  className="bg-gradient-to-r from-[#1F7368]/10 to-[#63D7C7]/10 rounded-2xl p-4 mb-8 border border-[#1F7368]/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <p className="text-sm text-gray-700">
                    Let's complete your profile to unlock the best internship matches tailored just for you! 🚀
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {/* Primary Button - Navigate to Profile */}
                  <motion.button
                    onClick={handleNavigateToProfile}
                    className="w-full bg-gradient-to-r from-[#1F7368] to-[#004F4D] text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Complete Profile</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                  </motion.button>

                  {/* Secondary Button - Skip */}
                  <motion.button
                    onClick={handleSkip}
                    className="w-full bg-gray-100 text-[#1F7368] font-semibold py-3 px-6 rounded-2xl hover:bg-gray-200 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Skip for Now
                  </motion.button>
                </motion.div>

                {/* Helper Text */}
                <motion.p
                  className="text-xs text-gray-500 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  You can complete your profile anytime from your dashboard
                </motion.p>

                {/* Email Verification Note */}
                <motion.div
                  className="mt-6 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <p className="text-xs text-gray-600">
                    ✓ Verify your email to unlock all features and stay connected with internship opportunities
                  </p>
                </motion.div>
              </div>

              {/* Footer Tips */}
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                <motion.div
                  className="text-xs text-gray-600 space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <p className="font-semibold text-gray-700 mb-2">Quick Tips:</p>
                  <div className="space-y-1 text-left">
                    <p>📝 Add your skills and interests</p>
                    <p>🎓 Upload your resume</p>
                    <p>📍 Set your location preferences</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
