"use client";

interface Props {
  className?: string;
}

export default function BuySellPanel({ className }: Props) {
  return (
    <div className={`col-span-3 border border-gray-600 rounded p-2 ${className} dnd-handle`}>
      <div className="h-full min-h-[40px]">
        <span className="text-white text-sm">Buy/Sell Panel</span>
      </div>
    </div>
  );
}