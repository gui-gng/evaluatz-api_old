const spawn = require("child_process").spawn;
const pythonProcess = spawn('python',["path/to/script.py", arg1, arg2]);


pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script
});

// pyton part

/*

print(dataToSendBack)
sys.stdout.flush()

*/