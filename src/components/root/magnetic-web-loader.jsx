import { useEffect } from "react";

function MagneticWebLoader() {

  useEffect(() => {
    const tagEl = document.createElement("script");
    tagEl.type = "module";

    const packageURL = "https://hbr.cisco.com/packages/@harbor/elements";
    const hbrDist = `${packageURL}/dist/harbor-elements`

    tagEl.innerHTML = `
      import { bootstrap } from "${hbrDist}/index.esm.js";
    
      bootstrap({
        base: "${hbrDist}/",
        injectScript: true,
        injectStyle: true,
        injectTokens: true,
        injectDarkTokens: true,
        injectMagneticTheme: true,
        injectMagneticDarkTheme: true,
        injectMagneticClassicTheme: true,
        injectMagneticBrandAltTheme: true,
      });
    `;

    document.head.appendChild(tagEl);
  }, [])

  return null;
}

export default MagneticWebLoader;