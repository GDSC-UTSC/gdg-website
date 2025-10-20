export default function StatsSection() {
  return (
    <>
      <div className="w-[80%] max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
          <div className="text-center lg:mt-0">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              800+
            </div>
            <div className="text-sm md:text-base font-medium text-white/90 tracking-wider">
              REGISTERED
            </div>
          </div>

          <div className="text-center lg:mt-30">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              1.6M+
            </div>
            <div className="text-sm md:text-base font-medium text-white/90 tracking-wider">
              VIEWS ON SOCIAL MEDIA
            </div>
          </div>

          <div className="text-center lg:mt-0">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              500+
            </div>
            <div className="text-sm md:text-base font-medium text-white/90 tracking-wider">
              ATTENDEES
            </div>
          </div>

          <div className="text-center lg:mt-30">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              30+
            </div>
            <div className="text-sm md:text-base font-medium text-white/90 tracking-wider">
              COMPANIES
            </div>
          </div>

          <div className="text-center lg:mt-0">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              5
            </div>
            <div className="text-sm md:text-base font-medium text-white/90 tracking-wider">
              PARTNER CLUBS
            </div>
          </div>
        </div>
      </div>
    </>
  );
}