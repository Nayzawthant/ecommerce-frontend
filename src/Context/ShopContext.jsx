// import React, { createContext, useState } from "react";
// import all_product from "../Components/Assets/all_product";

// export const ShopContext = createContext(null);

// const getDefaultCart = () => {
//     let cart = {};
//     for (let index = 0; index < all_product.length+1; index++) {
//         cart[index] = 0;
//     }
//     return cart;
// }
// const ShopContextProvider = (props) => {

//     const [cartItems, setCartItems] = useState(getDefaultCart());
    

//     const addToCart = (itemId) => {
//         setCartItems((prev) => ({...prev,[itemId]:prev[itemId]+1}));
//         console.log(cartItems);
//     }

//     const removeFromCart = (itemId) => {
//         setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}))
//     }

//     // const getTotalCartAmount = () => {
//     //     let totalAmount = 0;
//     //     for(const item in cartItems)
//     //     {
//     //         if(cartItems[item]>0) {
//     //             let itemInfo = all_product.find((product)=>product.id===Number(item))
//     //             totalAmount += itemInfo.new_price * cartItems[item];
//     //         } else {
//     //             console.log("false");
//     //         }
//     //         return totalAmount;
//     //     }
//     // }
//     const getTotalCartAmount = () => {
//         let totalAmount = 0;
    
//         cartItems.forEach((quantity, itemId) => {
//             if (quantity > 0) {
//                 let itemInfo = all_product.find((product) => product.id === Number(itemId));
//                 if (itemInfo) {
//                     totalAmount += itemInfo.new_price * quantity;
//                 } else {
//                     console.log("Item not found in product list");
//                 }
//             } else {
//                 console.log("Quantity should be greater than 0");
//             }
//         });
    
//         return totalAmount;
//     };
    
    
//     const contextValue = {getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart};

//     return (
//         <ShopContext.Provider value={contextValue}>
//             {props.children}
//         </ShopContext.Provider>
//     )
// }

// export default ShopContextProvider;


import React, { createContext, useState } from "react";
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    const cart = {};
    all_product.forEach(product => {
        cart[product.id] = 0;
    });
    return cart;
}

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());

    const addToCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: prev[itemId] + 1 };
            console.log(updatedCart);
            return updatedCart;
        });
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: Math.max(0, prev[itemId] - 1) };
            console.log(updatedCart);
            return updatedCart;
        });
    }

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
