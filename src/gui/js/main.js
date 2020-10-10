let commands = {};

axios.get('http://localhost:8420/commands')
    .then(function (response) {
        response.data.map(function (command) {
            if (!commands.hasOwnProperty(command.room)) {
                commands[command.room] = {};
            }
            // device
            if (!commands[command.room].hasOwnProperty(command.device)) {
                commands[command.room][command.device] = {};
            }
            // command
            if (!commands[command.room][command.device].hasOwnProperty(command.id)) {
                let command_name = command.command_name;
                let command_code = command.ir_code;
                commands[command.room][command.device][command.id] = {
                    name: command_name,
                    code: command_code
                };
            }
        });

        let display = true;

        Object.entries(commands).forEach(room_devices => {
            let room_name = room_devices[0];
            let room_panel = newRoom(room_name, display);
            display = false;

            let devices = room_devices[1];
            Object.entries(devices).forEach(device_commands => {
                let device_name = device_commands[0];
                let device_table = newDevice(room_panel, device_name);

                Object.entries(device_commands[1]).forEach(name_code => {
                    let command_id = name_code[0];
                    let command_code_name = name_code[1];
                    let command_name = command_code_name.name;
                    let command_code = command_code_name.code;
                    newCommand(device_table, room_name, command_id, command_name, command_code);
                })
            });
            addButtonRooms(room_panel, room_name);

        });
        addNewCommandPanel();
        addMqttConfigPanel();
        loadLocalMqttConfig();

    })
    .catch(function (err) {
        document.getElementById('commands').innerHTML = '<li class="text-danger">' + err.message + '</li>';
    });

function openPanel(room_name) {
    let i;
    let x = document.getElementsByClassName("room_panel");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(room_name).style.display = "block";
}


function newRoom(room_name, display) {
    let h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode(room_name));
    let button = document.createElement("button");
    button.setAttribute("class", "w3-bar-item w3-button");
    button.setAttribute("onclick", "openPanel('" + room_name + "')");
    button.innerText = room_name;

    let panel = document.createElement("div");
    panel.setAttribute("id", room_name);
    panel.setAttribute("class", "w3-centered room_panel");
    if (!display) {
        panel.setAttribute("style", "display:none");
    }

    document.getElementById('room_buttons').appendChild(button);
    panel.appendChild(h2);
    document.getElementById('rooms_tabs').appendChild(panel);
    return panel;
}

function newDevice(room_panel, device_name) {
    let table_container = document.createElement("div");
    let table = document.createElement("table");
    table.setAttribute("class", "w3-table-all w3-card-4 ");
    table_container.innerHTML = `<h3>` + device_name + ` <button class="w3-button w3-medium new-command-button" title="New ` + device_name + ` command" onclick="fillNewCommandForm(` + `'` + room_panel.id + `','` + device_name + `')"><i class="fa fa-plus-square"></i></button></h3>`;

    let table_header = document.createElement("tr");
    table_header.innerHTML = "<th>Command</th>";
    table_header.innerHTML += "<th class='w3-hide-small' >Protocol</th>";
    table_header.innerHTML += "<th class='w3-hide-small' >Code</th>";
    table_header.innerHTML += "<th class='w3-hide-small' >Length</th>";
    table_header.innerHTML += "<th>Delete</th>";
    table_header.innerHTML += "<th>MQTT Topic</th>";
    table_header.innerHTML += "<th>Send</th>";

    table.appendChild(table_header);
    table_container.appendChild(table);
    room_panel.appendChild(document.createElement("br"));
    room_panel.appendChild(table_container);

    return table;
}

function newCommand(table, room_name, command_id, command_name, command_code) {
    let row = document.createElement("tr");

    let parsed_command_code = parseCommand(command_code);
    let ir_protocol = parsed_command_code[0];
    let ir_code = parsed_command_code[1];
    let ir_length = parsed_command_code[2] + " bits";

    row.innerHTML = "<td>" + command_name + "</td>";
    row.innerHTML += "<td class='w3-hide-small' >" + ir_protocol + "</td>";
    row.innerHTML += "<td class='w3-hide-small' >" + ir_code + "</td>";
    row.innerHTML += "<td class='w3-hide-small' >" + ir_length + "</td>";

    let delete_button_td = document.createElement("td");
    delete_button_td.innerHTML = `<button class="w3-button" title="Delete command" onclick="deleteCommand(` + `'` + command_name + `','` + command_id + `')"><i class="fa fa-trash"></i></button>`;
    row.appendChild(delete_button_td);

    let copy_button_td = document.createElement("td");
    copy_button_td.innerHTML = `<button class="w3-button" title="Copy topic" onclick="copyCommandTopic(` + `'` + room_name + `','` + command_code + `','` + command_name + `')"><i class="fa fa-copy"></i></button>`;
    row.appendChild(copy_button_td);

    let send_button_td = document.createElement("td");
    send_button_td.innerHTML = `<button class="w3-button" title="Send IR code" onclick="sendCommand(` + `'` + room_name + `','` + command_code + `')"><i class="fa fa-paper-plane"></i></button>`;
    row.appendChild(send_button_td);
    table.appendChild(row);

}

function parseCommand(command) {
    let command_split = command.split(";");

    let command_protocol = command_split[0];
    command_protocol = IR_PROTOCOLS[Number(command_protocol)] || command_protocol;
    command_split[0] = command_protocol;

    return command_split;
}

function copyCommandTopic(room_name, command_code, command_name) {
    let topic = getTopic(room_name, command_code);
    let dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = topic;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    alert(command_name + " topic copied!");

}

function getTopic(room_name, command_code) {
    return "openIR/" + room_name + "/SEND/" + command_code;
}


function sendCommand(room_name, command_code) {
    let topic = getTopic(room_name, command_code);
    send(topic, "");
}




