import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, Menu } from "lucide-react";
import Link from "next/link";
import HeaderClient from "./HeaderClient";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AdminButton, AdminButtonMobile } from "./AdminButton";

const HeaderServer = () => {
  return (
    <HeaderClient>
      <div className="px-4 sm:px-8 py-3 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121.03 58.57" className="w-8 h-4 text-white">
                <g>
                  <path
                    fill="currentColor"
                    d="M48.47 40.52 14.51 20.91a9.63 9.63 0 0 0-4.83-1.3 9.67 9.67 0 0 0-8.38 4.84C-1.37 29.08.21 34.99 4.84 37.66L38.8 57.27a9.63 9.63 0 0 0 4.83 1.3c3.34 0 6.59-1.73 8.38-4.84 2.67-4.63 1.09-10.54-3.54-13.21ZM116.2 20.91 82.24 1.3A9.63 9.63 0 0 0 77.41 0c-3.34 0-6.59 1.73-8.38 4.84-2.67 4.62-1.09 10.54 3.54 13.21l33.96 19.61a9.63 9.63 0 0 0 4.83 1.3c3.34 0 6.59-1.73 8.38-4.84 2.67-4.63 1.08-10.54-3.54-13.21ZM105.18 39.99l-15.85-9.15-16.77 9.68c-4.63 2.67-6.21 8.58-3.54 13.21a9.656 9.656 0 0 0 13.21 3.54l27.3-15.76c-1.52-.23-3-.74-4.35-1.52ZM15.86 18.58l15.85 9.15 16.77-9.68c4.63-2.67 6.21-8.58 3.54-13.21C49.35.22 43.44-1.37 38.81 1.3l-27.3 15.76c1.52.23 3 .74 4.35 1.52Z"
                  />
                </g>
              </svg>
              <span className="text-white font-semibold text-base hidden sm:inline">GDG @ UTSC</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1 overflow-x-auto whitespace-nowrap">
              <Link href="/events">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 text-sm px-3 sm:px-4 h-9"
                >
                  Events
                </Button>
              </Link>
              <Link href="/team">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 text-sm px-3 sm:px-4 h-9"
                >
                  Team
                </Button>
              </Link>
              <Link href="/positions">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 text-sm px-3 sm:px-4 h-9"
                >
                  Positions
                </Button>
              </Link>
            </nav>
          </div>

          {/* Right side - Social Icons and Account Button */}
          <div className="hidden md:flex items-center gap-6">
            {/* Social Media Icons */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com/company/gdscutsc/posts/"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/gdgutsc/"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>

            {/* Admin Button (conditionally rendered) */}
            <AdminButton />

            {/* Account Button */}
            <Link href="/account">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-5 h-9">
                Account
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-black border-white/20">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-8">
                {/* Logo */}
                <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121.03 58.57" className="w-8 h-4 text-white">
                      <g>
                        <path
                          fill="currentColor"
                          d="M48.47 40.52 14.51 20.91a9.63 9.63 0 0 0-4.83-1.3 9.67 9.67 0 0 0-8.38 4.84C-1.37 29.08.21 34.99 4.84 37.66L38.8 57.27a9.63 9.63 0 0 0 4.83 1.3c3.34 0 6.59-1.73 8.38-4.84 2.67-4.63 1.09-10.54-3.54-13.21ZM116.2 20.91 82.24 1.3A9.63 9.63 0 0 0 77.41 0c-3.34 0-6.59 1.73-8.38 4.84-2.67 4.62-1.09 10.54 3.54 13.21l33.96 19.61a9.63 9.63 0 0 0 4.83 1.3c3.34 0 6.59-1.73 8.38-4.84 2.67-4.63 1.08-10.54-3.54-13.21ZM105.18 39.99l-15.85-9.15-16.77 9.68c-4.63 2.67-6.21 8.58-3.54 13.21a9.656 9.656 0 0 0 13.21 3.54l27.3-15.76c-1.52-.23-3-.74-4.35-1.52ZM15.86 18.58l15.85 9.15 16.77-9.68c4.63-2.67 6.21-8.58 3.54-13.21C49.35.22 43.44-1.37 38.81 1.3l-27.3 15.76c1.52.23 3 .74 4.35 1.52Z"
                        />
                      </g>
                    </svg>
                    <span className="text-white font-semibold text-base">GDG @ UTSC</span>
                  </Link>
                </SheetClose>
                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Link href="/events">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 text-base h-12"
                      >
                        Events
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/team">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 text-base h-12"
                      >
                        Team
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/positions">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 text-base h-12"
                      >
                        Positions
                      </Button>
                    </Link>
                  </SheetClose>
                </nav>

                {/* Divider */}
                <div className="border-t border-white/20" />

                {/* Admin Button (conditionally rendered) */}
                <SheetClose asChild>
                  <AdminButtonMobile />
                </SheetClose>

                {/* Account Button */}
                <SheetClose asChild>
                  <Link href="/account" className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base h-12">
                      Account
                    </Button>
                  </Link>
                </SheetClose>

                {/* Social Media Icons */}
                <div className="flex items-center gap-4 justify-center">
                  <a
                    href="https://www.linkedin.com/company/gdscutsc/posts/"
                    className="text-white/70 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/gdgutsc/"
                    className="text-white/70 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </HeaderClient>
  );
};

export default HeaderServer;
