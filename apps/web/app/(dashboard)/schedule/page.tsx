'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function SchedulePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">Schedule</h1>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
        <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600" />
        <p className="text-gray-400">Calendar view coming soon...</p>
      </div>
    </motion.div>
  );
}
