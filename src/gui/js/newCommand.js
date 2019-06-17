function addNewCommandPanel() {
    let button = document.createElement("button");
    button.setAttribute("id", "new_command_panel_button");
    button.setAttribute("class", "w3-bar-item w3-button");
    button.setAttribute("onclick", "openPanel('new_command_panel')");
    button.innerText = "New";

    let h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode("New device/command"));
    let panel = document.createElement("div");
    panel.setAttribute("id", "new_command_panel");
    panel.setAttribute("class", "w3-container room_panel");
    panel.setAttribute("style", "display:none");

    let form = document.createElement("form");
    form.innerHTML = `
    <form class="w3-container">
        <label class="w3-text-blue"><b>Room</b></label>
        <input id="input_room" class="w3-input w3-border" type="text" placeholder="The same name as the ESP!..">
    
        <label class="w3-text-blue"><b>Device</b></label>
        <input id="input_device" class="w3-input w3-border" type="text" placeholder="Radio Cassette, discman, TV..">
    
        <label class="w3-text-blue"><b>Command Name</b></label>
        <input id="input_command_name" class="w3-input w3-border" type="text" placeholder="It can be the same as the button..">
        
        <label class="w3-text-blue"><b>Command Code</b></label>
        <input id="input_command_code" class="w3-input w3-border" type="text" placeholder="Read it with your ESP!..">
    
        <button type='button' class="w3-btn w3-blue" onclick="saveCommand()">Save</button>
    </form>
    `;

    panel.appendChild(h2);
    panel.appendChild(form);
    document.getElementById('room_buttons').appendChild(button);
    document.getElementById('rooms_tabs').appendChild(panel);
}

function fillNewCommandForm(room_name, device_name) {
    document.getElementById("input_room").value = room_name || "";
    document.getElementById("input_device").value = device_name || "";
    document.getElementById("new_command_panel_button").click();
}

function addButtonRooms(room_panel, room_name) {
    let newDeviceButton = document.createElement("button");
    newDeviceButton.innerText = "New " + room_name + " device";
    newDeviceButton.setAttribute("class", "w3-button w3-blue new-device-button");
    newDeviceButton.setAttribute("onClick", "fillNewCommandForm('" + room_panel.id + "')");
    room_panel.appendChild(newDeviceButton);
}

function saveCommand() {
    let room_name = document.getElementById("input_room").value;
    let device_name = document.getElementById("input_device").value;
    let command_name = document.getElementById("input_command_name").value;
    let command_code = document.getElementById("input_command_code").value;
    postCommand(room_name, device_name, command_name, command_code);
}
