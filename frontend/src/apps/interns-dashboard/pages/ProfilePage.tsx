import { motion } from "framer-motion";
import { User, ArrowLeft, Upload, FileText, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { extractResumeFromPDF, getProfileCompleteness } from "@/services/resumeSync";
import { Progress } from "@/shared/components/ui/progress";

const ProfilePage = () => {
  const [uploading, setUploading] = useState(false);
  const [completeness, setCompleteness] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    // Fetch profile completeness on mount
    const fetchCompleteness = async () => {
      try {
        const data = await getProfileCompleteness();
        setCompleteness(data.completeness_percentage);
      } catch (error) {
        console.error('Error fetching profile completeness:', error);
      }
    };
    fetchCompleteness();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    try {
      const result = await extractResumeFromPDF(file);
      console.log('Resume extracted:', result);
      
      setUploadSuccess(true);
      alert(`Resume data extracted successfully!\n\nUpdated fields: ${result.updated_fields.join(', ') || 'none'}\n\n${result.message}`);
      
      // Refresh completeness
      const data = await getProfileCompleteness();
      setCompleteness(data.completeness_percentage);
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      alert(`Failed to extract resume data: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Link to="/interns" className="inline-flex items-center mb-6 px-4 py-2 bg-[#FFFAF3] text-[#004F4D] rounded-lg border border-[#63D7C7]/30 hover:bg-white hover:shadow-lg transition-all duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Profile Completeness Card */}
          {completeness !== null && (
            <Card className="mb-6 shadow-xl bg-[#FFFAF3] border-[#63D7C7]/30 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-[#004F4D] flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Profile Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#004F4D]/70">Your profile is {completeness}% complete</span>
                    <span className="font-semibold text-[#1F7368]">{completeness}%</span>
                  </div>
                  <Progress value={completeness} className="h-2" />
                  <p className="text-xs text-[#004F4D]/60 mt-2">
                    Complete your profile to increase your visibility to employers
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resume Upload Card */}
          <Card className="mb-6 shadow-xl bg-[#FFFAF3] border-[#63D7C7]/30 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-[#004F4D] flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Resume to Auto-Fill Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[#004F4D]/70 text-sm">
                Upload your PDF resume and we'll automatically extract information to fill your profile. 
                This will populate fields like skills, contact info, and links.
              </p>
              
              <div className="border-2 border-dashed border-[#63D7C7] rounded-lg p-8 text-center hover:border-[#1F7368] transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={uploading}
                />
                <label 
                  htmlFor="resume-upload" 
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-12 h-12 bg-[#1F7368]/10 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-[#1F7368]" />
                  </div>
                  <div>
                    <p className="text-[#004F4D] font-medium">
                      {uploading ? 'Extracting data...' : 'Click to upload PDF resume'}
                    </p>
                    <p className="text-xs text-[#004F4D]/60 mt-1">
                      Only PDF files are supported
                    </p>
                  </div>
                </label>
              </div>

              {uploadSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Resume data extracted successfully!</p>
                    <p className="text-xs text-green-700 mt-1">Your profile has been updated with the extracted information.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Profile Card */}
          <Card className="shadow-xl bg-[#FFFAF3] border-[#63D7C7]/30 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#1F7368] to-[#004F4D] rounded-full flex items-center justify-center mb-4 shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-[#004F4D]">My Profile</CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <p className="text-[#004F4D]/70">
                Build your resume to automatically populate your profile, or upload an existing PDF resume 
                to extract your information.
              </p>
              
              <div className="space-y-4">
                <Link to="/build-resume" className="block">
                  <Button className="w-full bg-[#1F7368] hover:bg-[#004F4D] text-white shadow-md hover:shadow-lg transition-all duration-300">
                    Build Resume
                  </Button>
                </Link>
                <Button variant="outline" className="w-full bg-white border-[#63D7C7] text-[#1F7368] hover:bg-[#63D7C7]/10 hover:border-[#1F7368] transition-all duration-300">
                  Edit Profile Manually
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;

