import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/custom/LoadingComponents';
import { useExamsContext } from '@/context/ExamsContext';
import {
  FaPlay,
  FaClock,
  FaClipboardList,
  FaChartLine,
  FaTrophy,
  FaTimes,
  FaCheck,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaHourglass,
} from 'react-icons/fa';

interface ExamsGridProps {
  certId: number | null;
}

// Normalized internal status values used for UI display
type ExamStatus =
  | 'completed_successful'
  | 'completed_failed'
  | 'completed_review'
  | 'completed'
  | 'in_progress'
  | 'ready'
  | 'generating'
  | 'generation_failed'
  | 'pending'
  | 'not_started';

const ExamsGrid: React.FC<ExamsGridProps> = ({ certId }) => {
  const router = useRouter();
  const [navigatingExamId, setNavigatingExamId] = useState<string | null>(null);
  const { exams, isLoadingExams } = useExamsContext();

  const handleStartExam = (examId: string) => {
    setNavigatingExamId(examId);
    // Immediate redirect with optimistic loading
    router.push(`/main/certifications/${certId}/exams/${examId}`);
  };

  if (isLoadingExams) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!exams || exams.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <FaClipboardList className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          No Exams Available
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          There are no exams available for this certification yet. Create your first exam to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {exams.map((exam) => {
        // Enhanced status detection based on actual exam status and submission state
        const hasStarted = exam.started_at !== null;

        // Determine exam status based on the actual exam_status from API
        const rawStatus = exam.status || exam.exam_status || 'not_started';
        let examStatus: ExamStatus;

        // Normalize status for consistent display
        if (rawStatus === 'PASSED') {
          examStatus = 'completed_successful';
        } else if (rawStatus === 'FAILED') {
          examStatus = 'completed_failed';
        } else if (rawStatus === 'COMPLETED') {
          examStatus = 'completed';
        } else if (rawStatus === 'COMPLETED_REVIEW') {
          examStatus = 'completed_review';
        } else if (rawStatus === 'IN_PROGRESS') {
          examStatus = 'in_progress';
        } else if (rawStatus === 'READY') {
          examStatus = hasStarted ? 'in_progress' : 'ready';
        } else if (rawStatus === 'QUESTIONS_GENERATING') {
          examStatus = 'generating';
        } else if (rawStatus === 'QUESTION_GENERATION_FAILED') {
          examStatus = 'generation_failed';
        } else if (rawStatus === 'PENDING_QUESTIONS') {
          examStatus = 'pending';
        } else {
          examStatus = 'not_started';
        }

        const getStatusIcon = () => {
          switch (examStatus) {
            case 'completed_successful':
              return <FaTrophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
            case 'completed_failed':
              return <FaTimes className="w-5 h-5 text-red-600 dark:text-red-400" />;
            case 'completed':
              return <FaCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
            case 'in_progress':
              return <FaPlay className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
            case 'ready':
              return <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'generating':
              return (
                <FaSpinner className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
              );
            case 'generation_failed':
              return <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            case 'pending':
              return <FaHourglass className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
            default:
              return <FaClock className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
          }
        };

        const getStatusText = () => {
          switch (examStatus) {
            case 'completed_successful':
              return 'Passed';
            case 'completed_failed':
              return 'Failed';
            case 'completed_review':
              return 'Needs Review';
            case 'completed':
              return 'Completed';
            case 'in_progress':
              return 'In Progress';
            case 'ready':
              return 'Ready to Start';
            case 'generating':
              return 'Generating Questions';
            case 'generation_failed':
              return 'Generation Failed';
            case 'pending':
              return 'Pending';
            default:
              return 'Not Started';
          }
        };

        const getStatusColor = () => {
          switch (examStatus) {
            case 'completed_successful':
              return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
            case 'completed_failed':
              return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
            case 'completed_review':
              return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50';
            case 'completed':
              return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800/50';
            case 'in_progress':
              return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50';
            case 'ready':
              return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50';
            case 'generating':
              return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50';
            case 'generation_failed':
              return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
            case 'pending':
              return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/50';
            default:
              return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/50';
          }
        };

        return (
          <Card
            key={exam.exam_id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group"
          >
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-relaxed flex-1 mr-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon()}
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        Exam #{exam.exam_id.toString().substring(0, 8)}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${getStatusColor()}`}
                      >
                        {getStatusText()}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {hasStarted
                          ? `Started ${new Date(exam.started_at).toLocaleDateString()}`
                          : 'Not yet attempted'}
                      </span>
                    </div>
                  </div>
                </CardTitle>
                <div className="flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStartExam(exam.exam_id.toString())}
                    disabled={
                      navigatingExamId === exam.exam_id.toString() ||
                      examStatus === 'generating' ||
                      examStatus === 'generation_failed' ||
                      examStatus === 'pending'
                    }
                  >
                    {navigatingExamId === exam.exam_id.toString() ? (
                      <div className="flex items-center space-x-2">
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <>
                        {examStatus === 'completed' ||
                        examStatus === 'completed_successful' ||
                        examStatus === 'completed_failed' ||
                        examStatus === 'completed_review'
                          ? 'Review'
                          : examStatus === 'in_progress'
                          ? 'Continue'
                          : examStatus === 'ready'
                          ? 'Start'
                          : examStatus === 'generating'
                          ? 'Generating...'
                          : examStatus === 'generation_failed'
                          ? 'Retry Setup'
                          : examStatus === 'pending'
                          ? 'Pending'
                          : 'Start'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Exam Stats */}
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <FaClipboardList className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Questions
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {exam.certification?.max_quiz_counts || 25}
                  </p>
                </div>

                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <FaClock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Duration
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">60m</p>
                </div>

                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <FaChartLine className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Score
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {exam.score !== null ? `${exam.score}%` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleStartExam(exam.exam_id.toString())}
                    disabled={
                      navigatingExamId === exam.exam_id.toString() ||
                      examStatus === 'generating' ||
                      examStatus === 'generation_failed' ||
                      examStatus === 'pending'
                    }
                    className="flex-1"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {navigatingExamId === exam.exam_id.toString() ? (
                        <>
                          <span>Loading Exam...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {examStatus === 'completed' ||
                            examStatus === 'completed_successful' ||
                            examStatus === 'completed_review'
                              ? 'Review Exam'
                              : examStatus === 'in_progress'
                              ? 'Continue Exam'
                              : examStatus === 'generating'
                              ? 'Questions Generating...'
                              : examStatus === 'generation_failed'
                              ? 'Generation Failed'
                              : examStatus === 'pending'
                              ? 'Exam Setup Pending...'
                              : 'Start Exam'}
                          </span>
                        </>
                      )}
                    </div>
                  </Button>
                  <Button variant="outline" className="w-auto sm:w-32">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ExamsGrid;
