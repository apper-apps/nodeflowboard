const DEFAULT_COLUMNS = [
  { Id: 1, id: "todo", title: "To Do", color: "text-gray-700", bgColor: "bg-gray-50", order: 1 },
  { Id: 2, id: "inprogress", title: "In Progress", color: "text-info", bgColor: "bg-blue-50", order: 2 },
  { Id: 3, id: "review", title: "Review", color: "text-warning", bgColor: "bg-yellow-50", order: 3 },
  { Id: 4, id: "done", title: "Done", color: "text-success", bgColor: "bg-green-50", order: 4 },
];

const STORAGE_KEY = "kanban_columns";

class ColumnsService {
  // Get all columns
  async getColumns() {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const columns = JSON.parse(stored);
            resolve([...columns]);
          } else {
            resolve([...DEFAULT_COLUMNS]);
          }
        } catch (error) {
          console.error("Error reading columns from localStorage:", error);
          resolve([...DEFAULT_COLUMNS]);
        }
      }, 200);
    });
  }

  // Save columns configuration
  async saveColumns(columns) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!Array.isArray(columns)) {
            reject(new Error("Columns must be an array"));
            return;
          }

          // Validate columns structure
          const validColumns = columns.every(col => 
            col.hasOwnProperty('Id') && 
            col.hasOwnProperty('title') && 
            col.hasOwnProperty('id')
          );

          if (!validColumns) {
            reject(new Error("Invalid column structure"));
            return;
          }

          // Sort by order and ensure proper ids
          const sortedColumns = columns
            .sort((a, b) => a.order - b.order)
            .map((col, index) => ({
              ...col,
              id: col.id || `column_${col.Id}`,
              order: index + 1
            }));

          localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedColumns));
          resolve([...sortedColumns]);
        } catch (error) {
          console.error("Error saving columns to localStorage:", error);
          reject(error);
        }
      }, 300);
    });
  }

  // Reset to default columns
  async resetToDefaults() {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          localStorage.removeItem(STORAGE_KEY);
          resolve([...DEFAULT_COLUMNS]);
        } catch (error) {
          console.error("Error resetting columns:", error);
          resolve([...DEFAULT_COLUMNS]);
        }
      }, 200);
    });
  }

  // Get column by id
  async getColumnById(id) {
    return new Promise(async (resolve) => {
      try {
        const columns = await this.getColumns();
        const column = columns.find(col => col.id === id);
        resolve(column || null);
      } catch (error) {
        console.error("Error getting column by id:", error);
        resolve(null);
      }
    });
  }
}

export default new ColumnsService();