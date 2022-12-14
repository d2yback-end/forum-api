const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/DetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { title, body } = request.payload;
    const { id } = request.auth.credentials;

    const payload = {
      title,
      body,
      owner: id,
    };

    const addedThread = await addThreadUseCase.execute(payload);

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(201);
  }

  async getDetailThreadHandler(request, h) {
    const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
    const { threadId } = request.params;

    const payload = {
      threadId,
    };

    const { thread } = await detailThreadUseCase.execute(payload);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
