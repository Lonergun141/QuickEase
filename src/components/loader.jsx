import React from 'react';
import { img } from '../constants';

export default function LoadingScreen() {
	return (
		<div className="fixed inset-0 flex flex-col items-center justify-center bg-[#060321] z-50 p-4">
			<div className="text-white text-xl sm:text-2xl md:text-3xl font-inc mb-8">QuickEase</div>
			<div className="w-full max-w-xs sm:max-w-sm md:max-w-xs">
				<img src={img.Loader} alt="loading animation" className="w-full" />
			</div>
			<p className="text-white text-center mt-8 max-w-md text-sm sm:text-base md:text-sm font-pregular">
				Hold tight! Quickie is diving into your text, images, and documents, whipping up a smart summary just for you.
				Almost done - your highlights are on the way!
			</p>
		</div>
	);
}
