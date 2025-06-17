import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/custom/LoadingComponents';
import { useExamsContext } from '@/context/ExamsContext';
import { FaPlay, FaClock, FaClipboardList, FaChartLine, FaTrophy } from 'react-icons/fa';

interface ExamsGridProps {
  certId: number | null;
}

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
        // Enhanced status detection based on actual ExamListItem properties
        const isCompleted = exam.submitted_at !== null;
        const hasStarted = exam.started_at !== null;
        const hasScore = exam.score !== null && exam.score !== undefined;
        const meetsRequirement = hasScore && exam.score! >= (exam.certification?.pass_score || 80);
        const needsImprovement = hasScore && exam.score! < (exam.certification?.pass_score || 80);

        // Determine exam status
        let examStatus = 'not_started';
        if (isCompleted && meetsRequirement) {
          examStatus = 'completed_successful';
        } else if (isCompleted && needsImprovement) {
          examStatus = 'completed_review';
        } else if (isCompleted) {
          examStatus = 'completed';
        } else if (hasStarted) {
          examStatus = 'in_progress';
        }

        const getStatusIcon = () => {
          switch (examStatus) {
            case 'completed_successful':
              return <FaTrophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
            case 'completed':
            case 'completed_review':
              return <FaTrophy className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
            case 'in_progress':
              return <FaPlay className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
            default:
              return <FaClock className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
          }
        };

        const getStatusText = () => {
          switch (examStatus) {
            case 'completed_successful':
              return 'Passed';
            case 'completed_review':
              return 'Needs Review';
            case 'completed':
              return 'Completed';
            case 'in_progress':
              return 'In Progress';
            default:
              return 'Not Started';
          }
        };

        const getStatusColor = () => {
          switch (examStatus) {
            case 'completed_successful':
              return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
            case 'completed_review':
              return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50';
            case 'completed':
              return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800/50';
            case 'in_progress':
              return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50';
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
                    className="border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => handleStartExam(exam.exam_id.toString())}
                    disabled={navigatingExamId === exam.exam_id.toString()}
                  >
                    {navigatingExamId === exam.exam_id.toString() ? (
                      <div className="flex items-center space-x-2">
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <>
                        {examStatus === 'completed' ||
                        examStatus === 'completed_successful' ||
                        examStatus === 'completed_review'
                          ? 'Review'
                          : examStatus === 'in_progress'
                          ? 'Continue'
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

                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <FaTrophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Target Score
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {exam.certification?.pass_score || 80}%
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleStartExam(exam.exam_id.toString())}
                    disabled={navigatingExamId === exam.exam_id.toString()}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
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
                              : 'Start Exam'}
                          </span>
                        </>
                      )}
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-auto sm:w-32 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl py-3"
                  >
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
