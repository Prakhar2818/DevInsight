import { motion } from "framer-motion"

export default function Hero() {

  return (

    <section className="text-center py-20">

      <motion.h1
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        className="text-5xl font-bold text-[var(--foreground)]"
      >
        DevInsight AI
      </motion.h1>

      <p className="text-[var(--foreground-secondary)] mt-4 text-lg">
        AI powered repository intelligence platform
      </p>

    </section>

  )

}
