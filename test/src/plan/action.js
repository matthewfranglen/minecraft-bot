/* jshint esnext: true */

import assert from 'assert';
import action from '../../../lib/src/plan/action';

describe('minecraft-bot plan action', function () {
  it('should have the use method', function () {
    assert(action.use, 'check use method is created');
  });

  it('should have the toss method', function () {
    assert(action.toss, 'check toss method is created');
  });

  it('should have the equip method', function () {
    assert(action.equip, 'check equip method is created');
  });

  it('should have the look method', function () {
    assert(action.look, 'check look method is created');
  });

  it('should have the move method', function () {
    assert(action.move, 'check move method is created');
  });

  it('should have the dig method', function () {
    assert(action.dig, 'check dig method is created');
  });

  it('should have the say method', function () {
    assert(action.say, 'check say method is created');
  });
});
