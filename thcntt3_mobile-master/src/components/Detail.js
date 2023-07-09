import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    Modal,
    StyleSheet
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

function Detail(props) {

    const { item, visible, onHandleClose } = props;

    const opacityMotion = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let x = setTimeout(() => {
            Animated.timing(opacityMotion, { toValue: 1, duration: 800, useNativeDriver: false }).start();
        }, 800);
        return () => {
            clearInterval(x);
        }
    }, []);

    return (
        item
            ?
            <Modal visible={visible} transparent={true} >
                <Animated.View style={[styles.wrapper, { opacity: opacityMotion }]}>
                    <View style={styles.content}>

                        {/* HEADER */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Thông tin chi tiết</Text>
                        </View>

                        {/* BODY */}
                        <View>
                            <Text style={styles.body}>Id: {item._id}</Text>
                            <Text style={styles.body}>Nhiệt độ: {item.temperature}</Text>
                            <Text style={styles.body}>Độ ẩm: {item.humidity}</Text>
                            <Text style={styles.body}>Bụi mịn: {item.dust}</Text>
                            <Text style={styles.body}>Ngày tạo: {item.date}</Text>
                            <Text style={styles.body}>Giờ tạo: {item.time}</Text>
                        </View>

                        {/* FOOTER */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.btn_footer} onPress={onHandleClose}>
                                <Text style={styles.title}>Đóng</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Animated.View>
            </Modal>
            : ''
    )
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'rgba(00,00,00,.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    content: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 700,
        color: '#000',
        textTransform: 'capitalize'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    body: {
        fontSize: 14,
        fontWeight: 500,
        textAlign: 'center',
        marginVertical: 5
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    btn_footer: {
        width: '60%',
        backgroundColor: '#ffff66',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    }
});

export default Detail;
