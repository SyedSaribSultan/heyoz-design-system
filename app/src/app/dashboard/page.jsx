import Dashboard from './Dashboard';
import '../home/home.css';
import './dashboard.css';

// Oz dashboard (Home, agent version): a prompt box in the middle, Oz's one suggested move under it,
// then everything Oz knows about the user's ads and niche, in plain words. See README.md.
export const metadata = { title: { absolute: 'HeyOz · Oz Dashboard' }, description: 'Prototype: the HeyOz agent dashboard, built from design-system tokens.', alternates: { canonical: '/dashboard' } };

export default function Page() {
  return <Dashboard />;
}
