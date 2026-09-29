import type { Metadata } from 'next';
import { ScenarioExperience } from '../../components/scenario/ScenarioExperience';

export const metadata: Metadata = {
  title: 'Escape Velocity — A grounded scenario for the end of aging',
  description:
    'A scenario-based, scrollable account of how aging might be solved, unlock by unlock, as AI grows more capable — with a live chart that keeps score. Documented science, forecast futures.',
  openGraph: {
    title: 'Escape Velocity',
    description: 'How the end of aging might actually happen, tied to the rise of powerful AI.',
    type: 'article',
  },
};

export default function EscapeVelocityPage() {
  return <ScenarioExperience />;
}
