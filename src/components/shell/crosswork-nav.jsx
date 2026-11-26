import { NavLink, useLocation } from "react-router-dom";
import { getExplorationOption, resolveExploration } from '../../features/explorations/options.js';
import "./crosswork-nav.css";

const sections = [
  { value: "/network-monitoring", label: "Home", icon: "nav-home" },
  { value: "/network-monitoring/admin", label: "Admin", icon: "nav-admin" },
  { value: "/network-monitoring/incidents", label: "Incidents", icon: "nav-alerts" },
];

function SectionLinks() {
  const location = useLocation();
  const exploration = resolveExploration(location.search);
  const agentCentric = exploration === 'agent-centric' && /\/network-monitoring(?:\/jobs)?\/?$/.test(location.pathname);
  const home = { ...sections[0], value: getExplorationOption(exploration).path };
  const visible = agentCentric ? [
    home,
    { value: '/network-monitoring/jobs?exploration=agent-centric', label: 'Jobs', icon: 'nav-workflows' },
    ...sections.slice(1),
  ] : [home, ...sections.slice(1)];
  return visible.map(section => <NavLink key={section.value} to={section.value} end>
    <hbr-icon name={section.icon} size="24px" aria-hidden="true" />
    <span>{section.label}</span>
  </NavLink>);
}

export default function CrossworkNav() {
  return <>
    <nav className="crosswork-navigation" aria-label="Crosswork AI navigation"><SectionLinks /></nav>
    <nav className="crosswork-mobile-navigation" aria-label="Crosswork AI mobile navigation"><SectionLinks /></nav>
  </>;
}
