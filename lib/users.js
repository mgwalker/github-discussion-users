import fs from "node:fs/promises";
import { JSDOM } from "jsdom";

const users = {};

const getUsers = async (discussion) => {
  const html = await fetch(discussion).then((r) => r.text());
  const dom = new JSDOM(html);

  const comments = Array.from(
    dom.window.document.querySelectorAll(
      ".discussion .timeline-comment-header-text",
    ),
  );

  comments.forEach((comment) => {
    const username = comment
      .querySelector(`[data-hovercard-type="user"]`)
      .getAttribute("href")
      // remove the leading slash
      .slice(1);

    const relativeLink = comment
      .querySelector("relative-time")
      .parentElement.getAttribute("href");
    const link = `${discussion}${relativeLink}`;

    const timestamp = comment
      .querySelector("relative-time")
      .getAttribute("datetime");

    if (users[username]) {
      users[username].commentCount += 1;
      users[username].comments.push({ link, timestamp });
    } else {
      users[username] = {
        username,
        url: `https://github.com/${username}`,
        commentCount: 1,
        comments: [{ link, timestamp }],
      };
    }
  });
};

export const getAllUsers = async () => {
  const discussions = JSON.parse(await fs.readFile("./data/discussions.json"));

  for (let i = 0; i < discussions.length; i += 1) {
    console.log(
      `getting users for discussion ${i + 1} of ${discussions.length}`,
    );
    await getUsers(discussions[i]);
  }

  await fs.writeFile(
    "./data/users.json",
    JSON.stringify(Object.values(users), null, 2),
  );
};
