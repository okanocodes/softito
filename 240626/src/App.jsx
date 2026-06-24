import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Stock from "./pages/Stock";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Messaging from "./pages/Messaging";
import { useSelector } from "react-redux";

export default function App() {
  const activeTab = useSelector((state) => state.auth.activeTab);

  return (
    <div className="app-container">
      <input
        type="radio"
        id="tab-login"
        name="crm-tab"
        defaultChecked
        className="tab-radio"
        checked={activeTab === "login"}
        readOnly
      />
      <input
        type="radio"
        id="tab-dashboard"
        name="crm-tab"
        className="tab-radio"
        checked={activeTab === "dashboard"}
        readOnly
      />
      <input
        type="radio"
        id="tab-customers"
        name="crm-tab"
        className="tab-radio"
        checked={activeTab === "customers"}
        readOnly
      />
      <input
        type="radio"
        id="tab-stock"
        name="crm-tab"
        className="tab-radio"
        checked={activeTab === "stock"}
        readOnly
      />
      <input
        type="radio"
        id="tab-products"
        name="crm-tab"
        className="tab-radio"
        checked={activeTab === "products"}
        readOnly
      />
      <input
        type="radio"
        id="tab-reports"
        name="crm-tab"
        className="tab-radio"
        checked={activeTab === "reports"}
        readOnly
      />
      <input
        type="radio"
        id="tab-messages"
        name="crm-tab"
        className="tab-radio"
        checked={activeTab === "messages"}
        readOnly
      />

      <main className="login-screen">
        <Auth />
      </main>

      <div className="app-frame">
        <Sidebar />

        <div className="main-content">
          <Header />

          <Dashboard />
          <Customers />
          <Stock />
          <Products />
          <Reports />
          <Messaging />
        </div>
      </div>
    </div>
  );
}
