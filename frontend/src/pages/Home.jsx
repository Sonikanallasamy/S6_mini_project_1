import { useNavigate } from "react-router-dom";
import bg from "../assets/home_bg.jpg";
import "./Home.css";

function Home() {
const navigate = useNavigate();

return (
<div
className="home-container"
style={{ backgroundImage: `url(${bg})` }}
> <div className="home-content"> <h1>🥼Fake Medicine Detector⚕️</h1>
    <p className="quote">
      "Ensuring every medicine you take is safe, genuine, and trustworthy."
    </p>

    <p className="subtext">
      Detect counterfeit medicines instantly using AI-powered verification.
    </p>

    <div className="buttons">
      <button className="login-btn" onClick={() => navigate("/login")}>
        Login
      </button>

      <button className="register-btn" onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  </div>
</div>

);
}

export default Home;
