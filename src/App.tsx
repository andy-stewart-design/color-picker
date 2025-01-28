import { Root as ExportDialogRoot } from "@radix-ui/react-dialog";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import ColorGrid from "@/components/ColorGrid";
import ExportDialog from "@/components/ExportDialog";
import s from "./app.module.css";

export interface ColorDefinition {
  hex: string;
  h: number;
  s: number;
  l: number;
}

export interface ColorFormValues extends ColorDefinition {
  numColors: number;
  keyIndex: number;
}

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
