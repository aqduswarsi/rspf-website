import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import UsersUnverified from "./pages/UsersUnverified";
import UsersVerified from "./pages/UsersVerified";
import AddUser from "./pages/AddUser";
import AddEvents from "./pages/AddEvents";
import AddNews from "./pages/AddNews";
import Gallery from "./pages/Gallery";
import EducationManagement from "./pages/EducationManagement";
import ExamManagement from "./pages/ExamManagement";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public website */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users/unverified" element={<UsersUnverified />} />
          <Route path="users/verified" element={<UsersVerified />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="events" element={<AddEvents />} />
          <Route path="news" element={<AddNews />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="education/courses" element={<EducationManagement />} />
          <Route path="education/subjects" element={<EducationManagement />} />
          <Route path="education/lessons/add" element={<EducationManagement />} />
          <Route path="education/lessons" element={<EducationManagement />} />
          <Route path="exam/questions" element={<ExamManagement />} />
          <Route path="exam/results" element={<ExamManagement />} />
          <Route path="exam/non-printed" element={<ExamManagement />} />
          <Route path="exam/printed" element={<ExamManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}
