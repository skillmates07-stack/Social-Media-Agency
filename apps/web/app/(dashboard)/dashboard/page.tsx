'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth-store';
import {
  TrendingUp,
  Users,
  FileText,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Posts',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Scheduled',
    value: '48',
    change: '+4.2%',
    trend: 'up',
    icon: Calendar,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Total Reach',
    value: '45.2K',
    change: '+18.3%',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Engagement',
    value: '3.8K',
    change: '-2.4%',
    trend: 'down',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
  },
];

const recentPosts = [
  {
    id: '1',
    content: 'Exciting news! Our new product launch is live 🚀',
    platform: 'Twitter',
    engagement: 1234,
    scheduled: '2024-01-15 10:00 AM',
  },
  {
    id: '2',
    content: 'Behind the scenes of our latest campaign',
    platform: 'Instagram',
    engagement: 2345,
    scheduled: '2024-01-15 2:00 PM',
  },
  {
    id: '3',
    content: 'Join us for our live Q&A session tomorrow!',
    platform: 'Facebook',
    engagement: 987,
    scheduled: '2024-01-16 11:00 AM',
  },
];

export default function DashboardPage() {
  const { agency } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {agency?.name || 'there'}! 👋
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your social media accounts today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl transition-all hover:border-slate-700"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-10 from-white to-transparent" />

              <div className="relative">
                {/* Icon */}
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Stats */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <div className="flex items-end justify-between">
                    <motion.h3
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                      className="text-3xl font-bold text-white"
                    >
                      {stat.value}
                    </motion.h3>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Posts</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-800/30 p-4 transition-all hover:border-slate-700 hover:bg-slate-800/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-white line-clamp-1">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{post.platform}</span>
                    <span>•</span>
                    <span>{post.engagement} engagements</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Engagement Overview</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const height = Math.random() * 100 + 20;
              return (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-12 text-sm text-gray-400">{day}</span>
                  <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${height}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
                    />
                  </div>
                  <span className="w-12 text-right text-sm text-white">
                    {Math.round(height)}%
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
