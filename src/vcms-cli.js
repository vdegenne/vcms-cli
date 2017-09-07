#!/usr/bin/env node
const commandLineArgs = require('command-line-args');
const commandLineCommands = require('command-line-commands');
const {mkstructure} = require('./structure');
const fs = require('fs');


const globalParams = [
  {name: 'path', alias: 'p', type: String}
];

const commands = new Map();
commands.set('mkpage', [
  { name: 'type', alias: 't', type: String },
  { name: 'title', type: String },
  { name: 'description', alias: 'd', type: String },
  { name: 'keywords', alias: 'k', type: String },
  { name: 'method', alias: 'm', type: String }
]);




let parsedArgs;
try {
  parsedArgs = commandLineCommands([...commands.keys()]);
}
catch (error) {
  if (error.name === 'INVALID_COMMAND') {
    if (error.command) {
      console.warn(`'${error.command}' is not valid.`);
    }
    return;
  }
  throw error;
}

const commandName = parsedArgs.command;
const commandArgs = parsedArgs.argv;
const commandParams = commands.get(commandName);

const params = commandParams;
for (const p of globalParams) {
  params.push(p);
}
const args = commandLineArgs(params, commandArgs);


const resource = {}
resource.type = args.type;

switch (commandName) {
  case 'mkpage':
  mkstructure(args.path).then((dirpath) => {

    switch (args.type) {
      case 'rest':
        let method = args.method || 'get';
        fs.writeFile(`./${dirpath}/${method}.php`, '<?php\n', _ => {});
        fs.writeFile(`./${dirpath}/${method}.json`, JSON.stringify({}), _ => {});
        break;
      case 'web':
        resource.metadatas = {};
        resource.metadatas.title = args.title || '';
        resource.metadatas.description = args.description || '';
        resource.metadatas.keywords = args.keywords || '';

        fs.writeFile(`./${dirpath}/body.php`, '', _ => {});
        fs.writeFile(`./${dirpath}/head.php`, '', _ => {});
        break;
    }

    try {
      fs.statSync(`./${dirpath}/resource.json`);
    }
    catch (err) {
      fs.writeFile(
        `./${dirpath}/resource.json`,
        JSON.stringify(resource, null, 2),
        err => {
          if (err) {
            console.error('couldn\'t create the "resource.json" file.');
            process.exit(1);
          }
          console.log('"resource.json" created');
        }
      );
    }

  });
  break;
}
