import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import { useActionContext } from "../Providers/ActionProvider";

function SelectMenu() {
  const { updateColor } = useActionContext();

  return (
    <div>
      <Label.Root className="LabelRoot" htmlFor="saturationEase">
        Saturation Easing
      </Label.Root>
      <Select.Root
        name="saturationEase"
        defaultValue="easeOut"
        onValueChange={() => updateColor("saturationEase")}
      >
        <Select.Trigger
          id="saturationEase"
          className="SelectTrigger"
          aria-label="Food"
        >
          <Select.Value placeholder="Select a fruit…" />
          <Select.Icon className="SelectIcon"></Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="SelectContent">
            <Select.Viewport className="SelectViewport">
              <Select.Item value="linear">
                <Select.ItemText>Linear</Select.ItemText>
              </Select.Item>
              <Select.Item value="easeOut">
                <Select.ItemText>Ease Out Sine</Select.ItemText>
              </Select.Item>
              <Select.Item value="easeOutCubic">
                <Select.ItemText>Ease Out Cubic</Select.ItemText>
              </Select.Item>
              <Select.Item value="easeIn">
                <Select.ItemText>Ease In Sine</Select.ItemText>
              </Select.Item>
              <Select.Item value="easeInCubic">
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
