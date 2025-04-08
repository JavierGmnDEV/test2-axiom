"use client";

import React, { useEffect, useState } from "react";
import { 
  DndContext, 
  DragOverlay, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import dynamic from "next/dynamic";
import HeaderNavigation from "../components/cards/HeaderNavigation";
import SecondaryNavigation from "../components/cards/SecondaryNavigation";
import TokenInfo from "../components/cards/TokenInfo";
import ChartArea from "../components/cards/ChartArea";
import TradingHistory from "../components/cards/TradingHistory";
import BuySellPanel from "../components/cards/BuySellPanel";
import OrderForm from "../components/cards/OrderForm";
import TradingStats from "../components/cards/TradingStats";
import Presets from "../components/cards/Presets";
import TokenDetails from "../components/cards/TokenDetails";
import Footer from "../components/cards/Footer";
import SortableItem from "../components/SortableItem";

type ContainerType = 'navbar' | 'content' | 'aside' | 'footer';

type Card = {
  id: string;
  component: React.ComponentType<any>;
  container: ContainerType;
};

type ContainersState = {
  [key in ContainerType]: Card[];
};

const initialCards: Card[] = [
  { id: "card-1", component: HeaderNavigation, container: 'navbar' },
  { id: "card-2", component: SecondaryNavigation, container: 'aside' },
  { id: "card-3", component: TokenInfo, container: 'content' },
  { id: "card-4", component: ChartArea, container: 'content' },
  { id: "card-5", component: TradingHistory, container: 'content' },
  { id: "card-6", component: BuySellPanel, container: 'aside' },
  { id: "card-7", component: OrderForm, container: 'content' },
  { id: "card-8", component: TradingStats, container: 'content' },
  { id: "card-9", component: Presets, container: 'content' },
  { id: "card-10", component: TokenDetails, container: 'content' },
  { id: "card-11", component: Footer, container: 'footer' },
];

const initializeContainers = (): ContainersState => ({
  navbar: initialCards.filter(c => c.container === 'navbar'),
  content: initialCards.filter(c => c.container === 'content'),
  aside: initialCards.filter(c => c.container === 'aside'),
  footer: initialCards.filter(c => c.container === 'footer')
});



export default function Home() {
  const [containers, setContainers] = useState<ContainersState>(initializeContainers());
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isClient, setIsClient] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("containerLayout");
    if (saved) {
      try {
        const savedLayout: Array<{id: string; container: ContainerType}> = JSON.parse(saved);
        
        const rebuiltContainers = initializeContainers();
        savedLayout.forEach(({id, container}) => {
          const card = initialCards.find(c => c.id === id);
          if (card) {
            Object.keys(rebuiltContainers).forEach(key => {
              rebuiltContainers[key as ContainerType] = rebuiltContainers[key as ContainerType].filter(c => c.id !== id);
            });
            rebuiltContainers[container].push({...card, container});
          }
        });
        
        setContainers(rebuiltContainers);
      } catch (error) {
        console.error("Error parsing container layout:", error);
      }
    }
  }, []);
  
  useEffect(() => {
    if (isClient) {
      const layoutToSave = Object.values(containers)
        .flat()
        .map(({id, container}) => ({id, container}));
      localStorage.setItem("containerLayout", JSON.stringify(layoutToSave));
    }
  }, [containers, isClient]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeContainer = Object.keys(containers).find((key) =>
      containers[key as ContainerType].some((item) => item.id === active.id)
    ) as ContainerType;
  
    const overContainer = Object.keys(containers).find((key) =>
      containers[key as ContainerType].some((item) => item.id === over.id)
    ) as ContainerType;
  
    if (!activeContainer || !overContainer) return;
  
    // Prevenir mover el último elemento de cualquier contenedor
    if (containers[activeContainer].length === 1) return;
  
    const activeIndex = containers[activeContainer].findIndex((i) => i.id === active.id);
    const overIndex = containers[overContainer].findIndex((i) => i.id === over.id);
  
    if (activeContainer === overContainer) {
      setContainers((prev) => ({
        ...prev,
        [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex)
      }));
    } else {
      setContainers((prev) => {
        const newItems = [...prev[activeContainer]];
        const [removed] = newItems.splice(activeIndex, 1);
        removed.container = overContainer;
  
        return {
          ...prev,
          [activeContainer]: newItems,
          [overContainer]: [
            ...prev[overContainer].slice(0, overIndex),
            removed,
            ...prev[overContainer].slice(overIndex)
          ]
        };
      });
    }
  };

  if (!isClient) return null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="min-h-screen bg-black flex flex-col ">
        {/* Navbar */}
        <div className="w-full h-20 flex-shrink-0 overflow-y-auto min-h-[20px]   ">
          <SortableContext 
            items={containers.navbar} 
            strategy={horizontalListSortingStrategy}
          >
            {containers.navbar.map((card) => (
              <SortableItem key={card.id} id={card.id}>
                <card.component className="w-full h-full" />
              </SortableItem>
            ))}
            {containers.navbar.length === 0 && (
      <div className="w-full h-full bg-gray-800/50   border-dashed"></div>
    )}
          </SortableContext>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* Content */}
          <div className="w-4/6 h-full flex flex-col space-y-4 pr-2   ">
            <SortableContext 
              items={containers.content}
              strategy={verticalListSortingStrategy}
            >
              {containers.content.map((card) => (
                <SortableItem key={card.id} id={card.id}>
                  <card.component className="w-full" />
                </SortableItem>
              ))}
               {containers.content.length === 0 && (
      <div className="w-full h-full bg-gray-800/50   border-dashed"></div>
    )}
            </SortableContext>
          </div>

          {/* Aside */}
          <div className="w-2/6 h-full flex flex-col space-y-4 pl-2  ">
            <SortableContext 
              items={containers.aside}
              strategy={verticalListSortingStrategy}
            >
              {containers.aside.map((card) => (
                <SortableItem key={card.id} id={card.id}>
                  <card.component className="w-full py-9" />
                </SortableItem>
              ))}
               {containers.aside.length === 0 && (
      <div className="w-full h-full bg-gray-800/50   border-dashed"></div>
    )}
            </SortableContext>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full h-20 flex-shrink-0 overflow-y-auto ">
          <SortableContext 
            items={containers.footer}
            strategy={horizontalListSortingStrategy}
          >
            {containers.footer.map((card) => (
              <SortableItem key={card.id} id={card.id}>
                <card.component className="w-full h-full" />
              </SortableItem>
            ))}
             {containers.footer.length === 0 && (
      <div className="w-full h-full bg-gray-800/50   border-dashed"></div>
    )}
          </SortableContext>
        </div>

        <DragOverlay>
  {activeId ? (
    <div className="opacity-50">
      {(() => {
        const card = Object.values(containers)
          .flat()
          .find(c => c.id === activeId);
        
        return card ? React.createElement(card.component, { className: "w-full" }) : null;
      })()}
    </div>
  ) : null}
</DragOverlay>
      </div>
    </DndContext>
  );
}