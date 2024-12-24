import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        whiteSpace: 'nowrap', // Asegura que el contenido no se envuelva
    };

    return (
        <th ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </th>
    );
};