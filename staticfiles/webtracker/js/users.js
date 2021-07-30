// Safe alternative to get template variables in javascript to prevent XSS attacks.
// Easy method but unsecure --> {{users_list|safe}}. It's prone to XSS attacks.
var users = JSON.parse(document.getElementById('users_list').textContent);
// var users_list;
console.log(users)
buildTable(users);

$(".search-table").on("keyup", function() {
    // users_list = [];
    search_value = $(this).val().toLowerCase();
    console.log("Search: ", search_value)
    $("#usersTableBody tr").filter(function() {
        $(this).toggle($(this).text()
        .toLowerCase().indexOf(search_value) > -1)
    });
    // if (search_value !== "") {
    //     users.forEach(element => {
    //         if (element[1].toLowerCase().startsWith(search_value)) {
    //             users_list.push(element);
    //         }
    //     });
    //     console.log("users_list:", users_list)
    // } else {
    //     users_list = users
    //     console.log("users_list:", users_list)
    // }
    // buildTable(users_list);
})

function buildTable(users_list) {
    var table_body = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    table_body.innerHTML = "";
    for (let index = 0; index < users_list.length; index++) {
        if (users_list[index][3] == 'No') {
            table_body.insertRow().innerHTML = "<tr> <td id='userId' class='userId hidden px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                            <p class='text-gray-900 whitespace-no-wrap'>"
                                    + users_list[index][0] +
                            "</p> \
                        </td> <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                            <p class='text-gray-900 whitespace-no-wrap'>"
                                    + users_list[index][1] +
                            "</p> \
                        </td> <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                            <p class='text-gray-900 whitespace-no-wrap'>"
                                    + users_list[index][2] +
                            "</p> \
                        </td> \
                        <td class='4'><div class='flex items-center justify-center'><button id='send' type='button' class='send-tracking-request py-2 px-4  bg-indigo-600 hover:bg-indigo-800 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg'>\
                        SEND</button></div></td>\
                        </tr>";
        } else if (users_list[index][3]) {
            table_body.insertRow().innerHTML = "<tr> <td id='userId' class='userId hidden px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                            <p class='text-gray-900 whitespace-no-wrap'>"
                                    + users_list[index][0] +
                            "</p> \
                        </td> <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                            <p class='text-gray-900 whitespace-no-wrap'>"
                                    + users_list[index][1] +
                            "</p> \
                        </td> <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                            <p class='text-gray-900 whitespace-no-wrap'>"
                                    + users_list[index][2] +
                            "</p> \
                        </td> \
                        <td class='4'><div class='flex items-center justify-center'><button id='track' type='button' class='track-user-location py-2 px-3  bg-green-600 hover:bg-green-800 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg'>\
                        TRACK</button></div></td>\
                        </tr>";
        } else {
            table_body.insertRow().innerHTML = "<tr> <td id='userId' class='userId hidden px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                            <p class='text-gray-900 whitespace-no-wrap'>"
                                    + users_list[index][0] +
                            "</p> \
                        </td> <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                            <p class='text-gray-900 whitespace-no-wrap'>"
                                    + users_list[index][1] +
                            "</p> \
                        </td> <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                            <p class='text-gray-900 whitespace-no-wrap'>"
                                    + users_list[index][2] +
                            "</p> \
                        </td> \
                        <td class='4 px-5 py-5 border-b border-gray-200 bg-white text-center uppercase text-sm'> \
                            <p class='text-gray-900 whitespace-no-wrap'>"
                                    + "Track Request Sent" +
                            "</p> \
                        </td> \
                        </tr>";
        }
    };
}


$(document).on("click", ".send-tracking-request", function() {
    var tr = $(this).closest("tr");
    var trackee_id = tr.find(".userId").text();
    
    data = {'trackee_id': trackee_id, csrfmiddlewaretoken};

    $.post(request_url, data, function(status) {
        if (status) {
            var td4 = tr.find('.4')[0];
            td4.className += ' px-5 py-5 border-b border-gray-200 bg-white text-center uppercase text-sm';
            td4.innerHTML = "<p class='text-gray-900 whitespace-no-wrap'>"
            + "Track Request Sent" + "</p>"
        }
    });  
});

$(document).on("click", ".track-user-location", function() {
    var trackee_id = $(this).closest("tr").find(".userId").text();
    console.log(trackee_id)
    data = {'trackee_id': trackee_id, csrfmiddlewaretoken};

    $.post(track_url, data, function(status) {
        if (status) {
            setTimeout(() => {
                location.href = display_map_url;
            }, 1000);
        }
    });  
});