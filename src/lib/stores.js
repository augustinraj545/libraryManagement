import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const log = (config) => (set, get, api) =>
    config((...args) => {
        set(...args);
    }, get, api);

export const cartStore = create(
    persist(
        log((set, get) => ({
            cart: [],
            addItem: (item) =>
                set((state) => {
                    const existingItem = state.cart.find((_item) => _item.id === item.id);
                    if (existingItem) {
                        const updatedCart = state.cart.map((_item) =>
                            _item.id === item.id ? { ..._item, quantity: _item.quantity + 1 } : _item
                        );
                        return { cart: updatedCart };
                    } else {
                        return { cart: [...state.cart, { ...item, quantity: 1 }] };
                    }
                }),
            removeItem: (item) =>
                set((state) => {
                    const updatedCart = state.cart.map((_item) => {
                        if (_item.id === item.id) {
                            const updatedItem = { ..._item, quantity: _item.quantity - 1 };
                            return updatedItem.quantity > 0 ? updatedItem : null;
                        }
                        return _item;
                    });
                    return { cart: updatedCart.filter((item) => item !== null) };
                }),
            getTotal: () =>
                get().cart.reduce((total, item) => total + Math.round(item.saleInfo.listPrice.amount) * item.quantity, 0),
            getTotalQuantity: () =>
                get().cart.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0),
        })),
        {
            name: 'cart-storage',
            getStorage: () => sessionStorage, // Use sessionStorage for persistence
        }
    )
);