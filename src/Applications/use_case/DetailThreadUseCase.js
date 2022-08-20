const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = new DetailThread(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(threadId);
    const thread = await this._threadRepository.getDetailThread(threadId);

    const detailComment = await this._commentRepository.getDetailComment(threadId);
    const { comments } = new DetailComment({ comments: detailComment });

    thread.comments = comments;
    return {
      thread,
    };
  }
}

module.exports = DetailThreadUseCase;
