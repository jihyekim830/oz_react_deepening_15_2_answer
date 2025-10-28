import { memo, useCallback, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import clsx from 'clsx';
import { useBoardStore } from '../store';
import BoardDetailModal from './BoardDetailModal';
import BoardConfirmModal from './BoardConfirmModal';
import BoardEditModal from './BoardEditModal';
import BoardItem from './BoardItem';

const typeToKorean = (type) => {
  switch (type) {
    case 'todo':
      return '할 일';
    case 'inprogress':
      return '진행 중';
    case 'done':
      return '완료';
    default:
      return type;
  }
};

const Boards = memo(function Boards({ type }) {
  const { setNodeRef, isOver } = useDroppable({
    id: type,
    data: {
      type,
      accepts: ['todo', 'inprogress', 'done'],
    },
  });
  const { data } = useBoardStore();
  const filteredData = data.filter((item) => item.type === type);
  const [item, setItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Detail Modal
  const handleModalOpen = useCallback((item) => {
    setItem(item);
    setIsOpen(true);
  }, []);
  const handleModalClose = () => {
    setItem(null);
    setIsOpen(false);
  };

  // Delete Confirm Modal
  const handleConfirmModalOpen = (id) => {
    setSelectedId(id);
    handleModalClose();
    setConfirmIsOpen(true);
  };
  const handleConfirmModalClose = () => {
    setConfirmIsOpen(false);
    setSelectedId(null);
  };

  // Edit Modal
  const handleEditModalOpen = () => {
    setEditIsOpen(true);
    setIsOpen(false);
  };
  const handleEditModalClose = () => {
    setEditIsOpen(false);
  };

  return (
    <div
      className={clsx('w-full flex flex-col', isOver && 'bg-slate-200 rounded-md ring-2 ring-slate-400 ring-inset')}
      ref={setNodeRef}
    >
      <div className="w-full h-[60px] bg-stone-200 rounded-sm flex items-center justify-center">
        <p className="text-lg font-semibold">{typeToKorean(type)}</p>
      </div>
      <div className="flex flex-col gap-2 p-4 min-h-[300px]">
        <SortableContext items={filteredData} strategy={verticalListSortingStrategy}>
          {filteredData.length === 0 ? (
            <div className="min-h-[300px] border-2 border-dashed border-slate-300 rounded-md flex items-center justify-center text-slate-400">
              이 영역으로 항목을 드래그하세요
            </div>
          ) : (
            filteredData.map((item) => <BoardItem key={item.id} item={item} onClick={handleModalOpen} />)
          )}
        </SortableContext>
      </div>
      {isOpen && (
        <BoardDetailModal
          onClose={handleModalClose}
          onConfirm={handleConfirmModalOpen}
          onEdit={handleEditModalOpen}
          item={item}
        />
      )}
      {confirmIsOpen && <BoardConfirmModal onClose={handleConfirmModalClose} id={selectedId} />}
      {editIsOpen && <BoardEditModal onClose={handleEditModalClose} item={item} />}
    </div>
  );
});

export default Boards;
