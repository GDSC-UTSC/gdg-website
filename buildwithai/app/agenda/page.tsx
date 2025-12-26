import Section from "@buildwithai/components/Section";
import { daySchedule } from "@buildwithai/lib/data";

export const metadata = {
	title: "Agenda • Build With AI 2025",
	description:
		"Full schedule for Build With AI 2025 – sessions, rooms, and speakers.",
};

function badgeFor(type: string) {
	switch (type) {
		case "keynote":
			return "bg-indigo-500/20 text-indigo-200";
		case "workshop":
			return "bg-emerald-500/20 text-emerald-200";
		case "competition":
			return "bg-cyan-500/20 text-cyan-200";
		case "break":
			return "bg-zinc-500/20 text-zinc-200";
		default:
			return "bg-sky-500/20 text-sky-200";
	}
}

export default function AgendaPage() {
	return (
		<main className="min-h-screen bg-gradient-to-b from-[#040a1a] to-black">
			<div className="pt-28">
				<Section
					title="Agenda"
					subtitle="Room numbers and speakers are subject to change."
					className="pt-0"
				>
					<div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
						<table className="min-w-full">
							<thead className="bg-white/5">
								<tr className="text-left text-white/70">
									<th className="px-4 py-3 font-medium">Time</th>
									<th className="px-4 py-3 font-medium">Session</th>
									<th className="px-4 py-3 font-medium">Room</th>
									<th className="px-4 py-3 font-medium">Speakers</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/10">
								{daySchedule.map((s) => (
									<tr key={s.id} className="text-white/90">
										<td className="px-4 py-3 font-mono text-sky-200">
											{s.time}
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<span
													className={`inline-flex rounded-full px-2 py-0.5 text-xs ${badgeFor(s.type)}`}
												>
													{s.type}
												</span>
												<span>{s.title}</span>
											</div>
										</td>
										<td className="px-4 py-3 text-white/70">{s.room}</td>
										<td className="px-4 py-3 text-white/70">
											{s.speakers.join(", ")}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Section>
			</div>
		</main>
	);
}


