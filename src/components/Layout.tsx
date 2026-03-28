import { Outlet } from 'react-router-dom';
import { Header } from './ui/header-2';
import Footer from './Footer';
import LoginModal from './LoginModal';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      <LoginModal />
    </div>
  );
}
