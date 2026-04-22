import "../assets/Card.css";
import defaultImage from "../assets/logo.svg";

const Card = ({ titulo, autor, precio, kind, imagen }) => {
  return (
    <div className="card">
      <img src={imagen || defaultImage} alt={titulo} className="card-img" />
      <h3>{titulo}</h3>
      <p className="autor">{autor}</p>
      <p className="tipo">{kind}</p>
      <p className="precio">{precio} EUR</p>
    </div>
  );
};

export default Card;

