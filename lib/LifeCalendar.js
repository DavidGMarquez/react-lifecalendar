import React, {Component, PropTypes} from 'react'
import moment from 'moment'

import LifeMatrix from './LifeMatrix'
import LifeTitle from './LifeTitle'
import LifeYAxis from './LifeYAxis'
import LifeXAxis from './LifeXAxis'

class LifeCalendar extends Component {

  getWeekRange(dob, start, end) {
    var offsetStart = moment.duration(start.diff(dob)).asYears() * 52;
    var offsetEnd = offsetStart + (moment.duration(end.diff(start)).asYears() * 52);
    return {start: Math.ceil(offsetStart - (1 / 2)), end: Math.ceil(offsetEnd - (1 / 2))};
  }

  render() {
    const {width, height, title, data} = this.props;

    if (data.dob === undefined || data.lifeExpectancy === undefined) {
      console.error('Please supply both the dob and lifeExpectancy values in the data to the calendar');
      return (<p>Error rendering calendar - please check console</p>);
    }

    var count = data.lifeExpectancy * 52;
    var dateFormat = data.dateFormat || 'MM/DD/YYYY';

    var ranges = data.ranges.map((range) => {
      var offset = this.getWeekRange(moment(data.dob, dateFormat), moment(range.start, dateFormat), moment(range.end || moment().format(dateFormat), dateFormat));
      return {
        start: offset.start,
        end: offset.end,
        title: range.title,
        color: range.color || 'black'
      }
    });

    var milestones = data.milestones.map((milestone) => {
      var offset = this.getWeekRange(moment(data.dob, dateFormat), moment(milestone.date, dateFormat), moment(milestone.date, dateFormat));
      return {
        start: offset.start,
        end: offset.end,
        title: milestone.title,
        color: milestone.color || (data.milestoneColor || 'black')
      }
    });
    ranges = ranges.concat(milestones);
    
    var currentOffset = this.getWeekRange(moment(data.dob, dateFormat), moment(), moment());
    ranges.push({
      start: currentOffset.start, end: currentOffset.end, title: 'Current Week!', color: 'darkblue'
    });

    var svgWidth = width || 500;
    var svgHeight = height || 1000;
    var margin = 30;


    return (
      <svg height={svgHeight} width={svgWidth + margin}>
        <svg x={margin} y="0" width={svgWidth - margin}>
          <LifeTitle width={svgWidth - margin} title={title || 'Life Calendar'}/>
        </svg>
        <svg x="0" y={margin + 10}>
          <LifeYAxis count={count}/>
        </svg>
        <svg x={margin} y={25} width={svgWidth - margin}>
          <LifeXAxis/>
        </svg>
        <svg x={margin} y={margin + 10} width={svgWidth - margin}>
          <LifeMatrix count={count} ranges={ranges}/>
        </svg>
      </svg>
    )
  }
}

export default LifeCalendar;