'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './ui/button'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50"
    >
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="mb-4">
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul>
          <li className="mb-2">
            <Button variant="ghost" className="w-full justify-start">Home</Button>
          </li>
          <li className="mb-2">
            <Button variant="ghost" className="w-full justify-start">Flashcards</Button>
          </li>
          <li className="mb-2">
            <Button variant="ghost" className="w-full justify-start">Study Mode</Button>
          </li>
          <li className="mb-2">
            <Button variant="ghost" className="w-full justify-start">Settings</Button>
          </li>
        </ul>
      </div>
    </motion.div>
  )
}