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

export default Layout;
