import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-black to-[#0a0a1f] overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />

      {/* Comet decoration */}
      <div className="absolute top-8 right-10 opacity-30">
        <Image
          src="/comet.webp"
          alt=""
          width={100}
          height={100}
          className="animate-[float_8s_ease-in-out_infinite]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.webp"
              alt="GDG Logo"
              width={40}
              height={40}
            />
            <div>
              <p className="text-white font-semibold">Build With AI 2025</p>
              <p className="text-white/60 text-xs">
                © {new Date().getFullYear()} Google Developer Group – UTSC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://developers.google.com/community/gdg"
              target="_blank"
              rel="noreferrer"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              About GDG
            </a>
            <a
              href="mailto:gdg@utsc.utoronto.ca"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-white/50 text-xs">
            Launching developers into the future of AI
          </p>
        </div>
      </div>
    </footer>
  );
}
