import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Components/AuthProvider"; 
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Components/Login";
import Dashboard from "./Components/Home/Dashboard"; 
import Sidebar from "./Components/Sidebar";
import ForwordMessage from "./Components/Home/ForwordMessage";
import SendMessage from "./Components/Home/SendMessage";
import Chanel from "./Components/Home/Chanel";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/forward-message" element={<ForwordMessage />} />
                    <Route path="/send-message" element={<SendMessage />} />
                    <Route path="/chanel" element={<Chanel />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
