//Given Rentals JSON object
let obj = {
    "products": [
        {
            "id": 1,
            "name": "Adult Male Bike",
            "price": 20.50,
            "image": "http://via.placeholder.com/250x250?text=Adult%20Male%20Bike",
            "product_type": "bike"
        },
        {
            "id": 2,
            "name": "Adult Female Bike",
            "price": 20.50,
            "image": "http://via.placeholder.com/250x250?text=Adult%20Female%20Bike",
            "product_type": "bike"
        },
        {
            "id": 3,
            "name": "Kids Unisex Bike",
            "price": 12.75,
            "image": "http://via.placeholder.com/250x250?text=Kids%20Unisex%20Bike",
            "product_type": "bike"
        },
        {
            "id": 4,
            "name": "Adult Unisex Helmet",
            "price": 4.00,
            "image": "http://via.placeholder.com/250x250?text=Adult%20Unisex%20Helmet",
            "product_type": "accessory"
        },
        {
            "id": 5,
            "name": "Kids Unisex Helmet",
            "price": 3.50,
            "image": "http://via.placeholder.com/250x250?text=Kids%20Unisex%20Helmet",
            "product_type": "accessory"
        },
        {
            "id": 6,
            "name": "Insurance",
            "price": 9.99,
            "image": "http://via.placeholder.com/250x250?text=Insurance",
            "product_type": "addon"
        }
    ]
};

//Main Div on page
let rentals = document.querySelector('.bikeRentals');

//page variables 
let total = 0;
let cart = {};
let count = 0;


// takes in type of product and returns cards to screen reflective of bikes vs accessory vs addon
function addProduct(type, max = 10) {
    let products = obj.products.map((product) => {

        if (product.product_type == type) {
            createCard(product, max, type);
        }// end if

    })
}// end addProduct


// for initial screen with bike selection run addProduct function with type = bike
addProduct('bike');


// creates button to move along application
let addItem = document.createElement('button');
addItem.innerHTML = "Go To Accessories";
addItem.classList.add('btn-primary', 'btn');
addItem.setAttribute('disabled', true);
addItem.addEventListener('click', function () {
    while (rentals.firstChild) rentals.removeChild(rentals.firstChild);
    let bikes = ['Adult Female Bike', 'Adult Male Bike', 'Kids Unisex Bike'];

    for (let item in bikes) {
        if (!cart[bikes[item]]) cart[bikes[item]] = { qty: 0 };
    }

    let totalAdultHelmets = cart['Adult Female Bike'].qty + cart['Adult Male Bike'].qty;
    let totalHelmets = totalAdultHelmets + cart['Kids Unisex Bike'].qty;

    if (count == 0) {
        count++;
        addProduct('accessory', totalAdultHelmets);
        rentals.append(addItem);
        addItem.innerHTML = "Go To Insurance";

    } else if (count == 1){
        count++;
        addProduct('addon', totalHelmets);
        rentals.append(addItem);
        addItem.innerHTML = "Review Order";
    } else if ( count == 2){
        let list = document.createElement('ul');

        for(let item in cart){
            if(cart[item].qty > 0){
                let lineItem = document.createElement('li');
                lineItem.innerHTML = cart[item].qty + " " +  cart[item].name + " = $"  +  parseFloat(cart[item].price * cart[item].qty).toFixed(2);
                list.append(lineItem);
            }
        }
        
        let lineItemTotal = document.createElement('h4');
        lineItemTotal.innerHTML = "TOTAL: $" + total.toFixed(2);
        rentals.append(list);
        rentals.append(lineItemTotal);

        let checkout = document.createElement('button');
        checkout.classList.add('btn-primary', 'btn');
        checkout.innerHTML = "CHECKOUT";
        checkout.addEventListener('click', function(){
            while (rentals.firstChild) rentals.removeChild(rentals.firstChild);
            let thankYou = document.createElement('h1');
            thankYou.innerHTML = "Thank you for your order";
            rentals.append(thankYou);
        })
        rentals.append(checkout);
    }
});

rentals.append(addItem);

//makes the cards shown on screen with data from JSON object using Bootstrap classes
function createCard(product, max, type) {
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'mb-3');
    if(type == 'accessory'){
        if(cart['Adult Female Bike'].qty + cart['Adult Male Bike'].qty == 0 && product.name == 'Adult Unisex Helmet' ){
            cardDiv.classList.add('hide');
        }else if (cart['Kids Unisex Bike'].qty == 0 && product.name == 'Kids Unisex Helmet' ) {
            cardDiv.classList.add('hide');
        }     
    }

    let ngDiv = document.createElement('div');
    ngDiv.classList.add('row', 'no-gutters');
    let imgDiv = document.createElement('div');
    imgDiv.classList.add('col-md-4');

    let image = document.createElement('img');
    image.setAttribute('src', product.image);
    image.classList.add('card-img');
    image.setAttribute('alt', product.name);

    imgDiv.append(image);
    ngDiv.append(imgDiv);


    let colDiv = document.createElement('div');
    colDiv.classList.add('col-md-8');
    let cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');

    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerHTML = product.name;
    let cardPrice = document.createElement('p');
    cardPrice.classList.add('card-text');
    cardPrice.innerHTML = '$' + parseFloat(product.price).toFixed(2);

    let qForm = document.createElement('form');
    let qSubmit = document.createElement('input');
    let quantity = document.createElement('input');
    qSubmit.setAttribute('type', 'submit');
    qSubmit.setAttribute('value', 'Add-Cart');
    quantity.setAttribute('name', 'quantity');
    quantity.setAttribute('type', 'number');
    quantity.setAttribute('value', 0);
    quantity.setAttribute('min', 0);
    quantity.setAttribute('max', max);
    qForm.append(quantity);
    qForm.append(qSubmit);
    cardBodyDiv.append(cardTitle);
    cardBodyDiv.append(cardPrice);
    cardBodyDiv.append(qForm);//was quantity
    colDiv.append(cardBodyDiv);
    ngDiv.append(colDiv);
    cardDiv.append(ngDiv);
    qForm.addEventListener('submit', function (e) {
        e.preventDefault();
        cart[product.name] = {
            qty: parseInt(this.quantity.value),
            name: product.name,
            price: parseFloat(product.price).toFixed(2)            
        }
        total = total += (this.quantity.value * product.price);
        qForm.removeChild(qForm.childNodes[1]);
        console.log(total > 0);
        if(total > 0){
            addItem.removeAttribute('disabled');
        }
    })


    rentals.append(cardDiv);
}