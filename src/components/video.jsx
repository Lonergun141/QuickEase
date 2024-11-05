import React from 'react';
import videoBg from '../assets/video/sample.mp4';

export default function Video() {
  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden">
      <video
        src={videoBg}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-contain md:object-contain"
      />
    </div>
  );
}
