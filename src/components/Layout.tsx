import { motion } from 'framer-motion';

export const Section = ({ children, id, className = "" }: { children: React.ReactNode, id?: string, className?: string }) => (
  <section id={id} className={`min-h-screen w-full flex flex-col justify-center px-6 md:px-20 py-20 ${className}`}>
    {children}
  </section>
);

export const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);
