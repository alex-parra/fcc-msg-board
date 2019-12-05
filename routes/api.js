'use strict';

import threadController from '../controllers/thread';
import replyController from '../controllers/reply';
import models from '../models';
import threadResource from '../resources/thread';

module.exports = function(app) {
  app
    .route('/api/threads/:board')
    .get(threadController.index)
    .post(threadController.store)
    .put(threadController.report)
    .delete(threadController.destroy);

  app
    .route('/api/replies/:board')
    .get(replyController.index)
    .post(replyController.store)
    .put(replyController.report)
    .delete(replyController.destroy);
};
