//Load in dependencies
const mysql = require("mysql2");
require("console.table");
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

//Initial prompt
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
          "View employees by manager",
          "View employees by department",
          "View the total utilized budget by department",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee's role",
          "Update an employee's manager",
          "Delete an employee",
          "Delete a role",
          "Delete a department",
          "No Action",
        ],
      },
    ])
    .then((answer) => {
      const { choices } = answer;
      switch (choices) {
        case "View all departments":
          showDepts();
          break;
        case "View all roles":
          showRoles();
          break;
        case "View all employees":
          showEmployees();
          break;
        case "View employees by manager":
          showEmpsXMgmt();
          break;
        case "View employees by department":
          showEmpsXDept();
          break;
        case "View the total utilized budget by department":
          showDeptXBudg();
          break;
        case "Add a department":
          addDept();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee's role":
          updateEmployee();
          break;
        case "Update an employee's manager":
          updateEmpMgmt();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete a department":
          deleteDept();
          break;
        case "No Action":
          console.log("No Action Taken, Bye!");
          process.exit();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//Fxns to show various aspects of the db based on different requests
const showDepts = () => {
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

const showRoles = () => {
  console.log("Showing all roles...\n");
  const sql = `SELECT job.id,
    job.title,
    department.dept_name AS department,
    salary
FROM job
    INNER JOIN department ON job.department_id = department.id`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

const showEmployees = () => {
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

const showEmpsXMgmt = () => {
  console.log("Showing employees by their manager...\n");
  const sql = `SELECT CONCAT(manager.first_name, " ", manager.last_name) AS Manager,
    CONCAT(employee.first_name, " ", employee.last_name) AS Employee
FROM employee
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
ORDER BY manager.last_name,
    employee.last_name;`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

const showEmpsXDept = () => {
  console.log("Showing employees by their department...\n");
  const sql = `SELECT department.dept_name AS Department,
    CONCAT(employee.first_name, " ", employee.last_name) AS Employee
FROM employee
    LEFT JOIN job ON employee.job_id = job.id
    LEFT JOIN department ON job.department_id = department.id
ORDER BY department,
    employee.last_name;`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

const showDeptXBudg = () => {
  console.log("Showing departments by their utilized budget...\n");
  const sql = `SELECT department.id,
    department.dept_name as Department,
    sum(job.salary) AS Budget,
    count(employee.id) AS Employee_Count
FROM employee
    INNER JOIN job ON employee.job_id = job.id
    INNER JOIN department ON job.department_id = department.id
GROUP BY department.id
ORDER BY department.id`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//Adding different things to the db
const addDept = () => {
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
      db.query(sql, answer.addDept, (err, data) => {
        if (err) throw err;
        showDepts();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const addRole = () => {
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
            console.log("Please enter a salary");
            return false;
          } else {
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
          })
          .catch((err) => {
            console.log(err);
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
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          });
      });
    });
};

//Update aspects of the db
const updateEmployee = () => {
  console.log("Updating an employee...\n");
  const empSql = `SELECT * FROM employee`;
  db.query(empSql, (err, data) => {
    if (err) throw err;
    const emps = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "empData",
          message: "Who would you like to update?",
          choices: emps,
        },
      ])
      .then((empChoice) => {
        const emp = empChoice.empData;
        const empParams = [];
        empParams.push(emp);

        const jobSql = `SELECT * FROM job`;
        db.query(jobSql, (err, data) => {
          if (err) throw err;
          const jobs = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "jobData",
                message: "What is this employee's new role?",
                choices: jobs,
              },
            ])
            .then((jobChoice) => {
              const job = jobChoice.jobData;
              empParams.push(job);
              const params = empParams.reverse();
              const addEmpSql = `UPDATE employee SET job_id = ? WHERE id = ?`;
              db.query(addEmpSql, params, (err, data) => {
                if (err) throw err;
                console.log("Employee has been updated");
                showEmployees();
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
  });
};

const updateEmpMgmt = () => {
  console.log("Updating an employee's manager...\n");
  const empSql = `SELECT * FROM employee`;
  db.query(empSql, (err, data) => {
    if (err) throw err;
    const emps = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "empData",
          message: "Who would you like to update?",
          choices: emps,
        },
      ])
      .then((empChoice) => {
        const emp = empChoice.empData;
        const empParams = [];
        empParams.push(emp);

        db.query(empSql, (err, data) => {
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
                message: "Who is the employee's manager?",
                choices: managers,
              },
            ])
            .then((managerChoice) => {
              const manager = managerChoice.manager;
              empParams.push(manager);
              const params = empParams.reverse();
              const changeMgmtSql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
              db.query(changeMgmtSql, params, (err, data) => {
                if (err) throw err;
                console.log("Employee has been updated");
                showEmployees();
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
  });
};

//Delete aspects of the db
const deleteEmployee = () => {
  console.log("Deleteing an employee...\n");
  const empSql = `SELECT * FROM employee`;
  db.query(empSql, (err, data) => {
    if (err) throw err;
    const emps = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "emp",
          message: "Which employee would you like to delete?",
          choices: emps,
        },
      ])
      .then((empChoice) => {
        const empParams = [];
        const employee = empChoice.emp;
        empParams.push(employee);

        const deleteEmpSql = `DELETE FROM employee WHERE id = ?`;
        db.query(deleteEmpSql, empParams, (err, data) => {
          if (err) throw err;
          console.log("Employee has been deleted");
          showEmployees();
        });
      });
  });
};

const deleteRole = () => {
  console.log("Deleteing a role...\n");
  const jobSql = `SELECT * FROM job`;
  db.query(jobSql, (err, data) => {
    if (err) throw err;
    const jobs = data.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "job",
          message: "Which role would you like to delete?",
          choices: jobs,
        },
      ])
      .then((jobChoice) => {
        const jobParams = [];
        const job = jobChoice.job;
        jobParams.push(job);

        const deleteJobSql = `DELETE FROM job WHERE id = ?`;
        db.query(deleteJobSql, jobParams, (err, data) => {
          if (err) throw err;
          console.log("Role has been deleted");
          showRoles();
        });
      });
  });
};

const deleteDept = () => {
  console.log("Deleteing a department...\n");
  const deptSql = `SELECT * FROM department`;
  db.query(deptSql, (err, data) => {
    if (err) throw err;
    const depts = data.map(({ id, dept_name }) => ({
      name: dept_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "dept",
          message: "Which department would you like to delete?",
          choices: depts,
        },
      ])
      .then((deptChoice) => {
        const deptParams = [];
        const dept = deptChoice.dept;
        deptParams.push(dept);

        const deleteDeptSql = `DELETE FROM department WHERE id = ?`;
        db.query(deleteDeptSql, deptParams, (err, data) => {
          if (err) throw err;
          console.log("Role has been deleted");
          showDepts();
        });
      });
  });
};

module.exports = promptUser;
