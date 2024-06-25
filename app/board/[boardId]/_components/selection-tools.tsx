"use client";

import { memo } from "react";
import { useMutation, useSelf } from "@liveblocks/react/suspense";
import { Trash2 } from "lucide-react";

import { Camera, Color } from "@/types/canvas";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

import { ColorPicker } from "./color-picker";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((me) => me.presence.selection);

    const selectionBouds = useSelectionBounds();

    const setFill = useMutation(
      ({ storage }, fillColor: Color) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fillColor);

        selection.forEach((layerId) => {
          liveLayers.get(layerId)?.set("fillColor", fillColor);
        });
      },
      [selection, setLastUsedColor]
    );

    const deleteLayers = useDeleteLayers();

    if (!selectionBouds) {
      return null;
    }

    const x = selectionBouds.width / 2 + selectionBouds.x + camera.x;
    const y = selectionBouds.y + camera.y;

    return (
      <div
        className="absolute flex select-none rounded-xl border bg-white p-3 shadow-sm"
        style={{
          transform: `translate(
            calc(${x}px - 50%),
            calc(${y - 16}px - 100%)
          )`,
        }}
      >
        <ColorPicker onChange={setFill} />
        <div className="ml-2 flex items-center border-l border-neutral-200 pl-2">
          <Hint label="Delete">
            <Button variant="board" size="icon" onClick={deleteLayers}>
              <Trash2 />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
