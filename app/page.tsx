"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { HeaderNavigation } from "@/components/cards/HeaderNavigation";
import { SecondaryNavigation } from "@/components/cards/SecondaryNavigation";
import { TokenInfo } from "@/components/cards/TokenInfo";
import { ChartArea } from "@/components/cards/ChartArea";
import { TradingHistory } from "@/components/cards/TradingHistory";
import { BuySellPanel } from "@/components/cards/BuySellPanel";
import { OrderForm } from "@/components/cards/OrderForm";
import { TradingStats } from "@/components/cards/TradingStats";
import { Presets } from "@/components/cards/Presets";
import { TokenDetails } from "@/components/cards/TokenDetails";
import { Footer } from "@/components/cards/Footer";

const initialCards = [
  { id: "card-1", component: HeaderNavigation },
  { id: "card-2", component: SecondaryNavigation },
  { id: "card-3", component: TokenInfo },
  { id: "card-4", component: ChartArea },
  { id: "card-5", component: TradingHistory },
  { id: "card-6", component: BuySellPanel },
  { id: "card-7", component: OrderForm },
  { id: "card-8", component: TradingStats },
  { id: "card-9", component: Presets },
  { id: "card-10", component: TokenDetails },
  { id: "card-11", component: Footer },
];

export default function Home() {
  const [cards, setCards] = useState(() => {
    if (typeof window === "undefined") return initialCards;
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved).map((id: string) => 
      initialCards.find(card => card.id === id)!
    ) : initialCards;
  });

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards.map(card => card.id)));
  }, [cards]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newCards = [...cards];
    const [moved] = newCards.splice(result.source.index, 1);
    newCards.splice(result.destination.index, 0, moved);
    
    setCards(newCards);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-black p-4">
        <Droppable droppableId="cards">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-12 gap-4"
            >
              {cards.map((card, index) => {
                const Component = card.component;
                return <Component key={card.id} id={card.id} index={index} />;
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}