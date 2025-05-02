const passModal = require("../Modal/passModal");
const quizInstructionModal = require("../Modal/quizInstructionModal");
const quizSettings = require("../Modal/quizSettings");

function doFetchQuizSetting(req,resp){
    quizSettings.findOne({key:"merababa"})
    .then((result)=>{ 
        if(!result){
            resp.json({ status : false , error : "server error"});
        }
        else{
            resp.json({status : true , result:result});
        }
    })
    .catch((error)=>{  
        resp.json({error:error,status: false})})
}

function doUpdateQuizSetting(req, resp) {
    // console.log("Received request body:", req.body);

    const update = {
        formUrl: req.body.formUrl,
        timerDuration: req.body.timerDuration,
    };

    // console.log("Updating with data:", update);

    quizSettings.updateOne({ key: "merababa" }, { $set: update })
        .then((result) => {
            // console.log("Acknowledged:", result.acknowledged);
            // console.log("Matched Count:", result.matchedCount);
            
            if (result.matchedCount) {
                resp.json({ status: true, message: "Settings saved" });
            } else {
                resp.json({ status: false, error: "No matching document found" });
            }
        })
        .catch((error) => {
            // console.error("Update Error:", error);
            resp.json({ status: false, error: error });
        });
}
 function doverifyPassword(req,resp){
    // console.log(req.body)
    passModal.findOne({key:"merababa3"})
    .then((result)=>{
        // console.log(result)
        if(result.pass===req.body.pass){
            resp.json({status: true,message:"login Successfully"})
        }
        else resp.json({status : false, error: "Wrong password" })
    })
    .catch((error)=>{
        resp.json({status:false, error:error});
    })
 }

 function doFetchQuizInstructions(req,resp){
    quizInstructionModal.findOne({})
    .then((result)=>{
        if(!result){
            resp.json({ status : false , error : "server error"});
        }
        else{
            resp.json({status : true , result:result.instructions});
        }
    })
    .catch((error)=> resp.json({error:error,status: false}))
}


function doUpdateQuizInstructions(req, resp) {
    // console.log("Received request body:", req.body);


    quizInstructionModal.updateOne({ key: "merababa2" }, { $set: {instructions:req.body.instructions} })
        .then((result) => {
            // console.log("Acknowledged:", result.acknowledged);
            // console.log("Matched Count:", result.matchedCount);
            
            if (result.matchedCount) {
                resp.json({ status: true, message: "Settings saved" });
            } else {
                resp.json({ status: false, error: "No matching document found" });
            }
        })
        .catch((error) => {
            // console.error("Update Error:", error);
            resp.json({ status: false, error: error });
        });
}  

async function doFetchAllAdminSettings(req,resp){
    try{
    const settings = await quizSettings.findOne({key:"merababa"})
    const instructions = await quizInstructionModal.findOne({})

    resp.json({status:true, settings:settings,instructions:instructions})
}
catch(error){
    resp.json({error:error,status:false})
}
}


 


module.exports = {
    doFetchQuizSetting,
    doUpdateQuizSetting,
    doverifyPassword,
    doFetchQuizInstructions,
    doUpdateQuizInstructions,
    doFetchAllAdminSettings
}