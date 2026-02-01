'use client';

import { useEffect, useState } from 'react';

export default function StarField() {
    const [stars, setStars] = useState<{ id: number; top: number; left: number; delay: number; duration: number; size: number }[]>([]);
    const [shootingStars, setShootingStars] = useState<{ id: number; top: number; left: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate random stars on client side
        const newStars = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 2 + Math.random() * 4,
            size: Math.random() > 0.8 ? 2 : 1, // 20% chances of being a big star
        }));
        setStars(newStars);

        // Generate shooting stars
        const newShootingStars = Array.from({ length: 3 }).map((_, i) => ({
            id: i,
            top: Math.random() * 50, // Start from top half
            left: 50 + Math.random() * 50, // Start from right half
            delay: Math.random() * 10,
        }));
        setShootingStars(newShootingStars);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[#0B0C15] bg-[radial-gradient(circle_at_50%_0%,_#2e1065_0%,_#0B0C15_60%)]" />

            {/* Stars */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className={`absolute rounded-full animate-twinkle bg-white ${star.size === 2 ? 'opacity-80 shadow-[0_0_4px_rgba(255,255,255,0.8)]' : 'opacity-60'}`}
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                    }}
                />
            ))}

            {/* Shooting Stars */}
            {shootingStars.map((star) => (
                <div
                    key={star.id}
                    className="absolute w-[100px] h-[1px] bg-gradient-to-l from-transparent via-white to-transparent animate-shooting-star opacity-0"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        animationDelay: `${star.delay}s`,
                    }}
                />
            ))}

            {/* Ambient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
    );
}
