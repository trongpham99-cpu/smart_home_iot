import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    StatusBar,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import { updateData } from '../apis';
import { useNavigation, useRoute } from '@react-navigation/native';
import Notification from './Notification';

const widthOfDevice = Dimensions.get('window').width;
const heightOfDevice = Dimensions.get('window').height;

function Update() {

    const route = useRoute();
    const { _id, temperature: temperatureDt, humidity: humidityDt, dust: dustDt, ...others } = route.params;

    const [temperature, setTemperature] = useState(temperatureDt.toString());
    const [humidity, setHumidity] = useState(humidityDt.toString());
    const [dust, setDust] = useState(dustDt.toString());


    const [isValidTemperature, setIsValidTemperature] = useState(true);
    const [isValidHumidity, setIsValidHumidity] = useState(true);
    const [isValidDust, setIsValidDust] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

    const navigation = useNavigation();

    const verifyNumber = (value) => {
        const regex = new RegExp(/^[0-9]*\.?[0-9]+$/);
        if (!value) return true;
        if (regex.test(value)) {
            return true;
        }
        return false;
    };

    const onHandleUpdateData = async () => {
        const errors = [];

        if (!temperature) errors.push('Vui lòng nhập nhiệt độ\n');
        if (!humidity) errors.push('Vui lòng nhập độ ẩm\n');
        if (!dust) errors.push('Vui lòng nhập bụi mịn\n');

        if (!isValidTemperature) errors.push('Nhiệt độ không hợp lệ\n');
        if (!isValidHumidity) errors.push('Độ ẩm không hợp lệ\n');
        if (!isValidDust) errors.push('Bụi mịn không hợp lệ\n');

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
                id: _id,
                temperature: temperature,
                humidity: humidity,
                dust: dust
            };
            await updateData(data)
                .then(() => {
                    setShowModal(true);
                    setMessage('Cập nhật dữ liệu thành công');
                })
                .catch(() => {
                    setShowModal(false);
                    setMessage('Cập nhật dữ liệu thất bại');
                })
                .finally(() => {
                    setTemperature('');
                    setHumidity('');
                    setDust('');
                    setTimeout(() => {
                        setShowModal(false);
                        navigation.navigate('List');
                    }, 1500);
                })
        }
    };

    const onHandleClose = () => {
        setShowModal(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle={'light-content'} />
                <Notification message={message} visible={showModal} onHandleClose={onHandleClose}></Notification>
                <View style={styles.wrapper}>

                    <View style={styles.title}>
                        <Text style={styles.content_title}>Cập nhật dữ liệu</Text>
                    </View>

                    <View style={styles.viewFields}>
                        <View style={styles.item}>
                            <Text style={styles.label}>Nhiệt độ</Text>
                            <TextInput
                                style={styles.input}
                                autoFocus
                                value={temperature}
                                onChangeText={(value) => {
                                    setTemperature(value);
                                    const isValid = verifyNumber(value);
                                    isValid ? setIsValidTemperature(true) : setIsValidTemperature(false)
                                }}
                                keyboardType='numeric' />
                            <Text style={styles.error}>{isValidTemperature ? '' : 'Nhiệt độ không hợp lệ'}</Text>
                        </View>

                        <View style={styles.item}>
                            <Text style={styles.label}>Độ ẩm</Text>
                            <TextInput
                                style={styles.input}
                                value={humidity}
                                onChangeText={(value) => {
                                    setHumidity(value);
                                    const isValid = verifyNumber(value);
                                    isValid ? setIsValidHumidity(true) : setIsValidHumidity(false)
                                }}
                                keyboardType='numeric' />
                            <Text style={styles.error}>{isValidHumidity ? '' : 'Độ ẩm không hợp lệ'}</Text>
                        </View>

                        <View style={styles.item}>
                            <Text style={styles.label}>Bụi mịn</Text>
                            <TextInput
                                style={styles.input}
                                value={dust}
                                onChangeText={(value) => {
                                    setDust(value);
                                    const isValid = verifyNumber(value);
                                    isValid ? setIsValidDust(true) : setIsValidDust(false)
                                }}
                                keyboardType='numeric' />
                            <Text style={styles.error}>{isValidDust ? '' : 'Bụi mịn không hợp lệ'}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.btn} onPress={() => onHandleUpdateData()}>
                        <Text>Cập nhật</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFE0'
    },
    wrapper: {
        width: '100%',
        height: '100%',
    },
    title: {
        marginTop: 100,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#87CEFA',
    },
    content_title: {
        color: '#000',
        fontSize: 24,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    viewFields: {
        width: '100%',
        height: '50%',
        marginTop: 0.05 * heightOfDevice,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    item: {
        width: '80%',
        height: 50,
        marginVertical: 50,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    label: {
        color: '#000',
        fontSize: 18,
        fontWeight: 700,
        textTransform: 'capitalize',
        marginBottom: 5
    },
    input: {
        height: '100%',
        width: '100%',
        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#000000',
        paddingLeft: 10,
        marginBottom: 5
    },
    error: {
        color: 'red',
        fontSize: 12,
        fontWeight: 500,
        fontStyle: 'italic',
        marginTop: 5
    },
    btn: {
        alignSelf: 'center',
        marginTop: 20,
        width: 150,
        padding: 15,
        backgroundColor: '#F5FFFA',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },

});

export default Update;
