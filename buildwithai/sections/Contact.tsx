import Section from "@buildwithai/components/Section";

export default function Contact() {
	return (
		<Section
			id="contact"
			title="Contact"
			subtitle="Have questions or want to sponsor? Get in touch."
		>
			<form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<input
					type="text"
					placeholder="Name"
					className="rounded-lg bg-white/5 text-white placeholder-white/40 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
				/>
				<input
					type="email"
					placeholder="Email"
					className="rounded-lg bg-white/5 text-white placeholder-white/40 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
				/>
				<textarea
					placeholder="Message"
					className="sm:col-span-2 rounded-lg bg-white/5 text-white placeholder-white/40 border border-white/10 px-4 py-3 min-h-32 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
				/>
				<div>
					<button
						type="submit"
						className="rounded-full bg-white text-black px-6 py-3 font-medium hover:bg-zinc-100 transition"
					>
						Send
					</button>
				</div>
			</form>
			<p className="mt-6 text-white/60">
				Or email us at{" "}
				<a className="underline" href="mailto:gdg@utsc.utoronto.ca">
					gdg@utsc.utoronto.ca
				</a>
			</p>
		</Section>
	);
}


