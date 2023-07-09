#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#include "MQ135.h"

#define ssid "Ambrose"
#define password "123456789"
// Thông tin về MQTT Broker
#define mqtt_server "broker.emqx.io"
const uint16_t mqtt_port = 1883; //Port của MQTT broker
#define mqtt_topic_pub "wemos/ledstatus"
#define mqtt_topic_sub "wemos/ledstatus"
WiFiClient espClient;
PubSubClient client(espClient);
#define STAPSK "123456789"
#define PIN_MQ135 A0   

const int DHTPIN = 14;      
const int DHTTYPE = DHT11;  
DHT dht(DHTPIN, DHTTYPE);
MQ135 mq135_sensor = MQ135(PIN_MQ135);

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  dht.begin();   
  // hàm thực hiện chức năng kết nối Wifi và in ra địa chỉ IP của ESP8266
  setup_wifi();
  // cài đặt server eclispe mosquitto và lắng nghe client ở port 1883
  client.setServer(mqtt_server, mqtt_port);
  // gọi hàm callback để thực hiện các chức năng publish/subcribe
  client.setCallback(callback);
  // gọi hàm reconnect() để thực hiện kết nối lại với server khi bị mất kết nối
  reconnect();
}
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  // kết nối đến mạng Wifi
  WiFi.begin(ssid, password);
  // in ra dấu . nếu chưa kết nối được đến mạng Wifi
  while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".");
  }
  // in ra thông báo đã kết nối và địa chỉ IP của ESP8266
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
void callback(char* topic, byte* payload, unsigned int length) {
  //in ra tên của topic và nội dung nhận được từ kênh MQTT lens đã publish
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
  Serial.print((char)payload[i]);
  }
  // kiểm tra nếu dữ liệu nhận được từ topic wemos/led/status là chuỗi "on"
  // sẽ bậtled D4, nếu là chuỗi "off" sẽ tắt led D4
  if ((char)payload[0] == 'o' && (char)payload[1] == 'n')
  { //on
  Serial.print("turn on");
  digitalWrite(4, HIGH);
  }
  else if ((char)payload[0] == 'o' && (char)payload[1] == 'f' && (char)payload[2] == 'f')
  //off
  {
  Serial.print("turn off");
  digitalWrite(4, LOW);
  }
  Serial.println();
  }
void reconnect() {
  // lặp cho đến khi được kết nối trở lại
  while (!client.connected()) {
  Serial.print("Attempting MQTT connection...");
  // hàm connect có đối số thứ 1 là id đại diện cho mqtt client phải duy nhất,
  // đối số thứ 2 là username và đối số thứ 3 là password nếu có
  if (client.connect("DEMO")) {
    Serial.println("connected");
    // publish gói tin "Connected!" đến topic esp/test
    client.publish("ledstatus", "Hello esp8266!");
    // đăng kí nhận gói tin tại topic esp/test
    client.subscribe("ledstatus");
    } else {
    // in ra màn hình trạng thái của client khi không kết nối được với MQTT broker
    Serial.print("failed, rc=");
    Serial.print(client.state());
    Serial.println(" try again in 5 seconds");
    // delay 5s trước khi thử lại
    delay(5000);
  }
}
}
void loop() {
// kiểm tra nếu ESP8266 chưa kết nối được thì sẽ thực hiện kết nối lại
  if (!client.connected()) {
    reconnect();
  }

  if ((WiFi.status() == WL_CONNECTED)) {
    float h = dht.readHumidity();    
    float t = dht.readTemperature(); 
    float ppm = mq135_sensor.getPPM();

    Serial.println(h);
    Serial.println(t);
    Serial.println(ppm);
    // client.publish("wemos/humidity", String(h).c_str());
    // client.publish("wemos/temperature", String(t).c_str());
    // client.publish("wemos/ppm", String(ppm).c_str());
    //send with JSON
    String json = "{\"h\":" + String(h) + ",\"t\":" + String(t) + ",\"ppm\":" + String(ppm) + "}";
    client.publish("wemos/json", json.c_str());
  }
  
  client.loop();
  delay(5000);
}