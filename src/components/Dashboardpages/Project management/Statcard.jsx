

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { Users, CheckCircle, FolderKanban } from 'lucide-react'; 


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

const cardStyles = {
    "Total Members": { icon: <Users size={28} />, className: "bg-blue-500/20 text-blue-800" },
    "Active Members": { icon: <CheckCircle size={28} />, className: "bg-green-500/20 text-green-800" },
    "Active Projects": { icon: <FolderKanban size={28} />, className: "bg-purple-500/20 text-purple-800" },
};

const StatCard = ({ title, value }) => {
    const styleInfo = cardStyles[title] || {};
    
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <motion.div
            className="bg-white/50 backdrop-blur-lg border border-white/30 rounded-2xl p-6 flex justify-between items-center shadow-xl transition-all duration-300"
            variants={cardVariants}
            whileHover={{ scale: 1.05, shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
        >
            <div>
                <p className="font-semibold text-gray-700 text-lg">{title}</p>
                <h2 className="text-5xl font-bold text-gray-900 mt-2">
                    <AnimatedNumber value={value} />
                </h2>
            </div>
            {styleInfo.icon && (
                <div className={`p-4 rounded-xl ${styleInfo.className}`}>
                    {styleInfo.icon}
                </div>
            )}
        </motion.div>
    );
};

export default StatCard;