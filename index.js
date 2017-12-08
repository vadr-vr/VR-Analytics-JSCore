import User from './js/userData.js';
/*
    CONFIGURATION FILE - 
        appId, appToken
        frequency of data collection
        default events to collect data for
        developer mode

    USER DATA MANAGER - (user id same as device id if not set)
        Handles any extra info about the user
    DEVICE DATA MANAGER (asynchronus)(Research: ways to get unique user id for windows, android, 
            ios, linux and osx)
        Handles the device information, location, hardware, browser

    DATA COLLECTOR - manages the event data dictionaries
        Manages the addition of event data to dictionary
        manages the event data dictionaries
        manages requests to server for data transfer

    DATA FETCHER
        Initiates timed event fetch request
        Manages user called events

    UTILS
        Gets unix time
        Gets uuid

    LOGGER
*/