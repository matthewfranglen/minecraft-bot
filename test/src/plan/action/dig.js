/* jshint esnext: true */

import assert from 'assert';
import dig from '../../../../lib/src/plan/action/dig';
import block from '../../../../lib/src/thing/block';

describe('minecraft-bot plan action dig', function () {
  it('should call dig when the dig method is called', function () {
    var called = false;
    var mockBot = {
      entity: {
        position: {
          offset: function () {},
          distanceTo: function () {
            return 0;
          }
        }
      },
      blockAt: function () {
        return block.constant.DIRT;
      },
      canDigBlock: function () {
        return true;
      },
      once: function () {},
      dig: function () {
        called = true;
      }
    };

    dig(mockBot);

    assert(called, 'check dig method is called');
  });
});
