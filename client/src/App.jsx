import { BrowserRouter, Routes, Route } from "react-router-dom";
import Approvals from "./pages/Approvals";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Approvals />}
                />

                <Route
                    path="/approvals"
                    element={<Approvals />}
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;