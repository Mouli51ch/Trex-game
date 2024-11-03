// components/layout/Header.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from "@/app/components/ui/button"
import { cn } from "@/app/lib/utils"

const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Community', href: '#community' }
]

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)

            const sections = navItems.map(item => item.href.substring(1))
            const scrollPosition = window.scrollY + 100

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const top = element.offsetTop
                    const height = element.offsetHeight
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const logoVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    }

    const navVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 }
    }

    const mobileMenuVariants = {
        hidden: { opacity: 0, x: '100%' },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        },
        exit: {
            opacity: 0,
            x: '100%',
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    }

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300",
                scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"
            )}
        >
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Left Edge */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={logoVariants}
                        className="flex-shrink-0 flex items-center"
                    >
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
                                TrexGame
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation - Center */}
                    <motion.nav
                        initial="hidden"
                        animate="visible"
                        variants={navVariants}
                        className="hidden md:flex items-center justify-center flex-1 mx-8"
                    >
                        {navItems.map((item) => (
                            <motion.div key={item.name} variants={itemVariants}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "relative px-5 py-2 text-sm font-medium transition-colors",
                                        activeSection === item.href.substring(1)
                                            ? "text-orange-500"
                                            : "text-gray-300 hover:text-orange-400"
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        document.querySelector(item.href)?.scrollIntoView({
                                            behavior: 'smooth'
                                        })
                                    }}
                                >
                                    {item.name}
                                    {activeSection === item.href.substring(1) && (
                                        <motion.div
                                            layoutId="activeSection"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.nav>

                    {/* Launch App Button - Right Edge */}
                    <div className="hidden md:flex items-center">
                        <Button
                            variant="default"
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                            onClick={() => window.open('#', '_blank')}
                        >
                            Launch App
                        </Button>
                    </div>

                    {/* Mobile Menu Button - Right Edge on Mobile */}
                    <motion.button
                        initial={false}
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        className="md:hidden relative z-10 p-2 rounded-md text-gray-300 hover:text-orange-500 hover:bg-gray-800 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={mobileMenuVariants}
                        className="fixed inset-0 z-0 bg-gray-900/95 backdrop-blur-lg md:hidden"
                    >
                        <div className="flex flex-col items-center justify-center h-full space-y-8">
                            {navItems.map((item) => (
                                <motion.div
                                    key={item.name}
                                    variants={itemVariants}
                                    className="w-full text-center"
                                >
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "text-xl font-medium transition-colors",
                                            activeSection === item.href.substring(1)
                                                ? "text-orange-500"
                                                : "text-gray-300 hover:text-orange-400"
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setIsOpen(false)
                                            document.querySelector(item.href)?.scrollIntoView({
                                                behavior: 'smooth'
                                            })
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <Button
                                variant="default"
                                size="lg"
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold mt-4"
                                onClick={() => window.open('#', '_blank')}
                            >
                                Launch App
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}