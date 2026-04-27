/* Research entries — rendered as a question-led journal layout (distinct
   from the projects timeline). Each entry:
     question    — string, the open question driving the work (large serif)
     lab         — string, e.g. "Stanford — Social Interaction Lab"
     date        — string, e.g. "2026 — ongoing"
     tags        — array of short strings (rendered small / muted)
     description — string; blank line (\n\n) splits into paragraphs
     link        — { href, label }, optional. */

export const research = [
  {
    question: `Why do LLM agents fail to coordinate even when they individually solve the task?`,
    lab: 'Stanford — Social Interaction Lab',
    date: '2026 — ongoing',
    tags: ['multi-agent', 'LLMs', 'negotiation'],
    description: `Designed an iterated multi-turn negotiation game to study dynamic grounding in LLM agent dyads. 720 game traces across three frontier models reveal that agents consistently fail to coordinate despite individually solving the task — failures traced to perfunctory fairness, proposal anchoring, and commitment violations.`,
    link: {
      href: 'https://drive.google.com/file/d/1VnT8yGx7xDepawply9VKND9cxO5QQQBW/view?usp=sharing',
      label: 'Paper (COLM 2026, under review)',
    },
  },
  {
    question: `When do people blame a person, and when do they blame the situation?`,
    lab: 'Stanford — Causality in Cognition Lab',
    date: '2025 — ongoing',
    tags: ['cognitive science', 'causal reasoning', 'modeling'],
    description: `Derived a computational model of causal explanation using counterfactual simulation to weigh trait vs. situational factors. Validated through a novel experimental paradigm — high predictive accuracy for human causal judgments and distinct participant clusters identified via counterfactual saliency.`,
  },
  {
    question: `Can a language model learn to steer its own internal representations?`,
    lab: 'Stanford — NLP Lab',
    date: '2025 — ongoing',
    tags: ['LLMs', 'RL', 'interpretability'],
    description: `Developing self-steering capabilities in Gemma-series models via RL and representation-edit tool calling. Architected and validated a training pipeline for concept steering; extending the framework to improve reasoning capability.`,
  },
];
