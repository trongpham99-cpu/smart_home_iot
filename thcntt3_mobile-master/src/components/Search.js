import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState } from 'react';

function Search(props) {

    let { keySearch, onHandleChangeText, onHandleSubmitEditing } = props;

    return (
        <View style={styles.search}>
            <TextInput
                value={keySearch}
                onChangeText={onHandleChangeText}
                placeholder="Nhập nhiệt độ bạn muốn tìm kiếm: "
                placeholderTextColor="#929292"
                style={{ padding: 10 }}
                onSubmitEditing={onHandleSubmitEditing}
                keyboardType='numeric'
            />
            <Icon
                style={{ padding: 10 }}
                size={20}
                name="search"
            />
        </View>
    )
};

const styles = StyleSheet.create({
    search: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f8ff',
    },
});

export default Search;
