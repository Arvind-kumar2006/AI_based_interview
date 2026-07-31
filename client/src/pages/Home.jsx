import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';

function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex flex-col' style={{ background: '#0A0A12' }}>
      <Navbar />

      <div className='flex-1 px-6 py-20'>
        <div className='max-w-6xl mx-auto'>

          {/* Badge */}
          <div className='flex justify-center mb-6'>
            <div className='text-sm px-4 py-2 rounded-full flex items-center gap-2'
              style={{ background: 'rgba(99,102,241,0.10)', color: '#8B7CF0', border: '1px solid rgba(99,102,241,0.18)' }}>
              <HiSparkles size={16} style={{ color: '#D97706' }} />
              AI Powered Smart Interview Platform
            </div>
          </div>

          {/* Hero */}
          <div className='text-center mb-28'>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto'
              style={{ color: '#F4F4F8' }}>
              Practice Interviews with
              <span className='px-5 py-1 rounded-full mx-2 inline-block'
                style={{ background: '#6366F1', color: '#F4F4F8' }}>
                AI Intelligence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='mt-6 max-w-2xl mx-auto text-lg'
              style={{ color: '#9997B0' }}>
              Role-based mock interviews with smart follow-ups,
              adaptive difficulty and real-time performance evaluation.
            </motion.p>

            <div className='flex flex-wrap justify-center gap-4 mt-10'>
              <motion.button
                onClick={() => { if (!userData) { setShowAuth(true); return; } navigate("/interview") }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className='px-10 py-3 rounded-full font-semibold transition-all'
                style={{ background: '#6366F1', color: '#F4F4F8', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}
                onMouseEnter={e => e.currentTarget.style.background='#8B7CF0'}
                onMouseLeave={e => e.currentTarget.style.background='#6366F1'}>
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => { if (!userData) { setShowAuth(true); return; } navigate("/history") }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className='px-10 py-3 rounded-full transition-all'
                style={{ border: '1px solid #2A2A3D', color: '#9997B0' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#6366F1'; e.currentTarget.style.color='#F4F4F8'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#2A2A3D'; e.currentTarget.style.color='#9997B0'; }}>
                View History
              </motion.button>
            </div>
          </div>

          {/* Step Cards */}
          <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28'>
            {[
              { icon: <BsRobot size={24} />, step: "STEP 1", title: "Role & Experience Selection", desc: "AI adjusts difficulty based on selected job role." },
              { icon: <BsMic size={24} />, step: "STEP 2", title: "Smart Voice Interview", desc: "Dynamic follow-up questions based on your answers." },
              { icon: <BsClock size={24} />, step: "STEP 3", title: "Timer Based Simulation", desc: "Real interview pressure with time tracking." }
            ].map((item, index) => (
              <motion.div key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ rotate: 0, scale: 1.06 }}
                className={`relative p-10 w-80 max-w-[90%] rounded-3xl transition-all duration-300
                  ${index === 0 ? "rotate-[-4deg]" : ""}
                  ${index === 1 ? "rotate-[3deg] md:-mt-6" : ""}
                  ${index === 2 ? "rotate-[-3deg]" : ""}
                `}
                style={{ background: '#161622', border: '1px solid #2A2A3D', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>

                <div className='absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl flex items-center justify-center'
                  style={{ background: '#161622', border: '2px solid #6366F1', color: '#6366F1', boxShadow: '0 4px 16px rgba(99,102,241,0.25)' }}>
                  {item.icon}
                </div>
                <div className='pt-10 text-center'>
                  <div className='text-xs font-semibold mb-2 tracking-wider' style={{ color: '#D97706' }}>{item.step}</div>
                  <h3 className='font-semibold mb-3 text-lg' style={{ color: '#F4F4F8' }}>{item.title}</h3>
                  <p className='text-sm leading-relaxed' style={{ color: '#9997B0' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Capabilities */}
          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl font-semibold text-center mb-16'
              style={{ color: '#F4F4F8' }}>
              Advanced AI{" "}
              <span style={{ color: '#6366F1' }}>Capabilities</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {[
                { image: evalImg, icon: <BsBarChart size={20} />, title: "AI Answer Evaluation", desc: "Scores communication, technical accuracy and confidence." },
                { image: resumeImg, icon: <BsFileEarmarkText size={20} />, title: "Resume Based Interview", desc: "Project-specific questions based on uploaded resume." },
                { image: pdfImg, icon: <BsFileEarmarkText size={20} />, title: "Downloadable PDF Report", desc: "Detailed strengths, weaknesses and improvement insights." },
                { image: analyticsImg, icon: <BsBarChart size={20} />, title: "History & Analytics", desc: "Track progress with performance graphs and topic analysis." }
              ].map((item, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className='rounded-3xl p-8 transition-all'
                  style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
                  <div className='flex flex-col md:flex-row items-center gap-8'>
                    <div className='w-full md:w-1/2 flex justify-center'>
                      <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-64' />
                    </div>
                    <div className='w-full md:w-1/2'>
                      <div className='w-12 h-12 rounded-xl flex items-center justify-center mb-6'
                        style={{ background: 'rgba(99,102,241,0.12)', color: '#6366F1', border: '1px solid #2A2A3D' }}>
                        {item.icon}
                      </div>
                      <h3 className='font-semibold mb-3 text-xl' style={{ color: '#F4F4F8' }}>{item.title}</h3>
                      <p className='text-sm leading-relaxed' style={{ color: '#9997B0' }}>{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interview Modes */}
          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl font-semibold text-center mb-16'
              style={{ color: '#F4F4F8' }}>
              Multiple Interview{" "}
              <span style={{ color: '#6366F1' }}>Modes</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {[
                { img: hrImg, title: "HR Interview Mode", desc: "Behavioral and communication based evaluation." },
                { img: techImg, title: "Technical Mode", desc: "Deep technical questioning based on selected role." },
                { img: confidenceImg, title: "Confidence Detection", desc: "Basic tone and voice analysis insights." },
                { img: creditImg, title: "Credits System", desc: "Unlock premium interview sessions easily." }
              ].map((mode, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className='rounded-3xl p-8 transition-all'
                  style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
                  <div className='flex items-center justify-between gap-6'>
                    <div className="w-1/2">
                      <h3 className="font-semibold text-xl mb-3" style={{ color: '#F4F4F8' }}>{mode.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#9997B0' }}>{mode.desc}</p>
                    </div>
                    <div className="w-1/2 flex justify-end">
                      <img src={mode.img} alt={mode.title} className="w-28 h-28 object-contain" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer/>
    </div>
  )
}

export default Home
