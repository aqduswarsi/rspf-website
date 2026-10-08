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
import ManageCourse from "./pages/ManageCourse";
import ManageSubject from "./pages/ManageSubject";
import ManageLessons from "./pages/ManageLessons";
import AllLessons from "./pages/AllLessons";
import ManageQuestion from "./pages/ManageQuestion";
import ManageExam from "./pages/ManageExam";
import ManageResult from "./pages/ManageResult";
import NonPrintedResult from "./pages/NonPrintedResult";
import PrintedResult from "./pages/PrintedResult";
import SupportTickets from "./pages/SupportTickets";
import ChangePassword from "./pages/ChangePassword";
import AddContactDetails from "./pages/AddContactDetails";
import UserDashboard from "./pages/UserDashboard";
import UserProfileUpdate from "./pages/UserProfileUpdate";
import UserIdCard from "./pages/UserIdCard";
import UserChangePassword from "./pages/UserChangePassword";
import UserReadCourse from "./pages/UserReadCourse";
import UserExam from "./pages/UserExam";
import UserExamResult from "./pages/UserExamResult";
import UserOpenTicket from "./pages/UserOpenTicket";
import UserSupportTicket from "./pages/UserSupportTicket";
import PublicRegister from "./pages/PublicRegister";
import AdminReattemptRequests from "./pages/AdminReattemptRequests";

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
        {/* ============ PUBLIC ============ */}
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
        <Route path="/register" element={<PublicRegister />} /> {/* ← नया */}
        {/* ============ ADMIN ============ */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* Users Management */}
          <Route path="users/unverified" element={<UsersUnverified />} />
          <Route path="users/verified" element={<UsersVerified />} />
          <Route path="users/add" element={<AddUser />} />

          {/* Content Management */}
          <Route path="events" element={<AddEvents />} />
          <Route path="news" element={<AddNews />} />
          <Route path="gallery" element={<Gallery />} />

          {/* Educational Management */}
          <Route path="education/courses" element={<ManageCourse />} />
          <Route path="education/subjects" element={<ManageSubject />} />
          <Route path="education/lessons/add" element={<ManageLessons />} />
          <Route path="education/lessons" element={<AllLessons />} />

          {/* Exam Management */}
          <Route path="exam/questions" element={<ManageQuestion />} />
          <Route path="exam/manage" element={<ManageExam />} />
          <Route path="exam/results" element={<ManageResult />} />
          <Route path="exam/non-printed" element={<NonPrintedResult />} />
          <Route path="exam/printed" element={<PrintedResult />} />
          <Route
            path="exam/reattempt-requests"
            element={<AdminReattemptRequests />}
          />

          {/* Support */}
          <Route path="support/non-answered" element={<SupportTickets />} />
          <Route path="support/answered" element={<SupportTickets />} />

          {/* Account */}
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="contact-details" element={<AddContactDetails />} />

          {/* Catch-all — jo bhi route miss ho */}
          <Route path="*" element={<AdminDashboard />} />
        </Route>
        {/* ============ USER ============ */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/account/profile" element={<UserProfileUpdate />} />
        <Route path="/user/account/id-card" element={<UserIdCard />} />
        <Route path="/user/change-password" element={<UserChangePassword />} />
        {/* ============ USER COURSE ============ */}
        <Route path="/user/course/read" element={<UserReadCourse />} />
        <Route path="/user/course/exam" element={<UserExam />} />
        <Route path="/user/course/result" element={<UserExamResult />} />
        {/* ============ USER SUPPORT ============ */}
        <Route path="/user/support/open" element={<UserOpenTicket />} />
        <Route path="/user/support/tickets" element={<UserSupportTicket />} />
      </Routes>
    </Router>
  );
}
