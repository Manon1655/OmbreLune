import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Library from "./pages/Library";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* INTRO — SANS NAVBAR */}
        <Route path="/" element={<Intro />} />

        {/* SITE — AVEC NAVBAR / FOOTER */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/library" element={<Library />} />
          {/* autres pages */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
