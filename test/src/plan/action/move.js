/* jshint esnext: true */

import assert from 'assert';
import vec3 from 'vec3';
import move from '../../../../lib/src/plan/action/move';

describe('minecraft-bot plan action move', function () {
  it('should call navigate.walk when the move method is called', function () {
    var called = false;
    var mockBot = {
      entity: {
        position: vec3(1, 2, 3)
      },
      navigate: {
        walk: function () {
          called = true;
        }
      }
    };

    move(mockBot, [1, 0, 0]);

    assert(called, 'check navigate.walk method is called');
  });
});
