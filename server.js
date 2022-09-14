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
  console.log(` _______ .___  ___. .______    __        ______   ____    ____  _______  _______    .___________.______          ___       ______  __  ___  _______ .______      
  |   ____||   \/   | |   _  \  |  |      /  __  \  \   \  /   / |   ____||   ____|   |           |   _  \        /   \     /      ||  |/  / |   ____||   _  \     
  |  |__   |  \  /  | |  |_)  | |  |     |  |  |  |  \   \/   /  |  |__   |  |__      \`---|  |----|  |_)  |      /  ^  \   |  ,----'|  '  /  |  |__   |  |_)  |    
  |   __|  |  |\/|  | |   ___/  |  |     |  |  |  |   \_    _/   |   __|  |   __|         |  |    |      /      /  /_\  \  |  |     |    <   |   __|  |      /     
  |  |____ |  |  |  | |  |      |  \`----.|  \`--'  |     |  |     |  |____ |  |____        |  |    |  |\  \----./  _____  \ |  \`----.|  .  \  |  |____ |  |\  \----.
  |_______||__|  |__| | _|      |_______| \______/      |__|     |_______||_______|       |__|    | _| \`._____/__/     \__\ \______||__|\__\ |_______|| _| \`._____|
                                                                                                                                                                   `);
  promptUser();
};

init();
