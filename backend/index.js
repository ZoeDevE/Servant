var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
const mongoose = require('mongoose');
const { timingSafeEqual } = require('crypto');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  inviteCode: {
    type: String,
    required: true,
    index: true,
    unique: true
  }
});

const User = mongoose.model('User', userSchema);

const contractConfig = new mongoose.Schema({
  name: {
    type: String,
    default: "noname"
  },
  punishments: {
    type: String,
    default: "",
  },
});

const task = new mongoose.Schema({
  type: {
    type: Number,
    required: true,
    default: 0
  },
  name: {
    type: String,
    required: true,
    default: "Timed task",
  },
  description: {
    type: String,
    default: "A longer description",
  },
  start: {
    type: Number,
    required: true
  },
  minDuration: {
    type: Number,
    required: true
  },
  endDuration: {
    type: Number,
    required: true
  },
  startTime: {
    type: Number,
    required: true,
    default: 0
  },
  goal: {
    type: Number,
    required: true
  },
  performed: {
    type: Number,
    required: true,
    default: 0
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  goalVisible: {
    type: Boolean,
    required: true,
    default: true,
  },
  timeVisible: {
    type: Boolean,
    required: true,
    default: true,
  },
  globalPunish: {
    type: Boolean,
    required: true,
    default: true,
  },
  punishments: {
    type: String,
    default: "",
  }
});

const contractSchema = new mongoose.Schema({
  master: {
    type: String,
    required: true,
    index: true
  },
  servant: {
    type: String,
    required: true,
    index: true
  },
  config: {
    type: contractConfig,
    default: () => ({})
  },
  openPunishments: {
    type: Array,
    default: [],
  },
  tasks: [task],
});

const Contract = mongoose.model('Contract', contractSchema);

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017";
mongoose.connect(uri);


app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(bodyParser.json());

app.post('/user', async function (req, res) {
  try {
    var user = new User({ id: req.body.id, inviteCode: req.body.inviteCode });
    var err = await user.save()
    console.log(err);
    res.status(204).send("Success!")
  } catch {
    res.status(400).send("User exists");
  }
});

app.put('/user', async function (req, res) {
  try {
    var user = await User.find({ id: req.body.id });
    if (user.length == 0) {
      res.status(404).send();
      return;
    }
    user = user[0];
    user.inviteCode = req.body.inviteCode;
    var err = await user.save()
    res.status(204).send("Success!")
  } catch (err) {
    res.status(400).send("User exists");
  }
});

app.post('/checkinvite', async function (req, res) {
  var data = await User.find({ inviteCode: req.body.inviteCode })
  console.log(data);
  if (data.length != 0) {
    res.status(204).send();
  } else {
    res.status(400).send();
  }
});

app.post('/contract', async function (req, res) {
  var result = await createContract(req.body.id, req.body.inviteCode);
  if (result) {
    res.status(204).send();
  } else {
    res.status(400).send();
  }
});

app.post('/contract/config', async function (req, res) {
  if (!req.body) {
    res.status(400).send()
  }
  console.log(req.body.contractId);
  try {
    let contract = await Contract.find({_id: req.body.contractId});
    if (contract) {
      contract = contract[0];
    }
    console.log(req.body.id);
    console.log(contract.master);
    if (contract && contract.master == req.body.id) {
      contract.config = req.body.config;
      contract.save();
      res.status(204).send();
    } else {
      res.status(400).send();
    }
  } catch {
    res.status(400).send();
  }
});

app.post('/getcontracts', async function (req, res) {
  console.log(req.body.id);
  var master = await Contract.find({ master: req.body.id }, "-__v -servant -master -config._id");
  var servant = await Contract.find({ servant: req.body.id }, "-__v -master -servant -config._id");

  console.log(master);
  console.log(servant);
  res.status(200).send({ master: master, servant: servant });
});

app.post('/task', async function (req, res) {
  console.log(req.body.id);
  var contract = await Contract.find({ _id: req.body.contractId });
  if (contract.length == 0) {
    res.status(404).send()
    return;
  }
  contract = contract[0];
  console.log(contract);
  if (contract.master !== req.body.id && contract.servant !== req.body.id) {
    res.status(403).send()
    return;
  }

  contract.tasks.push(req.body.task);
  contract.markModified('tasks'); 
  contract.save()
    .then(data => res.status(204).send())
    .catch(err => res.status(400).send(err));
});

app.put('/task', async function (req, res) {
  console.log(req.body.id);
  var contract = await Contract.find({ _id: req.body.contractId });
  if (contract.length == 0) {
    res.status(404).send()
    return;
  }
  contract = contract[0];
  console.log(contract);
  if (contract.master !== req.body.id && contract.servant !== req.body.id) {
    res.status(403).send()
    return;
  }

  try {
    var task = contract.tasks.find(task => task._id.toString() == req.body.task._id);
    if(task == null) {
      res.status(404).send();
      return;
    }
    for (const [key, value] of Object.entries(req.body.task)) {
      if (key === "_id") continue;
      task[key] = value
    }
    contract.markModified('tasks'); 
    await contract.save();
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send()
  }
});

app.delete('/task', async function (req, res) {
  console.log(req.body.id);
  var contract = await Contract.find({ _id: req.body.contractId });
  if (contract.length == 0) {
    res.status(404).send()
    return;
  }
  contract = contract[0];
  console.log(contract);
  if (contract.master !== req.body.id && contract.servant !== req.body.id) {
    res.status(403).send()
    return;
  }

  try {
    var taskindex = contract.tasks.findIndex(task => task._id.toString() == req.body.task._id);
    if(taskindex == -1) {
      res.status(404).send();
      return;
    }
    contract.tasks.splice(taskindex, 1);
    contract.markModified('tasks'); 
    await contract.save();
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send()
  }
});

app.post('/task/perform', async function (req, res) {
  console.log(req.body.id);
  var contract = await Contract.find({ _id: req.body.contractId });
  if (contract.length == 0) {
    res.status(404).send()
    return;
  }
  contract = contract[0];
  console.log(contract);
  
  try {
    var task = contract.tasks.find(task => task._id.toString() == req.body.task._id);
    if(task == null) {
      res.status(404).send();
      return;
    }
    task.performed += 1;
    contract.markModified('tasks'); 
    await contract.save();
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send()
  }
});

app.post('/task/start', async function (req, res) {
  console.log(req.body.id);
  var contract = await Contract.find({ _id: req.body.contractId });
  if (contract.length == 0) {
    res.status(404).send()
    return;
  }
  contract = contract[0];
  console.log(contract);
  
  try {
    var task = contract.tasks.find(task => task._id.toString() == req.body.task._id);
    if(task == null) {
      res.status(404).send();
      return;
    }
    task.startTime = Date.now();
    contract.markModified('tasks'); 
    await contract.save();
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send()
  }
});

app.post('/task/stop', async function (req, res) {
  console.log(req.body.id);
  var contract = await Contract.find({ _id: req.body.contractId });
  if (contract.length == 0) {
    res.status(404).send()
    return;
  }
  contract = contract[0];
  console.log(contract);
  
  try {
    var task = contract.tasks.find(task => task._id.toString() == req.body.task._id);
    if(task == null) {
      res.status(404).send();
      return;
    }
    task.performed += (Date.now()-task.startTime);
    task.startTime = 0;
    contract.markModified('tasks'); 
    await contract.save();
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send()
  }
});


app.put('/punishment', async function (req, res) {
  console.log(req.body.id);
  var contract = await Contract.find({ _id: req.body.contractId });
  if (contract.length == 0) {
    res.status(404).send()
    return;
  }
  contract = contract[0];
  console.log(contract);
  if (contract.master !== req.body.id && contract.servant !== req.body.id) {
    res.status(403).send()
    return;
  }

  try {
    contract.openPunishments.push(req.body.punishment);
    contract.save();
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send()
  }
});

app.delete('/punishment', async function (req, res) {
  console.log(req.body.id);
  var contract = await Contract.find({ _id: req.body.contractId });
  if (contract.length == 0) {
    res.status(404).send()
    return;
  }
  contract = contract[0];
  console.log(contract);
  if (contract.master !== req.body.id && contract.servant !== req.body.id) {
    res.status(403).send()
    return;
  }

  try {
    let index = contract.openPunishments.findIndex(text => text == req.body.punishment);
    if (index > -1) {
      contract.openPunishments.splice(index, 1);
      contract.save();
    }
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send()
  }
});

//create a server object:
var server = app.listen(8088, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});

async function createContract(id, inviteCode) {
  var servant = await User.find({ inviteCode: inviteCode });
  var master = await User.find({ id: id });

  if (servant.length == 0 || master.length == 0) return false; //Cant find servant or master
  servant = servant[0];
  master = master[0];

  if (master.id == servant.id) return false; //Cant be master and servant

  var contract = new Contract({ master: id, servant: servant.id })

  console.log(contract);

  await contract.save();

  return true;
}