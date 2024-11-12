import React from 'react';
import videoBg from '../assets/video/sample.mp4';

export default function Video() {
  return (
    <div className="relative w-full aspect-video max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={videoBg} type="video/mp4" />
      </video>
      
      {/* Video Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark/20"></div>
    </div>
  );
}
