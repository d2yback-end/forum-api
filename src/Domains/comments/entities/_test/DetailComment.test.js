const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      abc: 'abc',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      comments: {},
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should remap comments data correctly', () => {
    const payload = {
      comments: [
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
      ],
    };

    const { comments } = new DetailComment(payload);

    const expectedComment = [
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
    ];

    expect(comments).toEqual(expectedComment);
  });
});
