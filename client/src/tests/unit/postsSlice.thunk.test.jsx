import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchPosts, addPost } from '../../store/postsSlice';

describe('postsSlice async thunk', () => {
  let originalFetch;
  beforeAll(() => {
    originalFetch = global.fetch;
  });
  afterAll(() => {
    global.fetch = originalFetch;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  const makeStore = () => configureStore({ reducer: { posts: reducer } });

  it('handles fetchPosts success', async () => {
    const data = [{ _id: '1', title: 'A' }];
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => data });
    const store = makeStore();
    await store.dispatch(fetchPosts());
    const state = store.getState().posts;
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(data);
  });

  it('handles fetchPosts failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    const store = makeStore();
    await store.dispatch(fetchPosts());
    const state = store.getState().posts;
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Failed');
  });

  it('handles pending/fulfilled/rejected reducers directly', () => {
    const initial = { items: [], status: 'idle', error: null };
    const loading = reducer(initial, { type: fetchPosts.pending.type });
    expect(loading.status).toBe('loading');

    const payload = [{ _id: '2', title: 'B' }];
    const success = reducer(initial, { type: fetchPosts.fulfilled.type, payload });
    expect(success.status).toBe('succeeded');
    expect(success.items).toEqual(payload);

    const failure = reducer(initial, { type: fetchPosts.rejected.type, error: { message: 'Boom' } });
    expect(failure.status).toBe('failed');
    expect(failure.error).toBe('Boom');
  });
});
