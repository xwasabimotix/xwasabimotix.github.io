import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import BackToTop from './components/BackToTop.jsx'
import CustomScrollbar from './components/CustomScrollbar.jsx'
import Top from './pages/Top.jsx'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Top />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <CustomScrollbar />
    </BrowserRouter>
  )
}

export default App
