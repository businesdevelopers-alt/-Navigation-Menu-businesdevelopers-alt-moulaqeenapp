
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home'; // Static import for FCP performance
import LoadingScreen from './components/LoadingScreen';
import { useAuth } from './context/AuthContext';

// Lazy load heavy route components
const Simulator = lazy(() => import('./pages/Simulator'));
const Store = lazy(() => import('./pages/Store'));
const About = lazy(() => import('./pages/About'));
const Support = lazy(() => import('./pages/Support'));
const Docs = lazy(() => import('./pages/Docs'));
const Courses = lazy(() => import('./pages/Courses'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const Blog = lazy(() => import('./pages/Blog'));
const RobotsGallery = lazy(() => import('./pages/RobotsGallery'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const RobotCustomizer = lazy(() => import('./pages/RobotCustomizer'));

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            
            {/* حماية مسار المحاكي: إذا لم يكن هناك مستخدم، يتم التوجيه لصفحة تسجيل الدخول */}
            <Route 
              path="simulator" 
              element={user ? <Simulator /> : <Navigate to="/login" replace />} 
            />

            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetails />} />
            <Route path="store" element={<Store />} />
            <Route path="store/product/:id" element={<ProductDetails />} />
            <Route path="build" element={<RobotCustomizer />} />
            <Route path="about" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="gallery" element={<RobotsGallery />} />
            <Route path="support" element={<Support />} />
            <Route path="docs" element={<Docs />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
