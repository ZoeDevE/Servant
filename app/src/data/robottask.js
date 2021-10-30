import React, { useEffect, useState } from 'react';
import { createStore, createSubscriber, createHook } from 'react-sweet-state';
import { SettingsStore } from './configprovider';

const useDataStore = createHook(SettingsStore);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
  }
  

export default function checkTask(task, contract) {
    if (task.verifyTime < Date.now()) {
        
        let date = new Date()
        date.setHours(0);
        date.setMinutes(0);
        date.setMilliseconds(0);
        date.setSeconds(0);


        task.start = date.getTime();
        task.verifyTime = date.getTime()+getRandomInt(task.minDuration, task.endDuration);

        if (contract.config.unlock) {
            task.locked = false;
        }
        
        if (task.performed >= task.goal) {  //Goal achieved
            return [true, null];
        }
        
        let punishments = []
        punishments = punishments.concat(task.punishments.split("\n"))
        if (task.globalPunish) {
            punishments = punishments.concat(contract.punishments.split("\n"))
        }

        let index = getRandomInt(0, punishments.length);

        return [true, punishments[index]];
    }
    return [false, null];
}
