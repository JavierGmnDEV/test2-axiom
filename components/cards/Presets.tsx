"use client";

import { Draggable } from "@hello-pangea/dnd";

interface Props {
  id: string;
  index: number;
  className : string
}

export default function Presets({ id, index ,className }: Props) {
  return (
    <div className={`col-span-3 border border-gray-600 rounded p-2 ${className} dnd-handle`}>
    <div className="h-full min-h-[40px]">
      <span className="text-white text-sm">Presets</span>
    </div>
  </div>
  );
}