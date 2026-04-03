import { useEffect, useState } from "react";

function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/history", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));

  }, []);

  return (
    <div style={styles.container}>

      <h2>📊 Your Detection History</h2>

      {history.length === 0 ? (
        <p>No records yet</p>
      ) : (
        history.map(item => (
          <div key={item.id} style={styles.card}>

            {/* ✅ IMAGE FROM BACKEND */}
            {item.image && (
              <img
                src={`http://127.0.0.1:8000/${item.image}`}
                alt="Medicine"
                style={styles.image}
              />
            )}

            <p><b>Medicine:</b> {item.medicine_name}</p>

            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color: item.status === "Possible Fake" ? "red" : "green",
                  fontWeight: "bold"
                }}
              >
                {item.status}
              </span>
            </p>

            <p><b>Detected Text:</b> {item.detected_text}</p>

          </div>
        ))
      )}

    </div>
  );
}

const styles = {

  container: {
    marginTop: "40px"
  },

  card: {
    background: "#eef6ff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  image: {
    width: "150px",
    borderRadius: "10px",
    display: "block",
    margin: "0 auto 10px", // ✅ center image
    border: "2px solid #ccc"
  }

};

export default History;