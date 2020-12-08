let chart = null;
let activities = null;

const config = {
  type: 'line',
  data:  {
    datasets: []
  },
  options: {
    scales: {
      xAxes: [],
      yAxes: [{
        ticks: {
          callback: function(value, index, values) {
            return `${value} km`;
          }
        }
      }]
    },
    tooltips: {
      xPadding: 8,
      yPadding: 8,
      bodySpacing: 4,
      cornerRadius: 0,
      displayColors: false,
      callbacks: {
        label: function(item, data) {
          const activity = data.datasets[item.datasetIndex].data[item.index].activity;
          return [
            `Distance: ${trunc(activity.distance)} km`,
            `Average speed: ${trunc(activity.distance / (activity.time / 3600))} km/h`,
            `Elevation gain: ${trunc(activity.elevation)} m`
          ];
        }
      }
    }
  }
};

function trunc(value) {
  return Math.trunc(value * 10) / 10;
}

function groupBy(activities, format, date) {
  const map = new Map();
  for (const activity of activities) {
    const key = activity.date.format(format);

    if (!map.has(key)) {
      map.set(key, {
        date: date(activity.date.clone()),
        type: activity.type,
        time: 0,
        distance: 0,
        elevation: 0
      });
    }

    const value = map.get(key);
    value.time += activity.time;
    value.distance += activity.distance;
    value.elevation += activity.elevation;
  }
  return map.values();
}

function groupByDay(activities) {
  return activities;
}

function groupByWeek(activities) {
  return groupBy(activities, 'Y-w', date => {
    return date.endOf('week');
  });
}

function groupByMonth(activities) {
  return groupBy(activities, 'Y-M', date => {
    return date.endOf('month');
  });
}

function titleDay(items, data) {
  const date = data.datasets[items[0].datasetIndex].data[items[0].index].activity.date;
  return date.format('MMM D, H:mm');
}

function titleWeek(items, data) {
  const date = data.datasets[items[0].datasetIndex].data[items[0].index].activity.date;
  return `${date.startOf('week').format('MMM D')} - ${date.endOf('week').format('MMM D')}`;
}

function titleMonth(items, data) {
  const date = data.datasets[items[0].datasetIndex].data[items[0].index].activity.date;
  return date.format('MMMM');
}

function updateConfig(group, title, unit) {
  const years = new Map();
  for (const activity of group(activities)) {
    const year = activity.date.year();

    if (!years.has(year)) {
      years.set(year, []);
    }
    years.get(year).push({
      x: activity.date,
      y: activity.distance,
      activity: activity
    });
  }

  config.options.scales.xAxes.length = 0;
  config.options.scales.xAxes.push({
    type: 'time',
    time: {
      unit: unit,
      unitStepSize: 1
    }
  });

  config.options.tooltips.callbacks.title = title;

  config.data.datasets.length = 0;
  for (const [year, data] of years.entries()) {
    config.data.datasets.push({
      label: year,
      borderColor: 'rgba(33, 150, 243, 1)',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      borderWidth: 1,
      lineTension: 0,
      pointRadius: 5,
      pointHitRadius: 15,
      pointBorderColor: 'rgba(33, 150, 243, 1)',
      pointBackgroundColor: 'rgb(233, 245, 254, 1)',
      pointHoverRadius: 5,
      data: data
    });
  }
}

async function fetch(url) {
  return new Promise(resolve => {
    const request = new XMLHttpRequest();

    request.open('GET', url);
    request.responseType = 'json';
    request.onload = () => {
      const activities = [];
      for (const activity of request.response) {
        if (activity.type !== 'Ride') {
          continue;
        }
        activity.date = moment(activity.date);
        activity.distance = trunc(activity.distance / 1000);
        activities.push(activity);
      }
      resolve(activities);
    }
    request.send();
  });
}

async function init() {
  moment.updateLocale('de', {
    week: {
      dow: 1  // Because weeks don't start on Sunday...
    }
  });

  activities = await fetch('/data/strava.json');

  updateConfig(groupByWeek, titleWeek, 'week');

  chart = new Chart(document.getElementById('chart').getContext('2d'), config);
}

function update(group, title, unit) {
  updateConfig(group, title, unit);

  chart.update(config);
}

init();
