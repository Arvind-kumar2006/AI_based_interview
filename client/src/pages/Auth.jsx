import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function Auth({isModel = false}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleAuth = async () => {
        try {
            console.log("Step 1: Opening Google popup...")
            const response = await signInWithPopup(auth,provider)
            console.log("Step 2: Firebase response:", response)
            let User = response.user
            let name = User.displayName
            let email = User.email
            console.log("Step 3: Sending to backend:", { name, email })
            const result = await axios.post(ServerUrl + "/api/auth/google" , {name , email} , {withCredentials:true})
            console.log("Step 4: Backend response:", result.data)
            dispatch(setUserData(result.data))
            console.log("Step 5: Navigating to /")
            navigate('/')
        } catch (error) {
            console.error("❌ AUTH FAILED at step:", error.message)
            console.error("Full error:", error)
            dispatch(setUserData(null))
        }
    }

  return (
    <div className={`
      w-full 
      ${isModel ? "py-4" : "min-h-screen flex items-center justify-center px-6 py-20"}
    `}
    style={{ background: isModel ? 'transparent' : '#0A0A12' }}>

        <motion.div
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration:1.05}}
        className={`w-full ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}`}
        style={{ background: '#161622', border: '1px solid #2A2A3D', boxShadow: '0 25px 60px rgba(99,102,241,0.12)' }}>

            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='p-2 rounded-lg' style={{ background: '#6366F1' }}>
                    <BsRobot size={18} color="#F4F4F8"/>
                </div>
                <h2 className='font-semibold text-lg' style={{ color: '#F4F4F8' }}>InterviewIQ.AI</h2>
            </div>

            <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4' style={{ color: '#F4F4F8' }}>
                Continue with
                <span className='px-3 py-1 rounded-full inline-flex items-center gap-2 mx-1 text-base'
                    style={{ background: 'rgba(99,102,241,0.12)', color: '#8B7CF0' }}>
                    <IoSparkles size={16}/>
                    AI Smart Interview
                </span>
            </h1>

            <p className='text-center text-sm md:text-base leading-relaxed mb-8' style={{ color: '#9997B0' }}>
                Sign in to start AI-powered mock interviews,
                track your progress, and unlock detailed performance insights.
            </p>

            <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ scale: 1.03, background: '#8B7CF0' }}
            whileTap={{ scale: 0.98 }}
            className='w-full flex items-center justify-center gap-3 py-3 rounded-full font-semibold transition-all duration-200'
            style={{ background: '#6366F1', color: '#F4F4F8', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
                <FcGoogle size={20}/>
                Continue with Google
            </motion.button>
        </motion.div>
    </div>
  )
}

export default Auth
