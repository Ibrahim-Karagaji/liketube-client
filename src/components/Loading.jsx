export default function Loading() {
  return (
    <div style={styles.overlay}>
      <div style={styles.spinnerContainer}>
        <div style={styles.spinner}></div>
      </div>
      <style global jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#0f0f0f",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9990,
  },
  spinnerContainer: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0px 0px 5px 0px #f1f1f1",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #f1f1f1",
    borderTop: "3px solid #333",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
