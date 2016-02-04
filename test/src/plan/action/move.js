
/* jshint esnext: true */

import assert from 'assert';
import move from '../../../../lib/src/plan/move';

describe('minecraft-bot plan action move', function () {
  it('should call navigate.walk when the move method is called', function () {
    var called = false;
    var mockBot = {
      entity: { position: { offset: function () {} } },
      navigate: {
        walk: function () {
          called = true;
        }
      }
    };

    move(mockBot);

    assert(called, 'check navigate.walk method is called');
  });
});
