// fs and inquirer are included (the project needs them)
let inquirer = require('inquirer');
let generateMarkdown = require('./utils/generateMD');
let fs = require('fs');
let fileName = "newREADME.md";
// global vars
let screenShots = [];
let allCollaborators = [];
let allAssets = [];
let tutorialsArr = [];
let allFeatures = [];
let allData = {
    firstQuestions: {},
    screenshots: [],
    collaborators: [],
    assets: [],
    tutorials: [],
    projectFeatures: [],
    finalQuestions: {}
};
// first set of questions
const questions = [
	{
		type: 'input',
		name: 'title',
		message: 'What is your project called? ',
		validate: validator
	},
	{
		type: 'input',
		name: 'description1',
		message: 'What motivated you to make this project?',
		validate: validator
	},
    {
		type: 'input',
		name: 'description2',
		message: 'Why did you build this project?',
		validate: validator
	},
    {
		type: 'input',
		name: 'description3',
		message: 'What problem does this project fix?',
		validate: validator
	},
    {
		type: 'input',
		name: 'description4',
		message: 'What did this project teach you?',
		validate: validator
	},
	{
		type: 'input',
		name: 'installation',
		message: 'How do you install your project?',
		validate: validator
	},
	{
		type: 'input',
		name: 'usage',
		message: 'How do you use your project?',
		validate: validator
    },
    {
		type: 'input',
		name: 'email',
		message: 'Provide an email address so people can contact you',
		validate: validator
    },
    {
		type: 'input',
		name: 'github',
		message: 'Put your GitHub username so you can get credit for your work',
		validate: validator
    }
];
// function that validates the answers
function validator(response) {
    // checks if response exists and is a number
	let validation = response && isNaN(response) ? true : 'Hey you gotta answer!  Give it another go will ya.'
	return validation;
};
// function to validate boolean responses
function validatorBoolean(response) {
    // make sure the lowercase response is a "y" or an "n" 
    let validation = response && isNaN(response) && (response.toLowerCase() === 'y' || response.toLowerCase() === 'n') ? true : "This response is required and you need to answer with a 'y' or an 'n'. Try again!"
    return validation;
}
// a function to see if they want a screenshot
function screenshotYN() {
    // see if user wants to add a screenshot
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'wantScreenshot',
                message: 'WOuld you like to add a screenshot? (this is recommended) ',
                validate: validatorBoolean
            }
        ])
        .then((second) => {
            // if a screenshot is desired, we use inquiry to put it in
            if (second.wantScreenshot) screenshotInquiry();
            // if not we move on!
            else collaboratorYN();
        });
};
// this function gets the screenshot info
function screenshotInquiry() {
    // prompt user with questions about the screenshot they are adding
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'ssReference',
                message: 'Put in ref text for the picture ',
                validate: validator
            },
            {
                type: 'input',
                name: 'ssPath',
                message: 'Put your local path to the image ',
                validate: validator
            },
            {
                type: 'confirm',
                name: 'screenshotMore',
                message: 'Do you want to add another? ',
                validate: validatorBoolean
            }
        ])
        .then((answers) => {
            // Puts screenshots into an array
            screenShots.push([answers.ssReference, answers.ssPath]);
            // keep re-running this until the user says no
            if (answers.screenshotMore) screenshotInquiry();
            else {
                // once done, we move on
                allData.screenshots = screenShots;
                collaboratorYN();
            }
        });
};
// function to see about collaboration
function collaboratorYN() {
    // see if user wants to add a collaborator
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'collaboratorWant',
                message: 'Do you have any other collaborators? ',
                validate: validatorBoolean
            },
        ])
        .then((third) => {
            // if yes, call the inquirer again
            if (third.collaboratorWant) collaboratorInquiry();
            // if no, we move on
            else assetsYN();
        });
};
// Cprompts collaborator info
function collaboratorInquiry() {
    // prompt user with questions about the collaborator they are adding
    inquirer
        .prompt([
            {
                type: 'text',
                name: 'cName',
                message: 'What is your collaborator's name? ',
                validate: validator
            },
            {
                type: 'input',
                name: 'cLink',
                message: "What's a link to their github or other relevant website? ",
                validate: validator
            },
            {
                type: 'confirm',
                name: 'collaboratorMore',
                message: 'Any more collaborators? ',
                validate: validatorBoolean
            }
        ])
        .then((info) => {
            // same as screenshots, pushes into an array
            allCollaborators.push([info.cName, info.cLink]);
            // if yes, repeat
            if (info.collaboratorMore) collaboratorInquiry();
            // if no move on
            else {
                allData.collaborators = allCollaborators;
                assetsYN();
            }
        });
};
// sees if user wants to add an asset
function assetsYN() {
    // see if user wants to add an asset
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'assetWant',
                message: 'Did you use any third-party assets to make this? ',
                validate: validatorBoolean
            }
        ])
        .then((fourth) => {
            // if yes, inquirer function
            if (fourth.assetWant) assetInquiry();
            // if no move on
            else tutorialYN();
        });
};
// asset info function
function assetInquiry() {
    // prompt user with questions about the asset they are adding
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'assetName',
                message: 'What asset did you use? ',
                validate: validator
            },
            {
                type: 'input',
                name: 'assetAuthor',
                message: 'Who made this asset? ',
                validate: validator
            },
            {
                type: 'input',
                name: 'assetLink',
                message: "Put a link to their profile (GitHub, etc.): ",
                validate: validator
            },
            {
                type: 'confirm',
                name: 'assetMore',
                message: 'Did you use any more assets? ',
                validate: validatorBoolean
            }
        ])
        // assets array
        .then((description) => {
            allAssets.push([description.assetName, description.assetAuthor, description.assetLink]);
            // if yes, repeat
            if (description.assetMore) assetInquiry();
            // if no, move ona nd add data to big data array
            else {
                allData.assets = allAssets;
                tutorialYN();
            }
        });
};
// tutorial function
function tutorialYN() {
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'tutorialWant',
                message: 'Did you use a tutorial? ',
                validate: validatorBoolean
            }
        ])
        .then((fifth) => {
            // if yes, call function
            if (fifth.tutorialWant) tutorialInquiry();
            // if no move on
            else finalQuestions();
        });
};
// tutorial info function
function tutorialInquiry() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'tutReference',
                message: 'Put your tutorial reference here: ',
                validate: validator
            },
            {
                type: 'input',
                name: 'tutPath',
                message: 'Put the url here:',
                validate: validator
            },
            {
                type: 'confirm',
                name: 'tutMore',
                message: 'Do you want to add more tutorials? ',
                validate: validatorBoolean
            }
        ])
        // push tutorial into array
        .then((reference) => {
            tutorialsArr.push({ref: reference.tutReference, path: reference.tutPath});
            // if yes, repeat
            if (reference.tutMore) tutorialInquiry();
            // if no push to big array and move on
            else {
                allData.tutorials = tutorialsArr;
                featureInquiry();
            }
        });
};
// features function 
function featureInquiry() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'features',
                message: 'What is a feature of this project?  You can add more so please do them one by one ',
                validate: validator
            },
            {
                type: "confirm",
                name: "moreFeatures",
                message: "Want to add another feature? ",
                validate: validatorBoolean
            }
        ]).then((feature) => {
            allFeatures.push({feat: feature.features})
            if (feature.moreFeatures) featureInquiry();
            else {
                allData.projectFeatures = allFeatures;
                finalQuestions();
            } 
        })
}
// last questions
function finalQuestions() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'license',
                message: 'What license do you want to use? ',
                choices: [
                    "Apache 2.0",
                    "Boost Software License 1.0",
                    "BSD 3-Clause",
                    "BSD 2-Clause",
                    "CC0-1.0",
                    "CC BY 4.0",
                    "CC BY-SA 4.0",
                    "CC BY-NC 4.0",
                    "CC BY-ND 4.0",
                    "CC BY-NC-SA 4.0",
                    "CC BY-NC-ND 4.0",
                    "Eclipse Public License 1.0",
                    "GNU GPL v3",
                    "GNU GPL v2",
                    "GNU AGPL v3",
                    "GNU LGPL v3",
                    "GNU FDL v1.3",
                    "IPL 1.0",
                    "ICL",
                    "MIT",
                    "MPL 2.0",
                    "Open Data Commons Attribution",
                    "ODbL",
                    "PDDL",
                    "Artistic-2.0",
                    "Open Font-1.1",
                    "Unlicense",
                    "WTFPL",
                    "Zlib"
                ],
                default: "MIT"
            },
            {
                type: 'input',
                name: 'howOthersContribute',
                message: 'How can other people contribute? ',
                validate: validator
            },
            {
                type: 'input',
                name: 'tests',
                message: 'Provide a test for your project: ',
                validate: validator
            }
        ])
        // push this response into big array
        .then((sixth) => {
            allData.finalQuestions = sixth;
            // generate markdown with all the data from previous functions like this
            writeToFile(fileName, generateMarkdown(allData));
        })
}
// initialize app
function init() {
    // calls first set
	inquirer
        .prompt(questions)
        // pushes to big array then calls screenshot question
        .then((first) => {
            allData.firstQuestions = first;
            screenshotYN();
		})
        .catch((error) => {
			if (error.isTtyError) console.log("Prompts cannot be rendered in the current environment");
			else console.log("Well, something went wrong. Try again?");
		});
}
// Function to write into a readme file
function writeToFile(fileName, data) {
    // fs makes the file and writes to it
    fs.writeFile(fileName, `${data}`, (err) => {
        err ? console.log(err) : console.log("Nice")
    })
}
// this calls the init function
init();
