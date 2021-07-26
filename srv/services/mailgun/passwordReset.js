const axios = require("axios");
const config = require("config");
const qs = require("querystring");

const mgURL = config.get("mgURL");
const mgAPI = config.get("mgAPI");
const houseURL = config.get("houseURL");
const orgName = config.get("orgName");

const passwordReset = async (email, token) => {
  const postData = qs.stringify({
    from: "Ryan Tannenbaum <ryan@mail.for.education>",
    to: "ryan@for.education",
    subject: "House System Password reset",
    template: `house_reset_template`,
    "v:passwordResetURL": `${houseURL}/resetPassword/${token}`,
    "v:orgName": orgName,
  });

  console.log(postData);

  try {
    await axios.post(`https://api:${mgAPI}@${mgURL}/messages`, postData);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = passwordReset;
