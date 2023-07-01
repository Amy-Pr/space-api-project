const order = false;

const breakfastPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        if(order) {
            resolve('Your order is ready. Come and get it!'); //What is passed to the resolve method is available to be used in the "then" method.

        } else {
            reject(Error('Your order cannot be made.')); //'Error' not needed but helps with debugging.
        }
        
    }, 3000)

});

console.log(breakfastPromise)
//To get the promise value out of the promise object (consume it), use the then() method. 
//It can be called to handle fulfilled and rejected promises.
//The catch method only handles rejections, or errors.
breakfastPromise
    .then(value => console.log(value))
    .catch( error => console.log(error));
