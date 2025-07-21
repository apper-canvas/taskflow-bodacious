import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-gradient-to-br from-white to-surface rounded-xl border border-gray-200/50 p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="w-12 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer" />
        </div>
      </div>

      {/* Task cards skeleton */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl border border-gray-200/50 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer mt-1" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer" />
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-shimmer" />
                <div className="flex items-center space-x-2 mt-3">
                  <div className="w-16 h-5 bg-gradient-to-r from-primary-100 to-primary-50 rounded-full animate-shimmer" />
                  <div className="w-14 h-5 bg-gradient-to-r from-accent-100 to-accent-50 rounded-full animate-shimmer" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;