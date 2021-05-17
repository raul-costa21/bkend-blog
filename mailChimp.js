require("dotenv").config();
// Mailchimp Marketing install
const mailchimp = require("@mailchimp/mailchimp_marketing");

// MailCHimp config
mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us1",
});

// Functions
module.exports.sub = subscribe;
async function subscribe(req) {
  try {
    const mailSubs = await mailchimp.lists.addListMember(process.env.AUDIENCE_NUM, {
      email_address: req.body.email,
      status: "subscribed",
      merge_fields: {
        FNAME: req.body.fName,
        LNAME: req.body.lName,
      },
    });
    return "Success";
  } catch (err) {
    console.log("Ups Error:\n", err);
    return err;
  }
}
