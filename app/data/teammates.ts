export type Teammate = {
  id: number;
  initials: string;
  name: string;
  role: string;
  match: number;
  availability: string;
  status: string;
  statusTone: "green" | "amber" | "blue";
  skills: string[];
  categories: string[];
  reason: string;
  color: string;
};

export const teammates: Teammate[] = [
  {
    id: 1,
    initials: "MK",
    name: "Maya Kim",
    role: "Product designer",
    match: 94,
    availability: "Full weekend",
    status: "Online now",
    statusTone: "green",
    skills: ["Figma", "UX research", "Prototyping"],
    categories: ["Design"],
    reason:
      "You need product design. Maya wants a technical teammate and shares your climate-tech interest.",
    color: "coral",
  },
  {
    id: 2,
    initials: "JL",
    name: "Jordan Lee",
    role: "ML engineer",
    match: 89,
    availability: "Fri evening – Sun",
    status: "Replies quickly",
    statusTone: "blue",
    skills: ["Python", "PyTorch", "FastAPI"],
    categories: ["AI / ML", "Backend"],
    reason:
      "Jordan brings the recommendation experience your idea needs, while you cover the product frontend.",
    color: "lime",
  },
  {
    id: 3,
    initials: "AP",
    name: "Avery Patel",
    role: "Frontend developer",
    match: 82,
    availability: "Sat – Sun",
    status: "2 team spots open",
    statusTone: "amber",
    skills: ["TypeScript", "React", "Accessibility"],
    categories: ["Frontend"],
    reason:
      "Avery matches your pace and cares about accessible civic-tech products. Both of you want to ship a live demo.",
    color: "violet",
  },
  {
    id: 4,
    initials: "NS",
    name: "Noah Santos",
    role: "Backend developer",
    match: 78,
    availability: "Full weekend",
    status: "New match",
    statusTone: "green",
    skills: ["Node.js", "PostgreSQL", "APIs"],
    categories: ["Backend"],
    reason:
      "Noah can own data and deployment while you focus on the matching experience and interface.",
    color: "blue",
  },
];

export const matchFilters = [
  "All matches",
  "Frontend",
  "Backend",
  "AI / ML",
  "Design",
];
