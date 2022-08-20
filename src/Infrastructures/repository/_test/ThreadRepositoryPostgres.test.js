const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ResponseThread = require('../../../Domains/threads/entities/ResponseThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'adi',
        password: 'adi',
        fullname: 'adi munawar',
      });

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return new thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'adi',
        password: 'adi',
        fullname: 'adi munawar',
      });

      // Action
      const responseThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(responseThread).toStrictEqual(
        new ResponseThread({
          id: 'thread-123',
          title: 'title',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw NotFoundError if thread not available', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool);
      const id = 'thread-123';

      // Action & Assert
      await expect(threadRepository.checkAvailabilityThread(id))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if thread available', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool);
      const id = 'thread-123';

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

      // Action & Assert
      await expect(threadRepository.checkAvailabilityThread(id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getDetailThread function', () => {
    it('should get detail thread if thread available', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      const userPayload = {
        username: 'adi',
        password: 'adi',
      };
      const threadPayload = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
      };
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThreads(threadPayload);

      // Action
      const thread = await threadRepository.getDetailThread(threadPayload.id);

      expect(thread.id).toEqual(threadPayload.id);
      expect(thread.title).toEqual(threadPayload.title);
      expect(thread.body).toEqual(threadPayload.body);
      expect(thread.username).toEqual(userPayload.username);
    });
  });
});
