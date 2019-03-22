import React, { Component } from 'react';
import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css';
// import 'fullcalendar/dist/fullcalendar.print.min.css';
import 'fullcalendar/dist/fullcalendar.js';

class Calendar_test extends Component {
    componentDidMount(){
            $('#calendar').fullCalendar({
                customButtons:{
                    cus01:{
                        text:"cus01",
                        click:()=>{
                            $('#calendar').fullCalendar("next")
                        }
                    }
                },
                header: {
                    left: 'cus01 next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                eventLimit: true, // allow "more" link when too many events
                events: 'https://fullcalendar.io/demo-events.json?overload-day'
              });
    }
    render() {
        return (
            <div>
                <div id="calendar" >

                </div>
            </div>
        );
    }
}

export default Calendar_test;