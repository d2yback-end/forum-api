const DetailThreadUseCase = require('../DetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the Detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const thread = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2022',
      username: 'adi',
    };

    const comments = [
      {
        id: 'comment-123',
        username: 'adi',
        date: '2022',
        content: 'content',
        is_deleted: false,
      },
      {
        id: 'comment-321',
        username: 'dicoding',
        date: '2022',
        content: 'content',
        is_deleted: true,
      },
    ];

    /** mocking needed function */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getDetailComment = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    /** creating use case instance */
    const getThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getDetailThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getDetailComment)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(detailThread).toStrictEqual({
      thread: {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        date: '2022',
        username: 'adi',
        comments: [
          {
            id: 'comment-123',
            username: 'adi',
            date: '2022',
            content: 'content',
          },
          {
            id: 'comment-321',
            username: 'dicoding',
            date: '2022',
            content: '**komentar telah dihapus**',
          },
        ],
      },
    });
  });
});
