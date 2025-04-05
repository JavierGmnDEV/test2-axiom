"use client";

import { Draggable } from "@hello-pangea/dnd";

interface Props {
  id: string;
  index: number;
}

export function OrderForm({ id, index }: Props) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="col-span-3 border border-gray-600 rounded p-2 min-h-[100px] min-w-[100px]"
        >
          <div className="h-full min-h-[40px]">
            <span className="text-white text-sm">Order Form</span>
          </div>
        </div>
      )}
    </Draggable>
  );
}