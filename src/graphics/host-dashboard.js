'use strict';
$(() => {
  // JQuery selectors.
  var donationTotalElement = $('#donationTotal');
  var prizesContainer = $('#prizesContainer');
  var bidsContainer = $('#bidsContainer');
  var runsContainer = $('#runsContainer');
	
  // Declaring variables.
  var prizeHTML = $('<div class="prize"><span class="prizeName"></span><br>Provided by <span class="prizeProvider"></span><br>minimum donation <span class="prizeMinDonation"></span><br>Ends: <span class="prizeEnd"></span></div>');
  var bidHTML = $('<div class="bid"><span class="bidGame"></span><br><span class="bidName"></span></div>')
  var runHTML = $('<div class="run"><span class="justMissed">YOU HAVE JUST WATCHED<br></span><span class="gameName"></span><br><span class="gameCategory"></span><br><span class="gameConsole"></span><br><span class="gameRunners"></span><br><span class="gameTime"></span><br><span class="gameFinal"></span></div>');

  // Keep donation total updated.
  var donationTotal = nodecg.Replicant('donationTotal');
  donationTotal.on('change', newVal => {
    donationTotalElement.html(formatDollarAmount(donationTotal.value, true));
	});
	
	const videos = nodecg.Replicant('assets:videos');
	const videoPlayer = nodecg.Replicant('videoPlayer');
	videoPlayer.on('change', (newVal) => {
    const video = videos.value.find((v) => v.sum === newVal.selected);
		if (newVal.selected && video) {
			$('#videoName').text(video.name);
		} else {
			$('#videoName').text('none currently');
		}
	});
	
  // Keep prizes updated.
  var prizes = nodecg.Replicant('prizes');
  prizes.on('change', newVal => {
    prizesContainer.html('');
    newVal.forEach(prize => {
      var prizeElement = prizeHTML.clone();
      $('.prizeName', prizeElement).html(prize.name);
      $('.prizeProvider', prizeElement).html(prize.provided);
      $('.prizeMinDonation', prizeElement).html(formatDollarAmount(prize.minimumBid));
      $('.prizeEnd', prizeElement).html(moment.unix(prize.endTime / 1000).format('Do HH:mm'));
      prizesContainer.append(prizeElement);
    });
  });
	
  // Keep bids updated.
  var bids = nodecg.Replicant('bids');
  bids.on('change', newVal => {
    var i = 0;
    bidsContainer.html('');
    newVal.forEach(bid => {
      if (i >= 2) return;
      var bidElement = bidHTML.clone();
      $('.bidGame', bidElement).html(bid.game+' - '+bid.category);
      $('.bidName', bidElement).html(bid.name);
      // Donation Goal
      if (!bid.war) {
        var bidLeft = bid.goal - bid.total;
        bidElement.append('<br>'+formatDollarAmount(bid.total)+'/'+formatDollarAmount(bid.goal));
        bidElement.append('<br>'+formatDollarAmount(bidLeft)+' to goal'); 
      }
      // Bid War
      else {
        if (bid.options.length) {
          bid.options.forEach(option => {
            bidElement.append('<br>'+option.name+' ('+formatDollarAmount(option.total)+')')
          });
					
          if (bid.allowUserOptions)
            bidElement.append('<br><i>Users can submit their own options.</i>')
        }
        else
          bidElement.append('<br><i>No options submitted yet.</i>')
      }
      bidsContainer.append(bidElement);
      i++;
    });
  });
	
  var runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
  var runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
  var runDataActiveRunSurrounding = nodecg.Replicant('runDataActiveRunSurrounding', 'nodecg-speedcontrol');
  var runFinishTimes = nodecg.Replicant('runFinishTimes', 'nodecg-speedcontrol');
  var runFinishTimesInit = false;
  var runDataActiveRunInit = false;
  var runsInit = false;
  runFinishTimes.on('change', newVal => {
    runFinishTimesInit = true;
    if (!runsInit && runFinishTimesInit && runDataActiveRunInit) {
      setRuns();
      runsInit = true;
    }
  });
  runDataActiveRun.on('change', newVal => {
    runDataActiveRunInit = true;
    if (runFinishTimesInit && runDataActiveRunInit) {
      setRuns();
      runsInit = true;
    }
  });
	
  function setRuns() {
    runsContainer.html('');
    var indexOfCurrentRun = findIndexInRunDataArray(runDataActiveRun.value);
    for (var i = -1; i < 2; i++) {
      var run = runDataArray.value[indexOfCurrentRun+i];
      if (run) {
        var runElement = runHTML.clone();
        if (i === -1) {
          $('.justMissed', runElement).show();
          if (runFinishTimes.value[runDataActiveRunSurrounding.value.previous]) {
            $('.gameFinal', runElement).html(runFinishTimes.value[runDataActiveRunSurrounding.value.previous].time);
            $('.gameFinal', runElement).show();
          }
        }
        else {
          $('.justMissed', runElement).hide();
          $('.gameFinal', runElement).hide();
        }
        $('.gameName', runElement).html(run.game);
        $('.gameCategory', runElement).html(run.category);
        $('.gameConsole', runElement).html(run.system);
        $('.gameRunners', runElement).html(formPlayerNamesString(run));
        $('.gameTime', runElement).html(run.estimate);
        runsContainer.append(runElement);
      }
    }
  }

  // Get the next X runs in the schedule.
  function getNextRuns(runData, amount) {
    var nextRuns = [];
    var indexOfCurrentRun = findIndexInRunDataArray(runData);
    for (var i = 1; i <= amount; i++) {
      if (!runDataArray.value[indexOfCurrentRun + i]) break;
      nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
    }
    return nextRuns;
  }

  // Returns how long until a run, based on the estimate of the previous run.
  function formETAUntilRun(previousRun, whenTotal) {
    var whenString = '';
    if (!previousRun) whenString = 'Next';
    else {
      var previousRunTime = previousRun.estimateS + previousRun.setupTimeS;
      var formatted = moment.utc().second(0).to(moment.utc().second(whenTotal + previousRunTime), true);
      whenString = 'In about ' + formatted;
      whenTotal += previousRunTime;
    }
    return [whenString, whenTotal];
  }

  // Converts milliseconds to a time string.
  function msToTime(duration, noHour) {
    var seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    var timeString = '';

    if (!noHour)
      timeString += hours + ':';
    timeString += minutes + ':' + seconds;

    return timeString;
  }

  // Goes through each team and members and makes a string to show the names correctly together.
  function formPlayerNamesString(runData) {
    var namesArray = [];
    var namesList = 'No Player(s)';
    runData.teams.forEach(team => {
      var teamPlayerArray = [];
      team.players.forEach(player => { teamPlayerArray.push(player.name); });
      namesArray.push(teamPlayerArray.join(', '));
    });
    if (namesList.length) namesList = namesArray.join(' vs. ');
    return namesList;
  }

  // Returns the total amount of players a run has.
  function checkForTotalPlayers(runData) {
    var amount = 0;
    runData.teams.forEach(team => team.players.forEach(player => amount++));
    return amount;
  }

  // Find array index of current run based on it's ID.
  function findIndexInRunDataArray(run) {
    var indexOfRun = -1;

    // Completely skips this if the run variable isn't defined.
    if (run) {
      for (var i = 0; i < runDataArray.value.length; i++) {
        if (run.id === runDataArray.value[i].id) {
          indexOfRun = i; break;
        }
      }
    }

    return indexOfRun;
  }

  // Get a random integer, usually for selecting array elements.
  // You will never get max as an output.
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function getRandomFloat(max) {
    return Math.random() * max;
  }

  // Used to get the width of supplied text.
  function getTextWidth(text, size) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.font = size + 'px "Barlow Condensed"'; /* Change if layout is changed. */
    return ctx.measureText(text).width;
  }

  // Formats dollar amounts to the correct string.
  function formatDollarAmount(amount, forceRemoveCents) {
    // We drop the cents and add a comma over $1000.
    if (amount < 1000 && !forceRemoveCents)
      return '$' + amount.toFixed(2);
    else
      return '$' + Math.floor(amount).toLocaleString('en-US', { minimumFractionDigits: 0 });
  }

  // calculate the time until the prize period ends and render it as a human readable string ("an hour", "20 minutes")
  function getPrizeTimeUntilString(prize) {
    var timeUntil = moment.unix(prize.endTime / 1000).fromNow(true);
    timeUntil = timeUntil.replace('an ', ''); // Dirty fix for "Donate in the next an hour".
    timeUntil = timeUntil.replace('a ', ''); // Dirty fix for "Donate in the next a day".
    return timeUntil;
  }

  // Change if an element is visible or not.
  function changeVisibility(elem, isVisible) {
    $(elem).css({
      visibility: isVisible ? 'visible' : 'hidden'
    });
  }

  function createAssetArrayWithChances(arr) {
    var newArr = [];
    arr.forEach(asset => {
      for (var i = 0; i < asset.chance; i++) {
        newArr.push(asset);
      }
    });
    return newArr;
  }
});