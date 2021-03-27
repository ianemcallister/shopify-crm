/*
*   DAILY 5PM SCRIPT
*   
*   Runs through all of the events for the next day, determins if the following required elements have been assigned:
*       -   A Shift to every event
*       -   A Budget to every event
*/
//  NOTIFY PROGRESS
//  DEFINE DEPENDENCEIES
//  LOCAL VARIABLES
//  EXECUTE

//  1.  Collect events for the next day by searching events by by a child date value
//  2.  Iterate over the list:
//      - does the event have a budet?
//      - does the event have a shift?
//      - does the event have a shipping order?
//      - does the event have a manufacturing order?
//  3.  Complile a list of errors
//  4.  Notify me of the errors that need resolving