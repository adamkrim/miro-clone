"use client";

import { memo } from "react";
import { useStorage } from "@liveblocks/react/suspense";

import { LayerType } from "@/types/canvas";

import { Ellipse } from "./ellipse";
import { Note } from "./note";
import { Rectangle } from "./rectangle";
import { Text } from "./text";

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
      case LayerType.Text:
        return (
          <Text
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Note:
        return (
          <Note
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Ellipse:
        return (
          <Ellipse
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
