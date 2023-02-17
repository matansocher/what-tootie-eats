const { ALL_GOOD_MESSAGES, A_LOT_OF_NO_NO_FOODS_MESSAGE, NO_NO_FOODS, NO_NO_RESPONSES } = require('./config');

function findTootieNoNoFoods(message) {
    const noNoFoodsFound = [];
    NO_NO_FOODS.forEach(noNoFood => {
        if (message.includes(noNoFood)) {
            noNoFoodsFound.push(noNoFood);
        }
    });
    return noNoFoodsFound;
}

function createResponseMessage(noNoFoodsArr) {
    if (!noNoFoodsArr || !noNoFoodsArr.length) {
        return ALL_GOOD_MESSAGES[Math.floor(Math.random() * ALL_GOOD_MESSAGES.length)];
    }

    let response = [];
    if (noNoFoodsArr.length > 2) {
        response.push(A_LOT_OF_NO_NO_FOODS_MESSAGE);
    }

    noNoFoodsArr.forEach(noNoFood => {
        const randomResponse = NO_NO_RESPONSES[Math.floor(Math.random() * NO_NO_RESPONSES.length)];
        response.push(`${randomResponse.replace('{food}', noNoFood)}`);
    });

    return response.join('\n');
}

module.exports = {
    findTootieNoNoFoods,
    createResponseMessage,
}
