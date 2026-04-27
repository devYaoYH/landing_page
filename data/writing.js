/* Writing list data. Edit this file to add / reorder / remove entries.
   Each entry:
     date    — short string ("Apr 2025")
     tags    — array of short strings
     title   — string
     excerpt — string; blank line (\n\n) splits into paragraphs
     link    — { href, label }, optional. */

export const writing = [
  {
    date: '2026.04.25',
    tags: ['substack', 'LLMs', 'systems architecture'],
    title: 'Shape of LLM Applications',
    excerpt: `LLM Applications are like Flerkens, I describe them in familiar fullstack engineering terms but they can do wild things that break the mold. A architecture template for LLM applications, based on my experience building them and patterns I've seen across the ecosystem.`,
    link: {
      href: 'https://positronicbrain.substack.com/p/shape-of-llm-applications?r=6tktjx',
      label: 'Read',
    },
  },
  {
    date: '2026.03.02',
    tags: ['substack', 'embedded', 'satellites'],
    title: 'The Fellowship of Samwise',
    excerpt: `A retrospective on leading the Stanford Student Space Initiative satellite software team — what it took to ship a custom CubeSat OS in 9 months with ~8 engineers.`,
    link: { href: 'https://positronicbrain.substack.com/p/the-fellowship-of-samwise', label: 'Read' },
  },
  {
    date: '2025.12.12',
    tags: ['substack', 'GPU', 'systems'],
    title: 'On Writing Hardware-aware Software',
    excerpt: `A technical blog series on profiling and optimizing algorithms across CPUs, NVIDIA GPUs (CUDA / Triton), and specialized systolic-array chips like Trainium.`,
    link: { href: 'https://positronicbrain.substack.com/p/on-writing-hardware-aware-software', label: 'Read' },
  },
  {
    date: '2021.08.10',
    tags: ['paper', 'XAI', 'philosophy'],
    title: 'Explanatory Pluralism in Explainable AI',
    excerpt: `Published in Machine Learning and Knowledge Extraction (Springer, CD-MAKE 2021). Argues that XAI lacks a unified standard for "explanation" because human explanations themselves are pluralistic — and proposes a framework for matching explanation type to audience.`,
    link: { href: 'https://doi.org/10.1007/978-3-030-84060-0_18', label: 'Read' },
  },
];
