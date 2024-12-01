import Container from "@mui/material/Container";
import AppAppBar from "./components/AppAppBar";
import Latest from "./components/Latest";

const Dashboard = () => {
  return (
    <>
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          my: 16,
          gap: 4,
          height: "100%",
          width: "100%",
        }}
      >
        <Latest />
      </Container>
    </>
  );
};

export default Dashboard;
