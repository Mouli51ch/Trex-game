'use client'
import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from "@/app/components/ui/button"
import { ChevronDown, Gamepad2, Trophy, Coins, ArrowRight } from "lucide-react"
import { cn } from "@/app/lib/utils"
import { useMediaQuery } from 'react-responsive'

export default function Hero() {
    const isMobile = useMediaQuery({ maxWidth: 768 })
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 300], [1, 0])
    const y = useTransform(scrollY, [0, 300], [0, 100])

    useEffect(() => {
        if (isMobile) return // Disable parallax on mobile

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) * 0.01, // Reduced even more for better control
                y: (e.clientY - window.innerHeight / 2) * 0.01
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [isMobile])

    // Fewer shapes on mobile for better performance
    const shapes = Array.from({ length: isMobile ? 8 : 15 }).map((_, i) => ({
        size: Math.random() * (isMobile ? 20 : 30) + (isMobile ? 15 : 20),
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: i * 0.15,
        duration: 3 + Math.random() * 2,
    }))

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
                duration: 1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1.0]
            }
        }
    }

    const statsVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
                mass: 1
            }
        }
    }

    return (
        <section className="relative min-h-[100dvh] overflow-hidden">
            {/* Background shapes - reduced opacity on mobile */}
            <div className="absolute inset-0 overflow-hidden">
                {shapes.map((shape, i) => (
                    <motion.div
                        key={i}
                        className={cn(
                            "absolute rounded-full",
                            "bg-gradient-to-r from-orange-500/20 to-orange-300/10",
                            isMobile ? "opacity-50" : ""
                        )}
                        style={{
                            width: shape.size,
                            height: shape.size,
                            left: shape.left,
                            top: shape.top,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0.1, 0.2, 0.1],
                            scale: [1, 1.1, 1],
                            y: [-10, 10, -10]
                        }}
                        transition={{
                            duration: shape.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: shape.delay,
                        }}
                    />
                ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-gray-900/80 to-gray-900/90 z-10" />

            <motion.div
                className="relative z-20 container-custom min-h-[100dvh] flex flex-col justify-center items-center px-4 sm:px-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    className="text-center w-full max-w-4xl mx-auto"
                    style={isMobile ? {} : {
                        x: mousePosition.x,
                        y: mousePosition.y,
                    }}
                >
                    {/* Badge - adjusted for mobile */}
                    <motion.div
                        className="mb-6 sm:mb-8 inline-block"
                        animate={{
                            y: [-3, 3, -3],
                            scale: [1, 1.01, 1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500/20 to-orange-300/10 rounded-full backdrop-blur-sm border border-orange-500/20">
                            <span className="text-orange-400 text-sm sm:text-base font-semibold tracking-wide">
                                🎮 Web3 Gaming Reimagined
                            </span>
                        </div>
                    </motion.div>

                    {/* Title - responsive text sizes */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-2 sm:space-y-4 mb-6 sm:mb-8"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            <span className="inline-block bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
                                TrexGame:
                            </span>
                            <br />
                            <span className="inline-block text-white mt-2">
                                Unleash Your Inner Dinosaur!
                            </span>
                        </h1>
                    </motion.div>

                    {/* Description - adjusted line height and spacing */}
                    <motion.p
                        variants={itemVariants}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
                    >
                        Join the thrilling adventure of endless running and NFT evolution.
                        {!isMobile && <br />}
                        {' '}Compete, collect, and earn in the ultimate Web3 gaming experience.
                    </motion.p>

                    {/* CTA Buttons - stack on mobile */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16"
                    >
                        <Button
                            size={isMobile ? "default" : "lg"}
                            className="w-full sm:w-auto relative group h-12 sm:h-14 px-6 sm:px-8 bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            <span className="relative z-10 flex items-center text-base sm:text-lg font-medium">
                                Play Now
                                <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-orange-600"
                                initial={{ scale: 0 }}
                                whileHover={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            />
                        </Button>
                        <Button
                            size={isMobile ? "default" : "lg"}
                            variant="outline"
                            className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 text-base sm:text-lg font-medium"
                        >
                            Learn More
                        </Button>
                    </motion.div>

                    {/* Stats Grid - single column on mobile */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto px-4"
                        variants={containerVariants}
                    >
                        {[
                            { icon: Gamepad2, label: "Active Players", value: "50K+" },
                            { icon: Trophy, label: "Tournaments", value: "1000+" },
                            { icon: Coins, label: "Rewards Earned", value: "$2M+" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className={cn(
                                    "group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl overflow-hidden",
                                    "bg-gray-800/40 backdrop-blur-sm",
                                    "border border-orange-500/20",
                                    "hover:bg-gray-800/60 transition-all duration-300"
                                )}
                                variants={statsVariants}
                                whileHover={{ scale: isMobile ? 1.01 : 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="relative z-10">
                                    <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 text-orange-500 mx-auto mb-2 sm:mb-3" />
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</h3>
                                    <p className="text-sm sm:text-base text-gray-400">{stat.label}</p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll indicator - hidden on mobile */}
                {!isMobile && (
                    <motion.button
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-orange-500/80 hover:text-orange-500 transition-colors"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ opacity }}
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                    >
                        <span className="text-sm font-medium mb-2">Scroll to explore</span>
                        <ChevronDown className="w-6 h-6" />
                    </motion.button>
                )}
            </motion.div>

            <motion.div
                className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            />
        </section>
    )
}