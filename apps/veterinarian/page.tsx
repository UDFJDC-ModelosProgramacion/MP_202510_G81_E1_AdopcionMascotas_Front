'use client'

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/components/ui/tabs'
import { Badge } from '../../src/components/ui/badge'
import NotFoundPage from '../components/NotFoundPage'
import { 
  ArrowLeft, Stethoscope, Calendar, Clock, Phone, Mail, FileText, Heart, 
  PawPrint, Activity, CheckCircle, AlertCircle, Star, Award, MapPin, 
  ClipboardList, TrendingUp, User
} from 'lucide-react'
import api from '../../src/services/api'
import type { VeterinarianDetailDTO } from '../../src/types'

const specialityLabels = {
  GENERAL: "Medicina General",
  SURGERY: "Cirugía",
  DERMATOLOGY: "Dermatología",
  OPHTHALMOLOGY: "Oftalmología",
  CARDIOLOGY: "Cardiología",
  NEUROLOGY: "Neurología",
  ONCOLOGY: "Oncología",
  INTERNAL_MEDICINE: "Medicina Interna",
  INFECTOLOGY: "Infectología",
  ORTHOPEDICS: "Ortopedia",
  REPRODUCTION: "Reproducción",
  NUTRITION: "Nutrición",
  BEHAVIOR: "Comportamiento",
  PHYSIOTHERAPY: "Fisioterapia",
}

const disponibilityLabels = {
  MORNING: "Mañana",
  AFTERNOON: "Tarde",
  EVENING: "Noche",
  FULL_TIME: "Tiempo Completo",
}

const getStatusBadge = (status: string, type: string) => {
  switch (type) {
    case "medical":
      return (
        <Badge
          className={
            status === "COMPLETED"
              ? "bg-green-600 text-white"
              : status === "IN_PROGRESS"
                ? "bg-yellow-600 text-white"
                : "bg-red-600 text-white"
          }
        >
          {status === "COMPLETED" ? "Completado" : status === "IN_PROGRESS" ? "En Progreso" : "Pendiente"}
        </Badge>
      )
    case "adoption":
      return (
        <Badge
          className={
            status === "APPROVED"
              ? "bg-green-600 text-white"
              : status === "REJECTED"
                ? "bg-red-600 text-white"
                : "bg-yellow-600 text-white"
          }
        >
          {status === "APPROVED" ? "Aprobada" : status === "REJECTED" ? "Rechazada" : "Pendiente"}
        </Badge>
      )
    case "followup":
      return (
        <Badge
          className={
            status === "EXCELLENT"
              ? "bg-green-600 text-white"
              : status === "GOOD"
                ? "bg-yellow-600 text-white"
                : "bg-red-600 text-white"
          }
        >
          {status === "EXCELLENT" ? "Excelente" : status === "GOOD" ? "Regular" : "Crítico"}
        </Badge>
      )
    case "test":
      return (
        <Badge className={status === "PASSED" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
          {status === "PASSED" ? "Aprobado" : "Rechazado"}
        </Badge>
      )
    default:
      return null
  }
}

export default function VeterinarianDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vet, setVet] = useState<VeterinarianDetailDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const loadVeterinarianData = async () => {
      if (!id || id === '0') {
        setError('invalid-id')
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        const vetData = await api.getVeterinarianDetailWithFallback(id)
        
        if (!vetData || vetData.id === 0) {
          setError('not-found')
          return
        }
        
        setVet(vetData)
      } catch (error) {
        console.error('Error loading veterinarian data:', error)
        setError('server-error')
      } finally {
        setLoading(false)
      }
    }

    loadVeterinarianData()
  }, [id])

  // Helper function to get full name
  const getFullName = (vet: VeterinarianDetailDTO) => {
    return vet.name // Updated to use the name field from PersonDTO
  }

  // Helper function to calculate statistics
  const getStats = (vet: VeterinarianDetailDTO) => {
    return {
      totalMedicalEvents: vet.medicalEvents.length,
      totalAdoptions: vet.adoptionApplications.filter(app => app.applicationStatus === 'APPROVED').length,
      totalFollowUps: vet.followUps.length,
      totalArrivals: vet.shelterArrivals.length,
      successRate: vet.adoptionTests.length > 0 
        ? Math.round((vet.adoptionTests.filter(test => test.result === 'PASSED').length / vet.adoptionTests.length) * 100)
        : 100,
      averageScore: vet.adoptionTests.length > 0
        ? Math.round(vet.adoptionTests.reduce((sum, test) => sum + test.score, 0) / vet.adoptionTests.length)
        : 0,
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del veterinario...</p>
        </div>
      </div>
    )
  }

  if (error === 'invalid-id') {
    return (
      <NotFoundPage
        title="ID Inválido"
        description="El ID del veterinario proporcionado no es válido. Por favor, verifica la URL e intenta nuevamente."
        backLink="/shelter"
        backText="Ver todos los refugios"
        gradient="from-orange-50 to-amber-50"
      />
    )
  }

  if (error === 'not-found' || !vet) {
    return (
      <NotFoundPage
        title="Veterinario no encontrado"
        description="El veterinario que buscas no existe o ha sido removido del sistema. Te sugerimos explorar otros profesionales disponibles."
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
        description="Ocurrió un problema al cargar la información del veterinario. Por favor, intenta nuevamente más tarde."
        backLink="/shelter"
        backText="Ver todos los refugios"
        gradient="from-red-50 to-red-100"
      />
    )
  }

  const stats = getStats(vet)

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
                onClick={() => navigate(-1)}
                className="text-orange-700 hover:text-orange-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
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
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.open(`mailto:${vet.email}`, '_blank')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contactar
            </Button>
          </div>
        </div>
      </header>

      {/* Veterinarian Profile Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="border-orange-200 shadow-xl sticky top-24">
                <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="mx-auto mb-4 relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20"></div>
                    <div className="w-32 h-32 rounded-full mx-auto bg-blue-100 flex items-center justify-center relative z-10 border-4 border-white shadow-lg">
                      <User className="h-16 w-16 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-blue-800">Dr. {getFullName(vet)}</CardTitle>
                  <CardDescription className="text-blue-600 text-lg">
                    {specialityLabels[vet.speciality as keyof typeof specialityLabels] || vet.speciality}
                  </CardDescription>
                  <div className="flex justify-center mt-2">
                    <Badge className="bg-blue-600 text-white">
                      <Stethoscope className="h-3 w-3 mr-1" />
                      Licencia: {vet.licenseNumber}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-3 text-blue-600" />
                      <span>{vet.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-3 text-blue-600" />
                      <span>{vet.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-blue-600" />
                      <span>Información no disponible</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-blue-800 mb-3">Disponibilidad</h4>
                    <div className="flex flex-wrap gap-2">
                      {vet.disponibilities.map((disp, index) => (
                        <Badge key={index} variant="outline" className="border-blue-600 text-blue-600">
                          <Clock className="h-3 w-3 mr-1" />
                          {disponibilityLabels[disp]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-blue-800 mb-3">Estadísticas</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center bg-green-50 p-2 rounded">
                        <div className="text-lg font-bold text-green-600">{stats.totalAdoptions}</div>
                        <div className="text-xs text-green-700">Adopciones</div>
                      </div>
                      <div className="text-center bg-blue-50 p-2 rounded">
                        <div className="text-lg font-bold text-blue-600">{stats.totalMedicalEvents}</div>
                        <div className="text-xs text-blue-700">Consultas</div>
                      </div>
                      <div className="text-center bg-purple-50 p-2 rounded">
                        <div className="text-lg font-bold text-purple-600">{stats.successRate}%</div>
                        <div className="text-xs text-purple-700">Éxito</div>
                      </div>
                      <div className="text-center bg-orange-50 p-2 rounded">
                        <div className="text-lg font-bold text-orange-600">{stats.averageScore}</div>
                        <div className="text-xs text-orange-700">Puntuación</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-8 bg-blue-100/80 backdrop-blur-sm shadow-lg">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 text-xs"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    Resumen
                  </TabsTrigger>
                  <TabsTrigger
                    value="medical"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 text-xs"
                  >
                    <Stethoscope className="h-3 w-3 mr-1" />
                    Médico
                  </TabsTrigger>
                  <TabsTrigger
                    value="applications"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 text-xs"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Solicitudes
                  </TabsTrigger>
                  <TabsTrigger
                    value="followups"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 text-xs"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Seguimientos
                  </TabsTrigger>
                  <TabsTrigger
                    value="tests"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 text-xs"
                  >
                    <ClipboardList className="h-3 w-3 mr-1" />
                    Tests
                  </TabsTrigger>
                  <TabsTrigger
                    value="arrivals"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 text-xs"
                  >
                    <PawPrint className="h-3 w-3 mr-1" />
                    Llegadas
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-blue-800 flex items-center">
                          <Activity className="h-5 w-5 mr-2" />
                          Actividad Reciente
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {vet.medicalEvents.slice(0, 3).map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                              <p className="font-medium text-blue-800">{event.description}</p>
                              <p className="text-sm text-blue-600">{event.type}</p>
                              <p className="text-xs text-gray-500">{event.date.toLocaleDateString()}</p>
                            </div>
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completado
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardHeader>
                        <CardTitle className="text-green-800 flex items-center">
                          <Heart className="h-5 w-5 mr-2" />
                          Adopciones Aprobadas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {vet.adoptionApplications
                          .filter(app => app.applicationStatus === 'APPROVED')
                          .slice(0, 3)
                          .map((application) => (
                            <div key={application.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div>
                                <p className="font-medium text-green-800">{application.applicant.name}</p>
                                <p className="text-sm text-green-600">Aplicación #{application.id}</p>
                                <p className="text-xs text-gray-500">{application.applicationDate.toLocaleDateString()}</p>
                              </div>
                              <Badge className="bg-green-600 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Aprobada
                              </Badge>
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-purple-800 flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Rendimiento General
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Stethoscope className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">{stats.totalMedicalEvents}</div>
                          <div className="text-sm text-blue-700">Eventos Médicos</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600">{stats.totalAdoptions}</div>
                          <div className="text-sm text-green-700">Adopciones</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-600">{stats.totalFollowUps}</div>
                          <div className="text-sm text-purple-700">Seguimientos</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <PawPrint className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-orange-600">{stats.totalArrivals}</div>
                          <div className="text-sm text-orange-700">Llegadas</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Medical Events Tab */}
                <TabsContent value="medical" className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">Eventos Médicos</h3>
                    <p className="text-blue-700">Historial completo de consultas y procedimientos realizados</p>
                  </div>

                  <div className="space-y-4">
                    {vet.medicalEvents.map((event) => (
                      <Card key={event.id} className="border-blue-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-blue-800">{event.description}</h4>
                              <p className="text-blue-600">Tipo: {event.type}</p>
                              <p className="text-gray-600">{event.date.toLocaleDateString()}</p>
                            </div>
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completado
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {event.diagnosis && (
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">Diagnóstico</h5>
                                <p className="text-gray-600 text-sm">{event.diagnosis}</p>
                              </div>
                            )}
                            {event.treatment && (
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">Tratamiento</h5>
                                <p className="text-gray-600 text-sm">{event.treatment}</p>
                              </div>
                            )}
                          </div>

                          {event.nextAppointment && (
                            <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                              <div className="flex items-center text-blue-700">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span className="font-medium">
                                  Próxima cita: {event.nextAppointment.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {vet.medicalEvents.length === 0 && (
                      <div className="text-center py-8">
                        <Stethoscope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No hay eventos médicos registrados.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Adoption Applications Tab */}
                <TabsContent value="applications" className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">Solicitudes de Adopción</h3>
                    <p className="text-blue-700">Evaluaciones y recomendaciones para procesos de adopción</p>
                  </div>

                  <div className="space-y-4">
                    {vet.adoptionApplications.map((application) => (
                      <Card key={application.id} className="border-blue-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-blue-800">{application.applicant.name}</h4>
                              <p className="text-blue-600">Email: {application.applicant.email}</p>
                              <p className="text-gray-600">
                                Solicitud: {application.applicationDate.toLocaleDateString()}
                              </p>
                            </div>
                            {getStatusBadge(application.applicationStatus, "adoption")}
                          </div>

                          <div className="space-y-3">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h5 className="font-medium text-blue-800 mb-2">Observaciones</h5>
                              <p className="text-blue-700 text-sm">{application.observations}</p>
                            </div>

                            {application.evaluationNotes && (
                              <div className="bg-green-50 p-3 rounded-lg">
                                <h5 className="font-medium text-green-800 mb-2">Notas de Evaluación</h5>
                                <p className="text-green-700 text-sm">{application.evaluationNotes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {vet.adoptionApplications.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No hay solicitudes de adopción registradas.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Follow-ups Tab */}
                <TabsContent value="followups" className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">Seguimientos Post-Adopción</h3>
                    <p className="text-blue-700">Monitoreo del bienestar de mascotas adoptadas</p>
                  </div>

                  <div className="space-y-4">
                    {vet.followUps.map((followUp) => (
                      <Card key={followUp.id} className="border-blue-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-blue-800">{followUp.petName}</h4>
                              <p className="text-blue-600">Adoptante: {followUp.ownerName}</p>
                              <p className="text-gray-600">
                                Adopción: {followUp.adoptionDate.toLocaleDateString()} ({followUp.monthsPostAdoption} meses)
                              </p>
                            </div>
                            {getStatusBadge(followUp.status, "followup")}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                              <span>Seguimiento: {followUp.followUpDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-blue-600" />
                              <span>Próximo: {followUp.nextFollowUp.toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="bg-green-50 p-3 rounded-lg">
                            <h5 className="font-medium text-green-800 mb-2">Observaciones</h5>
                            <p className="text-green-700 text-sm">{followUp.notes}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {vet.followUps.length === 0 && (
                      <div className="text-center py-8">
                        <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No hay seguimientos registrados.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Adoption Tests Tab */}
                <TabsContent value="tests" className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">Tests de Adopción</h3>
                    <p className="text-blue-700">Evaluaciones de compatibilidad y comportamiento</p>
                  </div>

                  <div className="space-y-4">
                    {vet.adoptionTests.map((test) => (
                      <Card key={test.id} className="border-blue-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-blue-800">
                                {test.testType === "BEHAVIORAL" ? "Test Comportamental" : 
                                 test.testType === "COMPATIBILITY" ? "Test de Compatibilidad" :
                                 test.testType === "MEDICAL" ? "Evaluación Médica" : "Visita Domiciliaria"}
                              </h4>
                              <p className="text-blue-600">Mascota: {test.petName}</p>
                              <p className="text-blue-600">Aplicante: {test.applicantName}</p>
                              <p className="text-gray-600">{test.testDate.toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(test.result, "test")}
                              <div className="mt-2">
                                <Badge variant="outline" className="border-blue-600 text-blue-600">
                                  <Star className="h-3 w-3 mr-1" />
                                  {test.score}/100
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h5 className="font-medium text-blue-800 mb-2">Observaciones</h5>
                              <p className="text-blue-700 text-sm">{test.notes}</p>
                            </div>

                            <div className="bg-green-50 p-3 rounded-lg">
                              <h5 className="font-medium text-green-800 mb-2">Recomendaciones</h5>
                              <p className="text-green-700 text-sm">{test.recommendations}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {vet.adoptionTests.length === 0 && (
                      <div className="text-center py-8">
                        <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No hay tests de adopción registrados.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Shelter Arrivals Tab */}
                <TabsContent value="arrivals" className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">Llegadas al Refugio</h3>
                    <p className="text-blue-700">Evaluaciones iniciales y tratamientos de ingreso</p>
                  </div>

                  <div className="space-y-4">
                    {vet.shelterArrivals.map((arrival) => (
                      <Card key={arrival.id} className="border-blue-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-blue-800">Llegada #{arrival.id}</h4>
                              <p className="text-blue-600">Fecha: {arrival.arrivalDate.toLocaleDateString()}</p>
                              <p className="text-gray-600">
                                Motivo: {arrival.reason === "ABANDONMENT" ? "Abandono" : 
                                        arrival.reason === "SURRENDER" ? "Entrega" : "Rescate"}
                              </p>
                            </div>
                            <Badge
                              className={
                                arrival.condition === "GOOD"
                                  ? "bg-green-600 text-white"
                                  : arrival.condition === "FAIR"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-red-600 text-white"
                              }
                            >
                              {arrival.condition === "GOOD"
                                ? "Buen Estado"
                                : arrival.condition === "FAIR"
                                  ? "Estado Regular"
                                  : "Estado Crítico"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="font-medium text-gray-800">Rescatista:</span>
                              <p className="text-gray-600 text-sm">{arrival.rescuer}</p>
                            </div>
                            {arrival.initialWeight && (
                              <div>
                                <span className="font-medium text-gray-800">Peso inicial:</span>
                                <p className="text-gray-600 text-sm">{arrival.initialWeight} kg</p>
                              </div>
                            )}
                          </div>

                          {arrival.notes && (
                            <div className="bg-orange-50 p-3 rounded-lg">
                              <h5 className="font-medium text-orange-800 mb-2">Notas</h5>
                              <p className="text-orange-700 text-sm">{arrival.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {vet.shelterArrivals.length === 0 && (
                      <div className="text-center py-8">
                        <PawPrint className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No hay llegadas registradas.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
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
