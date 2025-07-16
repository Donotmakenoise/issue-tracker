import Navigation from "./navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-slate-600">&copy; 2024 My Blog. Built with Node.js, Express, and React.</p>
            <p className="text-slate-500 text-sm mt-2">Powered by markdown-it • Hosted on Replit</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
