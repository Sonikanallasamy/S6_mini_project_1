import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>

      <h2 style={styles.title}>🩺 Fake Medicine Detector</h2>

      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>

    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "#021024",
    color: "white"
  },

  title: {
    margin: 0
  },

  button: {
    padding: "8px 18px",
    background: "#00b4ff",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Navbar;