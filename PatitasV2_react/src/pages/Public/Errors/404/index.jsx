import React from 'react';
import "./404.css";

const NotFound = () => {
    return (
        <>
            <div className="bg-purple">
                <div className="stars">
                    <div className="custom-navbar">
                        <div className="brand-logo">
                            <img src="/logoB.png" width="100px" />
                        </div>
                        <div className="navbar-links">
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="/login" className="btn-request">Dashboard</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="central-body">
                        <img className="image-404" src="/img/404.webp" height="300px" />
                        <label className="label-estilizada">NO SE ENCONTRÓ LA PÁGINA</label>
                        <a href="/" className="btn-go-home">VOLVER</a>
                    </div>

                    <div className="objects">
                        <img className="object_rocket" src="/img/rocket.svg" width="40px" />
                        <div className="earth-moon">
                            <img className="object_earth" src="/img/earth.svg" width="100px" />
                            <img className="object_moon" src="/img/moon.svg" width="80px" />
                        </div>
                        <div className="box_astronaut">
                            <img className="object_astronaut" src="/img/astronaut.svg" width="140px" />
                        </div>
                    </div>
                    <div className="glowing_stars">
                        <div className="star"></div>
                        <div className="star"></div>
                        <div className="star"></div>
                        <div className="star"></div>
                        <div className="star"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;
