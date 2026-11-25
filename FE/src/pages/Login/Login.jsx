import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    login,
    selectAuthError,
    selectAuthStatus,
} from "../../features/auth/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const status = useSelector(selectAuthStatus);
    const error = useSelector(selectAuthError);
    const [form, setForm] = useState({ email: "", password: "" });

    const submitting = status === "loading";

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const result = await dispatch(login(form));
        if (login.fulfilled.match(result)) {
            navigate(location.state?.from?.pathname || "/", { replace: true });
        }
    }

    return (
        <div className="auth-page">
            <div className="card">
                <h1>Login</h1>

                {error?.message && <p role="alert">{error.message}</p>}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />
                  
                    <button type="submit" disabled={submitting}  style={{ marginTop: "1rem" }}>
                        {submitting ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p>
                    Don&apos;t have an account? <Link to="/register">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;