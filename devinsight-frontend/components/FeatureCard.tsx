import { motion } from "framer-motion"

export default function FeatureCard({
  title,
  description,
  icon
}: any) {

  return (

    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >

      <div className="text-[var(--primary-500)] mb-3 text-2xl">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-[var(--foreground)]">
        {title}
      </h3>

      <p className="text-[var(--foreground-secondary)] mt-2">
        {description}
      </p>

    </motion.div>

  )

}
