import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
return (
    <div className="min-h-screen">
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-hidden p-1">
          <div className="h-full bg-white rounded-lg overflow-hidden shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;