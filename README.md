# NOTE
The buttons [except login/logout] inside the drawer are not working (I think). 
No filter for viewing the tasks. I think it will show all the tasks or all the tasks related to the user/public


# How to run
1. Copy App.js to Awesome Project folder. (Replace existing App.js or rename existing App.js)
2. In api folder (..\express-boilerplate\app\modules\api), create a new folder and name it users.
3. Copy routes.js to api folder. (Replace existing routes.js or rename existing routes.js)
4. Copy api.js to users folder. (..\express-boilerplate\app\modules\api\users)
5. Copy apiTodos.js to todos folder. (delete existing api.js or rename existing api.js)
6. Rename apiTodos.js to api.js
7. yarn install (..\Awesome Project)
8. npm install  (..\express-boilerplate)
9. Open App.js 
10. Change all the ip address "http://192.168.1.9" to your ip address.
11. Import todo.sql in the database. (Consists of 2 tables todos and users) OR
    Create a new database and name it todo
       > Create a new table and name it todos
       > Create 7 columns (id [int], title [varchar 50], description [varchar 50], dateTime [datetime], assignedTo [varchar 50],
         assignedBy [varchar 50], done [boolean]) * id = primary key, auto increment
       > Create a new table and name it users
       > Create 3 columns (userID [int], username [varchar 50], password [varchar 50]) * userID = primary key, auto increment
12. yarn start (..\Awesome Project)


# MEMBERS
1. Alega, Marijo U.
2. Cabrera, Karla Marice A.
3. Durusan, Michelle Ellaine
4. Francia Jr., Anselmo
5. Salguero, Maria Sofia Grace
