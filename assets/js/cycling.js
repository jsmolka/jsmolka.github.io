import moment from 'moment';
import Chart from 'chart.js';

(async function() {
  const config = {
    type: 'line',
    data: {
      datasets: []
    },
    options: {
      scales: {
        xAxes: [],
        yAxes: [{
          ticks: {
            callback: function(value) {
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
              `Distance: ${activity.formatDistance}`,
              `Moving time: ${activity.formatTime}`,
              `Average speed: ${activity.formatAverage}`,
              `Elevation gain: ${activity.elevation}`
            ];
          }
        }
      }
    }
  };

  class Activity {
    constructor(date, time, distance, elevation) {
      this.date = moment(date);
      this.time = moment(time);
      this.distance = distance;
      this.elevation = elevation;
    }

    round(value) {
      return Math.round(value * 10) / 10;
    }

    get formatTime() {
      // Workaround to show more than 23 hours
      const basis = moment().startOf('day').add(this.time, 'seconds');
      const hours = Math.trunc(this.time / 3600);

      return basis.format(`${hours}:mm:ss`);
    }

    get formatDistance() {
      return `${this.round(this.distance)} km`;
    }

    get formatAverage() {
      const hours = this.time / 3600;

      return `${this.round(this.distance / hours)} km/h`;
    }

    get formatElevation() {
      return `${this.round(this.elevation)} m`;
    }

    get titleDay() {
      return this.date.format('MMM D, H:mm');
    }

    get titleWeek() {
      return `${this.date.startOf('week').format('MMM D')} - ${this.date.endOf('week').format('MMM D')}`;
    }

    get titleMonth() {
      return this.date.format('MMMM');
    }
  }

  class Activities extends Array {
    async fetch(url) {
      return new Promise(resolve => {
        const request = new XMLHttpRequest();

        request.open('GET', url);
        request.responseType = 'json';
        request.onload = () => {
          for (const datum of request.response) {
            if (datum.type !== 'Ride') {
              continue;
            }

            this.push(new Activity(
              datum.date,
              datum.time,
              datum.distance / 1000,
              datum.elevation
            ));
          }
          resolve(this);
        }
        request.send();
      });
    }

    groupBy(keyCallback, dateCallback) {
      const map = new Map();
      for (const activity of this) {
        const key = keyCallback(activity);

        if (!map.has(key)) {
          map.set(key, new Activity(
            dateCallback(activity),
            0, 0, 0)
          );
        }

        const value = map.get(key);
        value.time += activity.time;
        value.distance += activity.distance;
        value.elevation += activity.elevation;
      }
      return Array.from(map.values());
    }

    groupByDay() {
      return this.groupBy(
        activity => activity.date.format('Y-w-D'),
        activity => activity.date
      );
    }

    groupByWeek() {
      return this.groupBy(
        activity => activity.date.format('Y-w'),
        activity => activity.date.endOf('week')
      );
    }

    groupByMonth() {
      return this.groupBy(
        activity => activity.date.format('Y-M'),
        activity => activity.date.endOf('month')
      );
    }
  }

  class Dataset {
    constructor(label, data) {
      this.label = label;
      this.borderColor = 'rgba(33, 150, 243, 1)';
      this.backgroundColor = 'rgba(33, 150, 243, 0.1)';
      this.borderWidth = 1;
      this.lineTension = 0;
      this.pointRadius = 5;
      this.pointHitRadius = 5;
      this.pointBorderColor = 'rgba(33, 150, 243, 1)';
      this.pointBackgroundColor = 'rgb(233, 245, 254, 1)';
      this.pointHoverRadius = 5;
      this.data = data;
    }
  }

  class Application {
    constructor() {
      this.chart = null;
      this.config = Object.assign({}, config);
      this.activities = new Activities();
    }

    async init() {
      await this.activities.fetch('/static/data/strava.json');

      this.update(
        activity => activity.groupByDay(),
        activity => activity.titleDay,
        'week'
      );
    }

    update(groupCallback, titleCallback, unit) {
      const data = [];
      for (const activity of groupCallback(this.activities)) {
        data.push({
          x: activity.date,
          y: activity.distance,
          activity: activity
        });
      }

      this.config.options.scales.xAxes.length = 0;
      this.config.options.scales.xAxes.push({
        type: 'time',
        time: {
          unit: unit,
          unitStepSize: 1
        }
      });

      this.config.options.tooltips.callbacks.title = (items, data) => {
        const activity = data.datasets[items[0].datasetIndex].data[items[0].index].activity;
        return titleCallback(activity);
      };

      this.config.data.datasets.length = 0;
      this.config.data.datasets.push(
        new Dataset('', data))

      if (this.chart) {
        this.chart.update(this.config);
      } else {
        this.chart = new Chart(document.getElementById('chart').getContext('2d'), this.config);
      }
    }
  }

  moment.updateLocale('de', {
    week: {
      dow: 1  // Because weeks don't start on Sunday...
    }
  });

  const app = new Application();

  await app.init();

  document.getElementById('btnDay').onclick = () => {
    app.update(
      activities => activities.groupByDay(),
      activity => activity.titleDay,
      'week'
    );
  };

  document.getElementById('btnWeek').onclick = () => {
    app.update(
      activities => activities.groupByWeek(),
      activity => activity.titleWeek,
      'week'
    );
  };

  document.getElementById('btnMonth').onclick = () => {
    app.update(
      activities => activities.groupByMonth(),
      activity => activity.titleMonth,
      'month'
    );
  };
})();
