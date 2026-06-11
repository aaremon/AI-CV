import React, { useState } from 'react';
import { Send, Star, CheckCircle, Award } from 'lucide-react';

interface FeedbackRecord {
  id: number;
  feed_name: string;
  feed_email: string;
  feed_score: string;
  comments: string;
  timestamp: string;
}

interface FeedbackTabProps {
  allFeedback: FeedbackRecord[];
  onFeedbackSumitted: () => void;
}

export default function FeedbackTab({ allFeedback, onFeedbackSumitted }: FeedbackTabProps) {
  const [feedName, setFeedName] = useState('');
  const [feedEmail, setFeedEmail] = useState('');
  const [feedRating, setFeedRating] = useState<number>(5);
  const [feedComment, setFeedComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedName.trim() || !feedEmail.trim() || !feedRating) {
      setError("Please fill in Name, Email and select Rating stars.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: feedName,
          email: feedEmail,
          rating: feedRating,
          comments: feedComment
        })
      });

      if (response.ok) {
        setFeedbackSuccess(true);
        setFeedName('');
        setFeedEmail('');
        setFeedRating(5);
        setFeedComment('');
        onFeedbackSumitted();
        
        // auto dismiss success state
        setTimeout(() => setFeedbackSuccess(false), 5000);
      } else {
        throw new Error("Unable to save feedback review.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Let's try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto animate-fade-in py-4">
      
      {/* Submit Form Area */}
      <div className="lg:col-span-5 bg-white dark:bg-[#141c2f] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 h-fit">
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">Leave Your Review</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Provide feedback regarding the precision of the parser and dynamic suggestions.</p>
        </div>

        {feedbackSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-2xl flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Feedback Sent Successfully!</p>
              <p className="opacity-90">Thank you for helping us polish the resume parsing mechanisms.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">
              Your Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your name"
              value={feedName}
              onChange={(e) => setFeedName(e.target.value)}
              className="block w-full px-4 py-2.5 border border-slate-200 dark:border-[#243049] rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={feedEmail}
              onChange={(e) => setFeedEmail(e.target.value)}
              className="block w-full px-4 py-2.5 border border-slate-200 dark:border-[#243049] rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 block mb-2 uppercase tracking-wider">
              System Rating Score
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setFeedRating(s)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                    feedRating >= s
                      ? 'bg-amber-400 border-amber-400 text-white shadow-xs'
                      : 'border-slate-200 dark:border-[#243049] text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">
              Constructive Comments
            </label>
            <textarea
              rows={4}
              placeholder="Tell us what worked perfectly or what recommendations need improvements."
              value={feedComment}
              onChange={(e) => setFeedComment(e.target.value)}
              className="block w-full px-4 py-2.5 border border-slate-200 dark:border-[#243049] rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 dark:bg-white dark:hover:bg-slate-50 dark:text-slate-950 font-bold text-xs py-3 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 h-11 uppercase tracking-widest"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Submitting..." : "Send Feedback"}</span>
          </button>
        </form>
      </div>

      {/* Grid of All previous feedback */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-4">
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight uppercase">Community Verdict</h3>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold leading-none select-none">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>
              Average Rating:{' '}
              {allFeedback.length > 0
                ? (allFeedback.reduce((sum, item) => sum + Number(item.feed_score), 0) / allFeedback.length).toFixed(1)
                : '5.0'}
            </span>
          </div>
        </div>

        {allFeedback.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#141c2f] rounded-3xl border border-slate-200 dark:border-slate-800/80 text-slate-500">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-750 dark:text-white">No feedback reviews submitted yet.</p>
            <p className="text-xs text-slate-400">Be the first to share your evaluation score!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {allFeedback.map((feed) => (
              <div key={feed.id} className="bg-white dark:bg-[#141c2f] p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/60 shadow-xs space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">{feed.feed_name}</h5>
                    <p className="text-[10px] text-slate-400 font-mono">{new Date(feed.timestamp).toDateString()}</p>
                  </div>
                  <div className="flex gap-0.5 select-none text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Number(feed.feed_score) ? 'fill-current' : 'opacity-20 text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-sans">{feed.comments || 'No comments left.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
