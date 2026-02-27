import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home'; // New Landing Page
import SyllabusOverview from './components/SyllabusOverview'; // Replaces old Home/GradeSelector
import TopicBrowser from './components/Content/TopicBrowser';
import KnowledgeGraphViewer from './components/Content/KnowledgeGraphViewer';
import ErrataViewer from './components/Errata/ErrataViewer';

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/syllabus" element={<SyllabusOverview />} />
        <Route path="/errata" element={<ErrataViewer />} />
        <Route path="/grade/:gradeId" element={<TopicBrowser />} />
        <Route path="/content/:gradeId/:topicId/:conceptId" element={<KnowledgeGraphViewer />} />
      </Routes>
    </Layout>
  );
};

export default App;
