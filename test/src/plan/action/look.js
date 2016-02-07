/* jshint esnext: true */

import assert from 'assert';
import vec3 from 'vec3';
import look from '../../../../lib/src/plan/action/look';

describe('minecraft-bot plan action look', function () {
  it('should call lookAt when the look method is called', function () {
    var called = false;
    var mockBot = {
      entity: {
        position: vec3(1, 2, 3)
      },
      lookAt: function () {
        called = true;
      }
    };

    look(mockBot, [1, 0, 0]);

    assert(called, 'check lookAt method is called');
  });
});
