import { useState } from "react";
import {
  Content,
  Description,
  Overlay,
  Portal,
  Title,
  Close,
} from "@radix-ui/react-dialog";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { generateCSS } from "@/utils/generate-color-code-snippets";
import s from "./style.module.css";
import { useColorContext } from "../Providers/ColorProvider";
import { ColorMode } from "@/utils/culori";

export default function ExportDialog() {
  const [colorMode, setColorMode] = useState<ColorMode>("hex");
  const { colors, colorNames } = useColorContext();
  const css = generateCSS(colors, colorNames, colorMode);

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
          <ToggleGroup
            type="single"
            className={s.toggles}
            value={colorMode}
            onValueChange={(v) => v && setColorMode(v as ColorMode)}
          >
            <ToggleGroupItem value="hex">Hex</ToggleGroupItem>
            <ToggleGroupItem value="rgb">RGB</ToggleGroupItem>
            <ToggleGroupItem value="hsl">HSL</ToggleGroupItem>
            <ToggleGroupItem value="oklch">OKLCH</ToggleGroupItem>
          </ToggleGroup>
          <pre className={s.code} dangerouslySetInnerHTML={{ __html: css }} />
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
