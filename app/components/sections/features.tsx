// components/sections/Features.tsx
'use client'
import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Gamepad2, Dna, Gem, Trophy, Coins, Laptop, ArrowRight } from 'lucide-react'
import { Button } from "@/app/components/ui/button"
import { cn } from "@/app/lib/utils"

const features = [
    {
        title: "Endless Running Gameplay",
        description: "Experience the thrill of non-stop action as you navigate through challenging obstacles and terrains.",
        icon: Gamepad2,
        stats: { value: "1M+", label: "Players" },
        gradient: "from-blue-500 to-indigo-500"
    },
    {
        title: "NFT Evolution",
        description: "Watch your T-Rex grow and evolve as you progress, with unique NFT skins and abilities.",
        icon: Dna,
        stats: { value: "10K+", label: "NFTs Minted" },
        gradient: "from-purple-500 to-pink-500"
    },
    {
        title: "Collectibles and Power-ups",
        description: "Discover rare items and power-ups to enhance your gameplay and boost your scores.",
        icon: Gem,
        stats: { value: "500+", label: "Unique Items" },
        gradient: "from-emerald-500 to-teal-500"
    },
    {
        title: "Multiplayer Competition",
        description: "Compete against players worldwide in exciting tournaments and leaderboards.",
        icon: Trophy,
        stats: { value: "100+", label: "Daily Tournaments" },
        gradient: "from-amber-500 to-orange-500"
    },
    {
        title: "Play-to-Earn Rewards",
        description: "Earn cryptocurrency rewards for your achievements and contributions to the TrexGame ecosystem.",
        icon: Coins,
        stats: { value: "$2M+", label: "Rewards Paid" },
        gradient: "from-red-500 to-rose-500"
    },
    {
        title: "Cross-Platform Play",
        description: "Enjoy seamless gaming experience across desktop and mobile devices.",
        icon: Laptop,
        stats: { value: "3+", label: "Platforms" },
        gradient: "from-cyan-500 to-blue-500"
    }
]

export default function Features() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const { scrollYProgress } = useScroll()

    const y = useTransform(scrollYProgress, [0, 1], [0, -50])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])

    return (
        <section id="features" className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
            {/* Animated background pattern */}
            <div className="absolute inset-0 -z-10">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                        y
                    }}
                />
            </div>

            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
            >
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text"
                    >
                        Why Play TrexGame?
                    </motion.h2>
                    <motion.p
                        className="text-gray-400 text-lg max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Discover a revolutionary gaming experience that combines thrilling gameplay with blockchain technology
                    </motion.p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onHoverStart={() => setHoveredIndex(index)}
                            onHoverEnd={() => setHoveredIndex(null)}
                            className={cn(
                                "group relative p-8 rounded-2xl overflow-hidden",
                                "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50",
                                "hover:bg-gray-700/50 transition-all duration-500"
                            )}
                        >
                            {/* Background Gradient */}
                            <div className={cn(
                                "absolute inset-0 opacity-0 group-hover:opacity-10",
                                "transition-opacity duration-500 bg-gradient-to-r",
                                feature.gradient
                            )} />

                            {/* Icon */}
                            <motion.div
                                className="relative mb-6"
                                initial={false}
                                animate={hoveredIndex === index ? { scale: 1.1 } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center",
                                    "bg-gradient-to-r",
                                    feature.gradient
                                )}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                            </motion.div>

                            {/* Content */}
                            <motion.h3
                                className="text-xl font-semibold mb-3 text-white"
                                initial={false}
                                animate={hoveredIndex === index ? { x: 10 } : { x: 0 }}
                            >
                                {feature.title}
                            </motion.h3>

                            <motion.p
                                className="text-gray-300 mb-4"
                                initial={false}
                                animate={hoveredIndex === index ? { opacity: 0.8 } : { opacity: 0.6 }}
                            >
                                {feature.description}
                            </motion.p>

                            {/* Stats */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700/50">
                                <div>
                                    <p className="font-semibold text-white">{feature.stats.value}</p>
                                    <p className="text-sm text-gray-400">{feature.stats.label}</p>
                                </div>
                                <motion.div
                                    initial={false}
                                    animate={hoveredIndex === index ? { x: 0, opacity: 1 } : { x: 10, opacity: 0 }}
                                >
                                    <Button variant="ghost" size="icon" className="text-orange-500 hover:text-orange-400">
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Button
                        size="lg"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        Start Playing Now
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    )
}