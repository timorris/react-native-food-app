import { MenuItem } from "@/type";
import { Image, Platform, Text, TouchableOpacity } from 'react-native';
import { useCartStore } from "../store/cart.store";
import { useRouter } from "expo-router";

const MenuCard = ({ item }: { item: MenuItem}) => {
    const { $id, image_url, name, price } = item;
    const imageUrl = `${image_url}`;
    const { addItem } = useCartStore();
    const router = useRouter();

    const handleCardPress = () => {
        const itemData = encodeURIComponent(JSON.stringify(item));
        router.push(`/item-details?item=${itemData}` as any);
    };

    const handleAddToCart = (e: any) => {
        e.stopPropagation();
        addItem({ id: $id, name, price, image_url: imageUrl, customizations: []});
    };

    return (
        <TouchableOpacity 
            className="menu-card" 
            style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'}: {}}
            onPress={handleCardPress}
        >
            <Image source={{ uri: imageUrl }} className="size-32 absolute -top-10" resizeMode="contain" />
            <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>{name}</Text>
            <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>
            <TouchableOpacity onPress={handleAddToCart}>
                <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
export default MenuCard