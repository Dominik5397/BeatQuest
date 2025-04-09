'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-beatquest-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <LoginForm />
      </motion.div>
    </div>
  );
} 