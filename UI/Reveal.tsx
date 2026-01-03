'use client'

import { delay, useAnimation, motion, useInView } from 'framer-motion';
import React, { useEffect, useRef } from 'react'
import { JSX } from 'react/jsx-runtime';

interface Props {
    children: JSX.Element;
}

export const Reveal = ({ children }: Props) => {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true});
  
  const fireAll = useAnimation();
  
  useEffect(() => {
    if (inView) {
      fireAll.start("visible")
    }
  }, [inView]);

  return (
    <div ref={ref}>
      <motion.div
        variants= {{
          hidden: {
            opacity: 0,
            y: 75
          },
          visible: {
            opacity: 1, y: 0,
            transition: {delay: 0.5, duration: 0.6, type: "spring", stiffness: 60}
          }
        }}
        initial= "hidden"
        animate= {fireAll}
      >{ children }</motion.div>
    </div>
  )
}