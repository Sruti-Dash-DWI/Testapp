import React, { useEffect, useRef } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { Users, CheckCircle, FolderKanban, Building2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

// --- Animated Number Component ---
const AnimatedNumber = ({ value }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const spring = useSpring(0, {
        damping: 30,
        stiffness: 100,
    });

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [isInView, value, spring]);

    useEffect(() => {
        return spring.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest).toLocaleString();
            }
        });
    }, [spring]);

    return <span ref={ref}>0</span>;
};

// --- Style Configuration ---
// FIXED: Added explicit 'lineColor' so Tailwind detects the classes
const cardStyles = {
    "Total Members": { 
        icon: Users, 
        color: "text-blue-600", 
        bg: "bg-blue-50",
        lineColor: "bg-blue-600" 
    },
    "Active Members": { 
        icon: CheckCircle, 
        color: "text-emerald-600", 
        bg: "bg-emerald-50",
        lineColor: "bg-emerald-600" 
    },
    "Active Projects": { 
        icon: FolderKanban, 
        color: "text-violet-600", 
        bg: "bg-violet-50",
        lineColor: "bg-violet-600" 
    },
    "Total Organizations": {
        icon: Building2, 
        color: "text-orange-600", 
        bg: "bg-orange-50",
        lineColor: "bg-orange-600" 
    }
};

const Sastatcard = ({ title, value }) => {
    const { colors, isDarkMode } = useTheme();
    
    // Default fallback style
    const styleInfo = cardStyles[title] || { 
        icon: Users, 
        color: "text-gray-600", 
        bg: "bg-gray-50",
        lineColor: "bg-gray-600"
    };
    
    const Icon = styleInfo.icon;

    return (
        <motion.div
            className="group relative overflow-hidden rounded-2xl border transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            style={{
                backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.6)" : "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(12px)",
                borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.6)",
                boxShadow: isDarkMode 
                    ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" 
                    : "0 4px 20px -2px rgba(0, 0, 0, 0.05)"
            }}
        >
            <div className="p-6 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium tracking-wide opacity-70" style={{ color: colors.text }}>
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h2 className="text-4xl font-bold tracking-tight" style={{ color: colors.text }}>
                            <AnimatedNumber value={value} />
                        </h2>
                    </div>
                </div>

                <div className={`p-3.5 rounded-xl ${styleInfo.bg} ${styleInfo.color} shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={24} strokeWidth={2} />
                </div>
            </div>

            {/* Bottom Accent Line - Uses the explicit lineColor class */}
            <div className={`absolute bottom-0 left-0 h-1 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${styleInfo.lineColor}`} />
        </motion.div>
    );
};

export default Sastatcard;