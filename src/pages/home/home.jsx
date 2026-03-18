const examplePrompt = `"Create a dashboard page with a table
that has filtering, sorting, and pagination
for a list of network devices"`;

const exampleFigma = `"Build this page using the Magnetic
components: https://figma.com/design/..."`;

const steps = [
  {
    number: "1",
    title: "Open this project in any agentic editor",
    description:
      "Works in Cursor, VS Code with Copilot, Codex, or any editor with agent support. The create-magnetic-ui skill is picked up automatically — no setup needed.",
  },
  {
    number: "2",
    title: "Describe what you want, or paste a Figma link",
    description:
      'Tell the agent what to build in plain language (e.g., "add a form page for device provisioning") or share a Figma URL and ask it to implement the design. The agent reads the Magnetic component docs and generates correct code.',
  },
  {
    number: "3",
    title: "Iterate with follow-up prompts",
    description:
      "Ask the agent to refine, add features, or restyle. It stays within the Magnetic Design System for every change — no manual component lookup required.",
  },
];

const resources = [
  {
    label: "Magnetic Component Guidelines (Figma)",
    href: "https://www.figma.com/design/03chsH5sSKnIKj3W3YVcWo",
  },
  {
    label: "Magnetic web components Docs",
    href: "https://magnetic-web.cisco.com",
  },
  {
    label: "React Router Docs",
    href: "https://reactrouter.com",
  },
];

const techStack = [
  "React 19",
  "Vite",
  "Magnetic web components",
  "React Router",
];

export default function Home() {
  return (
    <hbr-layout direction="column" gap="xl" align="start">
      <hbr-layout variant="page:header" align="start">
        <hbr-layout direction="row" gap="sm">
          <hbr-text variant="page-title">Magnetic Starter Template</hbr-text>
          <hbr-tag sentiment="positive" size="small">
            <hbr-icon
              slot="prefix"
              name="status-positive"
              sentiment="positive"
              size="16px"
            />
            Ready
          </hbr-tag>
        </hbr-layout>
        <hbr-text type="secondary" size="sm" length="md">
          An AI agent-ready starter for building pages with the Magnetic Design
          System. Describe what you need or paste a Figma link — the agent
          handles component selection, layout, and code generation
          automatically.
        </hbr-text>
      </hbr-layout>

      <hbr-card container col="full">
        <hbr-text
          slot="header"
          variant="section-title"
          style={{ margin: 0 }}
        >
          Getting Started
        </hbr-text>

        <hbr-layout direction="column" gap="lg">
          {steps.map((step) => (
            <hbr-layout key={step.number} direction="row" gap="md">
              <hbr-layout
                direction="column"
                align="center"
                style={{ minWidth: "32px" }}
              >
                <hbr-text type="primary" size="lg" weight="bold">
                  {step.number}
                </hbr-text>
              </hbr-layout>
              <hbr-layout direction="column" gap="2xs">
                <hbr-text type="primary" size="sm" weight="semibold">
                  {step.title}
                </hbr-text>
                <hbr-text type="secondary" size="sm" length="md">
                  {step.description}
                </hbr-text>
              </hbr-layout>
            </hbr-layout>
          ))}
        </hbr-layout>
      </hbr-card>

      <hbr-divider />

      <hbr-layout direction="column" gap="md">
        <hbr-text variant="section-title">Example Prompts</hbr-text>
        <hbr-text type="secondary" size="sm" length="md">
          Paste either of these into your editor's agent chat to see it in
          action:
        </hbr-text>
        <hbr-layout direction="column" gap="sm">
          <hbr-layout direction="column" gap="2xs">
            <hbr-text type="primary" size="xs" weight="semibold">
              From a description
            </hbr-text>
            <hbr-code-snippet code={examplePrompt} />
          </hbr-layout>
          <hbr-layout direction="column" gap="2xs">
            <hbr-text type="primary" size="xs" weight="semibold">
              From a Figma link
            </hbr-text>
            <hbr-code-snippet code={exampleFigma} />
          </hbr-layout>
        </hbr-layout>
      </hbr-layout>

      <hbr-divider />

      <hbr-layout direction="column" gap="md">
        <hbr-text variant="section-title">Technology Stack</hbr-text>
        <hbr-layout direction="row" gap="2xs">
          {techStack.map((tech) => (
            <hbr-tag key={tech}>{tech}</hbr-tag>
          ))}
        </hbr-layout>
      </hbr-layout>

      <hbr-divider />

      <hbr-layout direction="column" gap="md">
        <hbr-text variant="section-title">Resources</hbr-text>
        <hbr-layout direction="column" gap="xs">
          {resources.map((r) => (
            <hbr-layout key={r.label} direction="row" gap="2xs">
              <hbr-icon
                name="arrow-square-out"
                size="16px"
                style={{ alignSelf: "center" }}
                sentiment="neutral"
              />
              <hbr-link href={r.href} target="_blank">
                {r.label}
              </hbr-link>
            </hbr-layout>
          ))}
        </hbr-layout>
      </hbr-layout>
    </hbr-layout>
  );
}
