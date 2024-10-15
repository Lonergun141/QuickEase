import { useState, useRef } from 'react';

function Tooltip({ title, description, children }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef(null);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <div
            className="relative flex flex-col items-center group"
            ref={tooltipRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div>{children}</div>
            {showTooltip && (
                <div className="absolute bottom-full mb-2 w-40 flex flex-col items-center justify-center p-3 bg-white text-black text-xs rounded-md shadow-lg transition-all duration-300 ease-in-out z-20">
                    <div className="text-center">
                        <h1 className="font-bold text-sm mb-1">{title}</h1>
                        <p>{description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tooltip;
