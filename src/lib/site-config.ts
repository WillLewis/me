export const siteConfig = {
  placeholderContent: true,
  siteUrl: "https://wxl3.com",
  title: "AI/ML Product Portfolio",
  shortTitle: "Portfolio",
  role: "AI / ML Product Manager",
  description:
    "Selected work in AI/ML product - LLMs, RAG, agents, vision, evals, and fine-tuning.",
  ogDescription: "Selected work in AI/ML product.",
  availability: "Available Q3 2026",
  location: "Remote · NYC",
  openTo: "NYC · SF · Remote",
  openToCaption: "Senior PM and Group PM roles",
  aboutRole: "AI/ML product manager",
  aboutLocation: "Brooklyn",
  aboutAvailability: "Q3 2026",
  buildLabel: "build 2026.05",
  contact: {
    email: "",
    linkedIn: "",
    github: "",
    resumeHref: "/resume.pdf",
  },
} as const;

export function getContactRows() {
  return [
    siteConfig.contact.email
      ? {
          label: "Email",
          value: siteConfig.contact.email,
          href: `mailto:${siteConfig.contact.email}`,
        }
      : null,
    siteConfig.contact.linkedIn
      ? {
          label: "LinkedIn",
          value: siteConfig.contact.linkedIn,
          href: siteConfig.contact.linkedIn.startsWith("http")
            ? siteConfig.contact.linkedIn
            : `https://www.linkedin.com${siteConfig.contact.linkedIn}`,
        }
      : null,
    siteConfig.contact.github
      ? {
          label: "GitHub",
          value: siteConfig.contact.github,
          href: siteConfig.contact.github.startsWith("http")
            ? siteConfig.contact.github
            : `https://github.com/${siteConfig.contact.github.replace(/^@/, "")}`,
        }
      : null,
    siteConfig.contact.resumeHref
      ? {
          label: "Resume · PDF",
          value: "Download",
          href: siteConfig.contact.resumeHref,
          download: true,
        }
      : null,
  ].filter((row) => row !== null);
}
