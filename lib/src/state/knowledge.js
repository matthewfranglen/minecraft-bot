/* jshint esnext: true */

// Records and provides information about the state of the world.

import db from './database';

// The block has the following information:
// * type - stone, air, dirt etc
// * position - x, y, z coordinate in space
// * time - the time at which the observation was taken
//
// There will be a lot of blocks recorded.
// Therefore a data warehouse approach has been taken to schema design.
//
// The fact table is a single observation of a block:
// * observation_id (surrogate key)
// * block_type_id (type foreign key)
// * position_id (position foreign key)
// * observation_timestamp (timestamp)
//
// The block type is a dimension:
// * block_type_id (surrogate key)
// * block_name (text)
//
// The position is a dimension:
// * position_id (surrogate key)
// * x (bigint)
// * y (bigint)
// * z (bigint)
//
// These tables may be expanded in future.

var recordBlock = function (block) {
  var position = block.position.floored();
  var insert = 'INSERT INTO observation (block_name, position_id) SELECT $1, position_id FROM position WHERE position.x = $2 AND position.y = $3 AND position.z = $4';
  var values = [block.name, position.x, position.y, position.z];

  return populatePosition(position).then(function () {
    db.update(insert, values);
  });
};

// The blocks are completely known so the dimension for them should be populated in advance.

var populateBlocks = function () {

};

// The position is likely to be created on demand as more blocks are discovered than change.

var populatePosition = function (position) {
  var upsert = 'INSERT INTO position(x, y, z) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING';
  var values = [position.x, position.y, position.z];

  return db.update(upsert, values);
};
