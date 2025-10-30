'use client';

import { motion } from 'framer-motion';
import { Link2, Edit3, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Connect Accounts',
    description: 'Securely link all your social media platforms with one-click OAuth authentication.',
    icon: Link2,
  },
  {
    number: '02',
    title: 'Create Content',
    description: 'Design and schedule posts across multiple platforms from a unified dashboard.',
    icon: Edit3,
  },
  {
    number: '03',
    title: 'Analyze Performance',
    description: 'Track metrics, gain insights, and optimize your strategy with real-time analytics.',
    icon: TrendingUp,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-32 relative bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get started in minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple onboarding process with no technical expertise required
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connection line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent -translate-x-1/2" />
                )}

                {/* Card */}
                <div className="relative">
                  {/* Icon container */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Step number */}
                  <div className="text-sm font-mono text-muted-foreground mb-3">
                    {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
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
