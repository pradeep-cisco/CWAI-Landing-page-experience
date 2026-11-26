import { NavLink, useLocation } from "react-router-dom";
import "./crosswork-nav.css";

const sections = [
  { value: "/network-monitoring", label: "Home", icon: "nav-home" },
  { value: "/network-monitoring/admin", label: "Admin", icon: "nav-admin" },
  { value: "/network-monitoring/incidents", label: "Incidents", icon: "nav-alerts" },
];

function SectionLinks() {
  const location = useLocation();
  const agentCentric = new URLSearchParams(location.search).get('exploration') === 'agent-centric';
  const visible = agentCentric ? [
    { ...sections[0], value: '/network-monitoring?exploration=agent-centric' },
    { value: '/network-monitoring/jobs?exploration=agent-centric', label: 'Jobs', icon: 'nav-workflows' },
    ...sections.slice(1),
  ] : sections;
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
