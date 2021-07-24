const bcrypt = require("bcryptjs");
const prompt = require("prompt-sync")();
const Teacher = require("../models/Teacher");
const addTeacher = require("./addTeacher");
const getStudents = require("../mbAPI/getStudents");
const getTeachers = require("../mbAPI/getTeachers");
const assignHouses = require("./assignHouses");
const getClasses = require("../mbAPI/getClasses");
const passGen = require("./passGen");
const popClass = require("../mbAPI/popClass");

const newInstall = async () => {
  const promptCheck = (query, hidden = false) => {
    let res = "";

    while (res === "") {
      hidden ? (res = prompt.hide(query)) : (res = prompt(query));
    }
    return res;
  };
  const teachers = await Teacher.find();

  if (teachers.length === 0) {
    const first_name = promptCheck("Enter the admin's first name: ");
    const last_name = promptCheck("Enter the admin's last name: ");
    const email = promptCheck("Enter the admin's email: ");
    const pass = promptCheck("Enter the admin's password: ", true);

    await addTeacher({
      first_name: first_name,
      last_name: last_name,
      email: email,
      archived: false,
      photo_url: null,
      role: "Admin",
      id: "1",
    });

    let salt = await bcrypt.genSalt(10);
    let enPass = await bcrypt.hash(pass, salt);

    await Teacher.findOneAndUpdate({ password: enPass });
    await getStudents();
    await getTeachers();
    await getClasses();
    await popClass();
    await passGen();
  }
};

module.exports = newInstall;
