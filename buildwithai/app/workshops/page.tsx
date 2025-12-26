import Section from "@buildwithai/components/Section";

export const metadata = {
	title: "Workshops & Competition • Build With AI 2025",
	description:
		"Hands‑on workshops and the Build With AI competition details and schedule.",
};

const workshops = [
	{
		title: "LLM Apps with Vertex AI",
		level: "Intermediate",
		when: "13:00 – 15:00",
		room: "Lab 1",
		description:
			"Build, evaluate, and deploy an LLM‑powered app using Vertex AI Studio and Search/RAG.",
	},
	{
		title: "Android On‑device ML",
		level: "Beginner",
		when: "13:00 – 15:00",
		room: "Lab 2",
		description:
			"Hands‑on with MediaPipe and Gemini Nano. Learn how to run models offline on Android.",
	},
	{
		title: "GenAI UX Design Sprint",
		level: "All levels",
		when: "13:00 – 15:00",
		room: "Studio 4",
		description:
			"Collaborative sprint exploring usable, safe, and delightful gen‑AI experiences.",
	},
];

export default function WorkshopsPage() {
	return (
		<main className="min-h-screen bg-gradient-to-b from-[#040a1a] to-black">
			<div className="pt-28">
				<Section
					title="Workshops"
					subtitle="Choose a track and get hands‑on with expert mentors."
					className="pt-0"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{workshops.map((w) => (
							<div
								key={w.title}
								className="rounded-2xl border border-white/10 bg-white/5 p-6"
							>
								<h3 className="text-white font-semibold">{w.title}</h3>
								<p className="text-white/60 text-sm mt-1">{w.level}</p>
								<p className="text-white/70 text-sm mt-2">
									{w.when} • {w.room}
								</p>
								<p className="text-white/80 mt-3">{w.description}</p>
							</div>
						))}
					</div>
				</Section>

				<Section
					title="Competition"
					subtitle="Team up after the workshops to build an AI project and pitch for prizes."
				>
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<ul className="text-white/80 space-y-2">
							<li>• 15:00 – 17:00: Build & Mentorship (Main Hall B)</li>
							<li>• 17:00 – 17:30: Pitches & Demos</li>
							<li>• 17:30: Awards & Closing</li>
						</ul>
						<p className="text-white/70 mt-4 text-sm">
							Bring a laptop. Teams of up to 4. Judging criteria: impact,
							technical depth, and usability.
						</p>
					</div>
				</Section>
			</div>
		</main>
	);
}


