"use client";

import { Github, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "https://github.com/GDSC-UTSC", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/company/gdscutsc/posts/", label: "LinkedIn" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://www.instagram.com/gdgutsc/", label: "Instagram" },
  ];

  return (
    <footer className="py-8 border-t">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 121.03 58.57"
            className="w-16 h-8 text-white"
          >
            <g>
              <path fill="currentColor"
                d="M48.47 40.52 14.51 20.91a9.63 9.63 0 0 0-4.83-1.3 9.67 9.67 0 0 0-8.38 4.84C-1.37 29.08.21 34.99 4.84 37.66L38.8 57.27a9.63 9.63 0 0 0 4.83 1.3c3.34 0 6.59-1.73 8.38-4.84 2.67-4.63 1.09-10.54-3.54-13.21ZM116.2 20.91 82.24 1.3A9.63 9.63 0 0 0 77.41 0c-3.34 0-6.59 1.73-8.38 4.84-2.67 4.62-1.09 10.54 3.54 13.21l33.96 19.61a9.63 9.63 0 0 0 4.83 1.3c3.34 0 6.59-1.73 8.38-4.84 2.67-4.63 1.08-10.54-3.54-13.21ZM105.18 39.99l-15.85-9.15-16.77 9.68c-4.63 2.67-6.21 8.58-3.54 13.21a9.656 9.656 0 0 0 13.21 3.54l27.3-15.76c-1.52-.23-3-.74-4.35-1.52ZM15.86 18.58l15.85 9.15 16.77-9.68c4.63-2.67 6.21-8.58 3.54-13.21C49.35.22 43.44-1.37 38.81 1.3l-27.3 15.76c1.52.23 3 .74 4.35 1.52Z" />
            </g>
          </svg>
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          © 2025 Google Developer Group @ UTSC, All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
