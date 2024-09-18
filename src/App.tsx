import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loading } from "react-vant";

const Index = lazy(() => import("./pages/report/list"));
const Login = lazy(() => import("./pages/user/login"));
const ReportList = lazy(() => import("./pages/report/list"));
const OrderList = lazy(() => import("./pages/order/list"));
const ReportDetail = lazy(() => import("./pages/report/detail"));

function App() {
  const isDev = import.meta.env.MODE === "development";

  if (isDev) {
  }
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
          <Route path="/reportList" element={<ReportList />} />
          <Route path="/reportDetail" element={<ReportDetail />} />
          <Route path="/orderList" element={<OrderList />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
