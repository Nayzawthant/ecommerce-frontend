


import React, { createContext, useEffect, useState } from "react";


export const ShopContext = createContext(null);

// const getDefaultCart = () => {
//     const cart = {};
//     all_product.forEach(product => {
//         cart[product.id] = 0;
//     });
//     return cart;
// }
const getDefaultCart = () => {
    const defaultCart = Array.from({ length: 301 }, (_, index) => index).reduce((cart, itemId) => {
        cart[itemId] = 0;
        return cart;
    }, {});

    return defaultCart;
};

const ShopContextProvider = (props) => {

    const [all_product, setAll_Product] = useState([]);

    const [cartItems, setCartItems] = useState(getDefaultCart());

    console.log("cartitems", cartItems)

    useEffect(() => {
        fetch('http://localhost:5000/allproducts') 
        .then((response) => response.json())
        .then((data) => setAll_Product(data))

        const authToken = localStorage.getItem('auth-token');
        if(authToken) {
            fetch('http://localhost:5000/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'Content-Type': 'application/json',
                    'auth-token': authToken,
                },
                body: "",
            }).then((response)=>response.json())
            .then((data) => setCartItems(data));
        }
    },[])

    const addToCart = async (itemId) => {
        try {
            // Update local state
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    
            // Check if the user is authenticated
            const authToken = localStorage.getItem('auth-token');
            if (authToken) {
                // Perform asynchronous fetch
                const response = await fetch('http://localhost:5000/addtocart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': authToken,
                    },
                    body: JSON.stringify({"itemId":itemId }),
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to add item to cart. Status: ${response.status}`);
                }
    
                const data = await response.json();
                // Handle successful response data
                console.log(data);
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error('An unexpected error occurred:', error.message);
            // You can add additional error handling logic here
        }
    };
    

    const removeFromCart = async (itemId) => {
        try {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
            
            // Check if the user is authenticated
            const authToken = localStorage.getItem('auth-token');

            if (authToken) {
                const response = await fetch('http://localhost:5000/removefromcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': authToken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId: itemId }),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                } else {
                    console.error('Failed to remove item from cart.');
                }
            }
        } catch (error) {
            console.error('Error in removeFromCart:', error);
        }
    };
    

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        Object.entries(cartItems).forEach(([itemId, quantity]) => {
            if (quantity > 0) {
                const itemInfo = all_product.find((product) => product.id === Number(itemId));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * quantity;
                } else {
                    console.log("Item not found in product list");
                }
            } else {
                console.log("Quantity should be greater than 0");
            }
        });

        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for(const item in cartItems) {
            if(cartItems[item]>0)
            {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
