// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBC2QOJsjBm6CJ6It9iqc5dVVROYoIX9jA",
    authDomain: "train-scheduler-772bb.firebaseapp.com",
    databaseURL: "https://train-scheduler-772bb.firebaseio.com",
    projectId: "train-scheduler-772bb",
    storageBucket: "",
    messagingSenderId: "973705947083"
  };
  firebase.initializeApp(config);

  var dataRef = firebase.database();

  var train = "";
  var destination = "";
  var first = 0;
  var frequency = 0;
  var timeUntil = 0;

  //The next two functions are for error handling to ensure that the user inputs the time and frequency correctly
  //If not, a modal comes up and tells the user to input the values correctly
  function inputFrequencyCorrection() {
    var modal = $('#myModal');
    $("#correction").text("Please enter a number for frequency.")
    modal.css("display", "block");
    setTimeout(function(){ modal.css("display", "none"); }, 3000);
  }

  function inputTimeCorrection() {
    var modal = $('#myModal');
    $("#correction").text("Please enter a time in military time.")
    modal.css("display", "block");
    setTimeout(function(){ modal.css("display", "none"); }, 3000);
  }

  //This functioncalculates and returns the time until next train (timeUntil) and next train time
  function arrivalTime(time, tFrequency) {
   
    var firstTimeConverted = moment(time, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    timeUntil = tMinutesTillTrain;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    return moment(nextTrain).format("hh:mm");
  }

  //Takes the user inputs and saves them to firebase database, uses a RegExp to ensure the time is entered
  //in the proper format and checks to make sure a number is entered for frequency, also clears the input fields
  $("#submit-button").on("click", function(event) {
    event.preventDefault();

    train = $("#tName-input").val().trim();
    destination = $("#destination-input").val().trim();
    first = $("#first-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    var re = /\d\d\:\d\d/;
    var OK = re.exec(first);   

    if(isNaN(frequency) || frequency === ""){
      inputFrequencyCorrection();
    }
    else if (!OK) {
        inputTimeCorrection();
    }
    else {

      dataRef.ref('Trains').push({
          trainInput:train,
          destinationInput:destination,
          firstTrainTime:first,
          frequencyInput:frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
    })
  }
    $("#inputInfo").find('input:text').val("");
    $("#frequency-input").val(""); 
});
 
//Creates a table to display the train information (reading from the firebase database values), 
//including the calculated values
    dataRef.ref('Trains').orderByChild("dateAdded").on("child_added", function(snapshot){
        var newRow = $("<tr>");
        var newTrain = $("<td>");
        var newDestination = $("<td>");
        var newFrequency = $("<td>");
        var newArrival = $("<td>");
        var newMinAway = $("<td>");
        newTrain.text(snapshot.val().trainInput);
        newDestination.text(snapshot.val().destinationInput);
        newFrequency.text(snapshot.val().frequencyInput);
        newArrival.text(arrivalTime(snapshot.val().firstTrainTime, snapshot.val().frequencyInput));
        newMinAway.text(timeUntil);
        newRow.append(newTrain, newDestination, newFrequency, newArrival, newMinAway);
        $("#table-body").append(newRow);
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
