// This file is part of the House System - https://houses.for.education/
//
// The House System is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The House System is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with The House System. If not, see <http://www.gnu.org/licenses/>.

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const bcrypt = require("bcryptjs");

const passGen = async (Users) => {
  const csvWriter = createCsvWriter({
    path: "/srv/tmp/pass.csv",
    header: [
      { id: "firstName", title: "First Name" },
      { id: "lastName", title: "Last Name" },
      { id: "password", title: "Password" },
    ],
  });
  let data = [];

  const passGen = () => {
    const adj = [
      "happy",
      "sad",
      "angry",
      "tired",
      "sleepy",
      "excited",
      "wild",
      "calm",
      "abrupt",
      "acidic",
      "adorable",
      "adventurous",
      "aggressive",
      "agitated",
      "alert",
      "aloof",
      "bored",
      "brave",
      "bright",
      "colossal",
      "condescending",
      "confused",
      "cooperative",
      "corny",
      "costly",
      "courageous",
      "cruel",
      "despicable",
      "determined",
      "dilapidated",
      "diminutive",
      "distressed",
      "disturbed",
      "dizzy",
      "exasperated",
      "excited",
      "exhilarated",
      "extensive",
      "exuberant",
      "frothy",
      "frustrating",
      "funny",
      "fuzzy",
      "gaudy",
      "graceful",
      "greasy",
      "grieving",
      "gritty",
      "grotesque",
      "grubby",
      "grumpy",
      "handsome",
      "hollow",
      "hungry",
      "hurt",
      "helpful",
      "helpless",
      "icy",
      "ideal",
      "large",
      "lazy",
      "livid",
      "lonely",
      "mysterious",
      "narrow",
      "outrageous",
      "panicky",
      "perfect",
      "teeny",
      "tense",
      "terrible",
      "tricky",
      "troubled",
      "upset",
      "wicked",
      "zealous",
    ];
    const ani = [
      "meerkat",
      "lion",
      "squirrel",
      "leopard",
      "dog",
      "firefox",
      "racoon",
      "tiger",
      "monkey",
      "wolf",
      "eagle",
      "macaw",
      "heron",
      "owl",
      "butterfly",
      "bear",
      "moorhen",
      "kookaburra",
      "hamster",
      "tortoise",
      "turtle",
      "hedgehog",
      "alligator",
      "crocodile",
      "stork",
      "egret",
      "walrus",
      "ibis",
      "finch",
      "panther",
      "rabbit",
      "penguin",
      "chicken",
      "cow",
      "horse",
      "pig",
      "dinosaur",
      "peacock",
      "racoon",
      "hornet",
      "falcon",
      "cat",
      "gorilla",
      "chimpanzee",
      "axolotl",
      "kiwi",
      "boa",
      "viper",
      "bee",
      "camel",
      "cheetah",
      "crocodile",
      "deer",
      "rat",
      "mouse",
      "scorpion",
      "seal",
      "shark",
      "sheep",
      "snail",
      "snake",
      "spider",
      "tiger",
      "zebra",
      "dolphin",
      "duck",
      "elephant",
      "fish",
      "fly",
      "fox",
      "frog",
      "giraffe",
      "goat",
      "goldfish",
      "hippopotamus",
      "kangaroo",
      "lobster",
      "octopus",
      "panda",
      "puppy",
      "rabbit",
      "kitten",
    ];
    const pass =
      adj[Math.floor(Math.random() * adj.length)] +
      ani[Math.floor(Math.random() * adj.length)] +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10);
    return pass;
  };

  const userArray = await Users.find({});
  let pass;
  try {
    for (let x = 0; x < userArray.length; x++) {
      pass = passGen();
      data[x] = {
        firstName: userArray[x].firstName,
        lastName: userArray[x].lastName,
        email: userArray[x].email,
        password: pass,
      };

      console.log(`${data[x].email},${data[x].firstName},${data[x].lastName},${pass}`);

      let salt = await bcrypt.genSalt(10);
      let enPass = await bcrypt.hash(pass, salt);

      await Users.findByIdAndUpdate(userArray[x]._id, {
        password: enPass,
      });
    }

    await csvWriter.writeRecords(data);
    return data;
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = passGen;
