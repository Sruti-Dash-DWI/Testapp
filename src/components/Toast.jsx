import React, { useEffect } from 'react';
import { useTheme } from './../context/ThemeContext';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
    const { theme, colors } = useTheme();

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    if (!isVisible) return null;

    const getIcon = () => {
        if (type === 'success') {
            return <CheckCircle size={20} color="#10b981" />;
        }
        return <AlertCircle size={20} color="#ef4444" />;
    };

    return (
        <div 
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up"
            style={{
                animation: 'slideUp 0.3s ease-out'
            }}
        >
            <div 
                className="flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg min-w-[300px]"
                style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                }}
            >
                {getIcon()}
                <span className="flex-grow font-medium" style={{ color: colors.text }}>
                    {message}
                </span>
                <button
                    onClick={onClose}
                    className="p-1 rounded hover:opacity-70 transition-opacity"
                    style={{ color: colors.text }}
                >
                    <X size={16} />
                </button>
            </div>
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        transform: translate(-50%, 20px);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-50%, 0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Toast;