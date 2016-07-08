/**
 * Finds the index of an element within an array based on their id.
 */
function findIndex(arr, id) {
    var len = arr.length;

    while (len--) {
        if (arr[len].id === id) {
            return len;
        }
    }

    return -1;
}

/**
 * @param obj - the item to test
 * @returns {boolean} true if obj is an object but not an array.
 */
function isObject(obj) {
    return obj === Object(obj) && !Array.isArray(obj);
}

function roundTo3(number) {
    return game.math.roundTo(number, -3);
}

/**
 * Updates a Object's properties with the infoToUpdateWith's properties.
 * Uses a recursive structure to go into each object within an object.
 * @param objectToUpdate - an object to update
 * @param infoToUpdateWith - must use the same property names as in objectToUpdate.
 */
function updateObjectProperties(objectToUpdate, infoToUpdateWith) {
    for (var property in infoToUpdateWith) {
        if (property != "id") {
            if (infoToUpdateWith.hasOwnProperty(property)) {
                if (objectToUpdate.hasOwnProperty(property)) {
                    var resultingValue = infoToUpdateWith[property];

                    if (isObject(objectToUpdate[property])) {
                        updateObjectProperties(objectToUpdate[property], resultingValue);
                    } else {
                        objectToUpdate[property] = resultingValue;
                    }
                } else {
                    console.log("Can not update property '" + property + "' (property does not exist)");
                }
            }
        }
    }
}