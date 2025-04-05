"use client";

import { Draggable } from "@hello-pangea/dnd";

interface Props {
  id: string;
  index: number;
}

export function TokenInfo({ id, index }: Props) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="col-span-3 border border-gray-600 rounded p-2 min-h-[50px]"
        >
          <div className="h-full min-h-[40px]">
            <span className="text-white text-sm">Token Info</span>
          </div>
        </div>
      )}
    </Draggable>
  );
}