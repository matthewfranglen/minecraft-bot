/* jshint esnext: true */

import assert from 'assert';
import vec3 from 'vec3';
import point from '../../../lib/src/thing/point';

describe('minecraft-bot thing point', function () {
  var mockBot = {
    entity: {
      position: vec3(1, 2, 3)
    }
  };
  var expected = vec3(2, 4, 6);

  it('should handle offsets represented as arrays', function () {
    var result = point.offsetToPoint(mockBot, [1, 2, 3]);

    assert(result, 'check absolute point is created');
    assert.deepEqual(result, expected, 'check correct point is created');
  });

  it('should handle offsets represented as vec3', function () {
    var result = point.offsetToPoint(mockBot, vec3(1, 2, 3));

    assert(result, 'check absolute point is created');
    assert.deepEqual(result, expected, 'check correct point is created');
  });
});
