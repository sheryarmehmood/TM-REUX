import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
    register,
    selectAuthError,
    selectAuthStatus,
} from "../../features/auth/authSlice";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(selectAuthStatus);
    const error = useSelector(selectAuthError);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submitting = status === "loading";

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const result = await dispatch(register(form));
        if (register.fulfilled.match(result)) {
            navigate("/", { replace: true });
        }
    }

    return (
        <div className="auth-page">
            <div className="card">
                <h1>Create account</h1>

                {error?.message && <p role="alert">{error.message}</p>}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                    />

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
                        autoComplete="new-password"
                        required
                    />

                    <label htmlFor="password_confirmation">Confirm password</label>
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />

                    <button type="submit" disabled={submitting} style={{ marginTop: "1rem" }}>
                        {submitting ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
