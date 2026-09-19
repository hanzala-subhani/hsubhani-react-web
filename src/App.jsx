import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Solutions from './pages/Solutions'
import SolutionDetail from './pages/SolutionDetail'
import CaseStudies from './pages/CaseStudies'
import CaseStudyDetail from './pages/CaseStudyDetail'
import Technology from './pages/Technology'
import Pricing from './pages/Pricing'
import Process from './pages/Process'
import Team from './pages/Team'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Interview from './pages/Interview'
import InterviewTopics from './pages/InterviewTopics'
import InterviewDetail from './pages/InterviewDetail'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/solutions/:slug" element={<SolutionDetail />} />
        <Route path="/work" element={<CaseStudies />} />
        <Route path="/work/:slug" element={<CaseStudyDetail />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/process" element={<Process />} />
        <Route path="/team" element={<Team />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/interview/topics" element={<InterviewTopics />} />
        <Route path="/interview/detail" element={<InterviewDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
