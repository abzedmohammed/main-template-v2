import {
    extractList,
    getEnvelopeMessage,
    getEnvelopeResult,
    getEnvelopeTotal,
    getResponseRefreshToken,
    getResponseToken,
    getResponseUserId,
} from './envelope';

// A full Axios response: the envelope lives under `.data`.
const axiosResponse = (envelope) => ({ status: 200, data: envelope });

describe('getEnvelopeResult', () => {
    it('reads the business payload from a raw Axios response', () => {
        const response = axiosResponse({
            success: true,
            data: { result: { usrId: '42' } },
        });

        expect(getEnvelopeResult(response)).toEqual({ usrId: '42' });
    });

    it('reads the payload when given the already-unwrapped envelope', () => {
        const envelope = { success: true, data: { result: { usrId: '42' } } };

        expect(getEnvelopeResult(envelope)).toEqual({ usrId: '42' });
    });

    it('returns null for an acknowledgement-only response (data: null)', () => {
        expect(
            getEnvelopeResult(axiosResponse({ success: true, data: null }))
        ).toBeNull();
    });
});

describe('getEnvelopeMessage', () => {
    it('returns the envelope message string', () => {
        const response = axiosResponse({ message: 'Saved', data: null });

        expect(getEnvelopeMessage(response)).toBe('Saved');
    });

    it('unwraps a nested message object', () => {
        const response = axiosResponse({ message: { message: 'Nested' }, data: null });

        expect(getEnvelopeMessage(response)).toBe('Nested');
    });

    it('falls back when no message is present', () => {
        expect(getEnvelopeMessage(axiosResponse({ data: null }), 'Default')).toBe(
            'Default'
        );
    });
});

describe('extractList', () => {
    it('returns an array unchanged', () => {
        expect(extractList([1, 2])).toEqual([1, 2]);
    });

    it('pulls the array out of common wrapper keys', () => {
        expect(extractList({ content: [{ id: 1 }] })).toEqual([{ id: 1 }]);
        expect(extractList({ notifications: [{ id: 2 }] })).toEqual([{ id: 2 }]);
    });

    it('returns an empty array when there is no list', () => {
        expect(extractList({ foo: 'bar' })).toEqual([]);
        expect(extractList(null)).toEqual([]);
    });
});

describe('getEnvelopeTotal', () => {
    it('reads the envelope total', () => {
        expect(getEnvelopeTotal(axiosResponse({ total: 12, data: { result: [] } }))).toBe(
            12
        );
    });

    it('falls back to the given default', () => {
        expect(getEnvelopeTotal(axiosResponse({ data: { result: [] } }), 0)).toBe(0);
    });
});

describe('token + id readers', () => {
    it('reads the access token from result.accessToken or result.token', () => {
        expect(
            getResponseToken(axiosResponse({ data: { result: { accessToken: 'a' } } }))
        ).toBe('a');
        expect(
            getResponseToken(axiosResponse({ data: { result: { token: 'b' } } }))
        ).toBe('b');
    });

    it('reads the refresh token', () => {
        expect(
            getResponseRefreshToken(
                axiosResponse({ data: { result: { refreshToken: 'r' } } })
            )
        ).toBe('r');
    });

    it('reads the user id across usrId / userId / nested user', () => {
        expect(
            getResponseUserId(axiosResponse({ data: { result: { usrId: '1' } } }))
        ).toBe('1');
        expect(
            getResponseUserId(axiosResponse({ data: { result: { userId: '2' } } }))
        ).toBe('2');
        expect(
            getResponseUserId(
                axiosResponse({ data: { result: { user: { usrId: '3' } } } })
            )
        ).toBe('3');
    });

    it('returns null when the field is absent', () => {
        expect(getResponseToken(axiosResponse({ data: { result: {} } }))).toBeNull();
        expect(getResponseUserId(axiosResponse({ data: { result: {} } }))).toBeNull();
    });
});
