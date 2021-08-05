const axios = require("axios");
const config = require("config");
const qs = require("querystring");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const mgURL = config.get("mgURL");
const mgAPI = config.get("mgAPI");
const mgEmail = config.get("mgEmail");
const houseURL = config.get("houseURL");
const orgName = config.get("orgName");

const passwordReset = async (email, token) => {
  const templatePath = path.join(__dirname, `./email_template.hbs`);
  const templateStr = fs.readFileSync(templatePath).toString("utf8");
  const compiled = handlebars.compile(templateStr);

  const compiledEmail = compiled({
    orgName: orgName,
    passwordResetURL: `${houseURL}/resetPassword/${token}`,
  });

  const postData = qs.stringify({
    from: `${orgName} Houses<${mgEmail}>`,
    to: email,
    subject: "House System Password reset",
    html: compiledEmail,
    "o:tag": "Password Reset",
  });

  try {
    await axios.post(`https://api:${mgAPI}@${mgURL}/messages`, postData);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = passwordReset;
