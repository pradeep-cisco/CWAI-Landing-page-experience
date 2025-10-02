import { useEffect } from "react";

export default function PhosphorIconLibrary() {
  // Figma make uses React 18, resorting to useEffect
  useEffect(() => {
    const el = document.createElement("hbr-icon-library");
    el.name = "phosphor";
    el.resolver = (name) => {
      return `https://hbr.cisco.com/packages/phosphor/${name}.svg`
    }
    el.mutator = (svg) => {
      // phosphor svgs seem to have a fill at the svg element
      // and only one path element
      // set fill of svg to none and set the path color to be --path-color-{tick}
      const paths = svg.querySelectorAll("path");
      const payload = { colors: [], secondaryColor: null };
      svg.setAttribute("fill", "none");
      let tick = 0;
      Array.from(paths).forEach((it) => {
        it.setAttribute("fill", `var(--path-color-${tick}, currentColor)`);
        tick++;
      });
      return payload;
    };
    document.body.appendChild(el);
  }, [])

  return null;
}