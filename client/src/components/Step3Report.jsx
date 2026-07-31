import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function Step3Report({ report }) {
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A12' }}>
        <p className="text-lg" style={{ color: '#9997B0' }}>Loading Report...</p>
      </div>
    );
  }
  const navigate = useNavigate()
  const { finalScore = 0, confidence = 0, communication = 0, correctness = 0, questionWiseScore = [] } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({ name: `Q${index + 1}`, score: score.score || 0 }))
  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";
  if (finalScore >= 8) { performanceText = "Ready for job opportunities."; shortTagline = "Excellent clarity and structured responses."; }
  else if (finalScore >= 5) { performanceText = "Needs minor improvement before interviews."; shortTagline = "Good foundation, refine articulation."; }
  else { performanceText = "Significant improvement required."; shortTagline = "Work on clarity and confidence."; }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, { align: "center" });
    currentY += 5;
    doc.setDrawColor(34, 197, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
    currentY += 15;
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, { align: "center" });
    currentY += 30;
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);
    currentY += 45;
    let advice = "";
    if (finalScore >= 8) advice = "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    else if (finalScore >= 5) advice = "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    else advice = "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);
    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);
    currentY += 50;
    autoTable(doc, {
      startY: currentY, margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [`${i + 1}`, q.question, `${q.score}/10`, q.feedback]),
      styles: { fontSize: 9, cellPadding: 5, valign: "top" },
      headStyles: { fillColor: [99, 102, 241], textColor: 255, halign: "center" },
      columnStyles: { 0: { cellWidth: 10, halign: "center" }, 1: { cellWidth: 55 }, 2: { cellWidth: 20, halign: "center" }, 3: { cellWidth: "auto" } },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });
    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className='min-h-screen px-4 sm:px-6 lg:px-10 py-8' style={{ background: '#0A0A12' }}>
      <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='md:mb-10 w-full flex items-start gap-4 flex-wrap'>
          <button
            onClick={() => navigate("/history")}
            className='mt-1 p-3 rounded-full transition'
            style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
            <FaArrowLeft style={{ color: '#6366F1' }} />
          </button>
          <div>
            <h1 className='text-3xl font-bold' style={{ color: '#F4F4F8' }}>Interview Analytics Dashboard</h1>
            <p className='mt-2' style={{ color: '#9997B0' }}>AI-powered performance insights</p>
          </div>
        </div>
        <button
          onClick={downloadPDF}
          className='px-6 py-3 rounded-xl font-semibold text-sm sm:text-base text-nowrap transition'
          style={{ background: '#6366F1', color: '#F4F4F8', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
          onMouseEnter={e => e.currentTarget.style.background='#8B7CF0'}
          onMouseLeave={e => e.currentTarget.style.background='#6366F1'}>
          Download PDF
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
        <div className='space-y-6'>
          {/* Score circle */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center"
            style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
            <h3 className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: '#9997B0' }}>Overall Performance</h3>
            <div className='relative w-20 h-20 sm:w-25 sm:h-25 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "#6366F1",
                  textColor: "#D97706",
                  trailColor: "#2A2A3D",
                })}
              />
            </div>
            <p className="mt-3 text-xs sm:text-sm" style={{ color: '#9997B0' }}>Out of 10</p>
            <div className="mt-4">
              <p className="font-semibold text-sm sm:text-base" style={{ color: '#F4F4F8' }}>{performanceText}</p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: '#9997B0' }}>{shortTagline}</p>
            </div>
          </motion.div>

          {/* Skill bars */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className='rounded-2xl sm:rounded-3xl p-6 sm:p-8'
            style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
            <h3 className="text-base sm:text-lg font-semibold mb-6" style={{ color: '#F4F4F8' }}>Skill Evaluation</h3>
            <div className='space-y-5'>
              {skills.map((s, i) => (
                <div key={i}>
                  <div className='flex justify-between mb-2 text-sm sm:text-base'>
                    <span style={{ color: '#C5C3D8' }}>{s.label}</span>
                    <span className='font-semibold' style={{ color: '#D97706' }}>{s.value}</span>
                  </div>
                  <div className='h-2 sm:h-3 rounded-full' style={{ background: '#2A2A3D' }}>
                    <div className='h-full rounded-full transition-all duration-700'
                      style={{ width: `${s.value * 10}%`, background: 'linear-gradient(90deg, #6366F1, #8B7CF0)' }}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className='lg:col-span-2 space-y-6'>
          {/* Chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className='rounded-2xl sm:rounded-3xl p-5 sm:p-8'
            style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6" style={{ color: '#F4F4F8' }}>Performance Trend</h3>
            <div className='h-64 sm:h-72'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3D" />
                  <XAxis dataKey="name" stroke="#9997B0" />
                  <YAxis domain={[0, 10]} stroke="#9997B0" />
                  <Tooltip contentStyle={{ background: '#161622', border: '1px solid #2A2A3D', borderRadius: '8px', color: '#F4F4F8' }} />
                  <Area type="monotone" dataKey="score" stroke="#6366F1" fill="rgba(99,102,241,0.15)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Question breakdown */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className='rounded-2xl sm:rounded-3xl p-5 sm:p-8'
            style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
            <h3 className="text-base sm:text-lg font-semibold mb-6" style={{ color: '#F4F4F8' }}>Question Breakdown</h3>
            <div className='space-y-6'>
              {questionWiseScore.map((q, i) => (
                <div key={i} className='p-4 sm:p-6 rounded-xl sm:rounded-2xl' style={{ background: '#12121C', border: '1px solid #2A2A3D' }}>
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4'>
                    <div>
                      <p className="text-xs" style={{ color: '#9997B0' }}>Question {i + 1}</p>
                      <p className="font-semibold text-sm sm:text-base leading-relaxed" style={{ color: '#F4F4F8' }}>
                        {q.question || "Question not available"}
                      </p>
                    </div>
                    <div className='px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit'
                      style={{ background: 'rgba(217,119,6,0.12)', color: '#D97706', border: '1px solid rgba(217,119,6,0.2)' }}>
                      {q.score ?? 0}/10
                    </div>
                  </div>
                  <div className='p-4 rounded-lg' style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid #2A2A3D' }}>
                    <p className='text-xs font-semibold mb-1' style={{ color: '#6366F1' }}>AI Feedback</p>
                    <p className='text-sm leading-relaxed' style={{ color: '#C5C3D8' }}>
                      {q.feedback && q.feedback.trim() !== "" ? q.feedback : "No feedback available for this question."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Step3Report
