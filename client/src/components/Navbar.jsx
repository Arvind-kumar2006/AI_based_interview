import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

function Navbar() {
    const {userData} = useSelector((state)=>state.user)
    const [showCreditPopup,setShowCreditPopup] = useState(false)
    const [showUserPopup,setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout" , {withCredentials:true})
            dispatch(setUserData(null))
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='flex justify-center px-4 pt-6' style={{ background: '#0A0A12' }}>
        <motion.div
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration: 0.3}}
        className='w-full max-w-6xl rounded-[24px] px-8 py-4 flex justify-between items-center relative'
        style={{ background: '#12121C', border: '1px solid #2A2A3D', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>

            <div className='flex items-center gap-3 cursor-pointer'>
                <div className='p-2 rounded-lg' style={{ background: '#6366F1' }}>
                    <BsRobot size={18} color="#F4F4F8"/>
                </div>
                <h1 className='font-semibold hidden md:block text-lg' style={{ color: '#F4F4F8' }}>InterviewIQ.AI</h1>
            </div>

            <div className='flex items-center gap-6 relative'>
                <div className='relative'>
                    <button
                    onClick={()=>{
                        if(!userData){ setShowAuth(true); return; }
                        setShowCreditPopup(!showCreditPopup);
                        setShowUserPopup(false)
                    }}
                    className='flex items-center gap-2 px-4 py-2 rounded-full text-md transition'
                    style={{ background: '#161622', color: '#D97706', border: '1px solid rgba(217,119,6,0.2)' }}>
                        <BsCoin size={20}/>
                        {userData?.credits || 0}
                    </button>

                    {showCreditPopup && (
                        <div className='absolute right-[-50px] mt-3 w-64 rounded-xl p-5 z-50'
                            style={{ background: '#161622', border: '1px solid #2A2A3D', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                            <p className='text-sm mb-4' style={{ color: '#9997B0' }}>Need more credits to continue interviews?</p>
                            <button
                            onClick={()=>navigate("/pricing")}
                            className='w-full py-2 rounded-lg text-sm font-semibold transition'
                            style={{ background: '#6366F1', color: '#F4F4F8' }}
                            onMouseEnter={e => e.target.style.background='#8B7CF0'}
                            onMouseLeave={e => e.target.style.background='#6366F1'}>
                                Buy more credits
                            </button>
                        </div>
                    )}
                </div>

                <div className='relative'>
                    <button
                    onClick={()=>{
                        if(!userData){ setShowAuth(true); return; }
                        setShowUserPopup(!showUserPopup);
                        setShowCreditPopup(false)
                    }}
                    className='w-9 h-9 rounded-full flex items-center justify-center font-semibold'
                    style={{ background: '#6366F1', color: '#F4F4F8', boxShadow: '0 2px 12px rgba(99,102,241,0.4)' }}>
                        {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={16}/>}
                    </button>

                    {showUserPopup && (
                        <div className='absolute right-0 mt-3 w-48 rounded-xl p-4 z-50'
                            style={{ background: '#161622', border: '1px solid #2A2A3D', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                            <p className='text-md font-medium mb-1' style={{ color: '#8B7CF0' }}>{userData?.name}</p>
                            <button
                            onClick={()=>navigate("/history")}
                            className='w-full text-left text-sm py-2 transition'
                            style={{ color: '#9997B0' }}
                            onMouseEnter={e => e.target.style.color='#F4F4F8'}
                            onMouseLeave={e => e.target.style.color='#9997B0'}>
                                Interview History
                            </button>
                            <button
                            onClick={handleLogout}
                            className='w-full text-left text-sm py-2 flex items-center gap-2'
                            style={{ color: '#f87171' }}>
                                <HiOutlineLogout size={16}/>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>

        {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}
    </div>
  )
}

export default Navbar
