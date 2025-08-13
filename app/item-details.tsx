import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomizationItem {
  id: string;
  name: string;
  image: any;
  price: number;
  type: "topping" | "side";
}

const ItemDetails = () => {
  const router = useRouter();
  const { item } = useLocalSearchParams<{ item: string }>();
  const { addItem } = useCartStore();
  
  // Parse the item data from the route params
  const itemData: MenuItem = item ? JSON.parse(decodeURIComponent(item)) : null;
  
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);

  if (!itemData) {
    return (
      <SafeAreaView className="bg-white flex-1 justify-center items-center">
        <Text className="text-lg">Item not found</Text>
      </SafeAreaView>
    );
  }

  const toppings: CustomizationItem[] = [
    { id: "tomato", name: "Tomato", image: images.tomatoes, price: 0.7, type: "topping" },
    { id: "onions", name: "Onions", image: images.onions, price: 0.5, type: "topping" },
    { id: "cheese", name: "Cheese", image: images.cheese, price: 1.0, type: "topping" },
    { id: "bacon", name: "Bacons", image: images.bacon, price: 2.0, type: "topping" },
  ];

  const sides: CustomizationItem[] = [
    { id: "fries", name: "Fries", image: images.fries, price: 3.5, type: "side" },
    { id: "coleslaw", name: "Coleslaw", image: images.coleslaw, price: 2.5, type: "side" },
    { id: "salad", name: "Salad", image: images.salad, price: 4.5, type: "side" },
    { id: "onionRings", name: "Pringles", image: images.onionRings, price: 4.0, type: "side" },
  ];

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingId) 
        ? prev.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const toggleSide = (sideId: string) => {
    setSelectedSides(prev => 
      prev.includes(sideId) 
        ? prev.filter(id => id !== sideId)
        : [...prev, sideId]
    );
  };

  const calculateTotalPrice = () => {
    const toppingsPrice = selectedToppings.reduce((total, id) => {
      const topping = toppings.find(t => t.id === id);
      return total + (topping?.price || 0);
    }, 0);
    
    const sidesPrice = selectedSides.reduce((total, id) => {
      const side = sides.find(s => s.id === id);
      return total + (side?.price || 0);
    }, 0);
    
    return itemData.price + toppingsPrice + sidesPrice;
  };

  const handleAddToCart = () => {
    const customizations = [
      ...selectedToppings.map(id => {
        const topping = toppings.find(t => t.id === id);
        return {
          id: topping?.id || id,
          name: topping?.name || id,
          price: topping?.price || 0,
          type: "topping"
        };
      }),
      ...selectedSides.map(id => {
        const side = sides.find(s => s.id === id);
        return {
          id: side?.id || id,
          name: side?.name || id,
          price: side?.price || 0,
          type: "side"
        };
      })
    ];

    addItem({
      id: itemData.$id,
      name: itemData.name,
      price: calculateTotalPrice(),
      image_url: itemData.image_url,
      customizations
    });
    
    router.back();
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={images.arrowBack} className="w-6 h-6" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={images.search} className="w-6 h-6" />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View className="px-5">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {itemData.name}
              </Text>
              <Text className="text-gray-600 mb-3">{itemData.type}</Text>
              
              {/* Rating and Price */}
              <View className="flex-row items-center mb-3">
                <View className="flex-row items-center mr-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Image key={star} source={images.star} className="w-4 h-4 mr-1" />
                  ))}
                  <Text className="text-sm text-gray-600 ml-1">{itemData.rating}/5</Text>
                </View>
                <Text className="text-2xl font-bold text-orange-500">
                  ${calculateTotalPrice().toFixed(2)}
                </Text>
              </View>

              {/* Nutritional Info */}
              <View className="flex-row mb-3">
                <View className="mr-6">
                  <Text className="text-sm text-gray-500">Calories</Text>
                  <Text className="text-sm font-semibold">{itemData.calories} Cal</Text>
                </View>
                <View className="mr-6">
                  <Text className="text-sm text-gray-500">Protein</Text>
                  <Text className="text-sm font-semibold">{itemData.protein}g</Text>
                </View>
                <View>
                  <Text className="text-sm text-gray-500">Bun Type</Text>
                  <Text className="text-sm font-semibold">Whole Wheat</Text>
                </View>
              </View>
            </View>

            {/* Product Image */}
            <View className="ml-4">
              <Image 
                source={{ uri: itemData.image_url }} 
                className="w-32 h-32 rounded-lg"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Delivery Info - Outside px-5 container for full width */}
        <View className="bg-gray-50 rounded-lg p-3 mb-4 mx-4 w-full">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1 justify-center">
              <Image source={images.dollar} className="w-4 h-4 mr-2" />
              <Text className="text-sm">Free Delivery</Text>
            </View>
            <View className="flex-row items-center flex-1 justify-center">
              <Image source={images.clock} className="w-4 h-4 mr-2" />
              <Text className="text-sm">20 - 30 mins</Text>
            </View>
            <View className="flex-row items-center flex-1 justify-center">
              <Image source={images.star} className="w-4 h-4 mr-2" />
              <Text className="text-sm">4.5</Text>
            </View>
          </View>
        </View>

        {/* Description and Customizations */}
        <View className="px-5">
          {/* Description */}
          <Text className="text-gray-700 leading-6 mb-6">
            {itemData.description}
          </Text>

          {/* Toppings Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3">Toppings</Text>
            <View className="flex-row flex-wrap justify-between">
              {toppings.map((topping) => (
                <View key={topping.id} className="w-[48%] bg-gray-50 rounded-lg p-3 mb-3">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1">
                      <Image source={topping.image} className="w-8 h-8 mr-2" />
                      <Text className="text-sm font-medium">{topping.name}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleTopping(topping.id)}
                      className={`w-6 h-6 rounded-full items-center justify-center ${
                        selectedToppings.includes(topping.id) ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    >
                      <Image 
                        source={images.plus} 
                        className="w-3 h-3" 
                        style={{ tintColor: selectedToppings.includes(topping.id) ? 'white' : 'black' }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Side Options Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3">Side options</Text>
            <View className="flex-row flex-wrap justify-between">
              {sides.map((side) => (
                <View key={side.id} className="w-[48%] bg-gray-50 rounded-lg p-3 mb-3">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1">
                      <Image source={side.image} className="w-8 h-8 mr-2" />
                      <Text className="text-sm font-medium">{side.name}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleSide(side.id)}
                      className={`w-6 h-6 rounded-full items-center justify-center ${
                        selectedSides.includes(side.id) ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    >
                      <Image 
                        source={images.plus} 
                        className="w-3 h-3" 
                        style={{ tintColor: selectedSides.includes(side.id) ? 'white' : 'black' }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View className="px-5 py-4 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-orange-500 rounded-lg py-4 items-center"
        >
          <Text className="text-white font-semibold text-lg">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ItemDetails;
