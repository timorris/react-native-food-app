import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CartItem = ({ item }: { item: CartItemType }) => {
    const { increaseQty, decreaseQty, removeItem } = useCartStore();
    const router = useRouter();

    const handleItemPress = () => {
        // Create a menu item object from cart item for the details page
        const menuItem = {
            $id: item.id,
            name: item.name,
            price: item.price,
            image_url: item.image_url,
            description: "Item from cart", // We'll need to get this from the original menu item
            calories: 0, // We'll need to get this from the original menu item
            protein: 0, // We'll need to get this from the original menu item
            rating: 0, // We'll need to get this from the original menu item
            type: "Item" // We'll need to get this from the original menu item
        };
        
        const itemData = encodeURIComponent(JSON.stringify({
            menuItem,
            cartItem: item,
            isEditMode: true
        }));
        
        router.push(`/item-details?item=${itemData}` as any);
    };

    const handleQuantityChange = (e: any, action: 'increase' | 'decrease') => {
        e.stopPropagation();
        if (action === 'increase') {
            increaseQty(item.id, item.customizations!);
        } else {
            decreaseQty(item.id, item.customizations!);
        }
    };

    return (
        <View className="cart-item">
            <TouchableOpacity 
                className="flex flex-row items-center gap-x-3 flex-1"
                onPress={handleItemPress}
            >
                <View className="cart-item__image">
                    <Image
                        source={{ uri: item.image_url }}
                        className="size-4/5 rounded-lg"
                        resizeMode="cover"
                    />
                </View>

                <View className="flex-1">
                    <Text className="base-bold text-dark-100">{item.name}</Text>
                    <Text className="paragraph-bold text-primary mt-1">
                        ${item.price}
                    </Text>

                    <View className="flex flex-row items-center gap-x-4 mt-2">
                        <TouchableOpacity
                            onPress={(e) => handleQuantityChange(e, 'decrease')}
                            className="cart-item__actions"
                        >
                            <Image
                                source={images.minus}
                                className="size-1/2"
                                resizeMode="contain"
                                tintColor={"#FF9C01"}
                            />
                        </TouchableOpacity>

                        <Text className="base-bold text-dark-100">{item.quantity}</Text>

                        <TouchableOpacity
                            onPress={(e) => handleQuantityChange(e, 'increase')}
                            className="cart-item__actions"
                        >
                            <Image
                                source={images.plus}
                                className="size-1/2"
                                resizeMode="contain"
                                tintColor={"#FF9C01"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => removeItem(item.id, item.customizations!)}
                className="flex-center"
            >
                <Image source={images.trash} className="size-5" resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
};

export default CartItem;