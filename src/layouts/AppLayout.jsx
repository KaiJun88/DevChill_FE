import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout() {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-6 bg-linear-to-b from-white via-gray-50 to-gray-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
