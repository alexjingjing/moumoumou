const AV = require('../utils/av-live-query-weapp-min');

class UserInfo extends AV.Object {
  get user() {
    return this.get('user');
  }
  set user(value) {
    this.set('user', value);
  }

  get info() {
    return this.get('info');
  }
  set info(value) {
    this.set('info', value);
  }
}

AV.Object.register(UserInfo, 'UserInfo');
module.exports = UserInfo;