var uuid = require('node-uuid');

exports.uuid = function (context, data) {
if (data.message !== undefined) {
      // Everything is ok
      console.log(data.message);
      context.success(data.message);
  } else {
    context.success(uuid.v4());
  }
};
