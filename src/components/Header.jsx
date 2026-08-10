import logo from "../assets/images/logo-cap.png";

function Header() {
    return (
        <header className="header">
            <div className="header__brand">
                <div className="header__logo">
                    <img
                        src={logo}
                        alt="Achados e Perdidos"
                        className="header__logo"
                    />
                </div>

                <div className="header__content">
                    <h1>
                        ACHADOS E <span>PERDIDOS</span>
                    </h1>

                    <p>Encontre seu objeto perdido em poucos segundos.</p>
                </div>
            </div>

            <div className="header__instruction">
                <div>
                    <h2>ESCOLHA UMA CATEGORIA</h2>
                    <p>Selecione uma categoria para visualizar os itens encontrados.</p>
                </div>
            </div>
        </header>
    );
}

export default Header;