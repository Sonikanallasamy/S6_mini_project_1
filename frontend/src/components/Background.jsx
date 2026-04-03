function Background() {

return (

<>
{/* glowing particles */}
<div className="particle p1"></div>
<div className="particle p2"></div>
<div className="particle p3"></div>
<div className="particle p4"></div>

{/* hexagons */}
<div className="hex h1"></div>
<div className="hex h2"></div>
<div className="hex h3"></div>

{/* ECG line */}
<div className="ecg"></div>

<style>
{`

body{
margin:0;
}

/* ================= BACKGROUND ================= */

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

/* ================= HEXAGONS ================= */

.hex{
position:absolute;
width:120px;
height:70px;
background:transparent;
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

/* ================= ECG LINE ================= */

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

`}
</style>

</>

);

}

export default Background;