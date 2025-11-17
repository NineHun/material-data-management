import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function FallingLeaves({ count = 28, ignoreReducedMotion = false }) {
  const reduce = useReducedMotion();

  // Simpan daun secara stabil tanpa useMemo (hindari lint error)
  const leavesRef = React.useRef([]);
  const lastCountRef = React.useRef(count);

  if (leavesRef.current.length === 0 || lastCountRef.current !== count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        size: 18 + Math.random() * 30,   // 18–48 px
        left: Math.random() * 100,       // posisi horizontal (vw)
        delay: Math.random() * 6,        // jeda awal
        fall: 7 + Math.random() * 8,     // durasi jatuh
        sway: 2.5 + Math.random() * 3,   // durasi goyang
        drift: 10 + Math.random() * 30,  // amplitudo goyang (px)
      });
    }
    leavesRef.current = arr;
    lastCountRef.current = count;
  }

  // Jika user prefer reduced motion dan tidak di-override → jangan render animasi
  if (reduce && !ignoreReducedMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {leavesRef.current.map((l) => (
        <motion.div
          key={l.id}
          initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 0 }}
          animate={{ y: ["-10vh", "110vh"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: l.fall, delay: l.delay, ease: "linear", repeat: Infinity }}
          className="absolute"
          style={{ left: `${l.left}vw` }}
        >
          <motion.div
            animate={{ x: [0, l.drift, -l.drift, 0], rotate: [0, 25, -20, 0] }}
            transition={{ duration: l.sway, ease: "easeInOut", repeat: Infinity }}
          >
            <Leaf className="text-emerald-400/80 drop-shadow-sm" style={{ width: l.size, height: l.size }} strokeWidth={1.7} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}