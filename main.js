import fs from "node:fs/promises";
import { loadDiscussions } from "./lib/loadDiscussions.js";
import { getAllUsers } from "./lib/users.js";

const usage = () => {
  console.log(`
  Usage: node main.js <URL>
    
    • URL is for a GitHub discussion board
    `);
  process.exit(0);
};

const main = async (url) => {
  if (!url) {
    usage();
  }
  if (!URL.canParse(url)) {
    console.log(`
  Invalid URL: ${url}`);
    usage();
  }

  await fs.mkdir("./data", { recursive: true });
  // await loadDiscussions(url);
  await getAllUsers();

  const users = JSON.parse(await fs.readFile("./data/users.json"))
    .sort(({ commentCount: a }, { commentCount: b }) => b - a)
    .map((user) => {
      user.comments.sort(({ timestamp: tsA }, { timestamp: tsB }) => {
        const a = Date.parse(tsA);
        const b = Date.parse(tsB);
        return b - a;
      });
      return user;
    });

  await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
};

main(...process.argv.slice(2));
