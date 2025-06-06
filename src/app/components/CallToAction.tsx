'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const CallToAction = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Glassmorphism background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#b85a00]/10 via-transparent to-[#b85a00]/5"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#b85a00]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#b85a00]/15 rounded-full blur-3xl"></div>
          <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to bring your vision to life?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Let's collaborate to create something extraordinary. Our team is ready to help you transform your ideas into reality.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-[#b85a00] text-white rounded-lg hover:bg-[#a04d00] transition-colors font-medium"
              >
                Get in Touch
              </Link>
              <Link
                href="/projects"
                className="px-8 py-3 bg-transparent border border-[#b85a00]/50 text-white rounded-lg hover:bg-[#b85a00]/10 transition-colors font-medium"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction; 