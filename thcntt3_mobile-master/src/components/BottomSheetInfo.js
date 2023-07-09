import React, { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
}
    from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet from '@gorhom/bottom-sheet';
import User from '../../assets/images/User-info.svg.png';

function BottomSheetInfo() {
    const [data, setData] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('userInfo')
            .then((user) => {
                const data = JSON.parse(user);
                setData(data);
            })
            .catch((error) => {
                console.log(`Fail to get data: ${error}`);
            });
    }, []);

    const sheetRef = useRef(null);
    const snapPointSheet = useMemo(() => ["3%", "25%"], []); // 2% tương ứng với index 0,  30% tương ứng với index 1, 
    const handleSheetChange = useCallback(index => {
    }, []);

    return (
        <BottomSheet ref={sheetRef} snapPoints={snapPointSheet} index={0} enablePanDownToClose={true} onChange={handleSheetChange}>
            {
                data ?
                    <View style={styles.container}>
                        <Image style={[styles.image, styles.content_left]} resizeMode='stretch' source={User} />
                        <View style={styles.content_right}>
                            <Text style={styles.text}>Họ và tên: {data.username}</Text>
                            <Text style={styles.text}>Giới tính: {data.gender === '1' ? 'Nam' : 'Nữ'}</Text>
                            <Text style={styles.text}>Tuổi: {data.age}</Text>
                            <Text style={styles.text}>Địa chỉ: {data.address}</Text>
                        </View>
                    </View>
                    :
                    <View style={styles.container}>
                        <Text style={styles.text}>No Data</Text>
                    </View>
            }
        </BottomSheet>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        backgroundColor: '#B9DEE2'
    },
    content_left: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    content_right: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 20
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10
    },
})

export default BottomSheetInfo;
