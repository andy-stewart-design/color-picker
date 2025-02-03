import { Root as ExportDialogRoot } from "@radix-ui/react-dialog";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import ColorGrid from "@/components/ColorGrid";
import ExportDialog from "@/components/ExportDialog";
import s from "./app.module.css";

function App() {
  return (
    <ExportDialogRoot>
      <main className={s.main}>
        <Sidebar />
        <ColorGrid />
      </main>
      <ExportDialog />
      <MobileShim />
    </ExportDialogRoot>
  );
}

function Layout() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}

function MobileShim() {
  return (
    <div className={s.mobileScreen}>
      <p>
        Sorry, I didn't have time to make this usable on mobile. Please try
        again on a larger screen.
      </p>
    </div>
  );
}

export default Layout;
