import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  filters = {}, 
  onFilterChange, 
  onClearFilters,
  className = "" 
}) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const priorityOptions = [
    { value: "high", label: "High Priority", color: "high" },
    { value: "medium", label: "Medium Priority", color: "medium" },
    { value: "low", label: "Low Priority", color: "low" },
  ];

  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "inprogress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" },
  ];

  const handleFilterToggle = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({ ...filters, [filterType]: newValues });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filterArray) => {
      return count + (Array.isArray(filterArray) ? filterArray.length : 0);
    }, 0);
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <ApperIcon name="Filter" className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="primary" size="sm">
              {activeFiltersCount}
            </Badge>
          )}
        </h3>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.priority?.includes(option.value) ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterToggle("priority", option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.status?.includes(option.value) ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterToggle("status", option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;