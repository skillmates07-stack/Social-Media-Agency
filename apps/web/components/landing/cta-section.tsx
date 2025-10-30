'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-secondary/30">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-8 py-16"
        >
          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              Ready to streamline your
              <br />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                social media workflow?
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of agencies using SocialHub to save time and grow their reach
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button 
                size="lg" 
                className="h-14 px-10 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 group"
              >
                Start free trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-base font-semibold"
              >
                Sign in
              </Button>
            </Link>
          </div>

          {/* Subtext */}
          <p className="text-sm text-muted-foreground pt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
