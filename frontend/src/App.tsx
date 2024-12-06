import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/error";
import RootLayout from "./components/layout/rootLayout";
import Home from "./pages/home";
import Equipe from "./pages/equipe";
import FAQ from "./pages/faq";
import { useEffect } from "react";
import Scene1 from "./pages/game/Scene1";
import Scene2 from "./pages/game/Scene2";
import Scene3 from "./pages/game/Scene3";
import Scene4 from "./pages/game/Scene4";
import Scene5 from "./pages/game/Scene5";
import Scene6 from "./pages/game/Scene6";
import CaptchaPage from "./pages/captcha";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<RootLayout />}
      loader={() => {
        return null;
      }}
      errorElement={<ErrorPage />}
    >
      <Route
        index
        element={<Home />}
        loader={() => {
          localStorage.setItem("gameFlappyStarted", "false");
          return null;
        }}
      />
      <Route path="scene-1" element={<Scene1 />} />
      <Route path="scene-2" element={<Scene2 />} />
      <Route path="scene-3" element={<Scene3 />} />
      <Route path="scene-4" element={<Scene4 />} />
      <Route path="scene-5" element={<Scene5 />} />
      <Route path="scene-6" element={<Scene6 />} />
      <Route path="faq" element={<FAQ />} />
      <Route
        path="about"
        element={<div>About Page</div>}
        loader={() => {
          return null;
        }}
      />

      <Route
        path="team"
        element={<Equipe />}
        loader={() => {
          return null;
        }}
      />

      <Route path="captcha" element={<CaptchaPage />} />
    </Route>
  )
);

function App() {
  useEffect(() => {
    // @ts-expect-error matomo
    // eslint-disable-next-line no-var
    var _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });

    // eslint-disable-next-line no-var
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = "https://matomo.moreiradj.net/js/container_ZetIg1f3.js";
    // @ts-expect-error matomo
    s.parentNode.insertBefore(g, s);
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
