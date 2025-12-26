export type Session = {
	id: string;
	time: string;
	title: string;
	room: string;
	speakers: string[];
	type: "keynote" | "talk" | "workshop" | "break" | "competition";
};

export const daySchedule: Session[] = [
	{
		id: "open",
		time: "08:30",
		title: "Registration & Breakfast",
		room: "Foyer",
		speakers: [],
		type: "break",
	},
	{
		id: "keynote",
		time: "09:00",
		title: "Opening Keynote: AI in Orbit",
		room: "Main Hall A",
		speakers: ["Alex Chen", "Priya Raman"],
		type: "keynote",
	},
	{
		id: "android",
		time: "10:15",
		title: "On‑device GenAI for Android",
		room: "Room 210",
		speakers: ["Samira Yousaf"],
		type: "talk",
	},
	{
		id: "vertex",
		time: "11:00",
		title: "Scaling RAG with Vertex AI",
		room: "Room 305",
		speakers: ["Alex Chen"],
		type: "talk",
	},
	{
		id: "lunch",
		time: "12:00",
		title: "Lunch",
		room: "Cafeteria",
		speakers: [],
		type: "break",
	},
	{
		id: "ws1",
		time: "13:00",
		title: "Workshop: LLM Apps with Vertex AI",
		room: "Lab 1",
		speakers: ["Workshop Crew"],
		type: "workshop",
	},
	{
		id: "ws2",
		time: "13:00",
		title: "Workshop: Android On‑device ML",
		room: "Lab 2",
		speakers: ["Android Team"],
		type: "workshop",
	},
	{
		id: "comp",
		time: "15:00",
		title: "AI Build Competition",
		room: "Main Hall B",
		speakers: [],
		type: "competition",
	},
	{
		id: "close",
		time: "17:30",
		title: "Awards & Closing",
		room: "Main Hall A",
		speakers: ["Organizers"],
		type: "keynote",
	},
];


