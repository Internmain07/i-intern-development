// Internship History Frontend Integration Examples
// These are TypeScript/React components to help integrate the feature

import React from 'react';

// ============================================
// 1. Experience Badge Component
// ============================================

interface ExperienceBadge {
  status: 'HIRED' | 'EXPERIENCED';
  type: 'active' | 'completed';
  title?: string;
  company?: string;
  days_remaining?: number;
  start_date?: string;
  expected_end_date?: string;
  completed_count?: number;
  total_experience_months?: number;
  total_experience_days?: number;
}

export const StudentExperienceBadge: React.FC<{ badge: ExperienceBadge | null }> = ({ badge }) => {
  if (!badge) return null;

  if (badge.status === 'HIRED' && badge.type === 'active') {
    return (
      <div className="bg-green-100 border border-green-500 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <div>
            <div className="font-bold text-green-800">Currently Interning</div>
            <div className="text-sm text-green-700">
              {badge.title} at {badge.company}
            </div>
            <div className="text-xs text-green-600 mt-1">
              ⏱️ {badge.days_remaining} days remaining
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (badge.status === 'EXPERIENCED' && badge.type === 'completed') {
    return (
      <div className="bg-blue-100 border border-blue-500 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <div>
            <div className="font-bold text-blue-800">Experienced via I-Intern</div>
            <div className="text-sm text-blue-700">
              {badge.completed_count || 0} internship{(badge.completed_count || 0) > 1 ? 's' : ''} completed
            </div>
            <div className="text-xs text-blue-600 mt-1">
              📅 {badge.total_experience_months || 0} months total experience
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ============================================
// 2. Check Before Accepting Offer
// ============================================

export const useCanAcceptOffer = () => {
  const [canAccept, setCanAccept] = React.useState<boolean>(true);
  const [reason, setReason] = React.useState<string>('');
  const [activeInternship, setActiveInternship] = React.useState<any>(null);

  const checkCanAccept = async (token: string) => {
    try {
      const response = await fetch('/api/v1/internship-history/check-can-accept-offer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setCanAccept(data.can_accept);
      setReason(data.reason);
      setActiveInternship(data.active_internship || null);

      return data.can_accept;
    } catch (error) {
      console.error('Error checking offer acceptance:', error);
      return false;
    }
  };

  return { canAccept, reason, activeInternship, checkCanAccept };
};

// Usage in offer response component
export const OfferResponseButton: React.FC<{ applicationId: string }> = ({ applicationId }) => {
  const { canAccept, reason, activeInternship, checkCanAccept } = useCanAcceptOffer();
  const [showModal, setShowModal] = React.useState(false);

  const handleAccept = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    const allowed = await checkCanAccept(token);

    if (!allowed) {
      alert(reason);
      return;
    }

    // Proceed with acceptance
    try {
      const response = await fetch(`/api/v1/applications/${applicationId}/respond`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: 'accepted' })
      });

      if (response.ok) {
        // Show start internship modal
        setShowModal(true);
      } else {
        const error = await response.json();
        alert(error.detail);
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };

  return (
    <>
      <button onClick={handleAccept} className="btn-primary">
        Accept Offer
      </button>
      {showModal && (
        <StartInternshipModal
          applicationId={applicationId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

// ============================================
// 3. Start Internship Modal
// ============================================

export const StartInternshipModal: React.FC<{
  applicationId: string;
  onClose: () => void;
}> = ({ applicationId, onClose }) => {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/v1/internship-history/start-internship/${applicationId}?start_date=${startDate}&expected_end_date=${endDate}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        alert('Internship started successfully!');
        onClose();
        window.location.reload(); // Refresh to show badge
      } else {
        const error = await response.json();
        alert(error.detail);
      }
    } catch (error) {
      console.error('Error starting internship:', error);
      alert('Failed to start internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Start Your Internship</h2>
        <p>Set the start and expected end dates for your internship</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Expected End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              min={startDate}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Starting...' : 'Start Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// 4. Current Internship Display
// ============================================

export const CurrentInternshipCard: React.FC = () => {
  const [internship, setInternship] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchCurrentInternship();
  }, []);

  const fetchCurrentInternship = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/internship-history/my-current-internship', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.has_active_internship) {
        setInternship(data.current_internship);
      }
    } catch (error) {
      console.error('Error fetching current internship:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!internship) return null;

  return (
    <div className="card">
      <h3>🎯 Current Internship</h3>
      <div className="internship-details">
        <h4>{internship.title}</h4>
        <p className="company">{internship.company}</p>
        <div className="info-grid">
          <div>
            <span className="label">Location:</span>
            <span>{internship.location}</span>
          </div>
          <div>
            <span className="label">Type:</span>
            <span>{internship.type}</span>
          </div>
          <div>
            <span className="label">Stipend:</span>
            <span>₹{internship.stipend?.toLocaleString()}/month</span>
          </div>
          <div>
            <span className="label">Duration:</span>
            <span>{internship.duration_months} months</span>
          </div>
        </div>
        
        <div className="progress-section">
          <div className="flex justify-between mb-2">
            <span>Days Completed: {internship.days_completed}</span>
            <span>Days Remaining: {internship.days_remaining}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{
                width: `${(internship.days_completed / (internship.days_completed + internship.days_remaining)) * 100}%`
              }}
            />
          </div>
        </div>

        <div className="dates">
          <p>Started: {new Date(internship.start_date).toLocaleDateString()}</p>
          <p>Expected End: {new Date(internship.expected_end_date).toLocaleDateString()}</p>
        </div>

        <button className="btn-secondary mt-4">
          Complete Internship
        </button>
      </div>
    </div>
  );
};

// ============================================
// 5. Internship History Page
// ============================================

export const InternshipHistoryPage: React.FC = () => {
  const [history, setHistory] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchHistory();
    fetchSummary();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/internship-history/my-history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/internship-history/my-experience-summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="internship-history-page">
      <h1>My Internship History</h1>

      {/* Summary Stats */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{summary.total_internships_completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.total_internships_ongoing}</div>
            <div className="stat-label">Ongoing</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.total_experience_months}</div>
            <div className="stat-label">Months Experience</div>
          </div>
        </div>
      )}

      {/* Current Internship */}
      {summary?.current_internship && (
        <div className="current-section">
          <h2>Current Internship</h2>
          <CurrentInternshipCard />
        </div>
      )}

      {/* History Timeline */}
      <div className="history-section">
        <h2>Past Internships</h2>
        <div className="timeline">
          {history.filter(h => h.status === 'completed').map((item) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-content">
                <h3>{item.title}</h3>
                <p className="company">{item.company}</p>
                <p className="dates">
                  {new Date(item.start_date).toLocaleDateString()} - 
                  {new Date(item.actual_end_date || item.expected_end_date).toLocaleDateString()}
                </p>
                <p className="duration">{item.duration_months} months</p>
                {item.skills_gained && (
                  <div className="skills-gained">
                    <strong>Skills Gained:</strong> {item.skills_gained}
                  </div>
                )}
                {item.performance_rating && (
                  <div className="rating">
                    Rating: {'⭐'.repeat(item.performance_rating)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// 6. Company View - Applicant Badge
// ============================================

export const ApplicantExperienceBadge: React.FC<{ 
  badge: ExperienceBadge | null;
  studentId: number;
}> = ({ badge, studentId }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  if (!badge) return null;

  return (
    <>
      <div 
        className="experience-badge cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <StudentExperienceBadge badge={badge} />
        <span className="text-xs text-gray-500">Click for details</span>
      </div>

      {showDetails && (
        <StudentExperienceModal
          studentId={studentId}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

// ============================================
// 7. Student Experience Modal (Company View)
// ============================================

export const StudentExperienceModal: React.FC<{
  studentId: number;
  onClose: () => void;
}> = ({ studentId, onClose }) => {
  const [experience, setExperience] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchExperience();
  }, [studentId]);

  const fetchExperience = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/v1/internship-history/student/${studentId}/experience`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setExperience(data);
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!experience) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{experience.student_name}'s I-Intern Experience</h2>
        
        <div className="experience-summary">
          <div className="summary-stat">
            <strong>{experience.total_internships_completed}</strong>
            <span>Completed Internships</span>
          </div>
          <div className="summary-stat">
            <strong>{experience.total_experience_months}</strong>
            <span>Months Experience</span>
          </div>
        </div>

        {experience.current_internship_badge && (
          <div className="current-internship-info">
            <h3>⚠️ Currently Interning</h3>
            <p>{experience.current_internship_badge.title}</p>
            <p>at {experience.current_internship_badge.company}</p>
            <p className="text-sm text-gray-600">
              {experience.current_internship_badge.days_remaining} days remaining
            </p>
            <div className="alert alert-info mt-2">
              This student is currently doing an internship and cannot accept new offers
              until completion.
            </div>
          </div>
        )}

        <button onClick={onClose} className="btn-primary mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

// ============================================
// 8. API Helper Functions
// ============================================

export const internshipHistoryAPI = {
  // Start internship
  async startInternship(applicationId: string, startDate: string, endDate: string, token: string) {
    const response = await fetch(
      `/api/v1/internship-history/start-internship/${applicationId}?start_date=${startDate}&expected_end_date=${endDate}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  // Complete internship
  async completeInternship(historyId: number, data: any, token: string) {
    const response = await fetch(
      `/api/v1/internship-history/complete-internship/${historyId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    return response.json();
  },

  // Get current internship
  async getCurrentInternship(token: string) {
    const response = await fetch('/api/v1/internship-history/my-current-internship', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Get history
  async getHistory(token: string) {
    const response = await fetch('/api/v1/internship-history/my-history', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Get summary
  async getSummary(token: string) {
    const response = await fetch('/api/v1/internship-history/my-experience-summary', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Check can accept offer
  async checkCanAccept(token: string) {
    const response = await fetch('/api/v1/internship-history/check-can-accept-offer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};
