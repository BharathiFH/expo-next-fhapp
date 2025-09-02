import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "solito/router";

export default function PostsScreen({ posts: serverPosts }) {
  const [posts, setPosts] = useState(serverPosts || []);
  const { push } = useRouter();

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5"
      );
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SSR Example 2</Text>
      {posts.length === 0 ? (
        <Text>NO POSTS</Text>
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.post}>
            <Text style={styles.postText}>{post.title}</Text>
          </View>
        ))
      )}
      <TouchableOpacity
        onPress={() => {
          push("/time");
        }}
        style={{ backgroundColor: "#cbf5dd", padding: 10, marginTop: 20 }}
      >
        <Text style={{ color: "#000000", fontSize: 18, fontWeight: "bold" }}>
          Go to Screen 1
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5"
  );
  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  post: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // for Android shadow
  },
  postText: {
    fontSize: 16,
    color: "#333",
  },
});
