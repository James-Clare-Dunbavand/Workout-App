import "./Navbar.css";
export default function Navbar() {
    return (
        <div id="nav-bar">
            <nav>
                <button type="button" id="nutrition-button">
                    Nutrition
                </button>
                <button type="button" id="workout-button">
                    Workout
                </button>
            </nav>

            {/* <section id="search-bar"> */}
            {/*     <input type="text" name="search-bar" id="search-input" /> */}
            {/* </section> */}
        </div>
    );
}
