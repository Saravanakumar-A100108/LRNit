import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background animate-page-enter">
      <div className="text-center">
        <h1 className="mb-4 text-8xl font-black text-primary text-glow animate-title-drop">404</h1>
        <p className="mb-6 text-xl text-muted-foreground animate-subtitle-rise">Oops! Page not found</p>
        <a
          href="/"
          className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:box-glow hover:scale-105 transition-all duration-300 animate-button-fade"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
