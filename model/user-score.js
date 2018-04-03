const AV = require('../utils/av-live-query-weapp-min');

class UserScore extends AV.Object {
  get user() {
    return this.get('user');
  }
  set user(value) {
    this.set('user', value);
  }

  get score() {
    return this.get('score');
  }
  set score(value) {
    this.set('score', value);
  }
}

AV.Object.register(UserScore, 'UserScore');
module.exports = UserScore;