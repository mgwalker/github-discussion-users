import fs from "node:fs/promises";
import { JSDOM } from "jsdom";

const getDiscussions = async ({ boardUrl, page = 1 } = {}) => {
  console.log(`getting discussions from page ${page}`);
  const html = await fetch(`${boardUrl}?page=${page}`).then((r) => r.text());

  const dom = new JSDOM(html);

  const links = Array.from(
    dom.window.document.querySelectorAll(".discussion-Link--secondary"),
  ).map((node) => `https://github.com${node.getAttribute("href")}`);

  const finished = dom.window.document
    .querySelector(".pagination .next_page")
    .classList.contains("disabled");

  if (!finished) {
    links.push(...(await getDiscussions({ boardUrl, page: (page += 1) })));
  }

  return links;
};

export const loadDiscussions = async (boardUrl) => {
  const discussions = await getDiscussions({ boardUrl });
  fs.writeFile("./data/discussions.json", JSON.stringify(discussions, null, 2));
};
