#include<ESP8266WiFi.h> 
#include<PubSubClient.h> 
#include<IRremoteESP8266.h>
#include<IRsend.h> 
#include<IRrecv.h>

    // Wifi and MQTT configuration. Change it with yours!
#define WIFI_SSID "your_wifi_ssid"
#define WIFI_PASSWORD "your_wifi_password"
#define MQTT_BROKER_IP "your_mqtt_server_ip"
#define MQTT_BROKER_PORT 0 // Put yours
#define MQTT_USER "your_mqtt_username"
#define MQTT_PASSWORD "your_mqtt_password"
#define CLIENT_NAME "your_room_name" // Used to form the topic

    // MQTT Topics
#define SEND_TOPIC "ir2MQTT/" CLIENT_NAME "/SEND/+"
#define READ_TOPIC "ir2MQTT/" CLIENT_NAME "/READ"
#define SENT_TOPIC "ir2MQTT/" CLIENT_NAME "/tele/SENT"
#define LWT_TOPIC "ir2MQTT/" CLIENT_NAME "/tele/LWT"

    // IR Configuration
#define IR_SEND_LED D2
#define IR_REC_LED D5


WiFiClient wifiClient;
PubSubClient client (wifiClient);
decode_results results;
IRsend irsend (IR_SEND_LED);
IRrecv irrecv (IR_REC_LED);
int ir_protocol;
unsigned long ir_code;
int ir_code_length;

void setup () {
    Serial.begin (115200);
    WiFi.mode (WIFI_STA);
    WiFi.begin (WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status () != WL_CONNECTED) {
        delay (500);
    }
    client.setServer (MQTT_BROKER_IP, MQTT_BROKER_PORT);
    client.setCallback (callback);
    irrecv.enableIRIn ();
    irsend.begin ();

}

void reconnect () {
    while (!client.connected ()) {
        if (client.connect (CLIENT_NAME, MQTT_USER, MQTT_PASSWORD, LWT_TOPIC, 0, 1, "Offline")) {
            client.subscribe (SEND_TOPIC);
            client.publish (LWT_TOPIC, "Online", true);
        } else {
            delay (5000);
        }
    }
}

void loop () {
    if (!client.connected ()) {
        reconnect ();
    }
    client.loop ();
    if (irrecv.decode ( & results)) {
        char * char_code = "";
        itoa (results.value, char_code, 16);
        ir_protocol = results.decode_type;
        ir_code_length = results.bits;   
        String message = "";
        message = (String)ir_protocol + ";" + (String)char_code + ";" + (String)ir_code_length;
        if (String(char_code).equals("ffffffff") || String(ir_protocol).equals("-1")){
        }else{
          client.publish (READ_TOPIC, message.c_str ());
        }
        irrecv.resume ();
    }
    delay (100);

}

void callback (char * topic, byte * payload, unsigned int length) {
    String receivedCommand = getValue ((String)topic, '/', 3);
    ir_protocol = getValue (receivedCommand, ';', 0).toInt ();
    ir_code = strtoul (getValue (receivedCommand, ';', 1).c_str (), NULL, 16);
    ir_code_length = getValue (receivedCommand, ';', 2).toInt ();
    sendCode (ir_protocol, ir_code, ir_code_length);
}

void sendCode (int protocol, unsigned long code, int bits) {

    switch (protocol) {
        case 1:
            irsend.sendRC5 (code, bits);
            irrecv.enableIRIn ();
            break;
        case 2:
            irsend.sendRC6 (code, bits);
            irrecv.enableIRIn ();
            break;
        case 3:
            irsend.sendNEC (code, bits);
            irrecv.enableIRIn ();
            break;
        case 4:
            irsend.sendSony (code, bits, 2);
            irrecv.enableIRIn ();
            break;
        case 5:
            irsend.sendPanasonic64 (code, bits);
            irrecv.enableIRIn ();
            break;
        case 6:
            irsend.sendJVC (code, bits);
            irrecv.enableIRIn ();
            break;
        case 7:
            irsend.sendSAMSUNG (code, bits);
            irrecv.enableIRIn ();
            break;
        case 8:
            irsend.sendWhynter (code, bits);
            irrecv.enableIRIn ();
            break;
        case 9:
            irsend.sendAiwaRCT501 (code, bits, 1);
            irrecv.enableIRIn ();
            break;
        case 10:
            irsend.sendLG (code, bits);
            irrecv.enableIRIn ();
            break;
        case 12:
            irsend.sendMitsubishi (code, bits, 1);
            irrecv.enableIRIn ();
            break;
        case 13:
            irsend.sendDISH (code, bits, 1);
            irrecv.enableIRIn ();
            break;
        case 14:
            irsend.sendSharpRaw (code, bits);
            irrecv.enableIRIn ();
            break;
        case 15:
            irsend.sendCOOLIX (code, bits);
            irrecv.enableIRIn ();
            break;
        case 17:
            irsend.sendDenon (code, bits);
            irrecv.enableIRIn ();
            break;
        case 19:
            irsend.sendSherwood (code, bits, 1);
            irrecv.enableIRIn ();
            break;
        case 21:
            irsend.sendRCMM (code, bits);
            irrecv.enableIRIn ();
            break;
        case 22:
            irsend.sendSanyoLC7461 (code, bits);
            irrecv.enableIRIn ();
            break;
        case 23:
            irsend.sendRC5 (code, bits);
            irrecv.enableIRIn ();
            break;
        case 29:
            irsend.sendNikai (code, bits);
            irrecv.enableIRIn ();
            break;
        case 34:
            irsend.sendMidea (code, bits);
            irrecv.enableIRIn ();
            break;
        case 35:
            irsend.sendMagiQuest (code, bits);
            irrecv.enableIRIn ();
            break;
        case 36:
            irsend.sendLasertag (code, bits);
            irrecv.enableIRIn ();
            break;
        case 37:
            irsend.sendCarrierAC (code, bits);
            irrecv.enableIRIn ();
            break;
        case 39:
            irsend.sendMitsubishi2 (code, bits, 1);
            irrecv.enableIRIn ();
            break;
        case 43:
            irsend.sendGICable (code, bits, 1);
            irrecv.enableIRIn ();
            break;
        case 47:
            irsend.sendLutron (code, bits);
            irrecv.enableIRIn ();
            break;
        case 50:
            irsend.sendPioneer (code, bits);
            irrecv.enableIRIn ();
            break;
        case 51:
            irsend.sendLG2 (code, bits);
            irrecv.enableIRIn ();
            break;
        case 54:
            irsend.sendVestelAc (code, bits);
            irrecv.enableIRIn ();
            break;
        case 55:
            irsend.sendTeco (code, bits);
            irrecv.enableIRIn ();
            break;
        case 56:
            irsend.sendSamsung36 (code, bits);
            irrecv.enableIRIn ();
            break;
        case 58:
            irsend.sendLegoPf (code, bits);
            irrecv.enableIRIn ();
            break;
    }
    char * sent_code = "";
    itoa (code, sent_code, 16);
    client.publish (SENT_TOPIC, sent_code);
}

String getValue (String data, char separator, int index) {
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length () - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt (i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i + 1 : i;
        }
    }
    return found > index ? data.substring (strIndex[0], strIndex[1]) : "";
}
