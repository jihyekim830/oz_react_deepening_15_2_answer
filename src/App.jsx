import { DndContext, DragOverlay, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import Boards from './components/Boards';
import Controller from './components/Controller';
import BoardItem from './components/BoardItem';
import { useState } from 'react';
import { useBoardStore } from './store';
import { arrayMove } from '@dnd-kit/sortable';

function App() {
  const { data, updateBoardType, reorderBoards } = useBoardStore();
  const [activeId, setActiveId] = useState(null);
  const activeItem = activeId && data.find((item) => item.id === activeId);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragStart = (e) => {
    if (e.active.id !== activeId) setActiveId(e.active.id);
  };
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over || !active || !activeItem) {
      setActiveId(null);
      return;
    }

    const activeItemType = active.data.current.type;
    const overItemType = over.data.current.type;
    if (activeItemType !== overItemType && active.id !== over.id)
      updateBoardType(active.id, over.data.current.type ?? over.id);
    if (activeItemType === overItemType && active.id !== over.id) {
      const activeIndex = data.findIndex((item) => item.id === active.id);
      const overIndex = data.findIndex((item) => item.id === over.id);
      const newData = arrayMove(data, activeIndex, overIndex);

      reorderBoards(newData);
      setActiveId(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen">
        <header className="w-full h-[80px] bg-slate-800 flex flex-col items-center justify-center text-stone-100">
          <p className="text-lg font-semibold">Kanban Board Project</p>
          <p>Chapter 2. Zustand</p>
        </header>
        <main className="flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-3 gap-4 p-4 w-full">
            <Boards type={'todo'} />
            <Boards type={'inprogress'} />
            <Boards type={'done'} />
          </div>
          <Controller />
        </main>
        <footer className="w-full h-[60px] bg-slate-800 flex items-center text-stone-100 justify-center">
          <p>&copy; OZ-CodingSchool</p>
        </footer>
      </div>
      <DragOverlay>{activeId && activeItem && <BoardItem item={activeItem} />}</DragOverlay>
    </DndContext>
  );
}

export default App;
