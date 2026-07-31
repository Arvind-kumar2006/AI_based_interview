import React from 'react'
import { motion } from "motion/react"
import { FaUserTie, FaBriefcase, FaFileUpload, FaMicrophoneAlt, FaChartLine } from "react-icons/fa";
import { useState } from 'react';
import axios from "axios"
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Step1SetUp({ onStart }) {
    const {userData} = useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setAnalyzing(true)
        const formdata = new FormData()
        formdata.append("resume", resumeFile)
        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true })
            console.log(result.data)
            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);
            setAnalyzing(false);
        } catch (error) {
            console.log(error)
            setAnalyzing(false);
        }
    }

    const handleStart = async () => {
        setLoading(true)
        try {
           const result = await axios.post(ServerUrl + "/api/interview/generate-questions", {role, experience, mode, resumeText, projects, skills}, {withCredentials:true})
           console.log(result.data)
           if(userData){ dispatch(setUserData({...userData, credits:result.data.creditsLeft})) }
           setLoading(false)
           onStart(result.data)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const inputStyle = {
        width: '100%', paddingLeft: '3rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem',
        background: '#0A0A12', border: '1px solid #2A2A3D', color: '#F4F4F8', borderRadius: '0.75rem',
        outline: 'none', transition: 'border-color 0.2s'
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen flex items-center justify-center px-4'
            style={{ background: '#0A0A12' }}>

            <div className='w-full max-w-6xl rounded-3xl grid md:grid-cols-2 overflow-hidden'
                style={{ background: '#161622', border: '1px solid #2A2A3D', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

                {/* Left Panel */}
                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='p-12 flex flex-col justify-center'
                    style={{ background: '#12121C', borderRight: '1px solid #2A2A3D' }}>

                    <h2 className="text-4xl font-bold mb-6" style={{ color: '#F4F4F8' }}>
                        Start Your AI Interview
                    </h2>
                    <p className="mb-10" style={{ color: '#9997B0' }}>
                        Practice real interview scenarios powered by AI.
                        Improve communication, technical skills, and confidence.
                    </p>

                    <div className='space-y-5'>
                        {[
                            { icon: <FaUserTie size={18} style={{ color: '#6366F1' }} />, text: "Choose Role & Experience" },
                            { icon: <FaMicrophoneAlt size={18} style={{ color: '#6366F1' }} />, text: "Smart Voice Interview" },
                            { icon: <FaChartLine size={18} style={{ color: '#6366F1' }} />, text: "Performance Analytics" },
                        ].map((item, index) => (
                            <motion.div key={index}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.15 }}
                                whileHover={{ scale: 1.03 }}
                                className='flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition'
                                style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
                                {item.icon}
                                <span className='font-medium' style={{ color: '#C5C3D8' }}>{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Panel */}
                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="p-12"
                    style={{ background: '#161622' }}>

                    <h2 className='text-3xl font-bold mb-8' style={{ color: '#F4F4F8' }}>Interview SetUp</h2>

                    <div className='space-y-6'>
                        <div className='relative'>
                            <FaUserTie className='absolute top-4 left-4' style={{ color: '#9997B0' }} />
                            <input type='text' placeholder='Enter role'
                                style={inputStyle}
                                onChange={(e) => setRole(e.target.value)} value={role}
                                onFocus={e => e.target.style.borderColor='#6366F1'}
                                onBlur={e => e.target.style.borderColor='#2A2A3D'} />
                        </div>

                        <div className='relative'>
                            <FaBriefcase className='absolute top-4 left-4' style={{ color: '#9997B0' }} />
                            <input type='text' placeholder='Experience (e.g. 2 years)'
                                style={inputStyle}
                                onChange={(e) => setExperience(e.target.value)} value={experience}
                                onFocus={e => e.target.style.borderColor='#6366F1'}
                                onBlur={e => e.target.style.borderColor='#2A2A3D'} />
                        </div>

                        <select value={mode} onChange={(e) => setMode(e.target.value)}
                            className='w-full py-3 px-4 rounded-xl outline-none transition'
                            style={{ background: '#0A0A12', border: '1px solid #2A2A3D', color: '#F4F4F8' }}
                            onFocus={e => e.target.style.borderColor='#6366F1'}
                            onBlur={e => e.target.style.borderColor='#2A2A3D'}>
                            <option value="Technical">Technical Interview</option>
                            <option value="HR">HR Interview</option>
                        </select>

                        {!analysisDone && (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => document.getElementById("resumeUpload").click()}
                                className='rounded-xl p-8 text-center cursor-pointer transition'
                                style={{ border: '2px dashed #2A2A3D' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor='#6366F1'}
                                onMouseLeave={e => e.currentTarget.style.borderColor='#2A2A3D'}>

                                <FaFileUpload className='text-4xl mx-auto mb-3' style={{ color: '#6366F1' }} />
                                <input type="file" accept="application/pdf" id="resumeUpload" className='hidden'
                                    onChange={(e) => setResumeFile(e.target.files[0])} />
                                <p className='font-medium' style={{ color: '#9997B0' }}>
                                    {resumeFile ? resumeFile.name : "Click to upload resume (Optional)"}
                                </p>

                                {resumeFile && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        onClick={(e) => { e.stopPropagation(); handleUploadResume() }}
                                        className='mt-4 px-5 py-2 rounded-lg font-semibold transition'
                                        style={{ background: '#6366F1', color: '#F4F4F8' }}
                                        onMouseEnter={e => e.target.style.background='#8B7CF0'}
                                        onMouseLeave={e => e.target.style.background='#6366F1'}>
                                        {analyzing ? "Analyzing..." : "Analyze Resume"}
                                    </motion.button>
                                )}
                            </motion.div>
                        )}

                        {analysisDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='rounded-xl p-5 space-y-4'
                                style={{ background: '#12121C', border: '1px solid #2A2A3D' }}>
                                <h3 className='text-lg font-semibold' style={{ color: '#F4F4F8' }}>Resume Analysis Result</h3>

                                {projects.length > 0 && (
                                    <div>
                                        <p className='font-medium mb-1' style={{ color: '#C5C3D8' }}>Projects:</p>
                                        <ul className='list-disc list-inside space-y-1' style={{ color: '#9997B0' }}>
                                            {projects.map((p, i) => <li key={i}>{p}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {skills.length > 0 && (
                                    <div>
                                        <p className='font-medium mb-1' style={{ color: '#C5C3D8' }}>Skills:</p>
                                        <div className='flex flex-wrap gap-2'>
                                            {skills.map((s, i) => (
                                                <span key={i} className='px-3 py-1 rounded-full text-sm'
                                                    style={{ background: 'rgba(99,102,241,0.12)', color: '#8B7CF0', border: '1px solid #2A2A3D' }}>
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        <motion.button
                            onClick={handleStart}
                            disabled={!role || !experience || loading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            className='w-full py-3 rounded-full text-lg font-semibold transition-all duration-200'
                            style={{
                                background: (!role || !experience || loading) ? '#2A2A3D' : '#6366F1',
                                color: (!role || !experience || loading) ? '#9997B0' : '#F4F4F8',
                                boxShadow: (!role || !experience || loading) ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
                                cursor: (!role || !experience || loading) ? 'not-allowed' : 'pointer'
                            }}>
                            {loading ? "Starting..." : "Start Interview"}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Step1SetUp
