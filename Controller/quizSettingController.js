const passModal = require("../Modal/passModal");
const quizInstructionModal = require("../Modal/quizInstructionModal");
const quizSettings = require("../Modal/quizSettings");

// Helper function for success responses
function sendSuccessResponse(resp, data) {
  resp.json({ status: true, ...data });
}

// Helper function for error responses
function sendErrorResponse(resp, message, error) {
  resp.status(500).json({ status: false, message, error }); // Added status code for errors
}

// Helper function to handle update operations
async function handleUpdate(resp, model, filter, update) {
  try {
    const result = await model.updateOne(filter, { $set: update });
    if (result.matchedCount) {
      sendSuccessResponse(resp, { message: "Settings saved" });
    } else {
      sendErrorResponse(resp, "No matching document found");
    }
  } catch (error) {
    sendErrorResponse(resp, "Error updating settings", error);
  }
}
async function doFetchQuizSetting(req, resp) {
    try {
        const result = await quizSettings.findOne({ key: "merababa" });
        if (!result) {
            sendErrorResponse(resp, "server error", {}); // change error message to error object
        } else {
            sendSuccessResponse(resp, { result: result });
        }
    } catch (error) {
        sendErrorResponse(resp, "server error", error);
    }
}


async function doUpdateQuizSetting(req, resp) {
  const update = {
    formUrl: req.body.formUrl,
    timerDuration: req.body.timerDuration,
  };
  await handleUpdate(resp, quizSettings, { key: "merababa" }, update);
}

async function doverifyPassword(req, resp) {
  try {
    const result = await passModal.findOne({ key: "merababa3" });
    if (!result) {
      sendErrorResponse(resp, "wrong password");
      return;
    }
    // In a real app, you'd hash the incoming password with bcrypt and compare it with the hashed password in the database.
    // if (await bcrypt.compare(req.body.pass, result.pass)) {
    if (result.pass === req.body.pass) {
      sendSuccessResponse(resp, { message: "login Successfully" });
    } else {
      sendErrorResponse(resp, "Wrong password");
    }
  } catch (error) {
    sendErrorResponse(resp, "Error verifying password", error);
  }
}
async function doFetchQuizInstructions(req, resp) {
    try {
        const result = await quizInstructionModal.findOne({});
        if (!result) {
            sendErrorResponse(resp, "server error", {}); // Change the error message to error object
        } else {
            sendSuccessResponse(resp, { result: result.instructions });
        }
    } catch (error) {
        sendErrorResponse(resp, "server error", error);
    }
}

async function doUpdateQuizInstructions(req, resp) {
  await handleUpdate(
    resp,
    quizInstructionModal,
    { key: "merababa2" },
    { instructions: req.body.instructions }
  );
}

async function doFetchAllAdminSettings(req, resp) {
    try {
        const [settings, instructions] = await Promise.all([
            quizSettings.findOne({ key: "merababa" }),
            quizInstructionModal.findOne({})
        ]);
        sendSuccessResponse(resp, { settings, instructions });
    } catch (error) {
        sendErrorResponse(resp, "server error", error);
    }
}

module.exports = {
  doFetchQuizSetting,
  doUpdateQuizSetting,
  doverifyPassword,
  doFetchQuizInstructions,
  doUpdateQuizInstructions,
  doFetchAllAdminSettings,
};
