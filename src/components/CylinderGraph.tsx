import React from 'react';

interface CylinderGraphProps {
    current: number;
    max: number;
}

export const CylinderGraph: React.FC<CylinderGraphProps> = ({ current, max }) => {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));

    // Determine color based on percentage
    const getColor = (pct: number) => {
        if (pct < 25) return 'bg-red-500';
        if (pct < 50) return 'bg-yellow-500';
        return 'bg-blue-500';
    };

    // Generate ticks from 100 down to 0 with step of 10
    const ticks = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-start gap-3 mb-2">
                {/* Cylinder Container */}
                <div className="relative w-16 h-40 bg-gray-100 border-2 border-gray-300 rounded-full overflow-hidden shadow-inner shrink-0">
                    {/* Internal Tick lines */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none">
                        {ticks.map((tick) => (
                            <div key={tick} className="w-full flex justify-center">
                                {/* Major ticks (0, 50, 100) are wider/darker, minor ticks are smaller */}
                                <div className={`h-px bg-gray-600 ${tick % 50 === 0 ? 'w-full opacity-50' : 'w-1/2 opacity-20'}`}></div>
                            </div>
                        ))}
                    </div>

                    {/* Liquid */}
                    <div className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out z-10 ${getColor(percentage)} opacity-80 h-[${percentage}%]`}>
                        {/* Surface reflection */}
                        <div className="w-full h-2 bg-white opacity-20 absolute top-0"></div>
                    </div>
                </div>
                {/* Axis Labels */}
                {/* py-[2px] compensates for the border-2 (2px) of the cylinder to align text with internal content area */}
                <div className="h-40 py-0.5 flex flex-col justify-between select-none">
                    {ticks.map((tick) => (
                        <div key={tick} className="flex items-center h-0 transform -translate-y-px">
                            <span className="text-[10px] font-mono text-gray-500 font-medium">
                                {tick}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-1">
                <span className="block text-2xl font-bold text-gray-800 leading-tight">{current} <span className="text-xs text-gray-500">m³</span></span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Volume</span>
            </div>
        </div>
    );
};