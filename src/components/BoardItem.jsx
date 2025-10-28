import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import clsx from 'clsx';

const BoardItem = memo(function BoardItem({ item, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: {
      type: item.type,
    },
  });

  return (
    <div
      className={clsx(
        'bg-white hover:bg-stone-100 shadow-md rounded-md p-4 cursor-pointer transform-3d',
        transform && `transform-[translate#d(${transform.x}px,${transform.y}px,0)]`,
        transition && `transition-[${transition}]`,
        isDragging && 'opacity-30 z-[1000]',
        !isDragging && 'opacity-100 z-[1]'
      )}
      onClick={() => onClick(item)}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <div
          className={clsx(
            'animate-pulse w-2 h-2 rounded-full',
            item.type === 'todo' && 'bg-green-500',
            item.type === 'inprogress' && 'bg-amber-500',
            item.type === 'done' && 'bg-red-500'
          )}
        ></div>
      </div>
      <p className="text-sm text-gray-500">{item.created_at}</p>
    </div>
  );
});

export default BoardItem;
