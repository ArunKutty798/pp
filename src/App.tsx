import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Header, Profile } from "./components";
import { useEagerConnect } from "./hooks/useEagerConnect";
import { CompletedProject, PendingProject, SignIn, SignUp } from "./pages";
import { CreateProject } from "./pages";

const App: React.FC = () => {
  const [isUser, setIsUser] = useState<"user" | "guest" | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();

  useEagerConnect();

  useEffect(() => {
    const data = localStorage.getItem("token");

    if (data) {
      setIsUser("user");
      navigate("/");
    } else {
      setIsUser("guest");
      navigate("/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isUser) {
    return (
      <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
        <h4 style={{ color: "#fff" }}>...</h4>
      </div>
    );
  }

  return (
    <div>
      {isUser === "guest" && (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      )}
      {isUser === "user" && (
        <div className="app">
          <Profile openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
          <div className="profile_route_wrapper">
            <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
            <Routes>
              <Route path="/" element={<CreateProject />} />
              <Route path="/completed-project" element={<CompletedProject />} />
              <Route path="/pending-project" element={<PendingProject />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
