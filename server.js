const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Blog = require("./models/blog");

const app = express();
const port = process.env.PORT || 8001;
const dbURI =
  "mongodb+srv://dbUser:dbUserPassword@cluster0.wm1ae.mongodb.net/fullstack-blog?retryWrites=true&w=majority";

// Database
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Listener
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// EJS
app.set("view engine", "ejs");

// Static Files & middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/blogs", (req, res) => {
  Blog.find((err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs", { title: "Blogs", blogs: docs });
    }
  });
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then(() => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("details", { blog: docs, title: "Details" });
    }
  });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(() => {
      // redirect
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/create", (req, res) => {
  res.render("create", { title: "Create" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.use((req, res) => {
  res.status(404).render("404");
});
