import { NavLink } from "react-router-dom";
import "./crosswork-nav.css";

const sections = [
  { value: "/network-monitoring", label: "Home", icon: "nav-home" },
  { value: "/network-monitoring/admin", label: "Admin", icon: "nav-admin" },
  { value: "/network-monitoring/incidents", label: "Incidents", icon: "nav-alerts" },
];

function SectionLinks() {
  return sections.map(section => <NavLink key={section.value} to={section.value} end>
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
