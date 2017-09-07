const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const pages_dirname = 'pages';

function mkstructure (pagepath) {
  return new Promise((resolve, reject) => {
    
    let dir = '';
    
    if (path.basename(process.cwd()) !== pages_dirname) {
      dir += pages_dirname + '/';
    }

    dir += pagepath;

    mkdirp(dir, err => {
      if (err) reject();
      else resolve(dir);
    })
  });
}

exports.mkstructure = mkstructure;