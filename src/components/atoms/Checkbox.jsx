import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      <motion.div
        className={cn(
          "w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-colors duration-200",
          checked 
            ? "bg-gradient-to-r from-primary-600 to-primary-500 border-primary-600" 
            : "border-gray-300 hover:border-primary-400 bg-white",
          className
        )}
        onClick={() => onChange?.({ target: { checked: !checked } })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25 
            }}
          >
            <ApperIcon name="Check" className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;