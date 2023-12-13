/* This example requires Tailwind CSS v2.0+ */
import { useState } from "react";
import { TwitterPicker } from "react-color";
import { Popover } from "@headlessui/react";
import { usePopper } from "react-popper";
import { classNames } from "../../lib/utils";

const colors = [
  "#ffffff",
  "#f4f4f5",
  "#fee2e2",
  "#ffedd5",
  "#fef9c3",
  "#dcfce7",
  "#e0f2fe",
  "#f3e8ff",
  "#fce7f3",

  "#94a3b8",
  "#a1a1aa",
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#c084fc",
  "#f472b6",

  "#64748b",
  "#71717a",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#0ea5e9",
  "#a855f7",
  "#f43f5e",

  "#475569",
  "#52525b",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0284c7",
  "#7c3aed",
  "#e11d48",

  "#334155",
  "#3f3f46",
  "#b91c1c",
  "#c2410c",
  "#a16207",
  "#15803d",
  "#0369a1",
  "#7e22ce",
  "#be123c",

  "#1e293b",
  "#27272a",
  "#991b1b",
  "#9a3412",
  "#854d0e",
  "#166534",
  "#075985",
  "#6b21a8",
  "#9f1239",
];

export default function ColorPicker({ selectedColor, setSelectedColor, index = null }) {
  let [referenceElement, setReferenceElement] = useState();

  let [popperElement, setPopperElement] = useState();
  let { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <Popover className="relative w-1/4">
      <Popover.Button
        ref={setReferenceElement}
        className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-full"
      >
        <span
          style={{
            backgroundColor: `${selectedColor}`,
          }}
          className={classNames(
            selectedColor === '#ffffff' ? "border border-gray-300" : "",
            "block h-5 w-5 rounded-full mr-2"
          )}
        ></span>
        {selectedColor}
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="bg-white absolute z-10 mr-3"
      >
        <TwitterPicker
          width="350px"
          colors={colors}
          color={selectedColor}
          onChangeComplete={(color) => {
            setSelectedColor(color.hex + (index !== null ? `-${index}` : ``));
          }}
          triangle="hide"
        />
      </Popover.Panel>
    </Popover>
  );
}
