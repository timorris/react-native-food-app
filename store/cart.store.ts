import { CartCustomization, CartStore, CartItemType } from "@/type";
import { create } from "zustand";

function areCustomizationsEqual(
    a: CartCustomization[] = [],
    b: CartCustomization[] = []
): boolean {
    if (a.length !== b.length) return false;

    const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
    const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

    return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    addItem: (item) => {
        const customizations = item.customizations ?? [];
        // Round the price to 2 decimal places to avoid floating-point precision issues
        const roundedPrice = Math.round(item.price * 100) / 100;

        const existing = get().items.find(
            (i) =>
                i.id === item.id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
        );

        if (existing) {
            set({
                items: get().items.map((i) =>
                    i.id === item.id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            set({
                items: [...get().items, { ...item, price: roundedPrice, quantity: 1, customizations }],
            });
        }
    },

    removeItem: (id, customizations = []) => {
        set({
            items: get().items.filter(
                (i) =>
                    !(
                        i.id === id &&
                        areCustomizationsEqual(i.customizations ?? [], customizations)
                    )
            ),
        });
    },

    increaseQty: (id, customizations = []) => {
        set({
            items: get().items.map((i) =>
                i.id === id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    decreaseQty: (id, customizations = []) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0),
        });
    },

    updateItem: (oldId: string, oldCustomizations: CartCustomization[], newItem: Omit<CartItemType, "quantity">) => {
        const roundedPrice = Math.round(newItem.price * 100) / 100;
        set({
            items: get().items.map((i) =>
                i.id === oldId &&
                areCustomizationsEqual(i.customizations ?? [], oldCustomizations)
                    ? { 
                        id: newItem.id,
                        name: newItem.name,
                        price: roundedPrice,
                        image_url: newItem.image_url,
                        quantity: i.quantity,
                        customizations: newItem.customizations
                      }
                    : i
            ),
        });
    },

    clearCart: () => set({ items: [] }),

    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () => {
        const total = get().items.reduce((total, item) => {
            return total + item.quantity * item.price;
        }, 0);
        // Round the total to 2 decimal places to avoid floating-point precision issues
        return Math.round(total * 100) / 100;
    },
}));