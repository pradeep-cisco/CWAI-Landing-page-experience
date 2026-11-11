export function harborRuntimeLoader(runtimeDirectory) {
  const directory = runtimeDirectory.replaceAll("\\", "/");

  return {
    name: "harbor-runtime-loader",
    apply: "serve",
    enforce: "pre",
    transform(code, id) {
      const filename = id.split("?", 1)[0].replaceAll("\\", "/");
      if (!filename.startsWith(directory)) return;

      // Stencil builds these chunk URLs at runtime. Let the browser resolve them;
      // Vite cannot enumerate them as application imports during development.
      const transformed = code.replace(
        /(\/\*!__STENCIL_STATIC_IMPORT_SWITCH__\*\/\s*return\s+import\()/g,
        "$1/* @vite-ignore */ ",
      );
      if (transformed === code) return;

      return { code: transformed, map: null };
    },
  };
}
