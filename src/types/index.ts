// Tipos basados en los DTOs del backend
export interface Pet {
    id: number;
    name: string;
    birthDate: Date;
    breed: string;
    size: "SMALL" | "MEDIUM" | "LARGE";
    gender: "MALE" | "FEMALE";
    behaviorProfile: string;
    shelter?: Shelter;
    image: string;
    vaccinated?: boolean;
    sterilized?: boolean;
    arrivalDate?: Date;
    // Additional properties for UI
    age?: number;
    status?: string;
    description?: string;
    weight?: number;
    isVaccinated?: boolean;
}

export interface Shelter {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    shelterEvents?: Event[];
    pets?: Pet[];
    shelterArrivals?: Arrival[];
    // Additional UI properties
    description?: string;
    petsCount?: number;
    veterinariansCount?: number;
    eventsCount?: number;
    foundedYear?: number;
    image?: string;
    coverImage?: string;
    status?: "ACTIVE" | "INACTIVE";
    capacity?: number;
    currentOccupancy?: number;
}

export interface Veterinarian {
    id: number;
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    speciality: {
        name: string;
        description: string;
    };
    disponibilities: string[];
    yearsExperience: number;
    image?: string;
    // Additional properties for UI
    specialty?: string;
    experience?: number;
}

export interface Event {
    id: number;
    name: string;
    description: string;
    date: Date;
    status?: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    shelter: {
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
    };
    // Additional properties for UI
    title?: string;
    time?: string;
    type?: string;
    location?: string;
}

export interface Arrival {
    id: number;
    petName: string;
    arrivalDate: Date;
    reason: "ABANDONMENT" | "SURRENDER" | "RESCUE";
    condition: "GOOD" | "FAIR" | "POOR";
    rescuer: string;
    notes?: string;
    // Additional properties for UI
    petImage?: string;
    rescuerName?: string;
    story?: string;
}

export interface ShelterDetail extends Shelter {
    pets: Pet[];
    veterinarians: Veterinarian[];
    events: Event[];
    arrivals: Arrival[];
}

// Pet DTOs based on backend structure
export interface PetDTO {
    id: number;
    name: string;
    birthDate: Date;
    breed: string;
    size: "SMALL" | "MEDIUM" | "LARGE";
    gender: "MALE" | "FEMALE";
    behaviorProfile: string;
    shelter: ShelterDTO;
    vaccineCard?: VaccineCardDTO;
}

export interface PetDetailDTO extends PetDTO {
    owners: OwnerDTO[];
    adoptionApplications: AdoptionApplicationDTO[];
    medicalEvents: MedicalEventDTO[];
    multimedia: MultimediaDTO[];
    adoption?: AdoptionDTO;
    shelterArrival?: ShelterArrivalDTO;
}

// Additional DTOs for Pet Detail
export interface OwnerDTO extends PersonDTO {
    houseType: HouseTypeEnum;
    address: string;
}

export interface OwnerDetailDTO extends OwnerDTO {
    adoptions: AdoptionDTO[];
    adoptionTests: AdoptionTestDTO[];
    adoptionApplications: AdoptionApplicationDTO[];
    pets: PetDTO[];
}

export interface AdoptionApplicationDTO {
    id: number;
    applicationDate: Date;
    applicationEnd?: Date;
    observations: string;
    applicationStatus: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";
    result?: "APPROVED" | "REJECTED";
    applicant: ApplicantDTO;
    veterinarian?: Veterinarian;
    evaluationNotes?: string;
    homeVisitDate?: Date;
    homeVisitResult?: "APPROVED" | "REJECTED";
}

export interface ApplicantDTO {
    id: number;
    name: string;
    email: string;
    phone: string;
    houseType: "HOUSE" | "APARTMENT";
    address: string;
    hasExperience: boolean;
    motivation: string;
}

export interface MedicalEventDTO {
    id: number;
    date: Date;
    type: "CHECKUP" | "VACCINATION" | "SURGERY" | "TREATMENT";
    description: string;
    veterinarian: string;
    diagnosis?: string;
    treatment?: string;
    nextAppointment?: Date;
}

export interface MultimediaDTO {
    id: number;
    type: "IMAGE" | "VIDEO";
    url: string;
    description: string;
    uploadDate: Date;
}

export interface AdoptionDTO {
    id: number;
    adoptionDate: Date;
    adoptionEnd?: Date;
    observations: string;
    adoptionStatus: "DONE" | "RETURN" | "DECEASED" | "CANCELED" | "PENDING";
    owner: OwnerDTO;
    veterinarian?: Veterinarian;
    returnReason?: string;
}

export interface ShelterArrivalDTO {
    id: number;
    arrivalDate: Date;
    reason: "ABANDONMENT" | "SURRENDER" | "RESCUE" | "RETURN";
    condition: "GOOD" | "FAIR" | "POOR";
    rescuer: string;
    notes?: string;
    initialWeight?: number;
    currentWeight?: number;
}

export interface VaccineCardDTO {
    id: number;
    issuedDate: Date;
    lastVaccineDate: Date;
    lastDewormingDate: Date;
    veterinarian: string;
    vaccines: VaccineDTO[];
    dewormings: DewormingDTO[];
}

export interface VaccineDTO {
    id: number;
    name: string;
    brandName: string;
    date: Date;
    nextDate: Date;
    dosis: number;
    status: "CURRENT" | "DUE_SOON" | "OVERDUE";
}

export interface DewormingDTO {
    id: number;
    brandName: string;
    date: Date;
    nextDate: Date;
    dosis: number;
    type: "INTERNAL" | "EXTERNAL";
    veterinarian: string;
    status: "CURRENT" | "DUE_SOON" | "OVERDUE";
    notes?: string;
}

// Updated Shelter DTOs
export interface ShelterDTO {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
}

export interface ShelterDetailDTO extends ShelterDTO {
    shelterEvents: ShelterEventDTO[];
    pets: PetDTO[];
    shelterArrivals: ShelterArrivalDTO[];
    description?: string;
    foundedYear?: number;
    capacity?: number;
    currentOccupancy?: number;
    image?: string;
    coverImage?: string;
    status?: "ACTIVE" | "INACTIVE";
}

export interface ShelterEventDTO {
    id: number;
    name: string;
    description: string;
    date: Date;
    status?: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    shelter: ShelterDTO;
}

// Veterinarian DTOs based on backend structure
export interface SpecialityEnum {
    GENERAL: "Medicina General";
    SURGERY: "Cirugía";
    DERMATOLOGY: "Dermatología";
    OPHTHALMOLOGY: "Oftalmología";
    CARDIOLOGY: "Cardiología";
    NEUROLOGY: "Neurología";
    ONCOLOGY: "Oncología";
    INTERNAL_MEDICINE: "Medicina Interna";
    INFECTOLOGY: "Infectología";
    ORTHOPEDICS: "Ortopedia";
    REPRODUCTION: "Reproducción";
    NUTRITION: "Nutrición";
    BEHAVIOR: "Comportamiento";
    PHYSIOTHERAPY: "Fisioterapia";
}

export type Speciality = keyof SpecialityEnum;

export interface VeterinarianDTO extends PersonDTO {
    id: number;
    licenseNumber: string;
    speciality: Speciality;
    disponibilities: DisponibilityEnum[];
}

export interface VeterinarianDetailDTO extends VeterinarianDTO {
    medicalEvents: MedicalEventDTO[];
    adoptionApplications: AdoptionApplicationDTO[];
    followUps: AdoptionFollowUpDTO[];
    adoptionTests: AdoptionTestDTO[];
    shelterArrivals: ShelterArrivalDTO[];
}

// Additional DTOs for Veterinarian Detail
export interface AdoptionFollowUpDTO {
    id: number;
    petName: string;
    petId: number;
    ownerName: string;
    adoptionDate: Date;
    followUpDate: Date;
    status: "EXCELLENT" | "GOOD" | "POOR" | "CRITICAL";
    notes: string;
    nextFollowUp: Date;
    monthsPostAdoption: number;
}

export interface AdoptionTestDTO {
    id: number;
    petName: string;
    petId: number;
    applicantName: string;
    testDate: Date;
    testType: "BEHAVIORAL" | "COMPATIBILITY" | "MEDICAL" | "HOME_VISIT";
    result: "PASSED" | "FAILED" | "PENDING";
    score: number;
    notes: string;
    recommendations: string;
}

// Enums
export type DisponibilityEnum =
    | "MORNING"
    | "AFTERNOON"
    | "EVENING"
    | "FULL_TIME";

// House Type Enum for OwnerDTO
export type HouseTypeEnum = "APARTMENT" | "HOUSE" | "FARM" | "TOWNHOUSE";

// Base Person DTO
export interface PersonDTO {
    id: number;
    name: string;
    email: string;
    phone: string;
    documentType?: string;
    documentNumber?: string;
    birthDate?: string;
}
