import { useState } from 'react';
import './Login.css';
import logo from "../assets/logo.png";
const Login = () => {
    const [email, setEmail] = useState(
        localStorage.getItem("email") || ""

    );
    const [password, setPassword] = useState('');
    const handleLogin = (event) => {
        event.preventDefault();

        if (email === "" || password === "") {
            alert("Vul alle velden in");
            return;
        }
        alert("Je hebt succesvol ingelogd.");
    };
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <img src={logo} alt="foto" /> <h1>Inloggen</h1>
                <label htmlFor="email">E-mailadres</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        localStorage.setItem("email", event.target.value);
                    }}
                    required
                />

                <label htmlFor="wachtwoord">Wachtwoord</label>
                <input
                    type="password"
                    id="wachtwoord"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                    required
                />

                <button type="submit">Inloggen</button>
            </form>
        </div>
    );
};


export default Login;