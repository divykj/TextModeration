import React, { useState, useCallback } from "react";

import {
  Alert,
  Container,
  Card,
  CardBody,
  CardTitle,
  Collapse,
  FormTextarea,
  FormInput,
  Button,
} from "shards-react";

import ActivityIndicator from "./components/ActivityIndicator";
import "./App.css";

const emptyPost = { title: "", body: "" };
const initialPosts = [
  { title: "Welcome, user", body: "Welcome to the clean blog." },
  {
    title: "No toxic content",
    body:
      "This blog site is free completely wholesome and devoid of any toxic content.",
  },
  {
    title: "Backend",
    body: "Toxic Content Detection of this blog is powered by NLP.",
  },
];

function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [post, setPost] = useState(emptyPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setPost((post) => ({ ...post, [name]: value }));
  }, []);

  const handlePost = useCallback(() => {
    if (!post.title) return false;
    setLoading(true);
    fetch("/api/check", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: post.title + " " + post.body }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.toxic)
          setError(
            "The post has been blocked, since it contained inappropriate content."
          );
        else {
          setError(false);
          setPosts((posts) => [...posts, post]);
          setPost(emptyPost);
        }
      })
      .catch((reason) => {
        console.log(reason);
        setError("Some server error occured. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [post]);

  return (
    <Container>
      <h1>Clean Blogging Site</h1>
      <div id="postCard">
        <Collapse open={!!error}>
          <Alert theme="danger">{error}</Alert>
        </Collapse>
        <FormInput
          autoFocus
          autoComplete="off"
          placeholder="Title"
          onChange={handleChange}
          value={post.title}
          name="title"
          disabled={loading}
        />
        <FormTextarea
          autoComplete="off"
          rows={3}
          placeholder="Write something nice to post..."
          onChange={handleChange}
          value={post.body}
          name="body"
          disabled={loading}
        />
        <Button theme="dark" onClick={handlePost} disabled={loading}>
          {loading ? <ActivityIndicator /> : "Post"}
        </Button>
      </div>
      <main>
        <h3>Previous blogs 🕓</h3>
        {posts.map((post, idx) => (
          <Card key={idx}>
            <CardBody>
              <CardTitle>{post.title}</CardTitle>
              <p>{post.body}</p>
            </CardBody>
          </Card>
        ))}
      </main>
    </Container>
  );
}

export default App;
