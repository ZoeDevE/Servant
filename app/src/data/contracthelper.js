export default function getContract(settingsState, dataState) {
    //Get all contracts
    let contracts = dataState.data.master.concat(dataState.data.servant);

    //Find the selected contract and see if the user is master
    var contract = contracts.find(contract => contract._id == settingsState.data.activeContract)
    

    //Selected contract is not found?
    if (!contract && contracts.length > 0) {
        //console.log("Couldnt find contract, loading first option")
        contract = contracts[0];
        let master = dataState.data.master.includes(contract);
        return [contract, master ? 0 : 1, contract._id];
    }

    if (!settingsState.robotContract) {
        return [settingsState.robotContract, 2, "robot"];
    }

    return null;
}