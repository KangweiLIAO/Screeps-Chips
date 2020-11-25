// TODO: create comments
/**
 @constructor
 @abstract
 */

var structStructure = function() {
    if (this.constructor === structStructure) {
      throw new Error("Abstract class cannot be instantiated.");
    }
    // Creep initialization...
};

/**
 @abstract
 */
structStructure.prototype.test = function() {
    throw new Error("Abstract method called.");
}

module.exports = structStructure;