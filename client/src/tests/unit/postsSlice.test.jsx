import reducer, { addPost } from '../../store/postsSlice';

describe('postsSlice reducer', () => {
  it('handles addPost', () => {
    const initial = { items: [], status: 'idle', error: null };
    const result = reducer(initial, addPost({ _id: '1', title: 'Post 1' }));
    expect(result.items.length).toBe(1);
    expect(result.items[0].title).toBe('Post 1');
  });
});
