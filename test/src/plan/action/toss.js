
/* jshint esnext: true */

import assert from 'assert';
import toss from '../../../../lib/src/plan/toss';

describe('minecraft-bot plan action toss', function () {
  it('should call tossStack when the toss method is called', function () {
    var called = false;
    var mockBot = {
      tossStack: function () {
        called = true;
      }
    };

    toss(mockBot, undefined);

    assert(called, 'check toss method is called');
  });
});
