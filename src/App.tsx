import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Admission from "@/pages/Admission";
import Detoxification from "@/pages/Detoxification";
import Psychological from "@/pages/Psychological";
import Rehabilitation from "@/pages/Rehabilitation";
import Management from "@/pages/Management";
import Education from "@/pages/Education";
import Release from "@/pages/Release";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/admission" replace />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/detoxification" element={<Detoxification />} />
          <Route path="/psychological" element={<Psychological />} />
          <Route path="/rehabilitation" element={<Rehabilitation />} />
          <Route path="/management" element={<Management />} />
          <Route path="/education" element={<Education />} />
          <Route path="/release" element={<Release />} />
          <Route path="*" element={<Navigate to="/admission" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
