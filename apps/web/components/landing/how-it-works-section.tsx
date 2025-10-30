'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Connect Your Accounts',
    description: 'Link all your social media platforms in seconds with our secure OAuth integration.',
    image: '🔗',
  },
  {
    number: '02',
    title: 'Create & Schedule',
    description: 'Craft engaging content and schedule posts across all platforms from one dashboard.',
    image: '📝',
  },
  {
    number: '03',
    title: 'Analyze & Grow',
    description: 'Track performance, gain insights, and optimize your strategy for better results.',
    image: '📊',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
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
            How it works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes. No credit card required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Card */}
                <div className="relative p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative">
                    {/* Number badge */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-lg mb-6">
                      {step.number}
                    </div>

                    {/* Emoji */}
                    <div className="text-6xl mb-6">{step.image}</div>

                    {/* Content */}
                    <h3 className="text-2xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>

                    {/* Check icon */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Join thousands of agencies already using SocialHub
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            <div className="text-2xl font-bold">Agency 1</div>
            <div className="text-2xl font-bold">Agency 2</div>
            <div className="text-2xl font-bold">Agency 3</div>
            <div className="text-2xl font-bold">Agency 4</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
