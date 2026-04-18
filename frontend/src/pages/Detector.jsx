import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import History from "../components/History.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "";

function Detector() {

const [file, setFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);

const handleFileChange = (event) => {
  const selected = event.target.files[0];
  setFile(selected);

  if (selected) {
    setImagePreview(URL.createObjectURL(selected));
  }
};

const handleUpload = async () => {

if (!file) {
alert("Please select an image");
return;
}

const formData = new FormData();
formData.append("file", file);

setLoading(true);
setResult(null);

try {

const token = localStorage.getItem("token");

const response = await fetch(`${API_BASE}/predict`, {
method: "POST",
headers:{
Authorization:`Bearer ${token}`
},
body: formData,
});

const data = await response.json();
setResult(data);

} catch (error) {
console.error(error);
alert("Error connecting to backend");
}

setLoading(false);
};

return (

<>
<Navbar/>

<div style={styles.page}>

{/* background effects */}
<div className="particle p1"></div>
<div className="particle p2"></div>
<div className="particle p3"></div>
<div className="particle p4"></div>

<div className="hex h1"></div>
<div className="hex h2"></div>
<div className="hex h3"></div>

<div className="ecg"></div>

<div style={styles.card}>

<h1 style={styles.title}>
🩺 Real vs Fake Medicine
</h1>

<input type="file" onChange={handleFileChange} style={styles.fileInput}/>

{imagePreview && (
  <img
    src={imagePreview}
    alt="Preview"
    style={styles.previewImage}
  />
)}

<button onClick={handleUpload} style={styles.button}>
Detect Medicine
</button>

{loading && (
<div style={styles.loadingContainer}>
<div className="spinner"></div>
<p style={styles.loadingText}>Processing Image...</p>
</div>
)}

{result && (

<div style={styles.resultCard}>

<h2>🔍 Detection Result</h2>

{imagePreview && (
  <img
    src={imagePreview}
    alt="Uploaded"
    style={styles.previewImage}
  />
)}

<p><b>Medicine:</b> {result.medicine_name}</p>

<p>
<b>Status:</b>{" "}
<span style={{
  color: result.status === "Possible Fake" ? "red" : "limegreen",
  fontWeight: "bold"
}}>
  {result.status}
</span>
</p>

<p><b>Detected Text:</b> {result.detected_text}</p>

{result.dosage && result.dosage.length > 0 && (
  <p><b>Dosage:</b> {result.dosage.join(", ")}</p>
)}

</div>
)}

<History/>

</div>

<style>
{`

body{
margin:0;
}

.particle{
position:absolute;
width:4px;
height:4px;
background:#00eaff;
border-radius:50%;
box-shadow:0 0 10px #00eaff;
animation:floatParticle 8s infinite linear;
}

.p1{top:20%;left:15%;}
.p2{top:60%;left:70%;}
.p3{top:40%;left:40%;}
.p4{top:80%;left:20%;}

@keyframes floatParticle{
0%{transform:translateY(0px);}
50%{transform:translateY(-40px);}
100%{transform:translateY(0px);}
}

.hex{
position:absolute;
width:120px;
height:70px;
border:2px solid rgba(0,255,255,0.3);
clip-path: polygon(
25% 0%, 
75% 0%, 
100% 50%, 
75% 100%, 
25% 100%, 
0% 50%
);
}

.h1{top:10%;left:70%;}
.h2{top:65%;left:80%;}
.h3{top:40%;left:10%;}

.ecg{
position:absolute;
top:15%;
left:0;
width:100%;
height:3px;
background:linear-gradient(90deg,transparent,#00eaff,transparent);
animation:ecgMove 3s infinite linear;
}

@keyframes ecgMove{
0%{transform:translateX(-100%);}
100%{transform:translateX(100%);}
}

.spinner{
width:60px;
height:60px;
border:6px solid #ddd;
border-top:6px solid #00eaff;
border-radius:50%;
animation:spin 1s linear infinite;
}

@keyframes spin{
0%{transform:rotate(0deg);}
100%{transform:rotate(360deg);}
}

::-webkit-scrollbar{
width:6px;
}

::-webkit-scrollbar-thumb{
background:#00b4ff;
border-radius:10px;
}

`}
</style>

</div>
</>

);
}

const styles = {

page:{
minHeight:"100vh",
width:"100vw",
display:"flex",
justifyContent:"center",
alignItems:"flex-start",
paddingTop:"120px",
background:"linear-gradient(135deg,#021024,#052659,#021024)",
fontFamily:"Arial",
overflow:"hidden",
color:"white",
position:"relative"
},

card:{
background:"rgba(255,255,255,0.92)",
backdropFilter:"blur(10px)",
padding:"40px",
borderRadius:"15px",
boxShadow:"0px 15px 40px rgba(0,0,0,0.5)",
textAlign:"center",
width:"420px",
maxHeight:"75vh",
overflowY:"auto",
zIndex:2,
color:"black"
},

title:{
marginBottom:"30px",
marginTop:"10px",
fontSize:"30px",
fontWeight:"bold"
},

fileInput:{
marginBottom:"20px"
},

button:{
background:"#00b4ff",
color:"white",
border:"none",
padding:"12px 25px",
fontSize:"16px",
borderRadius:"8px",
cursor:"pointer",
marginBottom:"20px",
fontWeight:"bold"
},

loadingContainer:{
marginTop:"20px",
display:"flex",
flexDirection:"column",
alignItems:"center"
},

loadingText:{
fontSize:"20px",
fontWeight:"bold",
marginTop:"15px"
},

resultCard:{
marginTop:"25px",
padding:"20px",
background:"#eef6ff",
borderRadius:"10px"
},

previewImage:{
width:"200px",
marginBottom:"15px",
borderRadius:"10px",
border:"2px solid #ccc",
display:"block",
marginLeft:"auto",
marginRight:"auto"
}

};

export default Detector;