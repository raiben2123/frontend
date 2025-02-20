import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, children, width }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: width || '100%', // Usa el ancho especificado o 100% por defecto
    };

    return (
        <th 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className="px-4 py-2 text-left border"
        >
            {children}
        </th>
    );
};