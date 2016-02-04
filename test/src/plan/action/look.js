
/* jshint esnext: true */

import assert from 'assert';
import look from '../../../../lib/src/plan/action/look';

describe('minecraft-bot plan action look', function () {
  it('should call lookAt when the look method is called', function () {
    var called = false;
    var mockBot = {
      entity: { position: { offset: function () {} } },
      lookAt: function () {
        called = true;
      }
    };

    look(mockBot);

    assert(called, 'check lookAt method is called');
  });
});
