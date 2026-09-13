import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface ProcessingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

export function ProcessingModal({
  isOpen,
  title = "Processing Request...",
  message = "Please wait while we save your changes",
}: ProcessingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a1512]/90 backdrop-blur-md text-white"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center p-8 bg-[#120e0c] rounded-3xl border border-[#c99335]/30 shadow-2xl"
          >
            <div className="relative w-24 h-24 mb-6">
              <Image src="/logo.png" alt="JMC Logo" fill className="object-contain" />
              <div className="absolute inset-0 border-4 border-[#c99335] border-t-transparent rounded-full animate-spin" />
            </div>
            <h2
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              {title}
            </h2>
            <p className="text-sm text-[#c99335] font-medium">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
