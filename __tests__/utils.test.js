const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("../db/seeds/utils");

const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/");
const db = require("../db/connection.js");
const endpointFile = require("../endpoints.json");
const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createRef", () => {
  test("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = createRef(input);
    const expected = {};
    expect(actual).toEqual(expected);
  });
  test("returns a reference object when passed an array with a single items", () => {
    const input = [{ title: "title1", article_id: 1, name: "name1" }];
    let actual = createRef(input, "title", "article_id");
    let expected = { title1: 1 };
    expect(actual).toEqual(expected);
    actual = createRef(input, "name", "title");
    expected = { name1: "title1" };
    expect(actual).toEqual(expected);
  });
  test("returns a reference object when passed an array with many items", () => {
    const input = [
      { title: "title1", article_id: 1 },
      { title: "title2", article_id: 2 },
      { title: "title3", article_id: 3 },
    ];
    const actual = createRef(input, "title", "article_id");
    const expected = { title1: 1, title2: 2, title3: 3 };
    expect(actual).toEqual(expected);
  });
  test("does not mutate the input", () => {
    const input = [{ title: "title1", article_id: 1 }];
    const control = [{ title: "title1", article_id: 1 }];
    createRef(input);
    expect(input).toEqual(control);
  });
});

describe("formatComments", () => {
  test("returns an empty array, if passed an empty array", () => {
    const comments = [];
    expect(formatComments(comments, {})).toEqual([]);
    expect(formatComments(comments, {})).not.toBe(comments);
  });
  test("converts created_by key to author", () => {
    const comments = [{ created_by: "ant" }, { created_by: "bee" }];
    const formattedComments = formatComments(comments, {});
    expect(formattedComments[0].author).toEqual("ant");
    expect(formattedComments[0].created_by).toBe(undefined);
    expect(formattedComments[1].author).toEqual("bee");
    expect(formattedComments[1].created_by).toBe(undefined);
  });
  test("replaces belongs_to value with appropriate id when passed a reference object", () => {
    const comments = [{ belongs_to: "title1" }, { belongs_to: "title2" }];
    const ref = { title1: 1, title2: 2 };
    const formattedComments = formatComments(comments, ref);
    expect(formattedComments[0].article_id).toBe(1);
    expect(formattedComments[1].article_id).toBe(2);
  });
  test("converts created_at timestamp to a date", () => {
    const timestamp = Date.now();
    const comments = [{ created_at: timestamp }];
    const formattedComments = formatComments(comments, {});
    expect(formattedComments[0].created_at).toEqual(new Date(timestamp));
  });
});

describe("GET api/topics", () => {
  test("Should return an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const data = response.body;
        expect(data.length).toBe(3);
        data.forEach((item) => {
          expect(item.hasOwnProperty("description")).toBe(true);
          expect(item.hasOwnProperty("slug")).toBe(true);
        });
      });
  });
  test("Should return a path not found when given an incorrect endpoint", () => {
    return request(app)
      .get("/api/wrongpath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path not found");
      });
  });
});

describe("GET /api", () => {
  test("Should return an object of all of the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const data = response.body;
        expect(data).toEqual(endpointFile);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Should return the correct article information when passed an article id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((response) => {
        const data = response.body.article;
        expect(data.article_id).toBe(4);
        expect(data.hasOwnProperty("article_id")).toBe(true);
        expect(data.hasOwnProperty("title")).toBe(true);
        expect(data.hasOwnProperty("topic")).toBe(true);
        expect(data.hasOwnProperty("author")).toBe(true);
        expect(data.hasOwnProperty("body")).toBe(true);
        expect(data.hasOwnProperty("created_at")).toBe(true);
        expect(data.hasOwnProperty("votes")).toBe(true);
        expect(data.hasOwnProperty("article_img_url")).toBe(true);
        expect(data.hasOwnProperty("comment_count")).toBe(true);
      });
  });

  test("Should respond with a 404 not found error when given an id that does not exist ", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        const message = response.body.msg;
        expect(message).toBe("article not found");
      });
  });

  test("Should return a 400 bad request if given an invalid id type ", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then((response) => {
        const message = response.body.msg;
        expect(message).toBe("bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("Should return an array with all of the articles including comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const data = response.body.allArticles;
        expect(data.length).toBe(13);
        data.forEach((article) => {
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("topic")).toBe(true);
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("body")).toBe(false);
          expect(article.hasOwnProperty("votes")).toBe(true);
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(article.hasOwnProperty("comment_count")).toBe(true);
        });
      });
  });
  test("Should return the articles array sorted by default into descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const data = response.body.allArticles;
        expect(data).toBeSorted({ descending: true });
      });
  });
});

describe("Get /api/articles/:article_id/comments", () => {
  test("Should return the comments from a specific article id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const data = response.body.comments;
        expect(data.length).toBe(2);
        data.forEach((comment) => {
          expect(comment.article_id).toBe(3);
        });
      });
  });

  test("Should return the comments from a specific article id in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const data = response.body.comments;
        expect(data).toBeSorted({ descending: true });
      });
  });

  test("Should return an empty array when given a valid article id but there are no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then((response) => {
        const data = response.body.comments;
        expect(data.length).toBe(0);
      });
  });

  test("Should return a 404 not found if passed an id that does not exist", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("article not found");
      });
  });

  test("Should return a 400 bad request if passed an invalid id", () => {
    return request(app)
      .get("/api/articles/Twyla/comments")
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Should insert the new comment into the database and return the updated information", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "butter_bridge",
        body: "Have you ever seen a Lavender corn snake?",
      })
      .expect(201)
      .then((response) => {
        const data = response.body.returnedComment[0];
        expect(data.author).toEqual("butter_bridge");
        expect(data.article_id).toEqual(2);
        expect(data.body).toEqual("Have you ever seen a Lavender corn snake?");
      });
  });

  test("Should return a 404 not found if given an article_id that does not exist", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({
        username: "butter_bridge",
        body: "Have you ever seen a Lavender corn snake?",
      })
      .expect(404)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("not found");
      });
  });

  test("Should return a 400 error when not given all of the not null i.e required entry fields", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        body: "Have you ever seen a Lavender corn snake?",
      })
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });

  test("Should return a 400 error when given a username that does not exist", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "Yuki",
        body: "Have you ever seen a Lavender corn snake?",
      })
      .expect(404)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Should update a specific article and return the articles update data", () => {
    return request(app)
      .patch("/api/articles/6")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        const data = response.body.updatedArticle[0];
        expect(data.article_id).toBe(6);
        expect(data.votes).toBe(5);
        expect(data.hasOwnProperty("title")).toBe(true);
        expect(data.hasOwnProperty("topic")).toBe(true);
        expect(data.hasOwnProperty("author")).toBe(true);
        expect(data.hasOwnProperty("body")).toBe(true);
        expect(data.hasOwnProperty("created_at")).toBe(true);
        expect(data.hasOwnProperty("votes")).toBe(true);
        expect(data.hasOwnProperty("article_img_url")).toBe(true);
      });
  });

  test("Should return a 404 article not found when given an id that does not exist", () => {
    return request(app)
      .patch("/api/articles/99")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("article not found");
      });
  });

  test("Should return a 400 bad request when given an invalid id type", () => {
    return request(app)
      .patch("/api/articles/Kimiko")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });

  test("Should return a 400 bad request when passed an incorrect data type", () => {
    return request(app)
      .patch("/api/articles/6")
      .send({ inc_votes: "Twyla" })
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });

  test("Should return a 400 bad request when nothing is passed in", () => {
    return request(app)
      .patch("/api/articles/6")
      .send()
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });

  test("Should return a 400 bad request when given no key", () => {
    return request(app)
      .patch("/api/articles/6")
      .send("5")
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Should delete the comment that corresponds with the comment id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("Should respond with a 400 bad request when given an invalid comment id", () => {
    return request(app)
      .delete("/api/comments/Kiyomi")
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });

  test("Should respond with a 404 not found when given a comment id that does not exist", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("comment not found");
      });
  });
});

describe("GET /api/users", () => {
  test("Should return all of the user data", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const data = response.body.allUsers;
        expect(data.length).toBe(4);
        data.forEach((user) => {
          expect(user.hasOwnProperty("username")).toBe(true);
          expect(user.hasOwnProperty("name")).toBe(true);
          expect(user.hasOwnProperty("avatar_url")).toBe(true);
        });
      });
  });
});

describe("GET /api/articles?topic=topicname", () => {
  test("Should return all articles whose topic is mitch", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const data = response.body.allArticles;
        expect(data.length).toBe(12);
        data.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("Should return a 404 not found when given a topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then((response) => {
        const data = response.body;
        expect(data.msg).toBe("topic not found");
      });
  });

  test("Should return a 200 and empty array when given a topic that exists but does not have any data associated with it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        const data = response.body.allArticles;
        expect(data.length).toBe(0);
      });
  });
});

describe("GET /api/article?sort_by=??order=??", () => {
  test("Should take a sort by title and sort and return it in asc order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&&order=ASC")
      .expect(200)
      .then((response) => {
        const data = response.body.allArticles;
        expect(data.length).toBe(13);
        expect(data).toBeSortedBy("title", { descending: false });
      });
  });

  test("Should take a sort by votes and sort and return it in desc order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&&order=DESC")
      .expect(200)
      .then((response) => {
        const data = response.body.allArticles;
        expect(data.length).toBe(13);
        expect(data).toBeSortedBy("votes", { descending: true });
      });
  });

  test("Should return a 400 bad request when given an invalid sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=Kimiko")
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });

  test("Should return a 400 bad request when given an invalid order by", () => {
    return request(app)
      .get("/api/articles?order=Twyla")
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("Should return all of the data for the requested username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((response) => {
        const data = response.body.userData;
        expect(data.username).toBe("butter_bridge");
        expect(data.hasOwnProperty("name")).toBe(true);
        expect(data.hasOwnProperty("avatar_url")).toBe(true);
      });
  });

  test("Should return a 404 not found when given a user that does not exist", () => {
    return request(app)
      .get("/api/users/Kiyomi")
      .expect(404)
      .then((response) => {
        const data = response.body;
        expect(data.msg).toBe("not found");
      });
  });
});

describe("Patch /api/comments/:comment_id", () => {
  test("should update the specified comment to increase the vote count and then return the updated comment", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 10 })
      .expect(200)
      .then((response) => {
        const data = response.body.updatedComment;
        expect(data.comment_id).toBe(2);
        expect(data.votes).toBe(24);
        expect(data.hasOwnProperty("body")).toBe(true);
        expect(data.hasOwnProperty("author")).toBe(true);
        expect(data.hasOwnProperty("article_id")).toBe(true);
        expect(data.hasOwnProperty("created_at")).toBe(true);
      });
  });

  test("Should return a 404 article not found when given an id that does not exist", () => {
    return request(app)
      .patch("/api/comments/99")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("comment not found");
      });
  });

  test("Should return a 400 bad request when given an invalid id type", () => {
    return request(app)
      .patch("/api/comments/Kimiko")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });

  test("Should return a 400 bad request when passed an incorrect data type", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: "Mini" })
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });

  test("Should return a 400 bad request when nothing is passed in", () => {
    return request(app)
      .patch("/api/comments/2")
      .send()
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });

  test("Should return a 400 bad request when given no key", () => {
    return request(app)
      .patch("/api/comments/2")
      .send("10")
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("Should add a new article to the database and return the new article data", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "My 2 cats",
        topic: "cats",
        author: "icellusedkars",
        body: "I have 2 cats, a girl called Twyla and a boy called Midnight. We never refer to him as Midnight we all just call him Mini because he was so tiny when we got him, not so much now, he's a chonky boy! Both cats are moggies, Twyla is black and white and Mini is black with a tiny white patch on his chest. They are in double digits but both are still very active. Twyla's favourite toy is a tennis ball she stole from a neighbour. Mini's not really a fan of toys he prefers playing with the dogs especially his best friend Kimiko, they play fight and chase each other around the house a lot, he particularly enjoys hiding behind doors and jumping on Kimiko when she comes in.",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(201)
      .then((response) => {
        const data = response.body.returnedArticle;
        expect(data.title).toEqual("My 2 cats");
        expect(data.topic).toEqual("cats");
        expect(data.author).toEqual("icellusedkars");
        expect(data.article_img_url).toEqual(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(data.hasOwnProperty("body")).toBe(true);
        expect(data.hasOwnProperty("article_id")).toBe(true);
        expect(data.hasOwnProperty("votes")).toBe(true);
        expect(data.hasOwnProperty("created_at")).toBe(true);
      });
  });

  test("Should return a 404 not found if given an author(username) that does not exist", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "My 2 cats",
        topic: "cats",
        author: "Kiyomi",
        body: "I have 2 cats, a girl called Twyla and a boy called Midnight. We never refer to him as Midnight we all just call him Mini because he was so tiny when we got him, not so much now, he's a chonky boy! Both cats are moggies, Twyla is black and white and Mini is black with a tiny white patch on his chest. They are in double digits but both are still very active. Twyla's favourite toy is a tennis ball she stole from a neighbour. Mini's not really a fan of toys he prefers playing with the dogs especially his best friend Kimiko, they play fight and chase each other around the house a lot, he particularly enjoys hiding behind doors and jumping on Kimiko when she comes in.",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(404)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("not found");
      });
  });

  test("Should return a 400 bad request when required fields are empty", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "My 2 cats",
        author: "icellusedkars",
        body: "I have 2 cats, a girl called Twyla and a boy called Midnight. We never refer to him as Midnight we all just call him Mini because he was so tiny when we got him, not so much now, he's a chonky boy! Both cats are moggies, Twyla is black and white and Mini is black with a tiny white patch on his chest. They are in double digits but both are still very active. Twyla's favourite toy is a tennis ball she stole from a neighbour. Mini's not really a fan of toys he prefers playing with the dogs especially his best friend Kimiko, they play fight and chase each other around the house a lot, he particularly enjoys hiding behind doors and jumping on Kimiko when she comes in.",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(400)
      .then((response) => {
        const data = response.body.msg;
        expect(data).toBe("bad request");
      });
  });
});

describe("GET /api/articles?limit=5&&p=2", () => {
  test("Should retrieve all articles starting at page 2 and limiting the articles to 5", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then((response) => {
        const data = response.body.allArticles;
        expect(data.length).toBe(5);
      });
  });
});
