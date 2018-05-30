
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

  $("#submit-button").on("click", function(event) {
      event.preventDefault();

      train = $("#tName-input").val().trim();
      destination = $("#destination-input").val().trim();
      first = $("#first-input").val().trim();
      frequency = $("#frequency-input").val().trim();

      console.log(train);
      $("#inputInfo").find('input:text').val("");
    //   $("#inputInfo").find('input:number').val("");

      dataRef.ref('Trains').push({
          trainInput:train,
          destinationInput:destination,
          firstTrainTime:first,
          frequencyInput:frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      })
    
  });

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
 
    dataRef.ref('Trains').orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
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
 
