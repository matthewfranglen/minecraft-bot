// Provides the concept of desire and how to satisfy desire.
//
// A desire might be to have more hearts.
//  -> That would require food and time.
//    -> Food is bread.
//    -> Bread requires wheat and a crafting station.
//      -> wheat requires seeds and tilled wet dirt
//        -> seeds requires digging grass blocks
//        -> tilled wet dirt requires a hoe and wet dirt
//          -> wet dirt requires dirt and water
//          -> Hoe is Wood Hoe
//          -> Wood Hoe requires wood sticks and wood planks
//            -> sticks requires wood planks
//            -> wood planks require wood
//              -> wood requires digging trees

// This defines the logical approach to handling desires. The basic information
// required is found in knowledge/block.json, knowledge/item.json, knowledge/craft.json
//
// node-minecraft-data: mcData.blocksByName["stone"]

// The concrete knowledge of desires is found in knowledge/desire.json
