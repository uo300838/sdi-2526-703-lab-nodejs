import "../assets/Header.css";

const Header = ({ onChangeView }) => {
  return (
    <header className="header">
      <h1>Tienda de Musica</h1>
      <nav className="nav">
        <button onClick={() => onChangeView?.("songs")}>Tienda</button>
        <button onClick={() => onChangeView?.("add")}>Anadir cancion</button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Cerrar Sesion
        </button>
      </nav>
    </header>
  );
};

export default Header;
