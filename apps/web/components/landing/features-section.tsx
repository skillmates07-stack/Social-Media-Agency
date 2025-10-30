'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  BarChart3,
  Users,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Schedule posts across all platforms with our intelligent calendar system.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Get detailed insights into your social media performance and audience engagement.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together with your team, assign tasks, and manage permissions easily.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience blazing-fast performance with our optimized infrastructure.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with SOC 2 compliance and end-to-end encryption.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Globe,
    title: 'Multi-Platform',
    description: 'Connect and manage all your social accounts from one powerful dashboard.',
    color: 'from-pink-500 to-rose-500',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you manage, analyze, and grow your social media presence.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
