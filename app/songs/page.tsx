"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trash2, Plus } from "lucide-react"
import { MusicVisualizer } from "@/components/music-visualizer"
import { AdminRoute } from '@/components/auth/AdminRoute'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from '@/components/ui/use-toast'
import { SongManagement } from '@/components/songs/SongManagement'

interface Song {
  id: string
  title: string
  artist: string
  youtubeId: string
  genre: string
  difficulty: string
  createdAt: string
}

export default function SongsPage() {
  return (
    <AdminRoute>
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-2">Zarządzanie Piosenkami</h1>
        <p className="text-muted-foreground mb-8">
          Dodawaj, usuwaj i zarządzaj swoją kolekcją piosenek
        </p>
        <SongManagement />
      </div>
    </AdminRoute>
  )
}

