import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import Logo from "../../assets/logo.svg";
import Like from "../../assets/like.svg";
import Dislike from "../../assets/dislike.svg";
import Api from "../../services/api";
import Match from "../../assets/itsamatch.png";
import "./Main.css";

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState({});
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const { data } = await Api.get("/devs", {
        headers: { user: match.params.id }
      });
      setUsers(data);

      const response = await Api.post("/devs/getById", { id: match.params.id });
      setLoggedUser(response.data);
    }

    let socket = io("http://localhost:3333", {
      query: { user: match.params.id }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
    });

    loadUsers();
  }, [match.params.id]);

  async function handleLike(id) {
    await Api.post(`devs/${id}/like`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id) {
    await Api.post(`devs/${id}/dislike`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <>
      <div className="navbar">
        <Link to="/Login">
          <img src={Logo} alt="Tindev" />
        </Link>
        <div className="profile">
          {loggedUser.name}
          <img className="avatar" src={loggedUser.avatar} alt="Avatar" />
        </div>
      </div>
      <div className="main-container">
        {users.length === 0 ? (
          <div className="empty">Acabaram os Devs!</div>
        ) : (
          <ul>
            {users.map(user => (
              <li key={user._id}>
                <img src={user.avatar} alt={user.name} />
                <footer>
                  <strong>{user.name}</strong>
                  <p>{user.bio}</p>
                </footer>
                <div className="buttons">
                  <button type="button" onClick={() => handleLike(user._id)}>
                    <img src={Like} alt="Like" />
                  </button>
                  <button type="button" onClick={() => handleDislike(user._id)}>
                    <img src={Dislike} alt="Dislike" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {matchDev && (
          <div className="match-container">
            <img src={Match} alt="Match" />
            <img className="avatar" src={matchDev.avatar} alt="Avatar" />
            <strong>{matchDev.name}</strong>
            <p>{matchDev.bio}</p>
            <button onClick={() => setMatchDev(null)}>Fechar</button>
          </div>
        )}
      </div>
    </>
  );
}
