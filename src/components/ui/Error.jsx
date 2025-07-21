import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full p-4 mb-6">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}. Don't worry, we're on it! Try refreshing the page or contact support if the problem persists.
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="primary" className="mb-4">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
      
      <Button variant="ghost" onClick={() => window.location.reload()}>
        <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
        Refresh Page
      </Button>
    </motion.div>
  );
};

export default Error;