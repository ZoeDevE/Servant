export default function getContract(settingsState, dataState) {
    //Get all contracts
    console.log(settingsState.data)
    let contracts = dataState.data.master.concat(dataState.data.servant);
    //Find the selected contract and see if the user is master
    var contract = contracts.find(contract => contract._id == settingsState.data.activeContract)
    
    if (contract) {
        let master = dataState.data.master.includes(contract);
        return [contract, master ? 0 : 1, contract._id];
    }

    if (settingsState.data.activeContract == "robot" && settingsState.data.robotContract) {
        console.log(settingsState.data.robotContract);
        return [settingsState.data.robotContract, 2, "robot"];
    }

    //Selected contract is not found?
    if (!contract && contracts.length > 0) {
        //console.log("Couldnt find contract, loading first option")
        contract = contracts[0];
        let master = dataState.data.master.includes(contract);
        return [contract, master ? 0 : 1, contract._id];
    }

    if (settingsState.data.robotContract) {
        return [settingsState.data.robotContract, 2, "robot"];
    }
    
    return [null, 3, "no contract"]
}