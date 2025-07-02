'use client'

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Phone, Mail, Calendar, Heart, Users, PawPrint, 
  Shield, FileText, Stethoscope, UserCheck, Award, Camera, AlertCircle,
  Clock, CheckCircle, XCircle, Bug, Home, Syringe, AlertTriangle,
  Activity
} from 'lucide-react'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'
import { Badge } from '../../../src/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../src/components/ui/tabs'
import NotFoundPage from '../../components/NotFoundPage'
import api from '../../../src/services/api'
import type { PetDetailDTO, ShelterDTO } from '../../../src/types'

export default function PetDetailPage() {
  const { shelterId, petId } = useParams<{ shelterId: string; petId: string }>()
  const navigate = useNavigate()
  const [pet, setPet] = useState<PetDetailDTO | null>(null)
  const [shelter, setShelter] = useState<ShelterDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('info')
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const loadPetData = async () => {
      if (!shelterId || !petId || shelterId === '0' || petId === '0') {
        setError('invalid-id')
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        const petData = await api.getPetDetailWithFallback(shelterId, petId)
        
        if (!petData || petData.id === 0) {
          setError('not-found')
          return
        }
        
        setPet(petData)
        setShelter(petData.shelter)
      } catch (error) {
        console.error('Error loading pet data:', error)
        setError('server-error')
      } finally {
        setLoading(false)
      }
    }

    loadPetData()
  }, [shelterId, petId])

  // Helper functions
  const calculateAge = (birthDate: Date): string => {
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (age === 0 || (age === 1 && monthDiff < 0)) {
      const months = monthDiff < 0 ? 12 + monthDiff : monthDiff
      return `${months} meses`
    }

    return `${age} años`
  }

  const getSizeLabel = (size: string): string => {
    const sizeMap: { [key: string]: string } = {
      SMALL: "Pequeño",
      MEDIUM: "Mediano",
      LARGE: "Grande",
    }
    return sizeMap[size] || size
  }

  const getGenderLabel = (gender: string): string => {
    return gender === "MALE" ? "Macho" : "Hembra"
  }

  const getApplicationStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pendiente", color: "bg-yellow-600", icon: Clock },
      APPROVED: { label: "Aprobada", color: "bg-green-600", icon: CheckCircle },
      REJECTED: { label: "Rechazada", color: "bg-red-600", icon: XCircle },
      CANCELED: { label: "Cancelada", color: "bg-gray-600", icon: AlertCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getVaccineStatusBadge = (status: string) => {
    const statusConfig = {
      CURRENT: { label: "Al día", color: "bg-green-600", icon: CheckCircle },
      DUE_SOON: { label: "Próxima", color: "bg-yellow-600", icon: Clock },
      OVERDUE: { label: "Vencida", color: "bg-red-600", icon: AlertTriangle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.CURRENT
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getDewormingTypeBadge = (type: string) => {
    const isInternal = type === "INTERNAL"
    return (
      <Badge className={isInternal ? "bg-blue-600 text-white" : "bg-purple-600 text-white"}>
        <Bug className="h-3 w-3 mr-1" />
        {isInternal ? "Interna" : "Externa"}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de la mascota...</p>
        </div>
      </div>
    )
  }

  if (error === 'invalid-id') {
    return (
      <NotFoundPage
        title="ID Inválido"
        description="Los IDs del refugio o mascota proporcionados no son válidos. Por favor, verifica la URL e intenta nuevamente."
        backLink="/shelter"
        backText="Ver todos los refugios"
        gradient="from-orange-50 to-amber-50"
      />
    )
  }

  if (error === 'not-found' || !pet || !shelter) {
    return (
      <NotFoundPage
        title="Mascota no encontrada"
        description="La mascota que buscas no existe, ha sido adoptada o fue removida del sistema. Te sugerimos explorar otras mascotas disponibles."
        backLink="/shelter"
        backText="Ver todos los refugios"
        gradient="from-orange-50 to-amber-50"
      />
    )
  }

  if (error === 'server-error') {
    return (
      <NotFoundPage
        title="Error del servidor"
        description="Ocurrió un problema al cargar la información de la mascota. Por favor, intenta nuevamente más tarde."
        backLink="/shelter"
        backText="Ver todos los refugios"
        gradient="from-red-50 to-red-100"
      />
    )
  }

  const handleAdoptionClick = () => {
    // Navigate to adoption application or show registration prompt
    navigate(`/shelter/${shelterId}/pet/${petId}/adopt`)
  }

  const images = pet.multimedia?.filter(m => m.type === 'IMAGE').map(m => m.url) || [
    '/placeholder-pet.jpg',
    '/placeholder-pet.jpg',
    '/placeholder-pet.jpg'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/shelter/${shelterId}`)}
                className="text-orange-700 hover:text-orange-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Refugio
              </Button>
              <div className="h-6 w-px bg-orange-200"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <PawPrint className="h-6 w-6 text-orange-600" />
                </div>
                <h1 className="text-2xl font-bold text-orange-800">Aves de Hermes</h1>
              </div>
            </div>
            <Button
              onClick={handleAdoptionClick}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Heart className="mr-2 h-4 w-4" />
              Adoptar a {pet.name}
            </Button>
          </div>
        </div>
      </header>

      {/* Pet Images Gallery */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                <img
                  src={images[selectedImage] || '/placeholder-pet.jpg'}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-green-600 text-white shadow-lg">
                  <Heart className="h-3 w-3 mr-1" />
                  Disponible
                </Badge>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-orange-500" : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <img
                      src={image || '/placeholder-pet.jpg'}
                      alt={`${pet.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Pet Basic Info */}
            <div className="space-y-6">
              <Card className="border-orange-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <CardTitle className="text-2xl text-orange-800">{pet.name}</CardTitle>
                  <CardDescription className="text-orange-600 text-lg">
                    {pet.breed} • {getSizeLabel(pet.size)} • {getGenderLabel(pet.gender)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                      <span className="font-medium">Edad:</span>
                      <span className="ml-2">{calculateAge(pet.birthDate)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Shield className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium">Vacunado</span>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Personalidad</h4>
                    <p className="text-orange-700 text-sm">{pet.behaviorProfile}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-orange-800 mb-3">Refugio</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                        {shelter.address}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-orange-600" />
                        {shelter.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-orange-600" />
                        {shelter.email}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 max-w-4xl mx-auto mb-8 bg-orange-100/80 backdrop-blur-sm shadow-lg">
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-300 flex items-center text-sm"
              >
                <FileText className="h-4 w-4 mr-1" />
                Info
              </TabsTrigger>
              <TabsTrigger
                value="vaccines"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-300 flex items-center text-sm"
              >
                <Syringe className="h-4 w-4 mr-1" />
                Vacunas
              </TabsTrigger>
              <TabsTrigger
                value="medical"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-300 flex items-center text-sm"
              >
                <Stethoscope className="h-4 w-4 mr-1" />
                Médico
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-300 flex items-center text-sm"
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Solicitudes
              </TabsTrigger>
              <TabsTrigger
                value="adoptions"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-300 flex items-center text-sm"
              >
                <Award className="h-4 w-4 mr-1" />
                Adopciones
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-300 flex items-center text-sm"
              >
                <Camera className="h-4 w-4 mr-1" />
                Fotos
              </TabsTrigger>
            </TabsList>

            {/* General Info Tab */}
            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-800 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Resumen de Salud
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pet.vaccineCard && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-green-800">Estado de Vacunación</h5>
                          <Badge className="bg-green-600 text-white">Completa</Badge>
                        </div>
                        <p className="text-sm text-green-600">
                          Última vacuna: {pet.vaccineCard.lastVaccineDate.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-green-600">Veterinario: {pet.vaccineCard.veterinarian}</p>
                      </div>
                    )}

                    {pet.vaccineCard && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-blue-800">Desparasitación</h5>
                          <Badge className="bg-blue-600 text-white">Al día</Badge>
                        </div>
                        <p className="text-sm text-blue-600">
                          Última desparasitación: {pet.vaccineCard.lastDewormingDate.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {pet.shelterArrival && (
                  <Card className="border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-orange-800 flex items-center">
                        <Home className="h-5 w-5 mr-2" />
                        Llegada al Refugio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium">Fecha:</span>
                          <p className="text-sm text-gray-600">{pet.shelterArrival.arrivalDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Motivo:</span>
                          <p className="text-sm text-gray-600">{pet.shelterArrival.reason}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Condición:</span>
                          <p className="text-sm text-gray-600">{pet.shelterArrival.condition}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Rescatista:</span>
                          <p className="text-sm text-gray-600">{pet.shelterArrival.rescuer}</p>
                        </div>
                      </div>

                      {pet.shelterArrival.notes && (
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <h4 className="font-medium text-orange-800 mb-2">Notas del rescate</h4>
                          <p className="text-sm text-orange-700">{pet.shelterArrival.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Vaccines Tab */}
            <TabsContent value="vaccines" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-orange-800 mb-2">Carnet de Vacunación</h3>
                <p className="text-orange-700">Historial completo de vacunas y desparasitaciones de {pet.name}</p>
              </div>

              {pet.vaccineCard ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Vaccines Section */}
                  <Card className="border-green-200">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardTitle className="text-green-800 flex items-center">
                        <Syringe className="h-5 w-5 mr-2" />
                        Vacunas
                      </CardTitle>
                      <CardDescription className="text-green-600">Registro de vacunación completo</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {pet.vaccineCard.vaccines.map((vaccine) => (
                        <div key={vaccine.id} className="border border-green-200 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-green-800">{vaccine.name}</h4>
                            {getVaccineStatusBadge(vaccine.status)}
                          </div>
                          <div className="space-y-1 text-sm text-green-700">
                            <p><strong>Marca:</strong> {vaccine.brandName}</p>
                            <p><strong>Fecha:</strong> {vaccine.date.toLocaleDateString()}</p>
                            <p><strong>Próxima:</strong> {vaccine.nextDate.toLocaleDateString()}</p>
                            <p><strong>Dosis:</strong> {vaccine.dosis} ml</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Dewormings Section */}
                  <Card className="border-purple-200">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
                      <CardTitle className="text-purple-800 flex items-center">
                        <Bug className="h-5 w-5 mr-2" />
                        Desparasitaciones
                      </CardTitle>
                      <CardDescription className="text-purple-600">Tratamientos internos y externos</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {pet.vaccineCard.dewormings.map((deworming) => (
                        <div key={deworming.id} className="border border-purple-200 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-purple-800">{deworming.brandName}</h4>
                            <div className="flex gap-2">
                              {getDewormingTypeBadge(deworming.type)}
                              {getVaccineStatusBadge(deworming.status)}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-purple-700">
                            <p><strong>Fecha:</strong> {deworming.date.toLocaleDateString()}</p>
                            <p><strong>Próxima:</strong> {deworming.nextDate.toLocaleDateString()}</p>
                            <p><strong>Veterinario:</strong> {deworming.veterinarian}</p>
                            {deworming.notes && <p><strong>Notas:</strong> {deworming.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Syringe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay información de vacunas disponible.</p>
                </div>
              )}
            </TabsContent>

            {/* Medical History Tab */}
            <TabsContent value="medical" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-orange-800 mb-2">Historial Médico</h3>
                <p className="text-orange-700">Registro completo de eventos médicos y tratamientos</p>
              </div>

              <div className="space-y-4">
                {pet.medicalEvents.map((event) => (
                  <Card key={event.id} className="border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-orange-800">{event.description}</h3>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm"><strong>Fecha:</strong> {event.date.toLocaleDateString()}</p>
                          <p className="text-sm"><strong>Veterinario:</strong> {event.veterinarian}</p>
                        </div>
                        <div>
                          {event.diagnosis && <p className="text-sm"><strong>Diagnóstico:</strong> {event.diagnosis}</p>}
                          {event.treatment && <p className="text-sm"><strong>Tratamiento:</strong> {event.treatment}</p>}
                        </div>
                      </div>

                      {event.nextAppointment && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Próxima cita:</strong> {event.nextAppointment.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {pet.medicalEvents.length === 0 && (
                <div className="text-center py-8">
                  <Stethoscope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay eventos médicos registrados.</p>
                </div>
              )}
            </TabsContent>

            {/* Adoption Applications Tab */}
            <TabsContent value="applications" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-orange-800 mb-2">Solicitudes de Adopción</h3>
                <p className="text-orange-700">Personas interesadas en adoptar a {pet.name}</p>
              </div>

              <div className="space-y-4">
                {pet.adoptionApplications.map((application) => (
                  <Card key={application.id} className="border-orange-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-orange-800">{application.applicant.name}</h3>
                          <p className="text-sm text-gray-600">{application.applicant.email}</p>
                        </div>
                        {getApplicationStatusBadge(application.applicationStatus)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm"><strong>Fecha de solicitud:</strong> {application.applicationDate.toLocaleDateString()}</p>
                          <p className="text-sm"><strong>Teléfono:</strong> {application.applicant.phone}</p>
                          <p className="text-sm"><strong>Tipo de vivienda:</strong> {application.applicant.houseType}</p>
                        </div>
                        <div>
                          <p className="text-sm"><strong>Experiencia:</strong> {application.applicant.hasExperience ? 'Sí' : 'No'}</p>
                          {application.homeVisitDate && (
                            <p className="text-sm"><strong>Visita domiciliaria:</strong> {application.homeVisitDate.toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-1">Motivación</h4>
                          <p className="text-sm text-gray-600">{application.applicant.motivation}</p>
                        </div>
                        {application.evaluationNotes && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-1">Evaluación</h4>
                            <p className="text-sm text-blue-600">{application.evaluationNotes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {pet.adoptionApplications.length === 0 && (
                <div className="text-center py-8">
                  <UserCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay solicitudes de adopción aún.</p>
                </div>
              )}
            </TabsContent>

            {/* Adoptions History Tab */}
            <TabsContent value="adoptions" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-orange-800 mb-2">Historial de Adopciones</h3>
                <p className="text-orange-700">Registro completo de adopciones de {pet.name}</p>
              </div>

              {pet.adoption ? (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Adopción Actual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Adoptante:</strong> {pet.adoption.owner.name}</p>
                      <p><strong>Fecha:</strong> {pet.adoption.adoptionDate.toLocaleDateString()}</p>
                      <p><strong>Estado:</strong> {pet.adoption.adoptionStatus}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800 flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Estado Actual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">Disponible para adopción</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-orange-800 mb-2">Galería de {pet.name}</h3>
                <p className="text-orange-700">Fotos y videos de nuestra querida mascota</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pet.multimedia.map((media) => (
                  <Card key={media.id} className="border-orange-200 overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={media.url || '/placeholder-pet.jpg'}
                        alt={media.description}
                        className="w-full h-full object-cover"
                      />
                      {media.type === "VIDEO" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Activity className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-orange-800 mb-1">{media.description}</h4>
                      <p className="text-sm text-gray-600">{media.uploadDate.toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {pet.multimedia.length === 0 && (
                <div className="text-center py-8">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay multimedia disponible.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-6">¿Te enamoraste de {pet.name}?</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
            {pet.name} está esperando por ti. Inicia el proceso de adopción y dale el hogar que se merece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleAdoptionClick}
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Heart className="mr-2 h-5 w-5" />
              Adoptar a {pet.name}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-transparent"
              asChild
            >
              <Link to={`/shelter/${shelterId}`}>
                <Users className="mr-2 h-5 w-5" />
                Ver Más Mascotas
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <PawPrint className="h-6 w-6" />
                <h4 className="text-xl font-bold">Aves de Hermes</h4>
              </div>
              <p className="text-orange-200">Conectando corazones, creando familias.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Adopción</h5>
              <ul className="space-y-2 text-orange-200">
                <li>
                  <Link to="/" className="hover:text-white">
                    Mascotas Disponibles
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Proceso de Adopción
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Requisitos
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Refugios</h5>
              <ul className="space-y-2 text-orange-200">
                <li>
                  <Link to="/shelter" className="hover:text-white">
                    Refugios Aliados
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Ser Refugio Aliado
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Donaciones
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contacto</h5>
              <ul className="space-y-2 text-orange-200">
                <li>info@avesdehermes.com</li>
                <li>+57 300 123 4567</li>
                <li>Bogotá, Colombia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-orange-800 mt-8 pt-8 text-center text-orange-200">
            <p>&copy; 2024 Aves de Hermes. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
