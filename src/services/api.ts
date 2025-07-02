import { Pet, Shelter, SuccessStory, ApiResponse, ShelterDetail, Veterinarian, Event, Arrival, PetDTO, PetDetailDTO, ShelterDTO } from '../types'

const API_BASE_URL = 'http://localhost:8080/api'

class ApiService {
  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ApiResponse<T> = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Error en la respuesta del servidor')
      }
      
      return data.data
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      throw error
    }
  }

  // Obtener todas las mascotas disponibles
  async getPets(): Promise<Pet[]> {
    return this.fetchData<Pet[]>('/pets')
  }

  // Obtener una mascota por ID
  async getPetById(id: number): Promise<Pet> {
    return this.fetchData<Pet>(`/pets/${id}`)
  }

  // Obtener todos los refugios
  async getShelters(): Promise<Shelter[]> {
    return this.fetchData<Shelter[]>('/shelters')
  }

  // Obtener detalle de un refugio por ID
  async getShelterDetailById(id: number): Promise<ShelterDetail> {
    return this.fetchData<ShelterDetail>(`/shelters/${id}/detail`)
  }

  // Obtener mascotas de un refugio específico
  async getPetsByShelter(shelterId: number): Promise<Pet[]> {
    return this.fetchData<Pet[]>(`/shelters/${shelterId}/pets`)
  }

  // Obtener un refugio por ID
  async getShelterById(id: string): Promise<Shelter> {
    return this.fetchData<Shelter>(`/shelters/${id}`)
  }

  // Obtener veterinarios de un refugio específico
  async getVeterinariansByShelter(shelterId: string): Promise<Veterinarian[]> {
    return this.fetchData<Veterinarian[]>(`/shelters/${shelterId}/veterinarians`)
  }

  // Obtener eventos de un refugio específico
  async getEventsByShelter(shelterId: string): Promise<Event[]> {
    return this.fetchData<Event[]>(`/shelters/${shelterId}/events`)
  }

  // Obtener llegadas de un refugio específico
  async getArrivalsByShelter(shelterId: string): Promise<Arrival[]> {
    return this.fetchData<Arrival[]>(`/shelters/${shelterId}/arrivals`)
  }

  // Obtener historias de éxito de un refugio específico
  async getSuccessStoriesByShelter(shelterId: string): Promise<SuccessStory[]> {
    return this.fetchData<SuccessStory[]>(`/shelters/${shelterId}/success-stories`)
  }

  // Obtener historias de éxito
  async getSuccessStories(): Promise<SuccessStory[]> {
    return this.fetchData<SuccessStory[]>('/success-stories')
  }

  // Filtrar mascotas por criterios
  async filterPets(filters: {
    size?: string
    gender?: string
    breed?: string
    shelterId?: number
  }): Promise<Pet[]> {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const queryString = params.toString()
    const endpoint = queryString ? `/pets/filter?${queryString}` : '/pets'
    
    return this.fetchData<Pet[]>(endpoint)
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
        description: "Dedicados al rescate y cuidado de mascotas abandonadas desde hace 15 años. Nuestro compromiso es brindar amor, cuidado médico y encontrar el hogar perfecto para cada mascota.",
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
            behaviorProfile: "Amigable, juguetona y muy cariñosa. Le encanta correr y jugar con otros perros.",
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
            }
          },
          {
            id: 2,
            name: "Rocky",
            birthDate: new Date("2021-11-20"),
            breed: "Pastor Alemán",
            size: "LARGE" as const,
            gender: "MALE" as const,
            behaviorProfile: "Protector, leal y muy inteligente. Ideal para familias con experiencia en perros grandes.",
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
            }
          },
          {
            id: 3,
            name: "Mia",
            birthDate: new Date("2023-01-10"),
            breed: "Mestizo",
            size: "SMALL" as const,
            gender: "FEMALE" as const,
            behaviorProfile: "Pequeña pero valiente, muy inteligente y fácil de entrenar.",
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
            }
          },
        ],

        veterinarians: [
          {
            id: 1,
            name: "Dr. María González",
            email: "maria.gonzalez@refugioesperanza.org",
            phone: "+57 301 111 2222",
            licenseNumber: "VET-2018-001",
            speciality: { name: "Medicina General", description: "Atención médica integral para mascotas" },
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
            speciality: { name: "Cirugía", description: "Especialista en procedimientos quirúrgicos" },
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
            speciality: { name: "Dermatología", description: "Tratamiento de enfermedades de la piel" },
            disponibilities: ["AFTERNOON", "EVENING"],
            yearsExperience: 7,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],

        events: [
          {
            id: 1,
            name: "Jornada de Vacunación Gratuita",
            description: "Vacunación antirrábica y múltiple para mascotas de la comunidad. Nuestro equipo veterinario estará disponible para brindar atención médica preventiva.",
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
            description: "Evento especial para encontrar hogares para nuestras mascotas. Conoce a todos nuestros peludos disponibles y encuentra tu compañero perfecto.",
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
            description: "Educación sobre tenencia responsable de mascotas. Aprende sobre nutrición, cuidados básicos, entrenamiento y bienestar animal.",
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
            description: "Esterilización gratuita para mascotas de bajos recursos. Contribuyendo al control poblacional y la salud de las mascotas de la comunidad.",
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
            description: "Ven a conocer nuestras instalaciones, conoce a nuestro equipo y descubre cómo puedes ayudar. Tours guiados cada hora.",
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
            description: "Jornada de recolección de donaciones para el cuidado de nuestras mascotas. Acepta alimentos, medicinas, juguetes y mantas.",
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
      }
    }

    return shelterData[id as keyof typeof shelterData] || null
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
        behaviorProfile: "Amigable, juguetona y muy cariñosa. Le encanta correr y jugar con otros perros.",
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
        behaviorProfile: "Tranquilo, obediente y perfecto para familias con niños.",
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
        behaviorProfile: "Pequeña pero valiente, muy inteligente y fácil de entrenar.",
        shelter: {
          id: 1,
          name: "Refugio Esperanza",
          address: "Calle 45 #12-34, Bogotá",
          phone: "+57 301 234 5678",
          email: "contacto@refugioesperanza.org",
        },
        image: "/placeholder.svg?height=300&width=400",
      },
    ]
  }

  private getMockShelters(): Shelter[] {
    return [
      {
        id: 1,
        name: "Refugio Esperanza",
        address: "Calle 45 #12-34, Bogotá",
        phone: "+57 301 234 5678",
        email: "contacto@refugioesperanza.org",
        description: "Dedicados al rescate y cuidado de mascotas abandonadas desde hace 15 años. Nuestro compromiso es brindar amor, cuidado médico y encontrar el hogar perfecto para cada mascota.",
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
        description: "Un refugio familiar que brinda amor y cuidado especializado a cada mascota. Contamos con instalaciones modernas y un equipo veterinario altamente calificado.",
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
        description: "Trabajamos incansablemente para encontrar el hogar perfecto para cada mascota. Nos especializamos en rehabilitación y socialización de animales rescatados.",
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
        description: "Más de 20 años dedicados al bienestar animal. Ofrecemos servicios de rescate, rehabilitación y adopción responsable.",
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
        description: "Refugio especializado en casos especiales y mascotas con necesidades médicas. Brindamos cuidado integral y amor incondicional.",
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
        description: "Comprometidos con la protección animal y la educación comunitaria. Trabajamos en programas de esterilización y adopción responsable.",
        petsCount: 38,
        veterinariansCount: 7,
        eventsCount: 11,
        foundedYear: 2011,
        image: "/placeholder.svg?height=300&width=400",
        coverImage: "/placeholder.svg?height=200&width=600",
        status: "ACTIVE",
        capacity: 50,
      },
    ]
  }

  private getMockSuccessStories(): SuccessStory[] {
    return [
      {
        id: 1,
        petName: "Rocky",
        ownerName: "María González",
        story: "Rocky llegó a mi vida cuando más lo necesitaba. Su amor incondicional me ayudó a superar momentos difíciles.",
        image: "/placeholder.svg?height=150&width=150",
        months: 8,
      },
      {
        id: 2,
        petName: "Bella",
        ownerName: "Carlos Rodríguez",
        story: "Bella se adaptó perfectamente a nuestra familia. Los niños la adoran y ella los protege como una verdadera guardiana.",
        image: "/placeholder.svg?height=150&width=150",
        months: 12,
      },
      {
        id: 3,
        petName: "Coco",
        ownerName: "Ana Martínez",
        story: "Adoptar a Coco fue la mejor decisión. Su energía y alegría transformaron completamente nuestro hogar.",
        image: "/placeholder.svg?height=150&width=150",
        months: 6,
      },
    ]
  }

  // Métodos con fallback a datos mock si la API no está disponible
  async getPetsWithFallback(): Promise<Pet[]> {
    try {
      return await this.getPets()
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error)
      return this.getMockPets()
    }
  }

  async getSheltersWithFallback(): Promise<Shelter[]> {
    try {
      return await this.getShelters()
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error)
      return this.getMockShelters()
    }
  }

  async getSuccessStoriesWithFallback(): Promise<SuccessStory[]> {
    try {
      return await this.getSuccessStories()
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error)
      return this.getMockSuccessStories()
    }
  }

  // Fallback methods for new shelter detail methods
  async getShelterByIdWithFallback(id: string): Promise<Shelter> {
    try {
      return await this.getShelterById(id)
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error)
      const shelters = this.getMockShelters()
      const shelter = shelters.find(s => s.id.toString() === id)
      if (!shelter) {
        throw new Error(`Shelter with id ${id} not found`)
      }
      return shelter
    }
  }

  async getPetsByShelterWithFallback(shelterId: string): Promise<Pet[]> {
    try {
      return await this.getPetsByShelter(parseInt(shelterId))
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error)
      const shelterDetail = this.getMockShelterDetail(parseInt(shelterId))
      return shelterDetail?.pets || []
    }
  }

  async getVeterinariansByShelterWithFallback(shelterId: string): Promise<Veterinarian[]> {
    try {
      return await this.getVeterinariansByShelter(shelterId)
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error)
      const shelterDetail = this.getMockShelterDetail(parseInt(shelterId))
      return shelterDetail?.veterinarians || []
    }
  }

  async getEventsByShelterWithFallback(shelterId: string): Promise<Event[]> {
    try {
      return await this.getEventsByShelter(shelterId)
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error)
      const shelterDetail = this.getMockShelterDetail(parseInt(shelterId))
      return shelterDetail?.events || []
    }
  }

  async getArrivalsByShelterWithFallback(shelterId: string): Promise<Arrival[]> {
    try {
      return await this.getArrivalsByShelter(shelterId)
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error)
      const shelterDetail = this.getMockShelterDetail(parseInt(shelterId))
      return shelterDetail?.arrivals || []
    }
  }

  async getSuccessStoriesByShelterWithFallback(shelterId: string): Promise<SuccessStory[]> {
    try {
      return await this.getSuccessStoriesByShelter(shelterId)
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error)
      // Return a subset of success stories for this shelter
      return this.getMockSuccessStories().filter(() => 
        // Mock logic: assume all stories belong to shelter 1 for now
        parseInt(shelterId) === 1
      )
    }
  }

  // Obtener detalle de una mascota por refugio y ID de mascota
  async getPetDetail(shelterId: string, petId: string): Promise<PetDetailDTO> {
    return this.fetchData<PetDetailDTO>(`/shelters/${shelterId}/pets/${petId}`)
  }

  // Obtener mascotas de un refugio específico con detalles completos
  async getPetsByShelterId(shelterId: string): Promise<PetDTO[]> {
    return this.fetchData<PetDTO[]>(`/shelters/${shelterId}/pets`)
  }

  // Pet detail with fallback
  async getPetDetailWithFallback(shelterId: string, petId: string): Promise<PetDetailDTO> {
    try {
      return await this.getPetDetail(shelterId, petId)
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error)
      return this.getMockPetDetail(parseInt(petId))
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
        behaviorProfile: "Amigable, juguetona y muy cariñosa. Le encanta correr y jugar con otros perros. Es perfecta para familias con niños y se adapta bien a diferentes ambientes.",
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
            observations: "Familia con experiencia previa en perros grandes. Casa con jardín amplio.",
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
              motivation: "Busco una compañera para mi familia, tenemos experiencia con perros grandes.",
            },
            evaluationNotes: "Excelente candidata. Familia responsable con experiencia previa.",
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
            treatment: "Continuar con rutina de ejercicio y alimentación",
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
    }
    
    return mockPetDetails[petId] || mockPetDetails[1]
  }
}

export const apiService = new ApiService()
export default apiService
