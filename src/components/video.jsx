import React from 'react'
import videoBg from '../assets/video/sample.mp4'

export default function Video() {
  return (
    <div className='fixed top-0 left-0 w-full h-full overflow-hidden z-[-1]'>
      <video 
        src={videoBg} 
        autoPlay 
        loop 
        muted 
        playsInline
        className='absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover'
      />
    </div>
  )
}