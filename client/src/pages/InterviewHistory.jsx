import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })
                setInterviews(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getMyInterviews()
    }, [])

    return (
        <div className='min-h-screen py-10' style={{ background: '#0A0A12' }}>
            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>

                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 rounded-full transition'
                        style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
                        <FaArrowLeft style={{ color: '#6366F1' }} />
                    </button>
                    <div>
                        <h1 className='text-3xl font-bold' style={{ color: '#F4F4F8' }}>Interview History</h1>
                        <p className='mt-2' style={{ color: '#9997B0' }}>Track your past interviews and performance reports</p>
                    </div>
                </div>

                {interviews.length === 0 ? (
                    <div className='p-10 rounded-2xl text-center' style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
                        <p style={{ color: '#9997B0' }}>No interviews found. Start your first interview.</p>
                    </div>
                ) : (
                    <div className='grid gap-6'>
                        {interviews.map((item, index) => (
                            <div key={index}
                                onClick={() => navigate(`/report/${item._id}`)}
                                className='p-6 rounded-2xl cursor-pointer transition-all duration-300'
                                style={{ background: '#161622', border: '1px solid #2A2A3D' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A3D'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div>
                                        <h3 className="text-lg font-semibold" style={{ color: '#F4F4F8' }}>{item.role}</h3>
                                        <p className="text-sm mt-1" style={{ color: '#9997B0' }}>{item.experience} • {item.mode}</p>
                                        <p className="text-xs mt-2" style={{ color: '#9997B0' }}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-6'>
                                        <div className="text-right">
                                            <p className="text-xl font-bold" style={{ color: '#D97706' }}>{item.finalScore || 0}/10</p>
                                            <p className="text-xs" style={{ color: '#9997B0' }}>Overall Score</p>
                                        </div>
                                        <span className='px-4 py-1 rounded-full text-xs font-medium'
                                            style={item.status === "completed"
                                                ? { background: 'rgba(99,102,241,0.12)', color: '#8B7CF0', border: '1px solid rgba(99,102,241,0.25)' }
                                                : { background: 'rgba(217,119,6,0.12)', color: '#D97706', border: '1px solid rgba(217,119,6,0.25)' }
                                            }>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default InterviewHistory
