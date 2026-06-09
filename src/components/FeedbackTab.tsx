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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fade-in">
      
      {/* Submit Form Area */}
      <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 h-fit">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-800">Leave Your Review</h3>
          <p className="text-xs text-slate-500">Provide feedback regarding the precision of Gemini's ATS suggestions and features.</p>
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
            <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wide">
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Deepak Padhi"
              value={feedName}
              onChange={(e) => setFeedName(e.target.value)}
              className="block w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g., helper@example.com"
              value={feedEmail}
              onChange={(e) => setFeedEmail(e.target.value)}
              className="block w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-500 block mb-1.5 uppercase tracking-wide">
              System Rating Score
            </label>
            <div className="flex gap-2.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setFeedRating(s)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                    feedRating >= s
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-slate-250 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wide">
              Constructive Comments
            </label>
            <textarea
              rows={4}
              placeholder="Tell us what worked perfectly or what recommendations need improvements."
              value={feedComment}
              onChange={(e) => setFeedComment(e.target.value)}
              className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 h-10 uppercase tracking-widest"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Submitting..." : "Send Feedback"}</span>
          </button>
        </form>
      </div>

      {/* Grid of All previous feedback */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Community Verdict ({allFeedback.length})</h3>
          <div className="bg-amber-50 border border-amber-100 text-amber-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold leading-none select-none">
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
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No feedback reviews submitted yet.</p>
            <p className="text-xs text-slate-400">Be the first to share your evaluation score!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {allFeedback.map((feed) => (
              <div key={feed.id} className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">{feed.feed_name}</h5>
                    <p className="text-[10px] text-slate-400 font-mono">{new Date(feed.timestamp).toDateString()}</p>
                  </div>
                  <div className="flex gap-0.5 select-none text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Number(feed.feed_score) ? 'fill-current' : 'opacity-20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{feed.comments || 'No comments left.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
