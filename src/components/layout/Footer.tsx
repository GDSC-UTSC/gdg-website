"use client";

import { motion } from "framer-motion";
import { Github, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "https://github.com/GDSC-UTSC", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/company/gdscutsc/posts/", label: "LinkedIn" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://www.instagram.com/gdgutsc/", label: "Instagram" },
  ];

  return (
    <footer className="py-12 border-t ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/gdg-logo.png"
                alt="GDG @ UTSC"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <div>
                <h3 className="font-bold">GDG @ UTSC</h3>
                <p className="text-xs text-muted-foreground">
                  Google Developer Group
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Building the next generation of developers at the University of
              Toronto Scarborough.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>University of Toronto Scarborough</p>
              <p>1265 Military Trail, Scarborough</p>
              <p>ON M1C 1A4, Canada</p>
              <p>gdg@utsc.ca</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t  pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 Google Developer Group @ UTSC. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ by the GDG @ UTSC team
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
