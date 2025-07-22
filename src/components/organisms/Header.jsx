import { motion } from "framer-motion";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ProgressRing from "@/components/molecules/ProgressRing";
import Button from "@/components/atoms/Button";
const Header = ({ onSearch, completionRate = 0, totalTasks = 0, completedTasks = 0 }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
<motion.header
      className="bg-white border-b border-gray-200/50 px-8 py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
<div className="flex items-center space-x-8">
          <div>
            <h1 className="text-2xl font-bold gradient-text font-display">
              TaskFlow
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {greeting}! You have {totalTasks - completedTasks} tasks remaining.
            </p>
          </div>
        </div>

<div className="flex items-center space-x-8">
          <SearchBar 
            onSearch={onSearch}
            placeholder="Search tasks..."
            className="w-64"
          />
          
          {totalTasks > 0 && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {completedTasks} of {totalTasks}
                </div>
                <div className="text-xs text-gray-500">
                  tasks completed
                </div>
              </div>
              <ProgressRing 
                progress={completionRate} 
                size={50} 
                strokeWidth={4}
              />
            </div>
          )}
          
<div className="flex items-center space-x-4">
            <UserInfo />
            <LogoutButton />
          </div>
</div>
      </div>
    </motion.header>
  );
};

const UserInfo = () => {
  const { user } = useSelector((state) => state.user);
  
  if (!user) return null;
  
  return (
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-xs text-gray-500">
          {user.emailAddress}
        </div>
      </div>
    </div>
  );
};

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
    >
      <ApperIcon name="LogOut" className="w-4 h-4" />
      <span>Logout</span>
    </Button>
  );
};

export default Header;