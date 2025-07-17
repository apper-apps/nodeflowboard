import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";
import Dashboard from "@/components/pages/Dashboard";
import MyTasks from "@/components/pages/MyTasks";
import ProjectBoard from "@/components/pages/ProjectBoard";
import Calendar from "@/components/pages/Calendar";
import Team from "@/components/pages/Team";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="project/:projectId" element={<ProjectBoard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="team" element={<Team />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="toast-container"
        style={{ zIndex: 9999 }}
      />
    </BrowserRouter>
  );
}

export default App;