// components/sections/Community.tsx
'use client'
import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
    Twitter,
    Instagram,
    // Discord,
    Youtube,
    Users,
    MessageCircle,
    Globe,
    Trophy,
    ArrowRight
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import Link from 'next/link'
import { cn } from "@/app/lib/utils"

const socialLinks = [
    // {
    //     name: 'Discord',
    //     icon: Discord,
    //     url: '#',
    //     members: '50K+',
    //     gradient: 'from-indigo-500 to-purple-500',
    //     description: 'Join our thriving Discord community'
    // },
    {
        name: 'Twitter',
        icon: Twitter,
        url: '#',
        members: '100K+',
        gradient: 'from-blue-400 to-blue-600',
        description: 'Follow us for the latest updates'
    },
    {
        name: 'Instagram',
        icon: Instagram,
        url: '#',
        members: '75K+',
        gradient: 'from-pink-500 to-rose-500',
        description: 'Check out game highlights & events'
    },
    {
        name: 'YouTube',
        icon: Youtube,
        url: '#',
        members: '200K+',
        gradient: 'from-red-500 to-red-600',
        description: 'Watch gameplay videos & tutorials'
    }
]

const communityStats = [
    { icon: Users, value: '250K+', label: 'Active Players' },
    { icon: MessageCircle, value: '1M+', label: 'Daily Messages' },
    { icon: Globe, value: '180+', label: 'Countries' },
    { icon: Trophy, value: '50K+', label: 'Tournament Players' }
]

export default function Community() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const { scrollYProgress } = useScroll()

    const y = useTransform(scrollYProgress, [0, 1], [0, -50])
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.9, 1], [0, 1, 1, 0])

    return (
        <section id="community" className="relative py-24 bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                        y
                    }}
                />
            </div>

            {/* Content container */}
            <motion.div
                className="relative z-10 max-w-6xl mx-auto px-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.2 } }
                }}
            >
                {/* Section header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-block mb-4"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                    >
                        <div className="bg-orange-500/10 rounded-full px-4 py-2 border border-orange-500/20">
                            <span className="text-orange-400 font-semibold">Join Our Community</span>
                        </div>
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text"
                    >
                        Connect with TrexGame Players
                    </motion.h2>
                    <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Join our vibrant community of players, share strategies, and stay updated on the latest TrexGame news!
                    </motion.p>
                </motion.div>

                {/* Community stats */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {communityStats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <stat.icon className="w-8 h-8 text-orange-500 mb-4" />
                            <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
                            <p className="text-gray-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Social links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {socialLinks.map((platform, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onHoverStart={() => setHoveredCard(index)}
                            onHoverEnd={() => setHoveredCard(null)}
                            className={cn(
                                "group relative p-6 rounded-2xl overflow-hidden",
                                "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50",
                                "hover:bg-gray-700/50 transition-all duration-500"
                            )}
                        >
                            {/* Background gradient */}
                            <div className={cn(
                                "absolute inset-0 opacity-0 group-hover:opacity-10",
                                "transition-opacity duration-500 bg-gradient-to-r",
                                platform.gradient
                            )} />

                            {/* Icon */}
                            <motion.div
                                className="mb-4"
                                animate={hoveredCard === index ? { scale: 1.1 } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <platform.icon className="w-8 h-8 text-white" />
                            </motion.div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-white mb-2">{platform.name}</h3>
                            <p className="text-gray-400 mb-4">{platform.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">{platform.members} members</span>
                                <Link href={platform.url}>
                                    <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300">
                                        Join <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter signup */}
                <motion.div
                    className="text-center bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl p-8 border border-orange-500/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-2xl font-bold text-white mb-4">Stay in the Loop</h3>
                    <p className="text-gray-300 mb-6">Subscribe to our newsletter for exclusive updates and rewards</p>
                    <div className="flex max-w-md mx-auto gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 bg-gray-900/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                        />
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                            Subscribe
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}