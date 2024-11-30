import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  TextField,
} from "@mui/material";
import { postServiceClient } from "../../../util/api";
import Swal from "sweetalert2";

type ArticleInfoType = {
  _id?: string;
  title: string;
  description: string;
  tag: string;
};
const articleInfo: ArticleInfoType[] = [
  {
    tag: "Engineering",
    title: "The future of AI in software engineering",
    description:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality.",
  },
  {
    tag: "Product",
    title: "Driving growth with user-centric product design",
    description:
      "Our user-centric product design approach is driving significant growth. Learn about the strategies we employ to create products that resonate with users.",
  },
  {
    tag: "Design",
    title: "Embracing minimalism in modern design",
    description:
      "Minimalism is a key trend in modern design. Discover how our design team incorporates minimalist principles to create clean and impactful user experiences.",
  },
  {
    tag: "Company",
    title: "Cultivating a culture of innovation",
    description:
      "Innovation is at the heart of our company culture. Learn about the initiatives we have in place to foster creativity and drive groundbreaking solutions.",
  },
  {
    tag: "Engineering",
    title: "Advancing cybersecurity with next-gen solutions",
    description:
      "Our next-generation cybersecurity solutions are setting new standards in the industry. Discover how we protect our clients from evolving cyber threats.",
  },
  {
    tag: "Product",
    title: "Enhancing customer experience through innovation",
    description:
      "Our innovative approaches are enhancing customer experience. Learn about the new features and improvements that are delighting our users.",
  },
  {
    tag: "Engineering",
    title: "Pioneering sustainable engineering solutions",
    description:
      "Learn about our commitment to sustainability and the innovative engineering solutions we're implementing to create a greener future. Discover the impact of our eco-friendly initiatives.",
  },
  {
    tag: "Product",
    title: "Maximizing efficiency with our latest product updates",
    description:
      "Our recent product updates are designed to help you maximize efficiency and achieve more. Get a detailed overview of the new features and improvements that can elevate your workflow.",
  },
  {
    tag: "Design",
    title: "Designing for the future: trends and insights",
    description:
      "Stay ahead of the curve with the latest design trends and insights. Our design team shares their expertise on creating intuitive and visually stunning user experiences.",
  },
  {
    tag: "Company",
    title: "Our company's journey: milestones and achievements",
    description:
      "Take a look at our company's journey and the milestones we've achieved along the way. From humble beginnings to industry leader, discover our story of growth and success.",
  },
];

export default function Latest() {
  const isAuthenticated = localStorage.getItem("swarm-user-token");

  const [loadingPost, setLoadingPost] = React.useState<boolean>(true);
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [posts, setPosts] = React.useState<ArticleInfoType[]>(articleInfo);
  const [selectedPost, setSelecetedPost] = React.useState<ArticleInfoType>({
    _id: "",
    tag: "",
    title: "",
    description: "",
  });
  const [postObj, setPostObj] = React.useState({
    tag: "",
    title: "",
    description: "",
  });
  const [postObjErr, setPostObjErr] = React.useState({
    tag: "",
    title: "",
    description: "",
  });

  const handleClick = (value: number) => {
    setTabValue(value);
  };

  const handleClearSelectedPost = () => {
    setSelecetedPost({ title: "", tag: "", description: "" });
    setPostObj({ title: "", tag: "", description: "" });
    setPostObjErr({ title: "", tag: "", description: "" });
    setTabValue(0);
  };

  const handleLoadPosts = React.useCallback(async () => {
    try {
      if (!isAuthenticated) {
        setLoadingPost(false);
        return;
      }
      setLoadingPost(true);
      const response = await postServiceClient.get("/post/all");
      if (response.status === 200) {
        setPosts(response.data.posts || []);
        return;
      }
      Swal.fire("Failed to load posts");
    } catch (error) {
      console.log("[!] ", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load posts",
      });
      setPosts(articleInfo);
    } finally {
      handleClearSelectedPost();
      setLoadingPost(false);
    }
  }, []);

  const handleSubmitPost = React.useCallback(async () => {
    try {
      if (!postObj.title)
        return setPostObjErr((pre) => ({ ...pre, title: "Title is required" }));
      if (!postObj.tag)
        return setPostObjErr((pre) => ({ ...pre, tag: "Tag is required" }));
      if (!postObj.description)
        return setPostObjErr((pre) => ({
          ...pre,
          description: "Description is required",
        }));
      setLoadingPost(true);
      const response = await postServiceClient.post(`/post`, { ...postObj });
      if (response.status === 201) {
        Swal.fire({ icon: "success", title: "Post created successfully" });
        return;
      }
      Swal.fire("Failed to create post");
    } catch (error) {
      console.log("[!] ", error);
      Swal.fire({ icon: "error", title: "Failed to submit post" });
    } finally {
      handleLoadPosts();
      setLoadingPost(false);
      setTabValue(0);
    }
  }, [handleLoadPosts, postObj]);

  const handleEditPost = React.useCallback(
    async (postId: string) => {
      try {
        if (!postObj.title)
          return setPostObjErr((pre) => ({
            ...pre,
            title: "Title is required",
          }));
        if (!postObj.tag)
          return setPostObjErr((pre) => ({ ...pre, tag: "Tag is required" }));
        if (!postObj.description)
          return setPostObjErr((pre) => ({
            ...pre,
            description: "Description is required",
          }));
        await postServiceClient.put(`/post/${postId}`, { ...postObj });
      } catch (error) {
        console.log("[!] ", error);
        Swal.fire({ icon: "error", title: "Failed to update post" });
      } finally {
        handleLoadPosts();
        setLoadingPost(false);
        setTabValue(0);
      }
    },
    [handleLoadPosts, postObj]
  );

  const handleDeletePost = React.useCallback(
    async (postId: string) => {
      try {
        const response = await postServiceClient.delete(`/post/${postId}`);
        if (response.status === 204) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Post Deleted",
          });
          handleLoadPosts();
          return;
        }
        Swal.fire("Failed to delete post");
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        console.log("[!] "), error;
        Swal.fire({
          icon: "error",
          title: "failed delete post",
        });
      } finally {
        handleLoadPosts();
        setLoadingPost(false);
        setTabValue(0);
      }
    },
    [handleLoadPosts]
  );

  const handleSetToEdit = React.useCallback(
    (postId: string) => {
      const editingPost = posts.find((item) => item._id === postId);
      if (editingPost) {
        setSelecetedPost(editingPost);
        setPostObj({ ...editingPost });
        setTabValue(1);
      }
    },
    [posts]
  );

  const handleSubmitBtnClick = () => {
    if (selectedPost._id) {
      handleEditPost(selectedPost._id);
    } else {
      handleSubmitPost();
    }
  };

  React.useEffect(() => {
    handleLoadPosts();
  }, [handleLoadPosts]);

  return (
    <Grid container width="100%">
      <Grid item xs={12}>
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            gap: 3,
            overflow: "auto",
          }}
        >
          <Chip
            onClick={() => handleClick(0)}
            size="medium"
            label="Posts"
            sx={{
              backgroundColor: tabValue === 0 ? "lightgray" : "transparent",
              border: tabValue === 0 ? "1px solid gray" : "none",
            }}
          />
          {isAuthenticated && (
            <Chip
              onClick={() => handleClick(1)}
              size="medium"
              label="Create"
              sx={{
                backgroundColor: tabValue === 1 ? "lightgray" : "transparent",
                border: tabValue === 1 ? "1px solid gray" : "none",
              }}
            />
          )}
        </Box>
      </Grid>
      <Typography variant="h2" gutterBottom>
        {tabValue === 0 ? "Latest" : "Create"}
      </Typography>
      {loadingPost ? (
        <Box display="flex" flexDirection="column" gap={1} width="100%">
          <Skeleton width="100%" />
          <Skeleton width="100%" />
          <Skeleton width="100%" />
        </Box>
      ) : (
        tabValue === 0 && (
          <Grid container gap={1} width="100%">
            {posts.length < 1 ? (
              <Box>
                <Typography padding={1} variant="h5">
                  No Posts Found
                </Typography>
              </Box>
            ) : (
              posts.map((article, index) => (
                <Box
                  sx={{ minWidth: 275, width: "100%" }}
                  key={`post card ${index}`}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        gutterBottom
                        sx={{ color: "text.secondary", fontSize: 14 }}
                      >
                        {article.tag}
                      </Typography>
                      <Typography variant="h5" component="div">
                        {article.title}
                      </Typography>
                      <Typography variant="body2">
                        {article.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {isAuthenticated && (
                        <Box
                          width="100%"
                          display="flex"
                          justifyContent="flex-end"
                          gap={1}
                        >
                          <Button
                            variant="contained"
                            onClick={() => {
                              if (article?._id) {
                                handleSetToEdit(article._id);
                              }
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              if (article?._id) {
                                handleDeletePost(article._id);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </CardActions>
                  </Card>
                </Box>
              ))
            )}
          </Grid>
        )
      )}
      {tabValue === 1 && isAuthenticated && (
        <Grid container gap="1em">
          <TextField
            fullWidth
            placeholder="Post Title"
            size="small"
            value={postObj.title}
            onChange={(e) => {
              setPostObj((pre) => ({ ...pre, title: e.target.value }));
              setPostObjErr((pre) => ({ ...pre, title: "" }));
            }}
            error={postObjErr.title.length > 0}
            helperText={[postObjErr.title]}
          />
          <TextField
            fullWidth
            placeholder="Post Tag"
            size="small"
            value={postObj.tag}
            onChange={(e) => {
              setPostObj((pre) => ({ ...pre, tag: e.target.value }));
              setPostObjErr((pre) => ({ ...pre, tag: "" }));
            }}
            error={postObjErr.tag.length > 0}
            helperText={[postObjErr.tag]}
          />
          <TextField
            fullWidth
            placeholder="Post Description"
            size="small"
            value={postObj.description}
            onChange={(e) => {
              setPostObj((pre) => ({ ...pre, description: e.target.value }));
              setPostObjErr((pre) => ({ ...pre, description: "" }));
            }}
            error={postObjErr.description.length > 0}
            helperText={[postObjErr.description]}
          />
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="flex-end"
            gap="10px"
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleClearSelectedPost()}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={() => handleSubmitBtnClick()}>
              Submit
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
