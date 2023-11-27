// DndContext.js
import { createContext, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

const DndContext = createContext({});

export function useDndContext() {
  return useContext(DndContext);
}

export function DndProvider({ children }) {
  const contextValue = {
    useDrag,
    useDrop,
  };

  return (
    <DndContext.Provider value={contextValue}>{children}</DndContext.Provider>
  );
}
