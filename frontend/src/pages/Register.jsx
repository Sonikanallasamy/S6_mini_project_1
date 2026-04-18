import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

function Register(){

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const handleRegister = async () => {

const response = await fetch(
`${API_BASE}/register?username=${username}&password=${password}`,
{ method:"POST" }
);

if(response.ok){
alert("User registered successfully");
navigate("/");
}else{
alert("Registration failed");
}

};

return(

<div style={styles.page}>

<h1 style={styles.heading}>🩺 Fake Medicine Detector</h1>

{/* Medicine icons */}
<div className="pill pill1">💊</div>
<div className="pill pill2">💊</div>
<div className="pill pill3">💊</div>
<div className="pill bottle">🧴</div>
<div className="pill tablet">🩹</div>
<div className="pill syringe">💉</div>

<div style={styles.card}>

<h2 style={styles.title}>Register</h2>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
style={styles.input}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={styles.input}
/>

<button onClick={handleRegister} style={styles.button}>
Register
</button>

<p style={{color:"black"}}>
Already have an account? <Link to="/">Login</Link>
</p>

</div>

<style>
{`

body{
margin:0;
}

.pill{
position:absolute;
font-size:60px;
opacity:0.5;
filter: drop-shadow(0px 0px 10px rgba(0,255,255,0.5));
animation:float 10s infinite ease-in-out;
}

.pill1{top:15%; left:8%;}
.pill2{top:70%; left:18%;}
.pill3{top:35%; right:12%;}
.bottle{top:12%; right:8%;}
.tablet{bottom:20%; right:25%;}
.syringe{bottom:12%; left:12%;}

@keyframes float{
0%{transform:translateY(0);}
50%{transform:translateY(-30px);}
100%{transform:translateY(0);}
}

`}
</style>

</div>

);

}

const styles={

page:{
height:"100vh",
width:"100vw",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
background:"linear-gradient(135deg,#021024,#052659,#021024)",
fontFamily:"Arial",
position:"relative",
color:"white"
},

heading:{
position:"absolute",
top:"40px",
fontSize:"38px",
fontWeight:"bold"
},

card:{
background:"rgba(255,255,255,0.95)",
padding:"40px",
borderRadius:"15px",
width:"360px",
textAlign:"center",
boxShadow:"0px 15px 40px rgba(0,0,0,0.5)",
color:"black"
},

title:{
marginBottom:"20px"
},

input:{
width:"100%",
padding:"12px",
marginBottom:"18px",
borderRadius:"8px",
border:"1px solid #ccc",
background:"#f2f2f2",
color:"black"
},

button:{
display:"block",
margin:"10px auto 20px auto",
width:"70%",
padding:"12px",
background:"#00b4ff",
border:"none",
color:"white",
fontSize:"16px",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"bold"
}

};

export default Register;