import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import { useActionContext } from "../Providers/ActionProvider";
import s from "./style.module.css";
import { DEFAULT_VALUES } from "@/constants";

function SelectMenu() {
  const { updateColor } = useActionContext();

  return (
    <div className={s.wrapper}>
      <Label.Root htmlFor="saturationEase">Saturation Easing</Label.Root>
      <Select.Root
        name="saturationEase"
        defaultValue={DEFAULT_VALUES.saturationEase}
        onValueChange={() => updateColor("saturationEase")}
      >
        <Select.Trigger
          className={s.trigger}
          id="saturationEase"
          aria-label="Saturation Easing"
        >
          <Select.Value placeholder="Select a fruit…" />
          <Select.Icon asChild>
            <svg viewBox="0 0 16 16" fill="none" width={16} height={16}>
              <path
                d="M 2 5 L 8 11 L 14 5"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={s.menu}>
            <Select.Viewport>
              <Select.Item className={s.option} value="linear">
                <Select.ItemText>Linear</Select.ItemText>
                <Select.ItemIndicator>
                  <svg viewBox="0 0 20 20" width={20} height={20}>
                    <path
                      d="M 5 10 L 9 14 L 15 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={s.option} value="easeOut">
                <Select.ItemText>Ease Out Sine</Select.ItemText>
                <Select.ItemIndicator>
                  <svg viewBox="0 0 20 20" width={20} height={20}>
                    <path
                      d="M 5 10 L 9 14 L 15 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={s.option} value="easeOutCubic">
                <Select.ItemText>Ease Out Cubic</Select.ItemText>
                <Select.ItemIndicator>
                  <svg viewBox="0 0 20 20" width={20} height={20}>
                    <path
                      d="M 5 10 L 9 14 L 15 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={s.option} value="easeIn">
                <Select.ItemText>Ease In Sine</Select.ItemText>
                <Select.ItemIndicator>
                  <svg viewBox="0 0 20 20" width={20} height={20}>
                    <path
                      d="M 5 10 L 9 14 L 15 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={s.option} value="easeInCubic">
                <Select.ItemText>Ease In Cubic</Select.ItemText>
                <Select.ItemIndicator>
                  <svg viewBox="0 0 20 20" width={20} height={20}>
                    <path
                      d="M 5 10 L 9 14 L 15 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Select.ItemIndicator>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export default SelectMenu;
