import { CustomInputProps } from '@/type';
import cn from 'clsx';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const CustomInput = ({ 
	placeholder = 'Enter text', 
	value, 
	onChangeText, 
	label, 
	secureTextEntry = false, 
	keyboardType="default"
} : CustomInputProps) => {

	const [isFocused, setIsFocused] = useState(false);

	return (
		<View className="w-full">

			<Text className={label}>{label}</Text>

			<TextInput className={cn('input', isFocused ? 'border-primary' : 'border-gray-300')}
			  autoCapitalize='none'
				autoCorrect={false}
				placeholder={placeholder} 
				placeholderTextColor={'#888'}
				secureTextEntry={secureTextEntry} 
				value={value} 
				onChangeText={onChangeText} 
				keyboardType={keyboardType}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
			/>
		</View>
	);
};

export default CustomInput;