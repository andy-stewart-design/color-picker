import { useState } from "react";
import {
  Content,
  Description,
  Overlay,
  Portal,
  Title,
  Close,
} from "@radix-ui/react-dialog";
import { ColorDefinition } from "@/App";
import { generateCSS } from "@/utils/generate-color-code-snippets";
import s from "./style.module.css";

interface Props {
  colors: ColorDefinition[];
  names: number[];
}

export default function ExportDialog({ colors, names }: Props) {
  const css = generateCSS(colors, names);

  return (
    <Portal>
      <Overlay className={s.overlay}>
        <Content className={s.dialog}>
          <div className={s.header}>
            <Title>Export palette</Title>
            <Description></Description>
            <Close>
              <CloseIcon />
            </Close>
          </div>
          <pre dangerouslySetInnerHTML={{ __html: css }} />
          <div className={s.footer}>
            <ExportButton copyText={css} />
          </div>
        </Content>
      </Overlay>
    </Portal>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16}>
      <path d="M 2 2 L 14 14 M 2 14 L 14 2" stroke="black" strokeWidth={1.5} />
    </svg>
  );
}

function ExportButton({ copyText }: { copyText: string }) {
  const [showMessage, setShowMessage] = useState(false);

  function handleClick() {
    if (!("navigator" in window) || showMessage) return;
    navigator.clipboard.writeText(copyText);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  }

  return (
    <button onClick={handleClick}>
      {showMessage ? "Copied to clipboard!" : "Copy CSS"}
    </button>
  );
}
