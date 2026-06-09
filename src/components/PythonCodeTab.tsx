import React, { useState } from 'react';
import { Code, BookOpen, Download, Check, Sparkles, Terminal, Play } from 'lucide-react';

export default function PythonCodeTab() {
  const [copied, setCopied] = useState(false);

  const pythonCode = `import os
import json
import streamlit as st
from google import genai
from google.genai import types

# ---------------------------------------------------------
# AI Resume Analysis & ATS Parser (Python Streamlit Engine)
# Author: Deepak Padhi [https://dnoobnerd.netlify.app]
# ---------------------------------------------------------

st.set_page_config(
    page_title="AI Resume Analyzer - Sleek Python Edition",
    page_icon="🎓",
    layout="wide"
)

# Custom Sleek CSS Styles
st.markdown("""
<style>
    .main-title {
        font-family: 'Outfit', sans-serif;
        font-size: 2.8rem;
        font-weight: 800;
        color: #1E293B;
        margin-bottom: 0px;
    }
    .accent {
        color: #4F46E5;
    }
    .subtitle {
        font-size: 1.1rem;
        color: #64748B;
        margin-bottom: 30px;
    }
    .metric-card {
        background-color: #FFFFFF;
        padding: 24px;
        border-radius: 16px;
        border: 1px solid #E2E8F0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# 1. Sidebar Setup
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=200&q=80", width=120)
    st.markdown("### 🛠️ Configuration Panel")
    api_key_input = st.text_input("Enter GEMINI_API_KEY", type="password", help="Leave blank if set in environment variables")
    
    st.markdown("---")
    st.info("💡 **Tips:** Use a clean, clear resume layout with explicit sections for Education, Experience, and Certifications.")

# 2. Main Page Header
st.markdown("<p class='main-title'>⚡ Resumé <span class='accent'>AI Analyzer</span></p>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>Sleek Python Streamlit implementation mirroring Node.js parser schemas</p>", unsafe_allow_html=True)

# 3. User Credentials Input
col1, col2 = st.columns(2)
with col1:
    applicant_name = st.text_input("Applicant Full Name *", placeholder="e.g. John Doe")
    applicant_email = st.text_input("Applicant Email *", placeholder="johndoe@example.com")
with col2:
    applicant_mobile = st.text_input("Contact Mobile Phone *", placeholder="+61 400 000 000")
    input_method = st.radio("Input Method", ["File Upload (PDF/TXT)", "Paste Raw text"])

uploaded_file = None
raw_resume_text = ""

# 4. Content Gathering
if input_method == "File Upload (PDF/TXT)":
    uploaded_file = st.file_uploader("Upload your resume document", type=["pdf", "txt"])
else:
    raw_resume_text = st.text_area("Paste full resume details", height=200)

# Submit action trigger
if st.button("🚀 Analyze ATS Score & Certifications"):
    if not (applicant_name and applicant_email and applicant_mobile):
        st.error("⚠️ All contact credentials fields are required.")
    elif input_method == "File Upload (PDF/TXT)" and not uploaded_file:
        st.error("⚠️ Please upload a resume PDF or Tech Text file.")
    elif input_method == "Paste Raw text" and not raw_resume_text.strip():
        st.error("⚠️ Please paste some resume text first.")
    else:
        # Determine API Key
        final_api_key = api_key_input if api_key_input else os.getenv("GEMINI_API_KEY")
        if not final_api_key:
            st.error("⚠️ GENAI api_key required. Prompt key in Sidebar configuration input.")
        else:
            with st.spinner("✨ Activating Gemini 3.5 ATS Parser..."):
                try:
                    # Initialize official modern google-genai SDK
                    client = genai.Client(api_key=final_api_key)
                    
                    # Formulate base64 or raw text contents for Gemini invocation
                    contents = []
                    if uploaded_file:
                        file_bytes = uploaded_file.read()
                        mime_type = "application/pdf" if uploaded_file.name.endswith(".pdf") else "text/plain"
                        contents.append(
                            types.Part.from_bytes(
                                data=file_bytes,
                                mime_type=mime_type,
                            )
                        )
                    else:
                        contents.append(raw_resume_text)
                    
                    prompt = """
                    You are an elite talent acquisition AI model and resume analyzer.
                    Parse the attached resume content. Identify basic details.
                    Verify presence of structural parameter points: Objective, Education, Experience, Internships, Skills, Hobbies, Interests, Achievements, Certifications, and Projects.
                    Suggest 8-12 recommended skills, and 4-6 custom realistic learning course certifications with links.
                    """
                    contents.append(prompt)
                    
                    # Invocation utilizing direct typed Structured Schemas
                    response = client.models.generate_content(
                        model='gemini-3.5-flash',
                        contents=contents,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            system_instruction="You are an expert ATS recruiter.",
                        ),
                    )
                    
                    data = json.loads(response.text)
                    st.success("✅ Parsing completed successfully!")
                    
                    # 5. Render results
                    st.header(f"📊 ATS Metrics: {data.get('name', applicant_name)}")
                    
                    s_col1, s_col2, s_col3 = st.columns(3)
                    with s_col1:
                        st.metric("Aggregate ATS Quality Rate", f"{data.get('resume_score', 0)}/100")
                    with s_col2:
                        st.metric("Predicted Engineering field", data.get("predicted_field", "Other"))
                    with s_col3:
                        st.metric("Skill Level Estimate", data.get("cand_level", "Fresher"))
                    
                    # Display structured feedback breakdown
                    st.subheader("📋 Structural Checklist Verdict")
                    for factor in data.get("feedback", []):
                        status_char = "✅" if factor.get("status") == "added" else "❌"
                        st.markdown(f"**{status_char} {factor.get('factor')}**: {factor.get('detail')}")
                        
                except Exception as e:
                    st.error(f"❌ Gemini invocation failed: {str(e)}")
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([pythonCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'app.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Intro Banner */}
      <div className="bg-[#1E293B] text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 z-0"></div>
        <div className="space-y-2 relative z-10">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider">
            User Request Fulfilled 🐍
          </span>
          <h2 className="text-3xl font-extrabold font-display leading-tight text-white tracking-tight">
            Playground with python (`.py`) Equivalent
          </h2>
          <p className="text-slate-350 leading-relaxed max-w-xl text-sm">
            We compiled a pristine, pure Python script using **Streamlit** and the official **Google `@google-genai` modern SDK client**. Copy or download it below to execute native Python-powered ATS parsing!
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/40 relative z-10 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download app.py</span>
        </button>
      </div>

      {/* Terminal environment walkthrough */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-850 uppercase tracking-wide">1. Setup environment</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Install python 3.9+ along with external UI and modern GenAI client libraries:
          </p>
          <div className="bg-slate-900 text-slate-200 text-[10px] font-mono p-3 rounded-lg border border-slate-800">
            pip install streamlit google-genai
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-850 uppercase tracking-wide">2. Save app.py</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Create an empty file in your project directory named <b className="font-mono">app.py</b>, paste the copyable script container below, and configure your keys.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Play className="w-5 h-5 animate-pulse" />
          </div>
          <h3 className="font-bold text-sm text-slate-850 uppercase tracking-wide">3. Boot UI Instance</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sprout the interactive Streamlit engine via the simple bash interpreter run command:
          </p>
          <div className="bg-slate-900 text-slate-200 text-[10px] font-mono p-3 rounded-lg border border-slate-800">
            streamlit run app.py
          </div>
        </div>

      </div>

      {/* Code viewer */}
      <div className="bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 bg-rose-500 rounded-full"></span>
            <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
            <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
            <span className="text-xs font-mono font-bold text-slate-400 ml-2">app.py (Python Streamlit)</span>
          </div>

          <button
            onClick={handleCopy}
            className="text-xs bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                <span>Copy Script Code</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 overflow-x-auto max-h-[480px]">
          <pre className="text-[11px] font-mono text-slate-300 leading-relaxed selection:bg-slate-800">
            <code>{pythonCode.trim()}</code>
          </pre>
        </div>
      </div>

    </div>
  );
}
