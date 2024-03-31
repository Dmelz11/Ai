// dependencies


const { OpenAI } = require('langchain/llms/openai');
const inquirer = require('inquirer');
require('dotenv').config();

// these two dependencies are not required for the app to run, but are used to format the output
const { StructuredOutputParser } = require("langchain/output_parsers");
const { PromptTemplate } = require("langchain/prompts");
// Creates and stores a wrapper for the OpenAI package along with basic configuration
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY, 
  temperature: 0,
  model: 'gpt-3.5-turbo'
});
// With a `StructuredOutputParser` we can define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
    code: "Javascript code that answers the user's question",
    explanation: "detailed explanation of the example code provided",
});

// get the format intructions from the parser
const formatInstructions = parser.getFormatInstructions();

// Uses the instantiated OpenAI wrapper, model, and makes a call based on input from inquirer
const promptFunc = async (input) => {
    try {
// Instantiation of a new object called "prompt" using the "PromptTemplate" class
      const prompt = new PromptTemplate({
//define the template for the prompt  
          template: "You are a javascript expert and will answer the user’s coding questions thoroughly as possible.\n{format_instructions}\n{question}",
          inputVariables: ["question"],
          partialVariables: { format_instructions: formatInstructions }
        });

//format the prompt with user input
       const promptInput = await prompt.format({
        question: input
       });

//call the model with the formatted prompt
        const res = await model.call(promptInput);
    console.log(await parser.parse(res));
  } catch (err) {
    console.error(err);
  };
}
// Initialization function that uses inquirer to prompt the user and returns a promise. It takes the user input and passes it through the call method
const init = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Ask a coding question:',
      },
    
    ]).then((inquirerResponse) => {
      promptFunc(inquirerResponse.name)
    });
};
 
// Calls the initialization function and starts the script
init();