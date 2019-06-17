// Change the phrase!
const phrase = "Discman-is-the-best-invention-in-the-world!";

let mqtt_param_1 = "";
let mqtt_param_2 = "";
let mqtt_param_3 = "";
let mqtt_param_4 = "";

decrypt();

client = new Paho.MQTT.Client(mqtt_param_1, Number(mqtt_param_2), " ", "ir2MQTTjs");

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

const lwt = new Paho.MQTT.Message("Offline");
lwt.destinationName = "ir2MQTT/JS/LWT";
lwt.retained = true;

client.connect({
    onSuccess: onConnect,
    userName: mqtt_param_3,
    password: mqtt_param_4,
    mqttVersion: 3,
    willMessage: lwt
});

function send(topic, payload, retained) {
    let message = new Paho.MQTT.Message("ir2MQTT Rulez!");
    message.destinationName = topic;
    message.retained = retained || false;
    client.send(message);
}

function onConnect() {
    client.subscribe("ir2MQTT/+/READ");
    send("ir2MQTT/JS/LWT", "Online", true);
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    document.getElementById("input_command_code").value = message.payloadString;
}

function addMqttConfigPanel() {
    let button = document.createElement("button");
    button.setAttribute("id", "mqttconfig_panel_button");
    button.setAttribute("class", "w3-bar-item w3-button");
    button.setAttribute("onclick", "openPanel('mqtt_config_panel')");
    button.innerText = "MQTT";

    let panel = document.createElement("div");
    panel.setAttribute("id", "mqtt_config_panel");
    panel.setAttribute("class", "w3-container room_panel");
    panel.setAttribute("style", "display:none");

    let h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode("MQTT Configuration"));
    let form = document.createElement("form");
    form.innerHTML = `
    <form class="w3-container">
        <label class="w3-text-blue"><b>Ip</b></label>
        <input id="input_mqtt_broker_ip" class="w3-input w3-border" type="text" placeholder="The IP of your MQTT broker..">
        
        <label class="w3-text-blue"><b>Port</b></label>
        <input id="input_mqtt_broker_port" class="w3-input w3-border" type="text" placeholder="The port of your MQTT broker..">
    
        <label class="w3-text-blue"><b>Username</b></label>
        <input id="input_mqtt_username" class="w3-input w3-border" type="text" placeholder="Your username..">
    
        <label class="w3-text-blue"><b>Password</b></label>
        <input id="input_mqtt_password" class="w3-input w3-border" type="password" placeholder="Your password.."">
    
        <button type='button' class="w3-btn w3-blue" onclick="saveMqttConfigLocal()">Save</button>
    </form>
    `;

    panel.appendChild(h2);
    panel.appendChild(form);

    document.getElementById('room_buttons').appendChild(button);
    document.getElementById('rooms_tabs').appendChild(panel);

}

function saveMqttConfigLocal() {
    mqtt_param_1 = document.getElementById("input_mqtt_broker_ip").value;
    mqtt_param_2 = document.getElementById("input_mqtt_broker_port").value;
    mqtt_param_3 = document.getElementById("input_mqtt_username").value;
    mqtt_param_4 = document.getElementById("input_mqtt_password").value;
    let ip = CryptoJS.AES.encrypt(mqtt_param_1, phrase);
    let port = CryptoJS.AES.encrypt(mqtt_param_2, phrase);
    let user = CryptoJS.AES.encrypt(mqtt_param_3, phrase);
    let pass = CryptoJS.AES.encrypt(mqtt_param_4, phrase);
    localStorage.setItem("1", ip);
    localStorage.setItem("2", port);
    localStorage.setItem("3", user);
    localStorage.setItem("4", pass);
    location.reload();
}

function loadLocalMqttConfig() {
    document.getElementById("input_mqtt_broker_ip").value = mqtt_param_1;
    document.getElementById("input_mqtt_broker_port").value = mqtt_param_2;
    document.getElementById("input_mqtt_username").value = mqtt_param_3;
    document.getElementById("input_mqtt_password").value = mqtt_param_4;
}

function decrypt() {
    mqtt_param_1 = CryptoJS.AES.decrypt(localStorage.getItem("1"), phrase).toString(CryptoJS.enc.Utf8);
    mqtt_param_2 = CryptoJS.AES.decrypt(localStorage.getItem("2"), phrase).toString(CryptoJS.enc.Utf8);
    mqtt_param_3 = CryptoJS.AES.decrypt(localStorage.getItem("3"), phrase).toString(CryptoJS.enc.Utf8);
    mqtt_param_4 = CryptoJS.AES.decrypt(localStorage.getItem("4"), phrase).toString(CryptoJS.enc.Utf8)

}


