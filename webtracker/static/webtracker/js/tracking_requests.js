// Safe alternative to get template variables in javascript to prevent XSS attacks.
// Easy method but unsecure --> {{tracking_requests|safe}}. It's prone to XSS attacks.
const tracking_requests = JSON.parse(document.getElementById('tracking_requests').textContent);
console.log(tracking_requests);
buildTable(tracking_requests);

$(".search-table").on("keyup", function() {
    search_value = $(this).val().toLowerCase();
    console.log("Search: ", search_value)
    $("#trackingRequestsTableBody tr").filter(function() {
        $(this).toggle($(this).text()
        .toLowerCase().indexOf(search_value) > -1)
    });
})

function buildTable(tracking_requests) {
    var table_body = document.getElementById('trackingRequestsTable').getElementsByTagName('tbody')[0];
    for (let index = 0; index < tracking_requests.length; index++) {
        if (tracking_requests[index][3]) {
            table_body.insertRow().innerHTML = "<tr> <td id='userId' class='userId hidden px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                        <p class='text-gray-900 whitespace-no-wrap'>"
                                + tracking_requests[index][0] +
                        "</p> \
                    </td> <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                        <p class='text-gray-900 whitespace-no-wrap'>"
                                + tracking_requests[index][1] +
                        "</p> \
                    </td> <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                        <p class='text-gray-900 whitespace-no-wrap'>"
                                + tracking_requests[index][2] +
                        "</p> \
                    </td> \
                    <td><div class='flex items-center justify-center'> \
                    <button id='revoke' type='button' class='revoke-tracking-request py-2 px-4 bg-red-600 hover:bg-red-800 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '>\
                    REVOKE</button></div></td> \
                    </tr>";
        } else {
            table_body.insertRow().innerHTML = "<tr> <td id='userId' class='userId hidden px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                        <p class='text-gray-900 whitespace-no-wrap'>"
                                + tracking_requests[index][0] +
                        "</p> \
                    </td> <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                        <p class='text-gray-900 whitespace-no-wrap'>"
                                + tracking_requests[index][1] +
                        "</p> \
                    </td> <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'> \
                        <p class='text-gray-900 whitespace-no-wrap'>"
                                + tracking_requests[index][2] +
                        "</p> \
                    </td> \
                    <td><div class='flex items-center justify-center space-x-4'> \
                    <button id='allow' type='button' class='allow-tracking-request py-2 px-4 bg-green-600 hover:bg-green-800 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '>\
                    ALLOW</button> \
                    <button id='reject' type='button' class='reject-tracking-request py-2 px-4 bg-red-600 hover:bg-red-800 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '>\
                    REJECT</button></div></td> \
                    </tr>";
        }
    };
}

// onclick=allowTrackingRequest(this)
// function allowTrackingRequest(btn) {
//     var tracker_id = $(btn).closest("tr").find("td:eq(0)").text();
//     console.log(tracker_id)
//     data = {'tracker_id': tracker_id,
//             csrfmiddlewaretoken: '{{ csrf_token }}'};
//     $.post(allow_url, data);
//     location.reload();
// };

// onclick=revokeTrackingRequest(this)
// function revokeTrackingRequest(btn) {
//     var tracker_id = $(btn).closest("tr").find("td:eq(0)").text();
//     console.log(tracker_id)
//     data = {'tracker_id': tracker_id,
//             csrfmiddlewaretoken: '{{ csrf_token }}'};
//     $.post(revoke_url, data);
//     location.reload();
// };

// onclick=rejectTrackingRequest(this)
// function rejectTrackingRequest(btn) {
//     var tracker_id = $(btn).closest("tr").find("td:eq(0)").text();
//     console.log(tracker_id)
//     data = {'tracker_id': tracker_id,
//             csrfmiddlewaretoken: '{{ csrf_token }}'};
//     $.post(reject_url, data);
//     location.reload();
// };

$(".allow-tracking-request").on("click", function() {
    var tracker_id = $(this).closest("tr").find(".userId").text();
    console.log(tracker_id)
    data = {'tracker_id': tracker_id,
            csrfmiddlewaretoken};
    $.post(allow_url, data, function(status) {
        if (status === "success") {
            setTimeout(() => {
                location.reload(true);
            }, 1000);
        }
    });  
});

$(".revoke-tracking-request").on("click", function() {
    var tracker_id = $(this).closest("tr").find(".userId").text();
    console.log(tracker_id)
    data = {'tracker_id': tracker_id,
            csrfmiddlewaretoken};
    $.post(revoke_url, data, function(status) {
        if (status === "success") {
            setTimeout(() => {
                location.reload(true);
            }, 1000);
        }
    });  
});

$(".reject-tracking-request").on("click", function() {
    var tracker_id = $(this).closest("tr").find(".userId").text();
    console.log(tracker_id)
    data = {'tracker_id': tracker_id,
            csrfmiddlewaretoken};
    $.post(reject_url, data, function(status) {
        if (status === "success") {
            setTimeout(() => {
                location.reload(true);
            }, 1000);
        }
    });  
});