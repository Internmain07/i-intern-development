import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Heart,
  MessageCircle,
  Building2,
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface InternFeedbackFormProps {
  internshipId: string;
  applicationId: string;
  companyName: string;
  onSubmitSuccess?: () => void;
}

interface FormData {
  mentorship_quality: number;
  learning_opportunities: number;
  work_environment: number;
  work_culture: number;
  compensation_fairness: number;
  career_growth_potential: number;
  overall_rating: number;
  best_aspects: string;
  improvements_needed: string;
  would_recommend: boolean | null;
  general_comments: string;
}

const initialFormData: FormData = {
  mentorship_quality: 0,
  learning_opportunities: 0,
  work_environment: 0,
  work_culture: 0,
  compensation_fairness: 0,
  career_growth_potential: 0,
  overall_rating: 0,
  best_aspects: '',
  improvements_needed: '',
  would_recommend: null,
  general_comments: '',
};

const ratingQuestions = [
  {
    id: 'mentorship_quality',
    label: 'Mentorship Quality',
    description: 'Rate the quality of mentorship and guidance you received',
  },
  {
    id: 'learning_opportunities',
    label: 'Learning Opportunities',
    description: 'Rate the opportunities to learn new skills and technologies',
  },
  {
    id: 'work_environment',
    label: 'Work Environment',
    description: 'Rate the physical and digital work environment',
  },
  {
    id: 'work_culture',
    label: 'Work Culture',
    description: 'Rate the company culture and team dynamics',
  },
  {
    id: 'compensation_fairness',
    label: 'Compensation Fairness',
    description: 'Rate the fairness of compensation and benefits',
  },
  {
    id: 'career_growth_potential',
    label: 'Career Growth Potential',
    description: 'Rate the potential for career growth at this company',
  },
];

export const InternFeedbackForm: React.FC<InternFeedbackFormProps> = ({
  internshipId,
  applicationId,
  companyName,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Update overall rating based on individual ratings
  useEffect(() => {
    const ratings = [
      formData.mentorship_quality,
      formData.learning_opportunities,
      formData.work_environment,
      formData.work_culture,
      formData.compensation_fairness,
      formData.career_growth_potential,
    ];
    const average = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
    setFormData((prev) => ({ ...prev, overall_rating: average }));
  }, [
    formData.mentorship_quality,
    formData.learning_opportunities,
    formData.work_environment,
    formData.work_culture,
    formData.compensation_fairness,
    formData.career_growth_potential,
  ]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check required ratings
    ratingQuestions.forEach((q) => {
      const fieldName = q.id as keyof FormData;
      if (!formData[fieldName] || formData[fieldName] === 0) {
        newErrors[fieldName] = `${q.label} is required`;
      }
    });

    // Check required text fields
    if (!formData.best_aspects?.trim()) {
      newErrors.best_aspects = 'Best aspects is required';
    }
    if (!formData.improvements_needed?.trim()) {
      newErrors.improvements_needed = 'Improvements needed is required';
    }
    if (formData.would_recommend === null) {
      newErrors.would_recommend = 'Please indicate if you would recommend';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRatingChange = (fieldName: string, value: number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleTextChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${API_URL}/api/v1/feedback/intern-to-company`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            internship_id: internshipId,
            application_id: applicationId,
            ...formData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSubmitted(true);
      toast({
        title: 'Success',
        description: 'Your feedback has been submitted successfully!',
        variant: 'default',
      });

      setTimeout(() => {
        onSubmitSuccess?.();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to submit feedback',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-md border-green-200 bg-green-50">
          <CardContent className="pt-12 pb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-200"
            >
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </motion.div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Thank You!
            </h2>
            <p className="text-gray-600">
              Your feedback for {companyName} has been successfully submitted.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Experience Feedback Form
              </h1>
              <p className="text-gray-600">Share your internship experience at {companyName}</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            Internship: {internshipId}
          </Badge>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Questions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                  <span>Experience Ratings</span>
                </CardTitle>
                <CardDescription>
                  Rate your experience on a scale of 1 (Poor) to 5 (Excellent)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {ratingQuestions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-900">
                          {question.label}
                          <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-600">
                          {question.description}
                        </p>
                      </div>
                      <span className="ml-4 inline-flex items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-900">
                        {(formData[question.id as keyof FormData] as number) || '-'}
                      </span>
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            handleRatingChange(question.id, star)
                          }
                          className={`transition-all ${
                            ((formData[question.id as keyof FormData] as number) || 0) >=
                            star
                              ? 'text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    {errors[question.id] && (
                      <p className="flex items-center text-sm text-red-600">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {errors[question.id]}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Overall Rating Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Overall Experience Rating
                    </p>
                    <p className="text-xs text-gray-500">
                      Automatically calculated from individual ratings
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-purple-600">
                      {formData.overall_rating || 0}
                    </span>
                    <span className="text-gray-600">/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Text Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-pink-500" />
                  <span>Your Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Best Aspects */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Best Aspects of Your Experience
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.best_aspects}
                    onChange={(e) =>
                      handleTextChange('best_aspects', e.target.value)
                    }
                    placeholder="What were the best parts of your internship experience?..."
                    rows={4}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:outline-none transition-all ${
                      errors.best_aspects
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-purple-500 focus:border-transparent'
                    }`}
                  />
                  {errors.best_aspects && (
                    <p className="flex items-center text-sm text-red-600 mt-1">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors.best_aspects}
                    </p>
                  )}
                </div>

                {/* Improvements Needed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Areas for Improvement
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.improvements_needed}
                    onChange={(e) =>
                      handleTextChange('improvements_needed', e.target.value)
                    }
                    placeholder="What areas could the company improve in for better intern experiences?..."
                    rows={4}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:outline-none transition-all ${
                      errors.improvements_needed
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-purple-500 focus:border-transparent'
                    }`}
                  />
                  {errors.improvements_needed && (
                    <p className="flex items-center text-sm text-red-600 mt-1">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors.improvements_needed}
                    </p>
                  )}
                </div>

                {/* General Comments */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    General Comments (Optional)
                  </label>
                  <textarea
                    value={formData.general_comments}
                    onChange={(e) =>
                      handleTextChange('general_comments', e.target.value)
                    }
                    placeholder="Any additional thoughts or suggestions..."
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-transparent transition-all"
                  />
                </div>

                {/* Would Recommend */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Would you recommend this company to other interns?
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleRatingChange('would_recommend', true)
                      }
                      className={`flex-1 rounded-lg border-2 py-3 font-semibold transition-all ${
                        formData.would_recommend === true
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                      }`}
                    >
                      ✓ Yes
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleRatingChange('would_recommend', false)
                      }
                      className={`flex-1 rounded-lg border-2 py-3 font-semibold transition-all ${
                        formData.would_recommend === false
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                      }`}
                    >
                      ✗ No
                    </button>
                  </div>
                  {errors.would_recommend && (
                    <p className="flex items-center text-sm text-red-600 mt-1">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors.would_recommend}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default InternFeedbackForm;
