#!/usr/bin/env node

const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const path = require("path");

const { lstat } = fs.promises;

const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, fileNames) => {
  // Check if we are getting any error!
  if (err) {
    console.log(err);
  }

  const statPromises = fileNames.map((fileName) => {
    return lstat(path.join(targetDir, fileName));
  });

  const allStats = await Promise.all(statPromises);

  for (let stats of allStats) {
    const index = allStats.indexOf(stats);

    if (stats.isFile()) {
      console.log(fileNames[index]);
    } else {
      console.log(chalk.bold.blueBright.italic(fileNames[index]));
    }
  }
});
