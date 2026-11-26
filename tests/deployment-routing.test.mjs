import test from "node:test";
import assert from "node:assert/strict";
import { matchRoutes } from "react-router-dom";
import { resolveDeploymentRouting } from "../src/routing/deployment.js";
import { EXPLORATION_OPTIONS, resolveExploration } from "../src/features/explorations/options.js";

const assetBase = "/preview-assets/ver_7a11eb26-63e3-4a2f-93d0-b5cb1aac3660/";
const previewBase = "/preview/cwai-landing-page-experience/";
const routes = [{ path: "/", children: [{ index: true }, { path: "network-monitoring/:section?" }] }];

test("bare dashboard links open Option 4 without requiring an exploration query", () => {
  for (const search of ['', '?experience=review', '?domain=west&agent=capacity', '?exploration=unavailable']) {
    assert.equal(resolveExploration(search), 'agent-centric');
  }
});

test("every floating-panel choice resolves back to that option, including Operations and archives", () => {
  for (const option of EXPLORATION_OPTIONS) {
    const url = new URL(option.path, 'https://example.test');
    assert.equal(resolveExploration(url.search), option.id, option.path);
  }
});

test("Protohost's visible preview address matches despite a different asset address", () => {
  for (const pathname of [previewBase, previewBase.slice(0, -1)]) {
    const deployment = resolveDeploymentRouting({ pathname, assetBase });
    assert.deepEqual(deployment, { basename: previewBase.slice(0, -1), landingPath: "/network-monitoring" });
    assert.equal(matchRoutes(routes, pathname, assetBase), null);
    assert.ok(matchRoutes(routes, pathname, deployment.basename));
  }
});

test("direct dashboard, Admin and Incidents URLs retain the same preview mount", () => {
  for (const route of ["network-monitoring", "network-monitoring/admin", "network-monitoring/incidents"]) {
    const pathname = `${previewBase}${route}`;
    const { basename } = resolveDeploymentRouting({ pathname, assetBase });
    assert.equal(basename, previewBase.slice(0, -1));
    assert.ok(matchRoutes(routes, pathname, basename), pathname);
  }
});

test("the mount is independent of the preview name and build version", () => {
  const { basename } = resolveDeploymentRouting({
    pathname: "/preview/another-wan", assetBase: "/preview-assets/ver_next/",
  });
  assert.equal(basename, "/preview/another-wan");
  assert.ok(matchRoutes(routes, "/preview/another-wan", basename));
});

test("local and conventional subpath deployments open the controller dashboard", () => {
  for (const base of ["/", "/CWAI-Landing-page-experience/", "/pages/magnetic/boilerplate-web/"]) {
    assert.deepEqual(resolveDeploymentRouting({ pathname: `${base}network-monitoring`, assetBase: base }), {
      basename: base, landingPath: "/network-monitoring",
    });
  }
  assert.equal(resolveDeploymentRouting({ pathname: previewBase, assetBase: "/" }).basename, "/");
});

test("a host can explicitly configure an application mount separately from its assets", () => {
  assert.equal(resolveDeploymentRouting({
    pathname: "/app/network-monitoring", assetBase: "/static/v1/", routerBase: "/app/",
  }).basename, "/app/");
});
