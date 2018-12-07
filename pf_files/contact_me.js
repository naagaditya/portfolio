
$(function() {

  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function($form, event, errors) {
      // additional error messages or events
    },
    submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour
      // get values from FORM
      
      // if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      //   gapi.auth2.getAuthInstance().signIn().then(() => {
      //     sendMessage();
      //   });
      // }
      // else sendMessage();
      sendMessage()
    },
    filter: function() {
      return $(this).is(":visible");
    },
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
  $('#success').html('');
});


// function initClient() {
//   var API_KEY = 'AIzaSyBQz3cW5OUX3bVuB1Vci6L-Gn0vTOtPFqM'; 

//   var CLIENT_ID = '855395398771-37i8an4g3jldupv70smrh9t45oct0ul8.apps.googleusercontent.com'; 

//   var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

//   gapi.client.init({
//     'apiKey': API_KEY,
//     'clientId': CLIENT_ID,
//     'scope': SCOPE,
//     'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
//   }).then(function() {
//   });
// }

// function handleClientLoad() {
//   gapi.load('client:auth2', initClient);
// }


// var db;
// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// var request = window.indexedDB.open("mailSyncDb", 1);
// request.onerror = function (event) {
//   console.log("error: ");
// };

// request.onsuccess = function (event) {
//   db = request.result;
//   console.log("success: " + db);
// };

// request.onupgradeneeded = function (event) {
//   var db = event.target.result;
//   var objectStore = db.createObjectStore("mailData", { keyPath: "id" });
//   console.log('create object store');
// }

function sendMessage () {
  var name = $("input#name").val();
  var email = $("input#email").val();
  var phone = $("input#phone").val();
  var message = $("textarea#message").val();
   // For Success/Failure Message
  // Check for white space in name for Success/Fail message
  $this = $("#sendMessageButton");
  $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages

  navigator.serviceWorker.controller.postMessage({
    url: "https://mir02dqvt2.execute-api.ap-south-1.amazonaws.com/User/",
    data: `{"name": "${name}","phone": "${phone}","email": "${email}","message": "${message}"}`
  }, [messageChannel.port2]);
  navigator.serviceWorker.ready.then(function (swRegistration) {
    return swRegistration.sync.register('sendMail');
  });
  if (!navigator.onLine) {
    
    $('#syncMail').html('You are not online. Your message is queued and will be send when you are back online');
  }
  
  // add data in indexed db
  // var request = db.transaction(["mailData"], "readwrite")
  //   .objectStore("mailData")
  //   .add({
  //     id: 1,
  //     url: "https://mir02dqvt2.execute-api.ap-south-1.amazonaws.com/User/",
  //     data: `{"name": "${name}","phone": "${phone}","email": "${email}","message": "${message}"}`
  //   });

  // request.onsuccess = function (event) {
  //   console.log("added to your database.");
  //   navigator.serviceWorker.ready.then(function (swRegistration) {
  //     return swRegistration.sync.register('sendMail');
  //   });
  // };

  // request.onerror = function (event) {
  //   console.log("Unable to add  ");
  // }
  
  
  
  // $.ajax({
  //   url: "https://mir02dqvt2.execute-api.ap-south-1.amazonaws.com/User/",
  //   type: "POST",
  //   dataType: "json",
  //   data: `{
  //     "name": "${name}",
  //     "phone": "${phone}",
  //     "email": "${email}",
  //     "message": "${message}"
  //   }`,
  //   cache: false,
  //   success: sendMsgSuccess,
  //   error: sendMsgFailure,
  //   complete: sendMsgComplete
  // });










  // var params = {
  //   spreadsheetId: '1Nm0wXEupghjnnvanMZPoo1QbRxtnfnTSGKcsImG0UKo',
  //   range: 'A1',  // TODO: Update placeholder value.

  //   // How the input data should be interpreted.
  //   valueInputOption: 'RAW',  // TODO: Update placeholder value.

  //   // How the input data should be inserted.
  //   insertDataOption: 'INSERT_ROWS',  // TODO: Update placeholder value.
  // };
  // var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
  // var firstName = profile.getName();
  // if (firstName.indexOf(' ') >= 0) {
  //   firstName = profile.getName().split(' ').slice(0, -1).join(' ');
  // }
  
  // var valueRangeBody = {values: [[profile.getName(), profile.getEmail(), message]]};

  // var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  // request.then(function(response) {
  //   // Success message
  //     $('#success').html("<div class='alert alert-success'>");
  //     $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
  //       .append("</button>");
  //     $('#success > .alert-success')
  //     .append("<strong>Hi "+firstName+" !</strong>");
  //     $('#success > .alert-success')
  //       .append("<strong>Your message has been sent. </strong>");
  //     $('#success > .alert-success')
  //       .append('</div>');
  //     //clear all fields
  //     $('#contactForm').trigger("reset");
  //     $this.prop("disabled", false);
  // }, function(reason) {
  //   $('#success').html("<div class='alert alert-danger'>");
  //   $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
  //     .append("</button>");
  //   $('#success > .alert-danger').append($("<strong>").text("Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!"));
  //   $('#success > .alert-danger').append('</div>');
  //   //clear all fields
  //   $('#contactForm').trigger("reset");
  //   $this.prop("disabled", false);
  //   console.error('error: ' + reason.result.error.message);
  // });
}


var sendMsgSuccess = function () {
  $('#success').html("<div class='alert alert-success'>");
  $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
    .append("</button>");
  $('#success > .alert-success')
    .append("<strong>Your message has been sent. </strong>");
  $('#success > .alert-success')
    .append('</div>');
  //clear all fields
  $('#contactForm').trigger("reset");
}

var sendMsgFailure = function () {
  $('#success').html("<div class='alert alert-danger'>");
  $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
    .append("</button>");
  $('#success > .alert-danger').append($("<strong>").text("Sorry " + name + ", it seems that my mail server is not responding. Please try again later!"));
  $('#success > .alert-danger').append('</div>');
  //clear all fields
  $('#contactForm').trigger("reset");
}

var sendMsgComplete = function () {
  $('#syncMail').html('');
  setTimeout(function () {
    $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
  }, 1000);
}

var messageChannel = new MessageChannel();
messageChannel.port1.onmessage = function (event) {
  console.log("Response the SW : ", event.data.message);
  if (event.data.message == 'success') {
    sendMsgSuccess();
    sendMsgComplete();
  }
  else {
    sendMsgFailure();
    sendMsgComplete();
  }
}