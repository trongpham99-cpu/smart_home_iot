import {
    SafeAreaView,
    View,
    StatusBar,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';


function InfoUser() {

    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [gender, setGender] = useState("1");
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');

    const genders = [
        { key: '1', value: 'Nam' },
        { key: '2', value: 'Nữ' },
    ];

    const handleLogin = () => {
        const errors = [];

        if (!username) errors.push('Vui lòng nhập họ và tên\n');
        if (!age) errors.push('Vui lòng nhập tuổi\n');
        if (!address) errors.push('Vui lòng nhập địa chỉ\n');

        if (errors.length > 0) {
            Alert.alert(
                'Thông báo lỗi',
                errors.join('\n'),
                [
                    { text: 'OK', onPress: () => console.log(), style: 'cancel' },
                ],
                { cancelable: true }
            );
        }
        else {
            const data = {
                username: username,
                gender: gender,
                age: age,
                address: address
            };

            AsyncStorage.setItem('userInfo', JSON.stringify(data));

            navigation.navigate('Home');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'light-content'} />
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Thông tin người dùng</Text>
                    </View>

                    {/* BODY */}
                    <View style={styles.body}>
                        <View style={styles.body_top}>
                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.text_name}>Họ tên</Text>
                                <View style={styles.input_group}>
                                    <Icon style={styles.text_icon} name='user' size={20} color={'black'} />
                                    <TextInput
                                        style={styles.text_input}
                                        placeholder='Nhập họ và tên'
                                        autoFocus
                                        value={username}
                                        onChangeText={(value) => setUsername(value)}
                                    />
                                </View>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.text_name}>Giới tính</Text>
                                <SelectList
                                    setSelected={setGender}
                                    data={genders}
                                    placeholder={"Chọn giới tính"}
                                    defaultOption={{ key: '1', value: 'Nam' }}
                                />
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.text_name}>Tuổi</Text>
                                <View style={styles.input_group}>
                                    <Icon style={styles.text_icon} name='info' size={20} color={'black'} />
                                    <TextInput
                                        style={styles.text_input}
                                        placeholder='Nhập tuổi'
                                        keyboardType='numeric'
                                        value={age}
                                        onChangeText={(value) => setAge(value)}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text style={styles.text_name}>Địa chỉ</Text>
                                <View style={styles.input_group}>
                                    <Icon style={styles.text_icon} name='map' size={20} color={'black'} />
                                    <TextInput
                                        style={styles.text_input}
                                        placeholder='Nhập địa chỉ'
                                        value={address}
                                        onChangeText={(value) => setAddress(value)}
                                    />
                                </View>
                            </View>

                            <View style={styles.view_btn_login}>
                                <TouchableOpacity style={styles.btn_login} onPress={handleLogin}>
                                    <Text style={styles.text_login}>Tiếp tục</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdf2c0'
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 16
    },
    content: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 5
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    body: {
        flex: 6
    },
    // header
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        color: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
        textShadowColor: '#bb0044'
    },
    // body
    body_top: {
        margin: 30,
    },
    input_group: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#ccc'
    },
    text_name: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'capitalize',
        marginBottom: 10
    },
    text_input: {
        // Đối với các thẻ TextInput nên cho flex là 1 để nó có chiều rộng, chiều cao full thằng cha
        flex: 1,
    },
    text_icon: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_btn_login: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    btn_login: {
        backgroundColor: 'red',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        padding: 10,
        backgroundColor: '#d2e1f0'
    },
    text_login: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase'
    }
});

export default InfoUser;
