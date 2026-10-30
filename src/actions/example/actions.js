import {
    createFetchAction,
    createMutationAction,
    stripPaginationParams,
} from '../shared';
import { exampleQueryKeys } from './queryKeys';

// --- Queries ---

export const getExampleAction = createFetchAction({
    queryKey: exampleQueryKeys.example,
    path: '/example',
    method: 'GET',
    sanitizeBody: stripPaginationParams,
});

// --- Mutations ---

export const saveEditExampleAction = createMutationAction({ path: '/save/edit' });

export const deleteExampleAction = createMutationAction({
    path: '/api/delete/{id}',
    method: 'DELETE',
    invalidateQueryKeys: [exampleQueryKeys.example],
    mapPayload: (data) => ({ id: data.id }),
});
