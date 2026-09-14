import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { StoreProvider } from "./store/store";
import Home from "./pages/Home";
import About from "./pages/About";
import Story from "./pages/Story";
import { CategoryPage, CraftIndex } from "./pages/Craft";
import { ArticlePage, JournalIndex } from "./pages/Journal";
import Visit from "./pages/Visit";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/our-story" element={<Story />} />
            <Route path="/craft" element={<CraftIndex />} />
            <Route path="/craft/:slug" element={<CategoryPage />} />
            <Route path="/journal" element={<JournalIndex />} />
            <Route path="/journal/:slug" element={<ArticlePage />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
