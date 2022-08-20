const ResponseThread = require('../ResponseThread');

describe('a ResponseThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title',
    };

    // Action and Assert
    expect(() => new ResponseThread(payload)).toThrowError('RESPONSE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'title',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new ResponseThread(payload)).toThrowError('RESPONSE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create response thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title',
      owner: 'user-123',
    };

    // Action
    const { id, title, owner } = new ResponseThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
