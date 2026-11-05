"use client";

import Script from "next/script";

const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

/**
 * ElevenLabs conversational agent widget.
 *
 * Renders nothing until NEXT_PUBLIC_ELEVENLABS_AGENT_ID is set, so no
 * third-party script loads for visitors until an agent is configured. Create
 * the agent in the ElevenLabs dashboard, give it the scope and escalation rules
 * you want, and paste its public agent ID into the env var.
 *
 * The agent's instructions live in ElevenLabs, not here — keep them aligned with
 * the rules the AI advisor follows (no invented figures, no guarantees about
 * admission, scholarships or visas).
 */
export const VoiceAssistant = () => {
  if (!agentId) return null;

  return (
    <>
      <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" async />
      {/* Web component provided by the script above. */}
      {/* @ts-expect-error — custom element is not in JSX.IntrinsicElements */}
      <elevenlabs-convai agent-id={agentId} />
    </>
  );
};
