/** Keep the application's address independent of its versioned asset location. */
export function resolveDeploymentRouting({ pathname, assetBase = "/", routerBase }) {
  // Protohost serves one preview at /preview/<slug>/, with each build's assets
  // at /preview-assets/<version>/. The asset path is not a navigable app route.
  const previewMount = pathname.match(/^\/preview\/[^/]+(?=\/|$)/)?.[0];
  const isVersionedPreview = Boolean(
    previewMount && /^\/preview-assets\/[^/]+(?:\/|$)/.test(assetBase),
  );

  return {
    basename: routerBase || (isVersionedPreview ? previewMount : assetBase),
    landingPath: "/network-monitoring",
  };
}
