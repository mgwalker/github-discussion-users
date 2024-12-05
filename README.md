# GitHub discussion users

This little script scrapes a GitHub discussion board to get a list of all the users who have participated and some metadata about their participation. This was necessary because I needed to get that information for a discussion board inside an organization where I could not create a PAT with the necessary permissions to work with the GraphQL API and there's not a REST API for discussion. (Thanks, GitHub. Solid.)

Anyway, usage is simple:

```sh
node main https://github.com/[org]/[repo]/discussions
```

It'll first go through all the pages of discussions making a list of discussion URLs. Then it'll walk through each discussion to scrape out the usernames involved. The final output is two files in the `./data` directory:

- `./data/discussions.json`  
  This is a list of URLs to individual discussion threads. That's all.
- `./data/users.json`  
  This is a map of all users that have participated in discussions, sorted by the total number of comments they've contributed. The keys

  ```json
  {
    "username": GitHub username,
    "url": link to their profile,
    "commentCount": total number of comments,
    "comments": [
      // list of comments, sorted by date, looks like this:
      {
        "link": url to the specific comment,
        "timestamp": ISO-8601 timestamp of the comment
      }
    ]
  }
  ```
