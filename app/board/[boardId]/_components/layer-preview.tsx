"use client";

import { memo } from "react";
import { useStorage } from "@liveblocks/react/suspense";

import { LayerType } from "@/types/canvas";

import { Rectangle } from "./rectangle";

interface LayerPreviewProps {
  layerId: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo(
  ({ layerId, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((storage) => storage.layers.get(layerId));

    if (!layer) {
      return null;
    }

    switch (layer.type) {
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      default:
        console.warn("Unknown layer type", layer.type);
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
