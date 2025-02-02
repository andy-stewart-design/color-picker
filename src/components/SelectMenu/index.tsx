import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import { useActionContext } from "../Providers/ActionProvider";
import s from "./style.module.css";

function SelectMenu() {
  const { updateColor } = useActionContext();

  return (
    <div className={s.wrapper}>
      <Label.Root htmlFor="saturationEase">Saturation Easing</Label.Root>
      <Select.Root
        name="saturationEase"
        defaultValue="easeOut"
        onValueChange={() => updateColor("saturationEase")}
      >
        <Select.Trigger
          className={s.trigger}
          id="saturationEase"
          aria-label="Saturation Easing"
        >
          <Select.Value placeholder="Select a fruit…" />
          <Select.Icon></Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={s.menu}>
            <Select.Viewport>
              <Select.Item className={s.option} value="linear">
                <Select.ItemText>Linear</Select.ItemText>
              </Select.Item>
              <Select.Item className={s.option} value="easeOut">
                <Select.ItemText>Ease Out Sine</Select.ItemText>
              </Select.Item>
              <Select.Item className={s.option} value="easeOutCubic">
                <Select.ItemText>Ease Out Cubic</Select.ItemText>
              </Select.Item>
              <Select.Item className={s.option} value="easeIn">
                <Select.ItemText>Ease In Sine</Select.ItemText>
              </Select.Item>
              <Select.Item className={s.option} value="easeInCubic">
                <Select.ItemText>Ease In Cubic</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export default SelectMenu;
