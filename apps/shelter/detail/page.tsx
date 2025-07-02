"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Heart,
    Users,
    PawPrint,
} from "lucide-react";
import { Button } from "../../../src/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../../src/components/ui/card";
import { Badge } from "../../../src/components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../../src/components/ui/tabs";
import NotFoundPage from "../../components/NotFoundPage";
import api from "../../../src/services/api";
import type {
    Shelter,
    Pet,
    Veterinarian,
    Event,
    Arrival,
} from "../../../src/types";

export default function ShelterDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [shelter, setShelter] = useState<Shelter | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [arrivals, setArrivals] = useState<Arrival[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("pets");

    useEffect(() => {
        const loadShelterData = async () => {
            if (!id || id === "0") {
                setError("invalid-id");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                console.log(`🏠 Cargando datos del shelter ${id}...`);
                
                const [
                    shelterData,
                    petsData,
                    veterinariansData,
                    eventsData,
                    arrivalsData,
                ] = await Promise.all([
                    api.getShelterByIdWithFallback(id),
                    api.getPetsByShelterWithFallback(id),
                    api.getVeterinariansByShelterWithFallback(id),
                    api.getEventsByShelterWithFallback(id),
                    api.getArrivalsByShelterWithFallback(id),
                ]);

                if (!shelterData || shelterData.id === 0) {
                    console.error(`❌ Shelter ${id} no encontrado`);
                    setError("not-found");
                    return;
                }

                console.log(`✅ Datos del shelter ${id} cargados exitosamente:`, {
                    shelter: shelterData.name,
                    pets: petsData.length,
                    veterinarians: veterinariansData.length,
                    events: eventsData.length,
                    arrivals: arrivalsData.length
                });

                setShelter(shelterData);
                setPets(petsData);
                setVeterinarians(veterinariansData);
                setEvents(eventsData);
                setArrivals(arrivalsData);
            } catch (error) {
                console.error(`❌ Error loading shelter data for ${id}:`, error);
                
                // Si el error es que no se encontró el shelter, mostrar not-found
                if (error instanceof Error && error.message.includes('not found')) {
                    setError("not-found");
                } else {
                    // Para otros errores, mostrar server-error
                    setError("server-error");
                }
            } finally {
                setLoading(false);
            }
        };

        loadShelterData();
    }, [id]);

    // Helper function to calculate age from birthDate
    const calculateAge = (birthDate: Date): number => {
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            return age - 1;
        }
        return age;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Cargando información del refugio...
                    </p>
                </div>
            </div>
        );
    }

    if (error === "invalid-id") {
        return (
            <NotFoundPage
                title="ID Inválido"
                description="El ID del refugio proporcionado no es válido. Por favor, verifica la URL e intenta nuevamente."
                backLink="/shelter"
                backText="Ver todos los refugios"
                gradient="from-blue-50 to-indigo-100"
            />
        );
    }

    if (error === "not-found" || !shelter) {
        return (
            <NotFoundPage
                title="Refugio no encontrado"
                description="El refugio que buscas no existe o ha sido eliminado. Te sugerimos explorar otros refugios disponibles."
                backLink="/shelter"
                backText="Ver todos los refugios"
                gradient="from-blue-50 to-indigo-100"
            />
        );
    }

    if (error === "server-error") {
        return (
            <NotFoundPage
                title="Error del servidor"
                description="Ocurrió un problema al cargar la información del refugio. Por favor, intenta nuevamente más tarde."
                backLink="/shelter"
                backText="Ver todos los refugios"
                gradient="from-red-50 to-red-100"
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <Link to="/shelter">
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a refugios
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src={
                                    shelter.image || "/placeholder-shelter.jpg"
                                }
                                alt={shelter.name}
                                className="w-32 h-32 rounded-lg object-cover shadow-md"
                            />
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {shelter.name}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {shelter.description}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {shelter.address}
                                </div>
                                <div className="flex items-center">
                                    <Phone className="mr-2 h-4 w-4" />
                                    {shelter.phone}
                                </div>
                                <div className="flex items-center">
                                    <Mail className="mr-2 h-4 w-4" />
                                    {shelter.email}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Badge variant="secondary">
                                    <PawPrint className="mr-1 h-3 w-3" />
                                    {pets.length} mascotas
                                </Badge>
                                <Badge variant="secondary">
                                    <Users className="mr-1 h-3 w-3" />
                                    {veterinarians.length} veterinarios
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="pets">
                            Mascotas ({pets.length})
                        </TabsTrigger>
                        <TabsTrigger value="veterinarians">
                            Veterinarios ({veterinarians.length})
                        </TabsTrigger>
                        <TabsTrigger value="events">
                            Eventos ({events.length})
                        </TabsTrigger>
                        <TabsTrigger value="arrivals">
                            Llegadas ({arrivals.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Pets Tab */}
                    <TabsContent value="pets" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pets.map((pet) => (
                                <Card
                                    key={pet.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={
                                                pet.image ||
                                                "/placeholder-pet.jpg"
                                            }
                                            alt={pet.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {pet.name}
                                                </CardTitle>
                                                <CardDescription>
                                                    {pet.breed} •{" "}
                                                    {calculateAge(
                                                        pet.birthDate
                                                    )}{" "}
                                                    años
                                                </CardDescription>
                                            </div>
                                            <Badge variant="secondary">
                                                Disponible
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {pet.behaviorProfile}
                                        </p>
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            <Badge variant="outline">
                                                {pet.size}
                                            </Badge>
                                            <Badge variant="outline">
                                                {pet.gender}
                                            </Badge>
                                            {pet.vaccinated && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-green-600"
                                                >
                                                    ✓ Vacunado
                                                </Badge>
                                            )}
                                        </div>
                                        <Button className="w-full" asChild>
                                            <Link
                                                to={`/shelter/${id}/pet/${pet.id}`}
                                            >
                                                Ver detalles
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {pets.length === 0 && (
                            <div className="text-center py-8">
                                <PawPrint className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500">
                                    No hay mascotas registradas en este refugio.
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Veterinarians Tab */}
                    <TabsContent value="veterinarians" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {veterinarians.map((vet) => (
                                <Link
                                    key={vet.id}
                                    to={`/veterinarian/${vet.id}`}
                                    className="block hover:shadow-lg transition-shadow"
                                >
                                    <Card className="h-full">
                                        <CardHeader>
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Users className="h-8 w-8 text-blue-600" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        Dr. {vet.name}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {vet.speciality.name}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center">
                                                    <Phone className="mr-2 h-4 w-4 text-gray-400" />
                                                    {vet.phone}
                                                </div>
                                                <div className="flex items-center">
                                                    <Mail className="mr-2 h-4 w-4 text-gray-400" />
                                                    {vet.email}
                                                </div>
                                                <div className="mt-4">
                                                    <Badge variant="outline">
                                                        {vet.yearsExperience}{" "}
                                                        años de experiencia
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        {veterinarians.length === 0 && (
                            <div className="text-center py-8">
                                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500">
                                    No hay veterinarios registrados en este
                                    refugio.
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Events Tab */}
                    <TabsContent value="events" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.map((event) => (
                                <Card
                                    key={event.id}
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {event.name}
                                                </CardTitle>
                                                <CardDescription className="flex items-center mt-2">
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    {new Date(
                                                        event.date
                                                    ).toLocaleDateString(
                                                        "es-ES"
                                                    )}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline">
                                                Evento
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {event.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin className="mr-1 h-4 w-4" />
                                                {event.shelter.address}
                                            </div>
                                            <Button size="sm">Más info</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {events.length === 0 && (
                            <div className="text-center py-8">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500">
                                    No hay eventos programados en este refugio.
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Arrivals Tab */}
                    <TabsContent value="arrivals" className="space-y-4">
                        <div className="space-y-4">
                            {arrivals.map((arrival) => (
                                <Card
                                    key={arrival.id}
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={
                                                        arrival.petImage ||
                                                        "/placeholder-pet.jpg"
                                                    }
                                                    alt={arrival.petName}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-lg">
                                                        {arrival.petName}
                                                    </h3>
                                                    <Badge variant="secondary">
                                                        {new Date(
                                                            arrival.arrivalDate
                                                        ).toLocaleDateString(
                                                            "es-ES"
                                                        )}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    <strong>
                                                        Rescatado por:
                                                    </strong>{" "}
                                                    {arrival.rescuer}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {arrival.notes ||
                                                        "Sin información adicional"}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {arrivals.length === 0 && (
                            <div className="text-center py-8">
                                <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500">
                                    No hay registros de llegadas recientes.
                                </p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
