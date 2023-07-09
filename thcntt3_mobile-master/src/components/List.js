import {
    SafeAreaView,
    View,
    Image,
    StatusBar,
    Text,
    StyleSheet,
    Animated,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    Alert
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getAll, deleteData, getDetail, updateData } from '../apis';
import UpArrowIcon from '../../assets/images/up-arrow.png';
import DownArrowIcon from '../../assets/images/down-arrow.png';
import EmptyIcon from '../../assets/images/empty.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import Search from './Search';
import Notification from './Notification';
import Detail from './Detail';
import BottomSheetInfo from './BottomSheetInfo';
import Dashboard from './Dashboard';

function List() {

    const [listData, setListData] = useState([]);
    const [isLoading, setShowLoading] = useState(true);
    const [keySearch, setKeySearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [showDetail, setShowDetail] = useState(false);
    const [item, setItem] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    let listViewRef;

    const scrollX = React.useRef(new Animated.Value(0)).current;
    const scrollY = React.useRef(new Animated.Value(0)).current;

    const sheetRef = useRef(null);
    const snapPointSheet = ["40%"]; // Ta chỉ muốn snapPointSheet hiển thị tối đa 40% chiều cao toàn bộ màn hình (Nó sẽ hiển thị phía dưới cùng màn hình)

    const navigation = useNavigation();

    const getListData = async () => {
        const data = await getAll();
        setListData(data.data.data);
        listData ? setShowLoading(false) : setShowLoading(true);
    };

    useEffect(() => {
        getListData();
        return () => { };
    }, [listData]);

    const onHandleChangeText = (value) => setKeySearch(value);

    const onHandleSubmitEditing = (event) => {
        const text = event.nativeEvent.text;
    };

    const showRenderItem = ({ item, index }) => {

        const ITEM_SIZE = 100 + 5 + 5 + 5 + 5;

        const scale = scrollY.interpolate({
            inputRange: [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)],
            outputRange: [1, 1, 1, 0]
        });

        const opacity = scrollY.interpolate({
            inputRange: [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 0.6)],
            outputRange: [1, 1, 1, 0]
        });


        return (
            <Animated.View style={[styles.item, { backgroundColor: showColorItem(index), transform: [{ scale }], opacity }]}>
                <View style={styles.left_item}>
                    <Text style={styles.text}>Nhiệt độ: {item.temperature} °C</Text>
                    <Text style={styles.text}>Độ ẩm: {item.humidity} %</Text>
                    <Text style={styles.text}>Nồng độ bụi: {item.dust} mg/m3</Text>
                </View>
                <View style={styles.right_item}>
                    <TouchableOpacity style={[styles.btn_common, styles.btn_info]}>
                        <Icon name='info' size={30} color='white' onPress={() => onHandleDetail(item._id)} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btn_common, styles.btn_delete]} onPress={() => onHandleDelete(item._id)}>
                        <Icon name='trash' size={30} color='white' />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btn_common, styles.btn_edit]}>
                        <Icon name='edit' size={30} color='white' onPress={() => onHandleUpdate(item)} />
                    </TouchableOpacity>
                </View>
                <View>
                </View>
            </Animated.View>
        )
    };

    const showListEmpty = () => {
        return (
            <View style={styles.content_no_data}>
                <Text style={styles.text_no_data}>Dữ liệu rỗng</Text>
                <Image source={EmptyIcon} style={styles.icon_nodata} />
            </View>
        )
    };

    const showHeader = () => {
        return (
            <View style={styles.container}>
                <Text>
                    <Dashboard />
                </Text>
            </View>
        )
    };

    const showFooter = () => {
        return (
            <View style={[styles.content_header_footer, styles.content_footer]}>
                <Text style={styles.text_header_footer}>Bởi Nguyễn Minh Đô</Text>
                <TouchableOpacity style={styles.button_header_footer} onPress={handleButtonUp}>
                    <Image source={UpArrowIcon} style={styles.icon} />
                </TouchableOpacity>
            </View>
        )
    };

    const showItemSeparator = () => {
        return (
            <View style={styles.separator}></View>
        )
    };

    const showColorItem = (index) => {
        let color = '';
        index % 2 === 0 ? color = '#F7F9F9' : color = '#BFC9CA';
        return color;
    };

    const onHandleRefreshPage = () => {
        setListData([]);
        getListData();
    };

    const handleButtonDown = () => {
        console.log('handleButtonDown');
        listViewRef.scrollToEnd({ animated: true });
    };

    const handleButtonUp = () => {
        console.log('handleButtonUp');
        listViewRef.scrollToOffset({ offset: 0, animated: true });
    };

    const deleteRecord = async (id) => {
        await deleteData(id)
            .then(() => {
                setShowModal(true);
                setMessage('Xóa dữ liệu thành công');
            })
            .catch(() => {
                setShowModal(false);
                setMessage('Xóa dữ liệu thất bại');
            })
            .finally(() => {
                getListData();
            })
    };

    const onHandleDelete = (id) => {
        Alert.alert(
            'Xóa dữ liệu',
            `Bạn có chắc chắn muốn xóa dữ liệu có id là: ${id}`,
            [
                { text: 'Có', onPress: () => deleteRecord(id) },
                { text: 'Không', onPress: () => console.log(), style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const onHandleUpdate = (item) => {
        navigation.navigate('Update', item);
    };

    const onHandleDetail = async (id) => {
        await getDetail(id)
            .then((data) => {
                setItem(data.data);
                setShowDetail(true);
            })
            .catch((error) => {
                setItem(null);
                setShowDetail(false);
            })
    };

    const onHandleClose = () => {
        setShowModal(false);
        setShowDetail(false);
    };

    const onHandleAdd = () => {
        navigation.navigate('Add');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'light-content'} />
            {
                isLoading
                    ? <ActivityIndicator style={styles.loading} size='large' color='red' />
                    :
                    <>
                        <Notification message={message} visible={showModal} onHandleClose={onHandleClose}></Notification>
                        <Detail item={item} visible={showDetail} onHandleClose={onHandleClose}></Detail>
                        <View style={styles.add}>
                            <Text style={styles.add_title}>Thêm dữ liệu</Text>
                            <TouchableOpacity style={[styles.btn_common, styles.btn_add]}>
                                <Icon name='plus' size={30} color='white' onPress={onHandleAdd} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.content_header_footer}>
                            <Dashboard></Dashboard>
                        </View>
                        <Animated.FlatList
                            data={listData}
                            renderItem={showRenderItem}
                            keyExtractor={(item) => item._id}
                            ItemSeparatorComponent={showItemSeparator}
                            ListEmptyComponent={showListEmpty}
                            // ListHeaderComponent={showHeader}
                            ListFooterComponent={showFooter}
                            ref={(ref) => listViewRef = ref}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isLoading}
                                    title='Đang loading...'
                                    size='large'
                                    colors={['yellow']}
                                    onRefresh={() => onHandleRefreshPage()}
                                />
                            }
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                        />
                        <BottomSheetInfo />
                    </>
            }
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    search: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f8ff',
        marginTop: 20,
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
        padding: 5,
        margin: 5
    },
    text: {
        fontSize: 18,
        fontWeight: 600,
        textAlign: 'left',
        marginVertical: 5
    },
    content_no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#f9f9f9',
        height: 555
    },
    text_no_data: {
        fontSize: 30,
        fontWeight: 700,
        textAlign: 'center',
        textTransform: 'uppercase',
        textShadowColor: 'grey',
        textShadowOffset: { width: 5, height: 5 },
        textShadowRadius: 10
    },
    icon_nodata: {
        width: 100,
        height: 100,
        resizeMode: 'stretch'
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'stretch'
    },
    content_header_footer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        marginVertical: 10
    },
    content_header: {
        backgroundColor: '#01cdfe'
    },
    content_footer: {
        backgroundColor: '#05ffa1',
    },
    text_header_footer: {
        fontSize: 28,
        fontWeight: 700,
        fontStyle: 'italic',
        color: 'white'
    },
    button_header_footer: {

    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#C8C8C8',
    },
    btn_common: {
        width: 40,
        height: 40,
        padding: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    left_item: {

    },
    right_item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginLeft: 5
    },
    btn_info: {
        backgroundColor: '#00FF00',
    },
    btn_delete: {
        backgroundColor: 'red',
    },
    btn_edit: {
        backgroundColor: 'blue',
    },
    add: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#FAF0E6',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    add_title: {
        fontSize: 25,
        fontWeight: 600,
        color: '#000',
        textTransform: 'capitalize'
    },
    btn_add: {
        backgroundColor: '#8B0000'
    }
});

export default List;
