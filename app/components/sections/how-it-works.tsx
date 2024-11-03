// components/sections/HowItWorks.tsx
'use client'
import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { UserPlus, Trophy, Gamepad, Coins, ChevronRight, Play } from 'lucide-react'
import { Button } from "@/app/components/ui/button"
import { cn } from "@/app/lib/utils"

const steps = [
    {
        step: 1,
        title: "Sign Up",
        description: "Create your account and join the TrexGame community.",
        icon: UserPlus,
        action: "Create Account",
        stats: "50K+ Players",
        gradient: "from-blue-500 to-indigo-500"
    },
    {
        step: 2,
        title: "Get Your T-Rex NFT",
        description: "Mint your unique T-Rex NFT to start your adventure.",
        icon: Trophy,
        action: "Mint NFT",
        stats: "10K+ NFTs",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        step: 3,
        title: "Join the Adventure",
        description: "Enter the game world and start running, collecting, and evolving.",
        icon: Gamepad,
        action: "Play Now",
        stats: "1M+ Games",
        gradient: "from-orange-500 to-red-500"
    },
    {
        step: 4,
        title: "Earn Rewards",
        description: "Compete, win, and earn cryptocurrency rewards for your achievements.",
        icon: Coins,
        action: "View Rewards",
        stats: "$2M+ Earned",
        gradient: "from-green-500 to-emerald-500"
    }
]

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState<number | null>(null)
    const { scrollYProgress } = useScroll()

    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.9, 1], [0, 1, 1, 0])

    return (
        <section id="how-it-works" className="relative py-24 bg-gray-900 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
                <motion.div
                    className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat"
                    style={{ y: backgroundY }}
                />
            </div>

            {/* Content container */}
            <motion.div
                className="max-w-6xl mx-auto px-4 relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.2
                        }
                    }
                }}
            >
                {/* Section header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-block mb-4"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                    >
                        <div className="bg-orange-500/10 rounded-full px-4 py-2 border border-orange-500/20">
                            <span className="text-orange-400 font-semibold">Simple Steps to Start</span>
                        </div>
                    </motion.div>
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text"
                    >
                        How to Get Started
                    </motion.h2>
                    <motion.p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Begin your journey in the TrexGame universe with these simple steps
                    </motion.p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="absolute left-[45px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500/0 via-orange-500/50 to-orange-500/0" />

                    {/* Steps list */}
                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                                onHoverStart={() => setActiveStep(index)}
                                onHoverEnd={() => setActiveStep(null)}
                            >
                                <motion.div
                                    className={cn(
                                        "flex items-start group",
                                        "transition-all duration-300",
                                        activeStep === index ? "scale-[1.02]" : ""
                                    )}
                                >
                                    {/* Step number and icon */}
                                    <motion.div
                                        className={cn(
                                            "relative flex-shrink-0 w-[90px] h-[90px] rounded-2xl mr-6",
                                            "flex items-center justify-center",
                                            "bg-gradient-to-br shadow-lg",
                                            step.gradient
                                        )}
                                        whileHover={{ scale: 1.05 }}
                                        initial={false}
                                    >
                                        <step.icon className="w-8 h-8 text-white" />
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold">{step.step}</span>
                                        </div>
                                    </motion.div>

                                    {/* Step content */}
                                    <div className="flex-1">
                                        <motion.div
                                            className={cn(
                                                "p-6 rounded-2xl",
                                                "bg-gray-800/50 backdrop-blur-sm",
                                                "border border-gray-700/50",
                                                "group-hover:bg-gray-700/50 transition-all duration-300"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                                                <span className="text-sm text-gray-400">{step.stats}</span>
                                            </div>
                                            <p className="text-gray-300 mb-4">{step.description}</p>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    className="text-orange-400 hover:text-orange-300 pl-0 hover:bg-transparent"
                                                >
                                                    {step.action} <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
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
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg group"
                    >
                        <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" /> Start Your Journey
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    )
}