import SidebarPetugas from "../Sidebar/sidebarPetugas";

export default function PetugasLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <SidebarPetugas />
      {children}
    </div>
  );
}
