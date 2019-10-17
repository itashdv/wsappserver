const extractArr = (str, itemId) => {
    return new Promise((resolve, reject) => {
        if (str === '') {
            resolve([]);
        } else {
            let finalArr = [];
            let arr = str.replace(/ /g, '').split(',');
            arr.map(item => {
                let allergen = {
                    itemId: itemId,
                    name: item
                }
                finalArr.push(allergen);
            });
            resolve(finalArr);
        }
    });
}

module.exports = extractArr;