// TV Schedule example

function retrieveGenres() {
  $.ajax({
    url: 'http://www.bbc.co.uk/tv/programmes/genres.json',
    dataType: 'json'
  }).done(function(response) {
    // console.log(response);
    // using the $.each( ) function
    // add each item to the #genres list as a list item with the key as the list item's id
    $.each(response.categories, function(index, item) {
      // console.log(item.key);
      $('#genres').append('<li id="' + item.key + '">' + item.key + '</li>');
    });
    $('#genres li').on('click', function(event) {
      var $target = event.target;
      console.log($target); // e.g. <li id="entertainment">entertainment</li>
      getTomorrowsSchedule($target.id);
      $('#genres li').removeClass('active'); // remove existing active class first
      console.log(this);
      $(this).addClass('active');
    })
  })
}

function getTomorrowsSchedule(genre) {
  $.ajax({
    url: 'http://www.bbc.co.uk/tv/programmes/genres/' + genre + '/schedules/tomorrow.json',
    dataType: 'json',
    beforeSend: function() {
      $('#programmes').empty(); // empty list if switching from genre to genre
      $('#programmes').html('<div class="spinner"><img src="spinner.gif" /></div>');
    }
  }).done(function(response) {
    $('.spinner').remove();
    $.each(response.broadcasts, function(index, item) {
      $('#programmes').append(processEpisode(item));
    })
  })
}

function processEpisode(episode) {
  var item_html = '<li>';
  item_html += '<h2>' + episode.programme.display_titles.title + '</h2>';
  if (episode.programme.image != null) {
    item_html += '<img src="http://ichef.bbci.co.uk/images/ic/272x153/' + episode.programme.image.pid + '.jpg" />'
  } else {
    item_html += '<img src="http://placehold.it/272x153" />'
  }
  item_html += '<p><b>Synopsis:</b> ' + episode.programme.short_synopsis + '</p>';
  item_html += '<p><b>Date and Time:</b> ' + formatDate(episode.start, episode.end) + '</p>';
  item_html += '<p><b>Duration:</b> ' + episode.duration + '</p>';
  item_html += '<span><b>Channel:</b> ' + episode.service.title + '</span>';
  return item_html;
}

function formatDate(start, end) {
  start_date = new Date(start);
  // e.g. start = 2014-05-08T18:50:00+01:00
  // e.g. start_date = Thu May 08 2014 18:50:00 GMT+0100 (BST)
  end_date = new Date(end);

  day = start_date.getDate();
  month = start_date.getMonth() + 1; // the returned months are 0-11
  year = start_date.getFullYear();

  start_hour = start_date.getHours();
  start_mins = start_date.getMinutes();

  end_hour = end_date.getHours();
  end_mins = end_date.getMinutes();

  date = day + "/" + month + "/" + year + " ";

  // add leading 0 and return last two characters to make sure we use 00:00 format
  date += ('0'+start_hour).slice(-2) + ':' + ('0'+start_mins).slice(-2) + "-" +
          ('0'+end_hour).slice(-2) + ':' +  ('0'+end_mins).slice(-2);
  return date;
}

retrieveGenres();
