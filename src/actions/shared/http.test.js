import axiosInstance from '../../instance';
import {
    deleteRequest,
    downloadBlob,
    fillPath,
    post,
    postWithoutBody,
    stripPaginationParams,
    uploadFile,
} from './http';

vi.mock('../../instance', () => ({
    default: { post: vi.fn(), delete: vi.fn() },
}));

const ok = (envelope = { success: true, data: null }) => ({ data: envelope });

beforeEach(() => {
    vi.resetAllMocks();
});

describe('post', () => {
    it('posts to the path and resolves with the response', async () => {
        axiosInstance.post.mockResolvedValue(ok());

        const response = await post('/save')({ name: 'a' });

        expect(axiosInstance.post).toHaveBeenCalledWith('/save', { name: 'a' });
        expect(response).toEqual(ok());
    });

    it('applies mapPayload before sending', async () => {
        axiosInstance.post.mockResolvedValue(ok());

        await post('/save', (data) => ({ wrapped: data }))({ id: 1 });

        expect(axiosInstance.post).toHaveBeenCalledWith('/save', { wrapped: { id: 1 } });
    });

    it('throws with the envelope message on success: false', async () => {
        axiosInstance.post.mockResolvedValue({
            data: { success: false, message: 'Nope' },
        });

        await expect(post('/save')({})).rejects.toThrow('Nope');
    });
});

describe('postWithoutBody', () => {
    it('posts with no body', async () => {
        axiosInstance.post.mockResolvedValue(ok());

        await postWithoutBody('/ping')();

        expect(axiosInstance.post).toHaveBeenCalledWith('/ping');
    });
});

describe('fillPath', () => {
    it('replaces placeholders with URL-encoded values', () => {
        expect(fillPath('/api/delete/{id}', { id: 'a b' })).toBe('/api/delete/a%20b');
    });

    it('throws when a placeholder value is missing', () => {
        expect(() => fillPath('/api/delete/{id}', {})).toThrow(
            'Missing "id" for /api/delete/{id}'
        );
    });
});

describe('deleteRequest', () => {
    it('sends DELETE to the filled path with no body', async () => {
        axiosInstance.delete.mockResolvedValue(ok());

        const response = await deleteRequest('/api/delete/{id}')({ id: 7 });

        expect(axiosInstance.delete).toHaveBeenCalledWith('/api/delete/7');
        expect(response).toEqual(ok());
    });

    it('reads the id through mapPayload', async () => {
        axiosInstance.delete.mockResolvedValue(ok());

        await deleteRequest('/api/delete/{id}', (data) => ({ id: data.exmId }))({
            exmId: 3,
        });

        expect(axiosInstance.delete).toHaveBeenCalledWith('/api/delete/3');
    });

    it('throws with the envelope message on success: false', async () => {
        axiosInstance.delete.mockResolvedValue({
            data: { success: false, message: 'Not found' },
        });

        await expect(deleteRequest('/api/delete/{id}')({ id: 7 })).rejects.toThrow(
            'Not found'
        );
    });
});

describe('stripPaginationParams', () => {
    it('removes start, limit and searchTerm but keeps the rest', () => {
        expect(
            stripPaginationParams({
                start: 0,
                limit: 10,
                searchTerm: 'x',
                status: 'ACTIVE',
            })
        ).toEqual({ status: 'ACTIVE' });
    });
});

describe('downloadBlob', () => {
    it('requests a blob and returns the data', async () => {
        axiosInstance.post.mockResolvedValue({ data: 'BLOB' });

        const blob = await downloadBlob('/export', { id: 1 });

        expect(axiosInstance.post).toHaveBeenCalledWith(
            '/export',
            { id: 1 },
            { responseType: 'blob' }
        );
        expect(blob).toBe('BLOB');
    });
});

describe('uploadFile', () => {
    it('clears the Content-Type so the browser sets the multipart boundary', async () => {
        axiosInstance.post.mockResolvedValue(ok());
        const formData = new FormData();

        await uploadFile('/upload', formData);

        expect(axiosInstance.post).toHaveBeenCalledWith('/upload', formData, {
            headers: { 'Content-Type': undefined },
        });
    });
});
