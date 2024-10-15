
import Navbar from './components/navbar';
import Video from './components/video';
import Footer from './components/footer';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-grow relative">
        <div className="relative h-screen">
          <Video />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute inset-0 flex justify-center items-center p-4 flex-col z-10">
            <h1 className="font-inc text-6xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-[250px] text-white text-center">
              QuickEase
            </h1>
            <h3 className="font-pregular text-xl sm:text-xl md:text-xl lg:text-xl xl:text-2xl text-white text-center mt-5">
              Where even procrastination takes the express route to knowledge!
            </h3>
            <Link
              to="/QuickEase-Web/SignUp"
              className="mt-9 px-6 sm:px-9 py-2 rounded-md text-lg sm:text-xl font-pregular text-white border border-white hover:bg-white hover:text-gray-800 transition duration-300 cursor-pointer">
              Join Now
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
