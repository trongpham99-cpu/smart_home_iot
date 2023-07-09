import {
    SafeAreaView,
    View,
    ImageBackground,
    StatusBar,
    Text,
    StyleSheet,
    Animated
}
    from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import background from '../../assets/images/QLNhietDoDoAmBackground.png';

function Welcome() {

    const navigation = useNavigation();

    const topMotion = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        let x = setTimeout(() => {
            Animated.timing(topMotion, { toValue: 50, duration: 1000, useNativeDriver: false }).start();
        }, 1000);
        let y = setTimeout(() => {
            navigation.navigate('InfoUser');
        }, 3000);
        return () => {
            clearInterval(x);
            clearInterval(y);
        }
    }, []);


    return (
        <ImageBackground style={styles.imageBackground} resizeMode='contain' source={background}>
            <StatusBar barStyle={'light-content'} />

            <SafeAreaView style={styles.safeArea}>
                <Animated.View style={[styles.wrapper, { marginTop: topMotion }]}>
                    <Text style={styles.title}>Ứng dụng quản lý nhiệt độ, độ ẩm, bụi mịn</Text>
                </Animated.View>
            </SafeAreaView>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    imageBackground: {
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
    },
    wrapper: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 600,
        textTransform: 'capitalize',
        textAlign: 'center',
        padding: 20,
        textShadowColor: 'grey',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 10
    }
});

export default Welcome;
