import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDataSensor } from '../apis';
import init from "react_native_mqtt";

init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {},
});
const options = {
    host: "broker.emqx.io",
    port: 8083,
    path: "/wemos",
    id: "id_" + parseInt(Math.random() * 100000),
};
//
const client = new Paho.MQTT.Client(options.host, options.port, options.path);

const Dashboard = ({ navigation }) => {

    const [data, setData] = useState(null);
    useEffect(() => {
        connect();
        client.onMessageArrived = onMessageArrived;
    }, []);

    const connect = () => {
        client.connect({
            onSuccess: () => {
                console.log("connect MQTT broker ok!");
                //step 2 subscribe topic
                subscribeTopic();
            },
            useSSL: false,
            timeout: 5,
            onFailure: () => {
                console.log("connect fail");
                // connect();
            },
        });
    };

    const subscribeTopic = () => {
        client.subscribe("wemos/json", { qos: 1 });
    };

    const onMessageArrived = async (message) => {
        if (!message.payloadString) return;
        try {
            const data = JSON.parse(message.payloadString);
            setData({
                h: data.h ? data.h : 0,
                t: data.t ? data.t : 0,
                ppm: data.ppm ? data.ppm : 0,
            });
            postData({
                temperature_value: data.t,
                humidity_value: data.h,
                mq2_value: data.ppm,
            });
        } catch (error) {
            console.log(error);
        }

    };

    const postData = async (params = {}) => {
        try {
            const result = await addDataSensor(params);
            console.log(result);
        } catch (error) {
            console.log(error);
        }

    };


    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={styles.bodyTop}>
                    <View style={styles.bodyTopLeft}>
                        <Text style={styles.bodyTopLeftText}>Temperature</Text>
                        <Text style={styles.bodyTopLeftText}>Humidity</Text>
                        <Text style={styles.bodyTopLeftText}>CO2</Text>
                    </View>
                    <View style={styles.bodyTopRight}>
                        <Text style={styles.bodyTopRightText}>
                            {data ? data.t : 0}°C
                        </Text>
                        <Text style={styles.bodyTopRightText}>
                            {data ? data.h : 0}%
                        </Text>
                        <Text style={styles.bodyTopRightText}>
                            {data ? data.ppm : 0}ppm
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
    },
    header: {
        backgroundColor: "#00bfff",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    bodyTop: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 200,
    },
    bodyTopLeft: {
        flex: 1,
        justifyContent: "left",
        alignItems: "left",
    },
    bodyTopLeftText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#00bfff",
    },
    bodyTopRight: {
        flex: 1,
        justifyContent: "left",
        alignItems: "left",
    },
    bodyTopRightText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#00bfff",
    },
    bodyBottom: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 100,
    },
    bodyBottomButton: {
        width: 100,
        height: 100,
        backgroundColor: "#00bfff",
        margin: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    bodyBottomButtonIcon: {
        marginBottom: 10,
    },
    bodyBottomButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Dashboard;
