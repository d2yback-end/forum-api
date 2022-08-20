const ResponseComment = require('../ResponseComment');

describe('a ResponseComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
    };

    // Action and Assert
    expect(() => new ResponseComment(payload)).toThrowError('RESPONSE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'content',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new ResponseComment(payload)).toThrowError('RESPONSE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create response comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new ResponseComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
