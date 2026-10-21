import { motion, type TargetAndTransition, type Transition } from "framer-motion";
import type { ReactNode } from "react";

// One motion language for the whole site: slow, confident ease-out, like a sheet of paper settling.
// Rules that keep it jitter-free: only transform + opacity are animated (never layout), every reveal plays
// ONCE, and elements keep their final size from the first frame. <MotionConfig reducedMotion="user"> in the
// root turns the movement off for people who ask their device for less motion.
export const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type RevealProps = {
  initial: TargetAndTransition;
  whileInView: TargetAndTransition;
  viewport: { once: boolean; margin: string };
  transition: Transition;
};

/** Spread onto any motion element: <motion.p {...revealProps()}> */
export const revealProps = (y = 24, delay = 0): RevealProps => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -8% 0px" },
  transition: { duration: 0.8, delay, ease: EASE },
});

export function Reveal({ children, className, y, delay }: { children: ReactNode; className?: string; y?: number; delay?: number }) {
  return (
    <motion.div className={className} {...revealProps(y, delay)}>
      {children}
    </motion.div>
  );
}
