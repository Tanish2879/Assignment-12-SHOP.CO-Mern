import React from "react";

const Login = () => {
    return (
        <main className="login">
            <div className="login__content">
                <header className="login__header">
                    <p className="login__eyebrow">SHOP.CO</p>
                    <h1 className="login__title">Welcome back</h1>
                    <p className="login__welcome">
                        Sign in to continue shopping with us.
                    </p>
                </header>

                <form className="login__form">
                    <div className="login__field">
                        <label className="login__label" htmlFor="email">
                            Email address
                        </label>
                        <input
                            className="login__input"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="login__field">
                        <label className="login__label" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="login__input"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button type="submit" className="login__button">
                        Login
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Login;
