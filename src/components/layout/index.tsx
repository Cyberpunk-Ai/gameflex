import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';

export function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      {/* Cinematic ambient atmosphere */}
      <div className="atmosphere" aria-hidden />
      <div className="fixed inset-0 grid-fade pointer-events-none z-0" aria-hidden />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
