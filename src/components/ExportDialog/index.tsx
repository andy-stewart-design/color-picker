import {
  Content,
  Description,
  Overlay,
  Portal,
  Title,
} from "@radix-ui/react-dialog";
import s from "./style.module.css";
import { ColorDefinition } from "@/App";
import { generateCSS } from "@/utils/generate-color-code-snippets";

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
          <Title>Export Colors</Title>
          <Description></Description>
          <pre dangerouslySetInnerHTML={{ __html: css }}></pre>
        </Content>
      </Overlay>
    </Portal>
  );
}
