class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, owner, thread } = payload;

    this.thread = thread;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ content, owner, thread }) {
    if (!content || !owner || !thread) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof thread !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
