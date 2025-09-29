"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface StatItemProps {
    number: string;
    description: string;
}

function StatItem({ number, description }: StatItemProps) {
    const targetNumber = parseInt(number.replace(/\D/g, "")); // e.g., 350 from "350+"
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {
        if (!inView) return;

        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentCount = Math.floor(progress * targetNumber);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [inView, targetNumber]);

    return (
        <div className="text-center p-6" ref={ref}>
            <div className="text-5xl md:text-6xl font-black tracking-tight text-white mb-3">
                {count}
                {/\+$/.test(number) && "+"}
            </div>
            <p className="text-gray-300 text-base md:text-lg font-medium leading-relaxed">{description}</p>
        </div>
    );
}

export default function StatisticsSection() {
    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-12">
                        Our Impact
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    <StatItem
                        number="350+"
                        description="passionate attendees"
                    />
                    <StatItem
                        number="12+"
                        description="industry-leading speakers"
                    />
                    <StatItem
                        number="600+"
                        description="hackers selected from 2200+ applicants"
                    />
                    <StatItem
                        number="100+"
                        description="universities represented"
                    />
                    <StatItem
                        number="25+"
                        description="countries worldwide"
                    />
                    <StatItem
                        number="160+"
                        description="AI projects for human empowerment"
                    />
                </div>
            </div>
        </section>
    );
}