const mysql = require("mysql2");
const consoleTable = require("console.table");
const inquirer = require("inquirer");

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
          console.log("view all depts");
          showDepts();
          break;
        case "View all roles":
          console.log("view all roles");
          showRoles();
          break;
        case "View all employees":
          console.log("view all emps");
          showEmployees();
          break;
        case "Add a department":
          console.log("add dept");
          addDept();
          break;
        case "Add a role":
          console.log("add role");
          addRole();
          break;
        case "Add an employee":
          console.log("add emp");
          addEmployee();
          break;
        case "Update an employee role":
          console.log("update emp role");
          break;
      }
    });
};

showDepts = () => {
  console.log("Showing all departments...\n");
  const sql = `SELECT department.id AS id,
      department.dept_name AS department
  FROM department`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

showRoles = () => {
  console.log("Showing all roles...\n");
  const sql = `SELECT job.id,
      job.title,
      department.dept_name AS department
  FROM job
      INNER JOIN department ON job.department_id = department.id`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

showEmployees = () => {
  console.log("Showing all employees...\n");
  const sql = `SELECT employee.id,
      employee.first_name,
      employee.last_name,
      job.title,
      department.dept_name AS department,
      job.salary,
      CONCAT (manager.first_name, " ", manager.last_name) AS manager
  FROM employee
      LEFT JOIN job ON employee.job_id = job.id
      LEFT JOIN department ON job.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

addDept = () => {
  console.log("Adding a department...\n");
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "What department would you like to add?",
        validate: (addDept) => {
          if (addDept) {
            return true;
          } else {
            console.log("Please enter a department");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (dept_name) VALUES (?)`;
      db.query(sql, answer.addDept, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        showDepts();
      });
    });
};

addRole = () => {
  console.log("Adding a role...\n");
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What role would you like to add?",
        validate: (addRole) => {
          if (addRole) {
            return true;
          } else {
            console.log("Please enter a role");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is this role's salary?",
        validate: (addSalary) => {
          if (isNaN(addSalary)) {
            return false;
          } else {
            console.log("Please enter a salary");
            return true;
          }
        },
      },
    ])
    .then((answer) => {
      const roleParams = [answer.role, answer.salary];
      const sql = `SELECT dept_name, id FROM department`;
      db.query(sql, (err, data) => {
        if (err) throw err;
        const dept = data.map(({ dept_name, id }) => ({
          name: dept_name,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "What department does this role belong to?",
              choices: dept,
            },
          ])
          .then((deptChoice) => {
            const dept = deptChoice.dept;
            roleParams.push(dept);
            const sql = `INSERT INTO job (title, salary, department_id) VALUES (?, ?, ?)`;
            db.query(sql, roleParams, (err, data) => {
              if (err) throw err;
              console.log(`Added ${answer.role} to roles!`);
              showRoles();
            });
          });
      });
    });
};

const addEmployee = () => {
  console.log("Adding an employee...\n");
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the new employee's first name?",
        validate: (firstName) => {
          if (firstName) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the new employee's last name?",
        validate: (lastName) => {
          if (lastName) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const empParams = [answer.firstName, answer.lastName];

      const sql = `SELECT job.id, job.title FROM job`;
      db.query(sql, (err, data) => {
        if (err) throw err;
        const jobs = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "job",
              message: "What is the new employee's role?",
              choices: jobs,
            },
          ])
          .then((jobChoice) => {
            const job = jobChoice.job;
            empParams.push(job);

            const mgmtSql = `SELECT * FROM employee`;
            db.query(mgmtSql, (err, data) => {
              if (err) throw err;
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is this employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  empParams.push(manager);

                  const sql = `INSERT INTO employee (first_name, last_name, job_id, manager_id) VALUES (?, ?, ?, ?)`;
                  db.query(sql, empParams, (err, data) => {
                    if (err) throw err;
                    console.log("Employee was added!");
                    showEmployees();
                  });
                });
            });
          });
      });
    });
};

module.exports = promptUser;
