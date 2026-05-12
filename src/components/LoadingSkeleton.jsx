/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-xl font-black text-slate-900 tracking-[0.3em] uppercase"
      >
        DevChill<span className="text-red-600">.</span>
      </motion.div>
      <div className="w-32 h-px bg-slate-100 mt-4 relative overflow-hidden">
        <motion.div
          animate={{ x: [-128, 128] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-full bg-red-600 absolute"
        />
      </div>
    </div>
  );
}
