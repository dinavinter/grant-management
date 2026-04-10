import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("runner", "routes/runner.tsx"),
  route("runner/webcontainer", "routes/runner.webcontainer.tsx"),
  route("runner/docs", "routes/runner.docs.tsx"),
] satisfies RouteConfig;
