const IR_PROTOCOLS = {
    1: "RC5",
    2: "RC6",
    3: "NEC",
    4: "SONY",
    5: "Panasonic64",
    6: "JVC",
    7: "Samsung",
    8: "Whynter",
    9: "Aiwa",
    10: "LG",
    12: "Mitsubishi",
    13: "DISH",
    14: "SharpRaw",
    15: "COOLIX",
    17: "Denon",
    19: "Sherwood",
    21: "RCMM",
    22: "Sanyo",
    23: "RC5",
    29: "Nikai",
    34: "Midea",
    35: "MagiQuest",
    36: "Lasertag",
    37: "CarrierAC",
    39: "Mitsubishi2",
    43: "GICable",
    47: "Lutron",
    50: "Pioneer",
    51: "LG2",
    54: "VestelAC",
    55: "Teco",
    56: "Samsung36",
    58: "LegoPf"
};

function postCommand(room_name, device_name, command_name, command_code) {
    if (room_name && device_name && command_name && command_code) {
        axios.post('http://localhost:8381/commands', {
            room: room_name,
            device: device_name,
            command_name: command_name,
            ir_code: command_code
        })
            .then(function (response) {
                alert("Command saved in the database!");
                location.reload();
            })
            .catch(function (error) {
                alert("An error occurred while saving the command :(");
                console.log(error);
            });
    }
}

function deleteCommand(command_name, command_id) {
    if (confirm(`Do you want to delete the ` + command_name + ` command?
    
Changes can not be undone!`)) {
        axios.delete('http://localhost:8381/commands?id=' + command_id)
            .then(function (response) {
                location.reload();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

}
