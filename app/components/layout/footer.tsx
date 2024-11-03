'use client'
import { useState } from 'react'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { ChevronRight, Twitter, Github, Instagram } from "lucide-react"
import Link from "next/link"
// import { cn } from "@/lib/utils"

export default function Footer() {
    const [email, setEmail] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Email submitted:', email)
        setEmail('')
    }

    const footerLinks = {
        company: [
            { label: 'About Us', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Contact', href: '#' },
            { label: 'Blog', href: '#' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Cookie Policy', href: '#' },
            { label: 'Disclaimers', href: '#' },
        ],
        resources: [
            { label: 'Documentation', href: '#' },
            { label: 'Help Center', href: '#' },
            { label: 'Community', href: '#' },
            { label: 'Roadmap', href: '#' },
        ],
    }

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        // { icon: Discord, href: '#', label: 'Discord' },
        { icon: Github, href: '#', label: 'Github' },
        { icon: Instagram, href: '#', label: 'Instagram' },
    ]

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main footer content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
                    {/* Brand and newsletter section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <Link href="/" className="inline-block">
                                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
                                    TrexGame
                                </span>
                            </Link>
                            <p className="text-sm text-gray-400">
                                Join the ultimate Web3 gaming experience. Compete, collect, and earn in our thrilling dinosaur adventure.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-300">Stay updated</p>
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex-1 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
                                />
                                <Button
                                    type="submit"
                                    className="bg-orange-500 hover:bg-orange-600 text-white transition-colors w-full sm:w-auto"
                                >
                                    Subscribe
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Links sections */}
                    {Object.entries(footerLinks).map(([category, links], idx) => (
                        <div key={category} className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                                {category}
                            </h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-300 hover:text-orange-500 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        {/* Copyright */}
                        <div className="text-sm text-gray-400">
                            © {new Date().getFullYear()} TrexGame. All rights reserved.
                        </div>

                        {/* Social links */}
                        <div className="flex items-center space-x-4">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="text-gray-400 hover:text-orange-500 transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}