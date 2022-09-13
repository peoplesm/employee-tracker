const express = require("express");
const mysql = require("mysql2");
// const consoleTable = require("console.table");
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

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

const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "No Action",
        ],
      },
    ])
    .then((answer) => {
      const { choices } = answer;
      switch (choices) {
        case "View all departments":
          console.log("yay");
          break;
        case "View all roles":
          console.log("yas");
          break;
      }
    });
};

init();
