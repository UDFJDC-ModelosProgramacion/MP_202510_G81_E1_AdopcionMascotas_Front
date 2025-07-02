import {
    Pet,
    Shelter,
    ShelterDetail,
    Veterinarian,
    Event,
    Arrival,
    PetDTO,
    PetDetailDTO,
    VeterinarianDetailDTO,
} from "../types";

const API_BASE_URL = "http://localhost:8080/api";

class ApiService {
    private async fetchData<T>(endpoint: string): Promise<T> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // El backend devuelve JSON directo, no envuelto en ApiResponse
            const data: T = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    // Verificar si el backend está disponible (solo para determinar si usar mock o no)
    private async isBackendAvailable(): Promise<boolean> {
        try {
            // Crear un timeout manual
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000); // Timeout más corto
            
            console.log('🔍 Verificando disponibilidad del backend...');
            const response = await fetch(`${API_BASE_URL}/shelters`, {
                method: 'HEAD', // Solo verificar si responde, no descargar datos
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            // El backend está disponible si responde (sin importar el código de estado)
            // Esto significa que el servidor está corriendo y puede responder
            console.log(`📡 Backend ✅ DISPONIBLE (status: ${response.status}) - Puerto responde`);
            return true;
        } catch (error) {
            // Error de red, timeout, o puerto cerrado
            console.log('❌ Backend NO DISPONIBLE - Puerto no responde:', error);
            return false;
        }
    }

    // Obtener todas las mascotas disponibles
    async getPets(): Promise<Pet[]> {
        return this.fetchData<Pet[]>("/pets");
    }

    // Obtener mascotas con fallback inteligente
    async getPetsWithSmartFallback(): Promise<Pet[]> {
        try {
            const pets = await this.getPets();
            return pets; // Si el backend responde, devolver lo que sea (incluso array vacío)
        } catch (error) {
            // Solo usar mock si el backend no está disponible
            const isAvailable = await this.isBackendAvailable();
            if (!isAvailable) {
                console.warn("Backend no disponible, usando datos mock para pets");
                return this.getMockPets();
            }
            // Si el backend está disponible pero hay error, devolver array vacío
            return [];
        }
    }

    // Obtener una mascota por ID
    async getPetById(id: number): Promise<Pet> {
        return this.fetchData<Pet>(`/pets/${id}`);
    }

    // Obtener todos los refugios
    async getShelters(): Promise<Shelter[]> {
        return this.fetchData<Shelter[]>("/shelters");
    }

    // Obtener refugios con fallback inteligente
    async getSheltersWithSmartFallback(): Promise<Shelter[]> {
        try {
            const shelters = await this.getShelters();
            return shelters; // Si el backend responde, devolver lo que sea (incluso array vacío)
        } catch (error) {
            // Solo usar mock si el backend no está disponible
            const isAvailable = await this.isBackendAvailable();
            if (!isAvailable) {
                console.warn("Backend no disponible, usando datos mock para shelters");
                return this.getMockShelters();
            }
            // Si el backend está disponible pero hay error, devolver array vacío
            return [];
        }
    }

    // Obtener detalle de un refugio por ID
    async getShelterDetailById(id: number): Promise<ShelterDetail> {
        return this.fetchData<ShelterDetail>(`/shelters/${id}/detail`);
    }

    // Obtener mascotas de un refugio específico
    async getPetsByShelter(shelterId: number): Promise<Pet[]> {
        try {
            return await this.fetchData<Pet[]>(`/shelters/${shelterId}/pets`);
        } catch (error) {
            console.warn(`Pets endpoint not available for shelter ${shelterId}, returning empty array`);
            return [];
        }
    }

    // Obtener un refugio por ID
    async getShelterById(id: string): Promise<Shelter> {
        return this.fetchData<Shelter>(`/shelters/${id}`);
    }

    // Obtener veterinarios de un refugio específico
    async getVeterinariansByShelter(shelterId: string): Promise<Veterinarian[]> {
        try {
            return await this.fetchData<Veterinarian[]>(`/shelters/${shelterId}/veterinarians`);
        } catch (error) {
            console.warn(`Veterinarians endpoint not available for shelter ${shelterId}, returning empty array`);
            return [];
        }
    }

    // Obtener eventos de un refugio específico
    async getEventsByShelter(shelterId: string): Promise<Event[]> {
        try {
            return await this.fetchData<Event[]>(`/shelters/${shelterId}/events`);
        } catch (error) {
            console.warn(`Events endpoint not available for shelter ${shelterId}, returning empty array`);
            return [];
        }
    }

    // Obtener llegadas de un refugio específico
    async getArrivalsByShelter(shelterId: string): Promise<Arrival[]> {
        try {
            return await this.fetchData<Arrival[]>(`/shelters/${shelterId}/arrivals`);
        } catch (error) {
            console.warn(`Arrivals endpoint not available for shelter ${shelterId}, returning empty array`);
            return [];
        }
    }

    // Filtrar mascotas por criterios
    async filterPets(filters: {
        size?: string;
        gender?: string;
        breed?: string;
        shelterId?: number;
    }): Promise<Pet[]> {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.append(key, value.toString());
            }
        });

        const queryString = params.toString();
        const endpoint = queryString ? `/pets/filter?${queryString}` : "/pets";

        return this.fetchData<Pet[]>(endpoint);
    }

    // Crear un nuevo refugio
    async createShelter(shelterData: {
        name: string;
        address: string;
        phone: string;
        email: string;
    }): Promise<Shelter> {
        const response = await fetch(`${API_BASE_URL}/shelters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shelterData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Shelter = await response.json();
        return data;
    }

    // Datos mock para desarrollo/fallback
    private getMockShelterDetail(id: number): ShelterDetail | null {
        const shelterData = {
            1: {
                id: 1,
                name: "Refugio Esperanza",
                address: "Calle 45 #12-34, Bogotá",
                phone: "+57 301 234 5678",
                email: "contacto@refugioesperanza.org",
                description:
                    "Dedicados al rescate y cuidado de mascotas abandonadas desde hace 15 años. Nuestro compromiso es brindar amor, cuidado médico y encontrar el hogar perfecto para cada mascota.",
                foundedYear: 2009,
                capacity: 60,
                currentOccupancy: 45,
                petsCount: 3,
                veterinariansCount: 3,
                eventsCount: 6,
                image: "/placeholder.svg?height=400&width=600",
                coverImage: "/placeholder.svg?height=300&width=800",
                status: "ACTIVE" as const,

                pets: [
                    {
                        id: 1,
                        name: "Luna",
                        birthDate: new Date("2022-03-15"),
                        breed: "Labrador Mix",
                        size: "MEDIUM" as const,
                        gender: "FEMALE" as const,
                        behaviorProfile:
                            "Amigable, juguetona y muy cariñosa. Le encanta correr y jugar con otros perros.",
                        image: "/placeholder.svg?height=300&width=400",
                        vaccinated: true,
                        sterilized: true,
                        arrivalDate: new Date("2023-08-10"),
                        shelter: {
                            id: 1,
                            name: "Refugio Esperanza",
                            address: "Calle 45 #12-34, Bogotá",
                            phone: "+57 301 234 5678",
                            email: "contacto@refugioesperanza.org",
                        },
                    },
                    {
                        id: 2,
                        name: "Rocky",
                        birthDate: new Date("2021-11-20"),
                        breed: "Pastor Alemán",
                        size: "LARGE" as const,
                        gender: "MALE" as const,
                        behaviorProfile:
                            "Protector, leal y muy inteligente. Ideal para familias con experiencia en perros grandes.",
                        image: "/placeholder.svg?height=300&width=400",
                        vaccinated: true,
                        sterilized: false,
                        arrivalDate: new Date("2023-09-15"),
                        shelter: {
                            id: 1,
                            name: "Refugio Esperanza",
                            address: "Calle 45 #12-34, Bogotá",
                            phone: "+57 301 234 5678",
                            email: "contacto@refugioesperanza.org",
                        },
                    },
                    {
                        id: 3,
                        name: "Mia",
                        birthDate: new Date("2023-01-10"),
                        breed: "Mestizo",
                        size: "SMALL" as const,
                        gender: "FEMALE" as const,
                        behaviorProfile:
                            "Pequeña pero valiente, muy inteligente y fácil de entrenar.",
                        image: "/placeholder.svg?height=300&width=400",
                        vaccinated: true,
                        sterilized: true,
                        arrivalDate: new Date("2023-07-22"),
                        shelter: {
                            id: 1,
                            name: "Refugio Esperanza",
                            address: "Calle 45 #12-34, Bogotá",
                            phone: "+57 301 234 5678",
                            email: "contacto@refugioesperanza.org",
                        },
                    },
                ],

                veterinarians: [
                    {
                        id: 1,
                        name: "Dr. María González",
                        email: "maria.gonzalez@refugioesperanza.org",
                        phone: "+57 301 111 2222",
                        licenseNumber: "VET-2018-001",
                        speciality: {
                            name: "Medicina General",
                            description:
                                "Atención médica integral para mascotas",
                        },
                        disponibilities: ["MORNING", "AFTERNOON"],
                        yearsExperience: 8,
                        image: "/placeholder.svg?height=200&width=200",
                    },
                    {
                        id: 2,
                        name: "Dr. Carlos Rodríguez",
                        email: "carlos.rodriguez@refugioesperanza.org",
                        phone: "+57 301 333 4444",
                        licenseNumber: "VET-2020-045",
                        speciality: {
                            name: "Cirugía",
                            description:
                                "Especialista en procedimientos quirúrgicos",
                        },
                        disponibilities: ["MORNING", "EVENING"],
                        yearsExperience: 6,
                        image: "/placeholder.svg?height=200&width=200",
                    },
                    {
                        id: 3,
                        name: "Dra. Ana Martínez",
                        email: "ana.martinez@refugioesperanza.org",
                        phone: "+57 301 555 6666",
                        licenseNumber: "VET-2019-023",
                        speciality: {
                            name: "Dermatología",
                            description:
                                "Tratamiento de enfermedades de la piel",
                        },
                        disponibilities: ["AFTERNOON", "EVENING"],
                        yearsExperience: 7,
                        image: "/placeholder.svg?height=200&width=200",
                    },
                ],

                events: [
                    {
                        id: 1,
                        name: "Jornada de Vacunación Gratuita",
                        description:
                            "Vacunación antirrábica y múltiple para mascotas de la comunidad. Nuestro equipo veterinario estará disponible para brindar atención médica preventiva.",
                        date: new Date("2024-02-15"),
                        status: "UPCOMING" as const,
                        shelter: {
                            id: 1,
                            name: "Refugio Esperanza",
                            address: "Calle 45 #12-34, Bogotá",
                            phone: "+57 301 234 5678",
                            email: "contacto@refugioesperanza.org",
                        },
                    },
                    {
                        id: 2,
                        name: "Feria de Adopción Especial",
                        description:
                            "Evento especial para encontrar hogares para nuestras mascotas. Conoce a todos nuestros peludos disponibles y encuentra tu compañero perfecto.",
                        date: new Date("2024-01-28"),
                        status: "COMPLETED" as const,
                        shelter: {
                            id: 1,
                            name: "Refugio Esperanza",
                            address: "Calle 45 #12-34, Bogotá",
                            phone: "+57 301 234 5678",
                            email: "contacto@refugioesperanza.org",
                        },
                    },
                    {
                        id: 3,
                        name: "Taller de Cuidado Responsable",
                        description:
                            "Educación sobre tenencia responsable de mascotas. Aprende sobre nutrición, cuidados básicos, entrenamiento y bienestar animal.",
                        date: new Date("2024-01-20"),
                        status: "COMPLETED" as const,
                        shelter: {
                            id: 1,
                            name: "Refugio Esperanza",
                            address: "Calle 45 #12-34, Bogotá",
                            phone: "+57 301 234 5678",
                            email: "contacto@refugioesperanza.org",
                        },
                    },
                    {
                        id: 4,
                        name: "Campaña de Esterilización",
                        description:
                            "Esterilización gratuita para mascotas de bajos recursos. Contribuyendo al control poblacional y la salud de las mascotas de la comunidad.",
                        date: new Date("2024-02-10"),
                        status: "UPCOMING" as const,
                        shelter: {
                            id: 1,
                            name: "Refugio Esperanza",
                            address: "Calle 45 #12-34, Bogotá",
                            phone: "+57 301 234 5678",
                            email: "contacto@refugioesperanza.org",
                        },
                    },
                    {
                        id: 5,
                        name: "Día de Puertas Abiertas",
                        description:
                            "Ven a conocer nuestras instalaciones, conoce a nuestro equipo y descubre cómo puedes ayudar. Tours guiados cada hora.",
                        date: new Date("2024-02-20"),
                        status: "UPCOMING" as const,
                        shelter: {
                            id: 1,
                            name: "Refugio Esperanza",
                            address: "Calle 45 #12-34, Bogotá",
                            phone: "+57 301 234 5678",
                            email: "contacto@refugioesperanza.org",
                        },
                    },
                    {
                        id: 6,
                        name: "Colecta de Alimentos y Medicinas",
                        description:
                            "Jornada de recolección de donaciones para el cuidado de nuestras mascotas. Acepta alimentos, medicinas, juguetes y mantas.",
                        date: new Date("2024-03-05"),
                        status: "UPCOMING" as const,
                        shelter: {
                            id: 1,
                            name: "Refugio Esperanza",
                            address: "Calle 45 #12-34, Bogotá",
                            phone: "+57 301 234 5678",
                            email: "contacto@refugioesperanza.org",
                        },
                    },
                ],

                arrivals: [
                    {
                        id: 1,
                        petName: "Luna",
                        arrivalDate: new Date("2023-08-10"),
                        reason: "ABANDONMENT" as const,
                        condition: "GOOD" as const,
                        rescuer: "Ciudadano anónimo",
                        notes: "Encontrada en la calle, bien alimentada pero sin collar",
                    },
                    {
                        id: 2,
                        petName: "Rocky",
                        arrivalDate: new Date("2023-09-15"),
                        reason: "SURRENDER" as const,
                        condition: "FAIR" as const,
                        rescuer: "Familia anterior",
                        notes: "Entregado por mudanza, necesita socialización",
                    },
                    {
                        id: 3,
                        petName: "Mia",
                        arrivalDate: new Date("2023-07-22"),
                        reason: "RESCUE" as const,
                        condition: "POOR" as const,
                        rescuer: "Equipo de rescate",
                        notes: "Rescatada de situación de maltrato, rehabilitada completamente",
                    },
                ],
            },
            2: {
                id: 2,
                name: "Hogar Feliz",
                address: "Carrera 15 #67-89, Medellín",
                phone: "+57 304 567 8901",
                email: "info@hogarfeliz.com",
                description:
                    "Un refugio familiar que brinda amor y cuidado especializado a cada mascota. Contamos con instalaciones modernas y un equipo veterinario altamente calificado.",
                foundedYear: 2015,
                capacity: 40,
                currentOccupancy: 32,
                petsCount: 2,
                veterinariansCount: 2,
                eventsCount: 4,
                image: "/placeholder.svg?height=400&width=600",
                coverImage: "/placeholder.svg?height=300&width=800",
                status: "ACTIVE" as const,

                pets: [
                    {
                        id: 4,
                        name: "Max",
                        birthDate: new Date("2021-08-20"),
                        breed: "Golden Retriever",
                        size: "LARGE" as const,
                        gender: "MALE" as const,
                        behaviorProfile:
                            "Tranquilo, obediente y perfecto para familias con niños.",
                        image: "/placeholder.svg?height=300&width=400",
                        vaccinated: true,
                        sterilized: true,
                        arrivalDate: new Date("2023-10-05"),
                        shelter: {
                            id: 2,
                            name: "Hogar Feliz",
                            address: "Carrera 15 #67-89, Medellín",
                            phone: "+57 304 567 8901",
                            email: "info@hogarfeliz.com",
                        },
                    },
                    {
                        id: 5,
                        name: "Bella",
                        birthDate: new Date("2022-05-12"),
                        breed: "Bulldog Francés",
                        size: "SMALL" as const,
                        gender: "FEMALE" as const,
                        behaviorProfile:
                            "Cariñosa y tranquila, perfecta mascota de compañía para apartamentos.",
                        image: "/placeholder.svg?height=300&width=400",
                        vaccinated: true,
                        sterilized: false,
                        arrivalDate: new Date("2023-11-20"),
                        shelter: {
                            id: 2,
                            name: "Hogar Feliz",
                            address: "Carrera 15 #67-89, Medellín",
                            phone: "+57 304 567 8901",
                            email: "info@hogarfeliz.com",
                        },
                    },
                ],

                veterinarians: [
                    {
                        id: 4,
                        name: "Dr. Luis Gómez",
                        email: "luis.gomez@hogarfeliz.com",
                        phone: "+57 304 777 8888",
                        licenseNumber: "VET-2021-078",
                        speciality: {
                            name: "Medicina Interna",
                            description: "Diagnóstico y tratamiento de enfermedades internas",
                        },
                        disponibilities: ["MORNING", "AFTERNOON"],
                        yearsExperience: 5,
                        image: "/placeholder.svg?height=200&width=200",
                    },
                    {
                        id: 5,
                        name: "Dra. Patricia Vega",
                        email: "patricia.vega@hogarfeliz.com",
                        phone: "+57 304 999 0000",
                        licenseNumber: "VET-2022-134",
                        speciality: {
                            name: "Pediatría Veterinaria",
                            description: "Cuidado especializado para cachorros y gatitos",
                        },
                        disponibilities: ["AFTERNOON", "EVENING"],
                        yearsExperience: 3,
                        image: "/placeholder.svg?height=200&width=200",
                    },
                ],

                events: [
                    {
                        id: 7,
                        name: "Adopción Especial de Fin de Semana",
                        description: "Evento especial para encontrar hogares durante el fin de semana con descuentos en adopciones.",
                        date: new Date("2024-02-18"),
                        status: "UPCOMING" as const,
                        shelter: {
                            id: 2,
                            name: "Hogar Feliz",
                            address: "Carrera 15 #67-89, Medellín",
                            phone: "+57 304 567 8901",
                            email: "info@hogarfeliz.com",
                        },
                    },
                    {
                        id: 8,
                        name: "Taller de Primeros Auxilios para Mascotas",
                        description: "Aprende técnicas básicas de primeros auxilios que pueden salvar la vida de tu mascota.",
                        date: new Date("2024-01-25"),
                        status: "COMPLETED" as const,
                        shelter: {
                            id: 2,
                            name: "Hogar Feliz",
                            address: "Carrera 15 #67-89, Medellín",
                            phone: "+57 304 567 8901",
                            email: "info@hogarfeliz.com",
                        },
                    },
                ],

                arrivals: [
                    {
                        id: 4,
                        petName: "Max",
                        arrivalDate: new Date("2023-10-05"),
                        reason: "SURRENDER" as const,
                        condition: "GOOD" as const,
                        rescuer: "Familia relocalizándose",
                        notes: "Entregado por mudanza internacional, excelente estado de salud",
                    },
                    {
                        id: 5,
                        petName: "Bella",
                        arrivalDate: new Date("2023-11-20"),
                        reason: "ABANDONMENT" as const,
                        condition: "FAIR" as const,
                        rescuer: "Vecinos preocupados",
                        notes: "Encontrada en parque, necesitaba cuidado veterinario básico",
                    },
                ],
            },
        };

        return shelterData[id as keyof typeof shelterData] || null;
    }
    private getMockPets(): Pet[] {
        return [
            {
                id: 1,
                name: "Luna",
                birthDate: new Date("2022-03-15"),
                breed: "Labrador Mix",
                size: "MEDIUM",
                gender: "FEMALE",
                behaviorProfile:
                    "Amigable, juguetona y muy cariñosa. Le encanta correr y jugar con otros perros.",
                shelter: {
                    id: 1,
                    name: "Refugio Esperanza",
                    address: "Calle 45 #12-34, Bogotá",
                    phone: "+57 301 234 5678",
                    email: "contacto@refugioesperanza.org",
                },
                image: "/placeholder.svg?height=300&width=400",
            },
            {
                id: 2,
                name: "Max",
                birthDate: new Date("2021-08-20"),
                breed: "Golden Retriever",
                size: "LARGE",
                gender: "MALE",
                behaviorProfile:
                    "Tranquilo, obediente y perfecto para familias con niños.",
                shelter: {
                    id: 2,
                    name: "Hogar Feliz",
                    address: "Carrera 15 #67-89, Medellín",
                    phone: "+57 304 567 8901",
                    email: "info@hogarfeliz.com",
                },
                image: "/placeholder.svg?height=300&width=400",
            },
            {
                id: 3,
                name: "Mia",
                birthDate: new Date("2023-01-10"),
                breed: "Mestizo",
                size: "SMALL",
                gender: "FEMALE",
                behaviorProfile:
                    "Pequeña pero valiente, muy inteligente y fácil de entrenar.",
                shelter: {
                    id: 1,
                    name: "Refugio Esperanza",
                    address: "Calle 45 #12-34, Bogotá",
                    phone: "+57 301 234 5678",
                    email: "contacto@refugioesperanza.org",
                },
                image: "/placeholder.svg?height=300&width=400",
            },
        ];
    }

    private getMockShelters(): Shelter[] {
        return [
            {
                id: 1,
                name: "Refugio Esperanza",
                address: "Calle 45 #12-34, Bogotá",
                phone: "+57 301 234 5678",
                email: "contacto@refugioesperanza.org",
                description:
                    "Dedicados al rescate y cuidado de mascotas abandonadas desde hace 15 años. Nuestro compromiso es brindar amor, cuidado médico y encontrar el hogar perfecto para cada mascota.",
                petsCount: 45,
                veterinariansCount: 8,
                eventsCount: 12,
                foundedYear: 2009,
                image: "/placeholder.svg?height=300&width=400",
                coverImage: "/placeholder.svg?height=200&width=600",
                status: "ACTIVE",
                capacity: 60,
            },
            {
                id: 2,
                name: "Hogar Feliz",
                address: "Carrera 15 #67-89, Medellín",
                phone: "+57 304 567 8901",
                email: "info@hogarfeliz.com",
                description:
                    "Un refugio familiar que brinda amor y cuidado especializado a cada mascota. Contamos con instalaciones modernas y un equipo veterinario altamente calificado.",
                petsCount: 32,
                veterinariansCount: 5,
                eventsCount: 8,
                foundedYear: 2015,
                image: "/placeholder.svg?height=300&width=400",
                coverImage: "/placeholder.svg?height=200&width=600",
                status: "ACTIVE",
                capacity: 40,
            },
            {
                id: 3,
                name: "Patitas Unidas",
                address: "Avenida 30 #78-12, Cali",
                phone: "+57 315 678 9012",
                email: "adopciones@patitasunidas.org",
                description:
                    "Trabajamos incansablemente para encontrar el hogar perfecto para cada mascota. Nos especializamos en rehabilitación y socialización de animales rescatados.",
                petsCount: 28,
                veterinariansCount: 6,
                eventsCount: 15,
                foundedYear: 2012,
                image: "/placeholder.svg?height=300&width=400",
                coverImage: "/placeholder.svg?height=200&width=600",
                status: "ACTIVE",
                capacity: 35,
            },
            {
                id: 4,
                name: "Refugio San Francisco",
                address: "Calle 123 #45-67, Barranquilla",
                phone: "+57 320 456 7890",
                email: "info@refugiosanfrancisco.org",
                description:
                    "Más de 20 años dedicados al bienestar animal. Ofrecemos servicios de rescate, rehabilitación y adopción responsable.",
                petsCount: 52,
                veterinariansCount: 10,
                eventsCount: 20,
                foundedYear: 2003,
                image: "/placeholder.svg?height=300&width=400",
                coverImage: "/placeholder.svg?height=200&width=600",
                status: "ACTIVE",
                capacity: 70,
            },
            {
                id: 5,
                name: "Corazones Peludos",
                address: "Carrera 89 #12-34, Bucaramanga",
                phone: "+57 312 345 6789",
                email: "contacto@corazonespeludos.com",
                description:
                    "Refugio especializado en casos especiales y mascotas con necesidades médicas. Brindamos cuidado integral y amor incondicional.",
                petsCount: 18,
                veterinariansCount: 4,
                eventsCount: 6,
                foundedYear: 2018,
                image: "/placeholder.svg?height=300&width=400",
                coverImage: "/placeholder.svg?height=200&width=600",
                status: "ACTIVE",
                capacity: 25,
            },
            {
                id: 6,
                name: "Refugio Amanecer",
                address: "Avenida 67 #89-12, Pereira",
                phone: "+57 318 234 5678",
                email: "adopciones@refugioamanecer.org",
                description:
                    "Comprometidos con la protección animal y la educación comunitaria. Trabajamos en programas de esterilización y adopción responsable.",
                petsCount: 38,
                veterinariansCount: 7,
                eventsCount: 11,
                foundedYear: 2011,
                image: "/placeholder.svg?height=300&width=400",
                coverImage: "/placeholder.svg?height=200&width=600",
                status: "ACTIVE",
                capacity: 50,
            },
        ];
    }

    // Métodos con fallback a datos mock si la API no está disponible
    async getPetsWithFallback(): Promise<Pet[]> {
        try {
            console.log('📱 Intentando obtener pets del backend...');
            const pets = await this.getPets();
            console.log(`✅ Backend respondió con ${pets.length} pets`);
            return pets; // Si el backend responde, devolver lo que sea (incluso array vacío)
        } catch (error) {
            console.log('❌ Error al obtener pets:', error);
            
            // Solo usar mock si el puerto/backend no está disponible (error de conexión)
            const isAvailable = await this.isBackendAvailable();
            if (!isAvailable) {
                console.warn("🔄 Puerto no responde - Usando datos MOCK para pets");
                return this.getMockPets();
            }
            
            // Si el puerto responde pero hay error en el endpoint específico, devolver vacío
            console.warn("🔧 Puerto responde pero endpoint de pets tiene error - Mostrando lista vacía");
            return [];
        }
    }

    async getSheltersWithFallback(): Promise<Shelter[]> {
        try {
            console.log('🏠 Intentando obtener shelters del backend...');
            const shelters = await this.getShelters();
            console.log(`✅ Backend respondió con ${shelters.length} shelters`);
            return shelters; // Si el backend responde, devolver lo que sea (incluso array vacío)
        } catch (error) {
            console.log('❌ Error al obtener shelters:', error);
            
            // Solo usar mock si el puerto/backend no está disponible (error de conexión)
            const isAvailable = await this.isBackendAvailable();
            if (!isAvailable) {
                console.warn("🔄 Puerto no responde - Usando datos MOCK para shelters");
                return this.getMockShelters();
            }
            
            // Si el puerto responde pero hay error en el endpoint específico, devolver vacío
            console.warn("🔧 Puerto responde pero endpoint de shelters tiene error - Mostrando lista vacía");
            return [];
        }
    }

    // Fallback methods for new shelter detail methods
    async getShelterByIdWithFallback(id: string): Promise<Shelter> {
        // Check for invalid IDs first
        if (!id || id === "0" || isNaN(parseInt(id))) {
            throw new Error(`Invalid shelter ID: ${id}`);
        }

        try {
            console.log(`🏠 Intentando obtener shelter ${id} del backend...`);
            const shelter = await this.getShelterById(id);
            console.log(`✅ Backend respondió con shelter ${id}`);
            return shelter;
        } catch (error) {
            console.log(`❌ Error al obtener shelter ${id}:`, error);
            
            // Solo usar mock si el puerto/backend no está disponible (error de conexión)
            const isAvailable = await this.isBackendAvailable();
            if (!isAvailable) {
                console.warn(`🔄 Puerto no responde - Usando datos MOCK para shelter ${id}`);
                const shelters = this.getMockShelters();
                const shelter = shelters.find((s) => s.id.toString() === id);
                if (!shelter) {
                    throw new Error(`Shelter with id ${id} not found in mock data`);
                }
                return shelter;
            }
            
            // Si el puerto responde pero hay error en el endpoint específico, re-lanzar el error
            console.warn(`🔧 Puerto responde pero endpoint de shelter ${id} tiene error`);
            throw error;
        }
    }

    async getPetsByShelterWithFallback(shelterId: string): Promise<Pet[]> {
        // Verificar disponibilidad del backend PRIMERO
        const isAvailable = await this.isBackendAvailable();
        
        if (!isAvailable) {
            console.warn(`🔄 Puerto no responde - Usando datos MOCK para pets del shelter ${shelterId}`);
            const shelterDetail = this.getMockShelterDetail(parseInt(shelterId));
            return shelterDetail?.pets || [];
        }
        
        // Si el backend está disponible, intentar obtener datos reales
        try {
            console.log(`� Intentando obtener pets del shelter ${shelterId}...`);
            const pets = await this.getPetsByShelter(parseInt(shelterId));
            console.log(`✅ Backend respondió con ${pets.length} pets para shelter ${shelterId}`);
            return pets;
        } catch (error) {
            console.log(`❌ Error al obtener pets del shelter ${shelterId}:`, error);
            console.warn(`🔧 Puerto responde pero endpoint de pets para shelter ${shelterId} tiene error - Mostrando lista vacía`);
            return [];
        }
    }

    async getVeterinariansByShelterWithFallback(
        shelterId: string
    ): Promise<Veterinarian[]> {
        // Verificar disponibilidad del backend PRIMERO
        const isAvailable = await this.isBackendAvailable();
        
        if (!isAvailable) {
            console.warn(`🔄 Puerto no responde - Usando datos MOCK para veterinarios del shelter ${shelterId}`);
            const shelterDetail = this.getMockShelterDetail(parseInt(shelterId));
            return shelterDetail?.veterinarians || [];
        }
        
        // Si el backend está disponible, intentar obtener datos reales
        try {
            console.log(`�‍⚕️ Intentando obtener veterinarios del shelter ${shelterId}...`);
            const veterinarians = await this.getVeterinariansByShelter(shelterId);
            console.log(`✅ Backend respondió con ${veterinarians.length} veterinarios para shelter ${shelterId}`);
            return veterinarians;
        } catch (error) {
            console.log(`❌ Error al obtener veterinarios del shelter ${shelterId}:`, error);
            console.warn(`🔧 Puerto responde pero endpoint de veterinarios para shelter ${shelterId} tiene error - Mostrando lista vacía`);
            return [];
        }
    }

    async getEventsByShelterWithFallback(shelterId: string): Promise<Event[]> {
        // Verificar disponibilidad del backend PRIMERO
        const isAvailable = await this.isBackendAvailable();
        
        if (!isAvailable) {
            console.warn(`🔄 Puerto no responde - Usando datos MOCK para eventos del shelter ${shelterId}`);
            const shelterDetail = this.getMockShelterDetail(parseInt(shelterId));
            return shelterDetail?.events || [];
        }
        
        // Si el backend está disponible, intentar obtener datos reales
        try {
            console.log(`� Intentando obtener eventos del shelter ${shelterId}...`);
            const events = await this.getEventsByShelter(shelterId);
            console.log(`✅ Backend respondió con ${events.length} eventos para shelter ${shelterId}`);
            return events;
        } catch (error) {
            console.log(`❌ Error al obtener eventos del shelter ${shelterId}:`, error);
            console.warn(`🔧 Puerto responde pero endpoint de eventos para shelter ${shelterId} tiene error - Mostrando lista vacía`);
            return [];
        }
    }

    async getArrivalsByShelterWithFallback(
        shelterId: string
    ): Promise<Arrival[]> {
        // Verificar disponibilidad del backend PRIMERO
        const isAvailable = await this.isBackendAvailable();
        
        if (!isAvailable) {
            console.warn(`🔄 Puerto no responde - Usando datos MOCK para llegadas del shelter ${shelterId}`);
            const shelterDetail = this.getMockShelterDetail(parseInt(shelterId));
            return shelterDetail?.arrivals || [];
        }
        
        // Si el backend está disponible, intentar obtener datos reales
        try {
            console.log(`� Intentando obtener llegadas del shelter ${shelterId}...`);
            const arrivals = await this.getArrivalsByShelter(shelterId);
            console.log(`✅ Backend respondió con ${arrivals.length} llegadas para shelter ${shelterId}`);
            return arrivals;
        } catch (error) {
            console.log(`❌ Error al obtener llegadas del shelter ${shelterId}:`, error);
            console.warn(`🔧 Puerto responde pero endpoint de llegadas para shelter ${shelterId} tiene error - Mostrando lista vacía`);
            return [];
        }
    }

    // Obtener detalle de una mascota por refugio y ID de mascota
    async getPetDetail(
        shelterId: string,
        petId: string
    ): Promise<PetDetailDTO> {
        return this.fetchData<PetDetailDTO>(
            `/shelters/${shelterId}/pets/${petId}`
        );
    }

    // Obtener mascotas de un refugio específico con detalles completos
    async getPetsByShelterId(shelterId: string): Promise<PetDTO[]> {
        return this.fetchData<PetDTO[]>(`/shelters/${shelterId}/pets`);
    }

    // Pet detail with fallback
    async getPetDetailWithFallback(
        shelterId: string,
        petId: string
    ): Promise<PetDetailDTO> {
        // Check for invalid IDs first
        if (
            !shelterId ||
            !petId ||
            shelterId === "0" ||
            petId === "0" ||
            isNaN(parseInt(shelterId)) ||
            isNaN(parseInt(petId))
        ) {
            throw new Error(
                `Invalid shelter ID (${shelterId}) or pet ID (${petId})`
            );
        }

        try {
            return await this.getPetDetail(shelterId, petId);
        } catch (error) {
            console.warn("API no disponible, usando datos mock:", error);
            const mockPet = this.getMockPetDetail(parseInt(petId));
            if (!mockPet || mockPet.id === 0) {
                throw new Error(
                    `Pet with id ${petId} not found in shelter ${shelterId}`
                );
            }
            return mockPet;
        }
    }

    // Mock data for pet detail
    private getMockPetDetail(petId: number): PetDetailDTO {
        const mockPetDetails: { [key: number]: PetDetailDTO } = {
            1: {
                id: 1,
                name: "Luna",
                birthDate: new Date("2022-03-15"),
                breed: "Labrador Mix",
                size: "MEDIUM",
                gender: "FEMALE",
                behaviorProfile:
                    "Amigable, juguetona y muy cariñosa. Le encanta correr y jugar con otros perros. Es perfecta para familias con niños y se adapta bien a diferentes ambientes.",
                shelter: {
                    id: 1,
                    name: "Refugio Esperanza",
                    address: "Calle 45 #12-34, Bogotá",
                    phone: "+57 301 234 5678",
                    email: "contacto@refugioesperanza.org",
                },
                vaccineCard: {
                    id: 1,
                    issuedDate: new Date("2023-08-15"),
                    lastVaccineDate: new Date("2024-01-15"),
                    lastDewormingDate: new Date("2024-01-10"),
                    veterinarian: "Dr. María González",
                    vaccines: [
                        {
                            id: 1,
                            name: "Antirrábica",
                            brandName: "Nobivac Rabies",
                            date: new Date("2024-01-15"),
                            nextDate: new Date("2025-01-15"),
                            dosis: 1.0,
                            status: "CURRENT",
                        },
                        {
                            id: 2,
                            name: "Múltiple (DHPP)",
                            brandName: "Nobivac DHPPi",
                            date: new Date("2024-01-10"),
                            nextDate: new Date("2025-01-10"),
                            dosis: 1.0,
                            status: "CURRENT",
                        },
                    ],
                    dewormings: [
                        {
                            id: 1,
                            brandName: "Drontal Plus",
                            date: new Date("2024-01-10"),
                            nextDate: new Date("2024-04-10"),
                            dosis: 2.0,
                            type: "INTERNAL",
                            veterinarian: "Dr. María González",
                            status: "CURRENT",
                            notes: "Desparasitación interna completa",
                        },
                    ],
                },
                owners: [],
                adoptionApplications: [
                    {
                        id: 1,
                        applicationDate: new Date("2024-01-15"),
                        applicationEnd: new Date("2024-01-20"),
                        observations:
                            "Familia con experiencia previa en perros grandes. Casa con jardín amplio.",
                        applicationStatus: "APPROVED",
                        result: "APPROVED",
                        applicant: {
                            id: 1,
                            name: "María García",
                            email: "maria.garcia@email.com",
                            phone: "+57 300 111 2222",
                            houseType: "HOUSE",
                            address: "Carrera 15 #23-45, Bogotá",
                            hasExperience: true,
                            motivation:
                                "Busco una compañera para mi familia, tenemos experiencia con perros grandes.",
                        },
                        evaluationNotes:
                            "Excelente candidata. Familia responsable con experiencia previa.",
                        homeVisitDate: new Date("2024-01-18"),
                        homeVisitResult: "APPROVED",
                    },
                ],
                medicalEvents: [
                    {
                        id: 1,
                        date: new Date("2024-01-20"),
                        type: "CHECKUP",
                        description: "Revisión general de salud",
                        veterinarian: "Dr. María González",
                        diagnosis: "Excelente estado de salud",
                        treatment:
                            "Continuar con rutina de ejercicio y alimentación",
                        nextAppointment: new Date("2024-04-20"),
                    },
                ],
                multimedia: [
                    {
                        id: 1,
                        type: "IMAGE",
                        url: "/placeholder.svg?height=400&width=600",
                        description: "Luna jugando en el parque",
                        uploadDate: new Date("2024-01-15"),
                    },
                ],
                shelterArrival: {
                    id: 1,
                    arrivalDate: new Date("2023-08-10"),
                    reason: "RETURN",
                    condition: "GOOD",
                    rescuer: "Dueño anterior - Carlos Mendoza",
                    notes: "Devuelta por mudanza internacional. Excelente estado de salud y comportamiento.",
                    initialWeight: 20.5,
                    currentWeight: 22.3,
                },
            },
        };

        return mockPetDetails[petId] || mockPetDetails[1];
    }

    // Obtener detalle de veterinario por ID
    async getVeterinarianDetail(
        veterinarianId: string
    ): Promise<VeterinarianDetailDTO> {
        return this.fetchData<VeterinarianDetailDTO>(
            `/veterinarians/${veterinarianId}`
        );
    }

    // Veterinarian detail with fallback
    async getVeterinarianDetailWithFallback(
        veterinarianId: string
    ): Promise<VeterinarianDetailDTO> {
        // Check for invalid IDs first
        if (
            !veterinarianId ||
            veterinarianId === "0" ||
            isNaN(parseInt(veterinarianId))
        ) {
            throw new Error(`Invalid veterinarian ID: ${veterinarianId}`);
        }

        try {
            return await this.getVeterinarianDetail(veterinarianId);
        } catch (error) {
            console.warn("API no disponible, usando datos mock:", error);
            const mockVet = this.getMockVeterinarianDetail(
                parseInt(veterinarianId)
            );
            if (!mockVet || mockVet.id === 0) {
                throw new Error(
                    `Veterinarian with id ${veterinarianId} not found`
                );
            }
            return mockVet;
        }
    }

    // Mock data for veterinarian detail
    private getMockVeterinarianDetail(
        veterinarianId: number
    ): VeterinarianDetailDTO {
        const mockVeterinarianDetails: {
            [key: number]: VeterinarianDetailDTO;
        } = {
            1: {
                id: 1,
                name: "María González",
                phone: "+57 301 111 2222",
                email: "maria.gonzalez@refugioesperanza.org",
                licenseNumber: "VET-2018-001",
                speciality: "GENERAL",
                disponibilities: ["MORNING", "AFTERNOON"],

                medicalEvents: [
                    {
                        id: 1,
                        date: new Date("2024-01-20"),
                        type: "CHECKUP",
                        description: "Revisión general de salud - Luna",
                        veterinarian: "Dr. María González",
                        diagnosis: "Excelente estado de salud",
                        treatment:
                            "Continuar con rutina de ejercicio y alimentación",
                        nextAppointment: new Date("2024-04-20"),
                    },
                    {
                        id: 2,
                        date: new Date("2024-01-18"),
                        type: "VACCINATION",
                        description: "Refuerzo de vacunas anuales - Max",
                        veterinarian: "Dr. María González",
                        diagnosis: "Vacunación completa",
                        treatment: "Observación por 24 horas post-vacunación",
                    },
                ],

                adoptionApplications: [
                    {
                        id: 1,
                        applicationDate: new Date("2024-01-15"),
                        applicationEnd: new Date("2024-01-20"),
                        observations:
                            "Familia con experiencia previa en perros grandes. Casa con jardín amplio.",
                        applicationStatus: "APPROVED",
                        result: "APPROVED",
                        applicant: {
                            id: 1,
                            name: "María García",
                            email: "maria.garcia@email.com",
                            phone: "+57 300 111 2222",
                            houseType: "HOUSE",
                            address: "Carrera 15 #23-45, Bogotá",
                            hasExperience: true,
                            motivation:
                                "Busco una compañera para mi familia, tenemos experiencia con perros grandes.",
                        },
                        evaluationNotes:
                            "Excelente candidata. Familia responsable con experiencia previa.",
                        homeVisitDate: new Date("2024-01-18"),
                        homeVisitResult: "APPROVED",
                    },
                ],

                followUps: [
                    {
                        id: 1,
                        petName: "Rocky",
                        petId: 4,
                        ownerName: "Carlos Mendoza",
                        adoptionDate: new Date("2023-12-01"),
                        followUpDate: new Date("2024-01-15"),
                        status: "EXCELLENT",
                        notes: "Mascota completamente adaptada, excelente cuidado",
                        nextFollowUp: new Date("2024-04-15"),
                        monthsPostAdoption: 1.5,
                    },
                ],

                adoptionTests: [
                    {
                        id: 1,
                        petName: "Luna",
                        petId: 1,
                        applicantName: "María García",
                        testDate: new Date("2024-01-16"),
                        testType: "BEHAVIORAL",
                        result: "PASSED",
                        score: 85,
                        notes: "Excelente interacción, mascota muy receptiva",
                        recommendations: "Continuar con proceso de adopción",
                    },
                ],

                shelterArrivals: [
                    {
                        id: 1,
                        arrivalDate: new Date("2023-08-10"),
                        reason: "ABANDONMENT",
                        condition: "GOOD",
                        rescuer: "Ciudadano anónimo",
                        notes: "Encontrada en la calle, bien alimentada pero sin collar",
                        initialWeight: 20.5,
                        currentWeight: 22.3,
                    },
                ],
            },
        };

        return (
            mockVeterinarianDetails[veterinarianId] ||
            mockVeterinarianDetails[1]
        );
    }
}

export const apiService = new ApiService();
export default apiService;
