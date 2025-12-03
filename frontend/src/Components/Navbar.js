function Navbar({name, onNavClick, currentUser, onLoginClick, onLogoutClick}) {
    return (
        <div>
            <nav className="navbar bg-dark navbar-expand-lg bg-body-tertiary" data-bs-theme="dark"> 
                <div className="container-fluid">
                    <a className="navbar-brand" href="#" onClick={e => {e.preventDefault(); onNavClick('catalog');}}>{name}</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={e => {e.preventDefault(); onNavClick('catalog');}}>Catalog</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={e => {e.preventDefault(); onNavClick('compare');}}>Compare</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={e => {e.preventDefault(); onNavClick('preferences');}}>Preferences</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={e => {e.preventDefault(); onNavClick('favorites');}}>Favorites</a>
                            </li>
                        </ul>
                        <div className="d-flex" style={{gap: '8px'}}>
                            {currentUser ? (
                                <>
                                    <span className="navbar-text" style={{color: 'white', marginRight: '8px'}}>Hello, {currentUser.username}</span>
                                    <button className="btn btn-outline-light" onClick={onLogoutClick}>Logout</button>
                                </>
                            ) : (
                                <button className="btn btn-outline-light" onClick={onLoginClick}>Login</button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}


export default Navbar;