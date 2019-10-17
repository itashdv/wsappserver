const extractAllergens = (input) => {
    return new Promise((resolve, reject) => {
        let isArray = Array.isArray(input);
        if (isArray) {
            resolve(input);
        } else {
            let allergens = [];
            allergens.push(input);
            resolve(allergens);
        }
    });
}

module.exports = extractAllergens;