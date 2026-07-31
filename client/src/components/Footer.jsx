import React from 'react'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <div className='flex justify-center px-4 pb-10 py-4 pt-10' style={{ background: '#0A0A12' }}>
      <div className='w-full max-w-6xl rounded-[24px] py-8 px-3 text-center'
        style={{ background: '#161622', border: '1px solid #2A2A3D' }}>
        <div className='flex justify-center items-center gap-3 mb-3'>
            <div className='p-2 rounded-lg' style={{ background: '#6366F1' }}>
              <BsRobot size={16} color="#F4F4F8"/>
            </div>
            <h2 className='font-semibold' style={{ color: '#F4F4F8' }}>InterviewIQ.AI</h2>
        </div>
        <p className='text-sm max-w-xl mx-auto' style={{ color: '#9997B0' }}>
          AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>
      </div>
    </div>
  )
}

export default Footer
