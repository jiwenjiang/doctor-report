import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loading } from "react-vant";

const Index = lazy(() => import("./pages/index"));
const Login = lazy(() => import("./pages/user/login"));
const Sleepv2 = lazy(() => import("./pages/sleepv2"));
const DuoyuanTrend = lazy(() => import("./pages/duoyuan-trend"));
const DuoyuanReport = lazy(() => import("./pages/duoyuan-report"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100vw",
              height: "100vh",
            }}
          >
            <Loading type="spinner" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sleepv2" element={<Sleepv2 />} />
          <Route path="/duoyuan-trend" element={<DuoyuanTrend />} />
          <Route path="/duoyuan-report" element={<DuoyuanReport />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
