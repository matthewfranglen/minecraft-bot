
/* jshint esnext: true */

import assert from 'assert';
import say from '../../../../lib/src/plan/say';

describe('minecraft-bot plan action say', function () {
  it('should call chat when the say method is called', function () {
    var called = false;
    var mockBot = {
      chat: function () {
        called = true;
      }
    };

    say(mockBot);

    assert(called, 'check chat method is called');
  });
});
