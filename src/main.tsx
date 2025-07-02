import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../apps/page.tsx";
import SheltersPage from "../apps/shelter/page.tsx";
import ShelterDetailPage from "../apps/shelter/detail/page.tsx";
import PetDetailPage from "../apps/shelter/pet/page.tsx";
import AdoptionApplicationPage from "../apps/shelter/pet/adopt/page.tsx";
import VeterinarianDetailPage from "../apps/veterinarian/page.tsx";
import AdoptionDashboard from "../apps/adoption/dashboard/page.tsx";
import RegisterPage from "../apps/register/page.tsx";
import "../apps/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shelter" element={<SheltersPage />} />
                <Route path="/shelter/:id" element={<ShelterDetailPage />} />
                <Route
                    path="/shelter/:shelterId/pet/:petId"
                    element={<PetDetailPage />}
                />
                <Route
                    path="/shelter/:shelterId/pet/:petId/adopt"
                    element={<AdoptionApplicationPage />}
                />
                <Route
                    path="/veterinarian/:id"
                    element={<VeterinarianDetailPage />}
                />
                <Route
                    path="/adoption/dashboard"
                    element={<AdoptionDashboard />}
                />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
