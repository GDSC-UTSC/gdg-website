import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeaderClient from "./HeaderClient";

const HeaderServer = () => {
  return (
    <HeaderClient>
      <div className="px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 121.03 58.57"
                className="w-8 h-4 text-white"
              >
                <g>
                  <path fill="currentColor"
                    d="M48.47 40.52 14.51 20.91a9.63 9.63 0 0 0-4.83-1.3 9.67 9.67 0 0 0-8.38 4.84C-1.37 29.08.21 34.99 4.84 37.66L38.8 57.27a9.63 9.63 0 0 0 4.83 1.3c3.34 0 6.59-1.73 8.38-4.84 2.67-4.63 1.09-10.54-3.54-13.21ZM116.2 20.91 82.24 1.3A9.63 9.63 0 0 0 77.41 0c-3.34 0-6.59 1.73-8.38 4.84-2.67 4.62-1.09 10.54 3.54 13.21l33.96 19.61a9.63 9.63 0 0 0 4.83 1.3c3.34 0 6.59-1.73 8.38-4.84 2.67-4.63 1.08-10.54-3.54-13.21ZM105.18 39.99l-15.85-9.15-16.77 9.68c-4.63 2.67-6.21 8.58-3.54 13.21a9.656 9.656 0 0 0 13.21 3.54l27.3-15.76c-1.52-.23-3-.74-4.35-1.52ZM15.86 18.58l15.85 9.15 16.77-9.68c4.63-2.67 6.21-8.58 3.54-13.21C49.35.22 43.44-1.37 38.81 1.3l-27.3 15.76c1.52.23 3 .74 4.35 1.52Z" />
                  </g>
              </svg>
              <span className="text-white font-semibold text-base">GDG @ UTSC</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <Link href="/events">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 text-sm px-4 h-9"
                >
                  Events
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 text-sm px-4 h-9"
                >
                  Projects
                </Button>
              </Link>
              <Link href="/team">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 text-sm px-4 h-9"
                >
                  Team
                </Button>
              </Link>
            </nav>
          </div>

          {/* Right side - Account Button */}
          <Link href="/account">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-5 h-9"
            >
              Account
            </Button>
          </Link>
        </div>
      </div>
    </HeaderClient>
  );
};

export default HeaderServer;
