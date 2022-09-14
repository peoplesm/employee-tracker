INSERT INTO department(dept_name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO job(title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Lead Engineer", 150000, 2),
("Software Engineer", 120000, 2),
("Account Manager", 160000, 3),
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000, 4);

INSERT INTO employee(first_name, last_name, job_id, manager_id)
VALUES ("Matt", "Peoples", 3, null),
("Jim", "Jimmy", 4, 1),
("Tom", "Timmy", 1, null),
("Cat", "Williams", 2, 3),
("Sam", "Samual", 5, null),
("Jack", "Johnson", 6, 5),
("Kimmy", "Kim", 7, null),
("Lin", "Say", 8, 7),
("Nina", "Patina", 3, 1),
("James", "Potter", 3, 1),
("Jet", "Mungus", 6, 5);




