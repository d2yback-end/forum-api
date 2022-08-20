const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ResponseComment = require('../../../Domains/comments/entities/ResponseComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new Comment', async () => {
      // Arrange
      const newComment = new NewComment({
        thread: 'thread-123',
        content: 'content',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'adi',
        password: 'adi',
        fullname: 'adi munawar',
      });

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return new comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        thread: 'thread-123',
        content: 'content',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'adi',
        password: 'adi',
        fullname: 'adi munawar',
      });

      // Action
      const responseComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(responseComment).toStrictEqual(
        new ResponseComment({
          id: 'comment-123',
          content: 'content',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw NotFoundError if comment not available', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      const id = 'comment-123';

      // Action & Assert
      await expect(commentRepository.checkAvailabilityComment(id))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if comment available', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      const id = 'comment-123';
      const commentPayload = {
        id: 'comment-123',
        thread: 'thread-123',
        content: 'content',
        owner: 'user-123',
      };
      const threadPayload = {
        id: 'thread-123',
        body: 'body',
        owner: 'user-123',
      };
      const userPayload = {
        username: 'adi',
        password: 'adi',
      };
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThreads(threadPayload);
      await CommentsTableTestHelper.addComments(commentPayload);

      // Action & Assert
      await expect(commentRepository.checkAvailabilityComment(id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('isOwner function', () => {
    it('should throw AuthorizationError if comment not belong to owner', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const id = 'comment-123';
      const owner = 'user-123';

      // Action & Assert
      await expect(commentRepositoryPostgres.isOwner(id, owner))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError if comment is belongs to owner', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentPayload = {
        id: 'comment-123',
        thread: 'thread-123',
        content: 'content',
        owner: 'user-123',
      };
      const threadPayload = {
        id: 'thread-123',
        body: 'body',
        owner: 'user-123',
      };
      const userPayload = {
        username: 'adi',
        password: 'adi',
      };
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThreads(threadPayload);
      await CommentsTableTestHelper.addComments(commentPayload);

      // Action & Assert
      await expect(commentRepositoryPostgres.isOwner(commentPayload.id, commentPayload.owner))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment', () => {
    it('should delete comment from database', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      const id = 'comment-123';
      const commentPayload = {
        id: 'comment-123',
        thread: 'thread-123',
        content: 'content',
        owner: 'user-123',
      };
      const threadPayload = {
        id: 'thread-123',
        body: 'body',
        owner: 'user-123',
      };
      const userPayload = {
        username: 'adi',
        password: 'adi',
      };
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThreads(threadPayload);
      await CommentsTableTestHelper.addComments(commentPayload);

      // Action
      await commentRepository.deleteComment(id);

      // Assert
      const comment = await CommentsTableTestHelper.isDelete(id);
      expect(comment).toEqual(true);
    });
  });

  describe('getDetailComment function', () => {
    it('should get comments of thread if thread available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentPayload = {
        id: 'comment-123',
        thread: 'thread-123',
        content: 'content',
        owner: 'user-123',
      };
      const threadPayload = {
        id: 'thread-123',
        body: 'body',
        owner: 'user-123',
      };
      const userPayload = {
        username: 'adi',
        password: 'adi',
      };
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThreads(threadPayload);
      await CommentsTableTestHelper.addComments(commentPayload);

      const comments = await commentRepositoryPostgres.getDetailComment(threadPayload.id);

      expect(Array.isArray(comments)).toBe(true);
      expect(comments[0].id).toEqual(commentPayload.id);
      expect(comments[0].username).toEqual(userPayload.username);
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toEqual('content');
    });
  });
});
