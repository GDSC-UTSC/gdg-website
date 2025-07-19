import { Button } from "@/components/ui/button";
import { getAuthenticatedUser } from "@/lib/firebase/server/index";
import Image from "next/image";
import Link from "next/link";
import HeaderClient from "./HeaderClient";

const HeaderServer = async () => {
  const user = await getAuthenticatedUser();
  console.log(user);
  return (
    <HeaderClient>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* logo section - centered on mobile, left on desktop */}
          <div className="flex justify-center md:justify-start">
            <Link href="/" className="block">
              <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:scale-105 transition-transform">
                <Image
                  src="/gdg-logo.png"
                  alt="GDG @ UTSC"
                  width={60}
                  height={60}
                  className="h-12 w-auto sm:h-14"
                />
                <div>
                  <h1 className="text-lg sm:text-xl font-bold">GDG @ UTSC</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Google Developer Group
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation - centered on mobile and desktop */}
          <div className="flex justify-center md:justify-between items-center w-full md:w-auto">
            <nav className="flex items-center space-x-1 lg:space-x-2 flex-wrap justify-center gap-y-2">
              <Link href="/events">
                <Button
                  variant="ghost"
                  className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                >
                  Events
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  variant="ghost"
                  className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                >
                  Projects
                </Button>
              </Link>
              <Link href="/team">
                <Button
                  variant="ghost"
                  className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                >
                  Team
                </Button>
              </Link>
              <Link href="/positions">
                <Button
                  variant="ghost"
                  className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                >
                  Positions
                </Button>
              </Link>
              <Link href="/account" className={!user ? "hidden" : ""}>
                <Button
                  variant="ghost"
                  className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                >
                  Account
                </Button>
              </Link>
              <Link href="/account/login" className={user ? "hidden" : ""}>
                <Button
                  variant="ghost"
                  className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                >
                  Login
                </Button>
              </Link>
              {user ? (
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    className="transition-colors text-sm lg:text-base px-3 lg:px-4 text-foreground hover:text-primary"
                  >
                    Admin
                  </Button>
                </Link>
              ) : null}
            </nav>
          </div>
        </div>
      </div>
    </HeaderClient>
  );
};

export default HeaderServer;
