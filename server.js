const express = require("express");
const consoleTable = require("console.table");
const promptUser = require("./assets/js/app");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let init = async () => {
  await app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
  );
  console.log(`
  
  ______                 _                         _______             _              
 |  ____|               | |                       |__   __|           | |             
 | |__   _ __ ___  _ __ | | ___  _   _  ___  ___     | |_ __ __ _  ___| | _____ _ __  
 |  __| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\    | | '__/ _\` |/ __| |/ / _ \\ '__| 
 | |____| | | | | | |_) | | (_) | |_| |  __/  __/    | | | | (_| | (__|   <  __/ |    
 |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|    |_|_|  \\__,_|\\___|_|\\_\\___|_|    
                  | |             __/ |                                               
                  |_|            |___/                                                
`);
  promptUser();
};

init();
