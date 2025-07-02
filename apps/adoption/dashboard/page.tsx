import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent } from '../../../src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../src/components/ui/tabs'
import { Badge } from '../../../src/components/ui/badge'
import {
  ArrowLeft,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  User,
  PawPrint,
  Phone,
  Award,
  RefreshCw,
  UserCheck,
} from 'lucide-react'

// Mock data for user's adoption applications and adoptions
const userAdoptionData = {
  user: {
    id: 1,
    name: "María García",
    email: "maria.garcia@email.com",
    phone: "+57 300 111 2222",
    registrationDate: new Date("2024-01-10"),
  },

  applications: [
    {
      id: 1,
      applicationDate: new Date("2024-01-15"),
      applicationEnd: new Date("2024-01-20"),
      applicationStatus: "APPROVED",
      result: "APPROVED",
      pet: {
        id: 1,
        name: "Luna",
        breed: "Labrador Mix",
        size: "MEDIUM",
        image: "/placeholder.svg?height=200&width=200",
      },
      shelter: {
        id: 1,
        name: "Refugio Esperanza",
        phone: "+57 301 234 5678",
      },
      veterinarian: {
        id: 1,
        name: "Dr. María González",
      },
      evaluationNotes: "Excelente candidata. Familia responsable con experiencia previa.",
      homeVisitDate: new Date("2024-01-18"),
      homeVisitResult: "APPROVED",
      nextStep: "Programar adopción final",
    },
    {
      id: 2,
      applicationDate: new Date("2024-01-05"),
      applicationEnd: null,
      applicationStatus: "PENDING",
      result: null,
      pet: {
        id: 2,
        name: "Max",
        breed: "Golden Retriever",
        size: "LARGE",
        image: "/placeholder.svg?height=200&width=200",
      },
      shelter: {
        id: 1,
        name: "Refugio Esperanza",
        phone: "+57 301 234 5678",
      },
      veterinarian: {
        id: 1,
        name: "Dr. María González",
      },
      evaluationNotes: "Pendiente visita domiciliaria.",
      homeVisitDate: new Date("2024-02-10"),
      homeVisitResult: null,
      nextStep: "Esperar visita domiciliaria",
    },
    {
      id: 3,
      applicationDate: new Date("2023-12-20"),
      applicationEnd: new Date("2023-12-28"),
      applicationStatus: "REJECTED",
      result: "REJECTED",
      pet: {
        id: 3,
        name: "Bella",
        breed: "Pastor Alemán",
        size: "LARGE",
        image: "/placeholder.svg?height=200&width=200",
      },
      shelter: {
        id: 2,
        name: "Hogar Feliz",
        phone: "+57 304 567 8901",
      },
      veterinarian: {
        id: 2,
        name: "Dr. Carlos Rodríguez",
      },
      evaluationNotes: "Espacio insuficiente para perro de gran tamaño.",
      homeVisitDate: new Date("2023-12-25"),
      homeVisitResult: "REJECTED",
      nextStep: null,
    },
  ],

  adoptions: [
    {
      id: 1,
      adoptionDate: new Date("2023-08-15"),
      adoptionEnd: null,
      adoptionStatus: "DONE",
      pet: {
        id: 4,
        name: "Rocky",
        breed: "Mestizo",
        size: "MEDIUM",
        image: "/placeholder.svg?height=200&width=200",
      },
      shelter: {
        id: 1,
        name: "Refugio Esperanza",
      },
      veterinarian: {
        id: 1,
        name: "Dr. María González",
      },
      observations: "Adopción exitosa. Excelente adaptación.",
      followUps: [
        {
          date: new Date("2023-09-15"),
          notes: "Adaptación excelente, mascota muy feliz",
          status: "EXCELLENT",
          veterinarian: "Dr. María González",
        },
        {
          date: new Date("2023-11-15"),
          notes: "Continúa adaptación positiva, buena salud",
          status: "EXCELLENT",
          veterinarian: "Dr. María González",
        },
        {
          date: new Date("2024-01-15"),
          notes: "Mascota completamente integrada a la familia",
          status: "EXCELLENT",
          veterinarian: "Dr. María González",
        },
      ],
      nextFollowUp: new Date("2024-04-15"),
    },
  ],
}

function getApplicationStatusBadge(status: string) {
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

function getAdoptionStatusBadge(status: string) {
  const statusConfig = {
    DONE: { label: "Completada", color: "bg-green-600", icon: CheckCircle },
    RETURN: { label: "Devuelta", color: "bg-yellow-600", icon: RefreshCw },
    DECEASED: { label: "Fallecida", color: "bg-gray-600", icon: XCircle },
    CANCELED: { label: "Cancelada", color: "bg-red-600", icon: XCircle },
    PENDING: { label: "Pendiente", color: "bg-blue-600", icon: Clock },
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

function getSizeLabel(size: string): string {
  const sizeMap: { [key: string]: string } = {
    SMALL: "Pequeño",
    MEDIUM: "Mediano",
    LARGE: "Grande",
  }
  return sizeMap[size] || size
}

const AdoptionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("applications")
  const data = userAdoptionData

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild className="text-orange-700 hover:text-orange-900">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Inicio
                </Link>
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
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link to="/">
                <Heart className="mr-2 h-4 w-4" />
                Explorar Mascotas
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* User Profile Header */}
      <section className="py-8 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6">
            <div className="bg-orange-100 p-4 rounded-full">
              <User className="h-12 w-12 text-orange-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-orange-800">{data.user.name}</h2>
              <p className="text-orange-600 text-lg">Panel de Adopciones</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-600">
                  Miembro desde: {data.user.registrationDate.toLocaleDateString()}
                </span>
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verificado
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-6 bg-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{data.applications.length}</div>
              <div className="text-sm text-blue-800">Solicitudes</div>
            </div>
            <div className="text-center bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {data.applications.filter((a) => a.applicationStatus === "APPROVED").length}
              </div>
              <div className="text-sm text-green-800">Aprobadas</div>
            </div>
            <div className="text-center bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{data.adoptions.length}</div>
              <div className="text-sm text-purple-800">Adopciones</div>
            </div>
            <div className="text-center bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {data.adoptions.filter((a) => a.adoptionStatus === "DONE").length}
              </div>
              <div className="text-sm text-orange-800">Exitosas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-orange-100/80 backdrop-blur-sm shadow-lg">
              <TabsTrigger
                value="applications"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-300"
              >
                <FileText className="h-4 w-4 mr-1" />
                Solicitudes
              </TabsTrigger>
              <TabsTrigger
                value="adoptions"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-300"
              >
                <Award className="h-4 w-4 mr-1" />
                Adopciones
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-orange-800 mb-2">Mis Solicitudes de Adopción</h3>
                <p className="text-orange-700">Estado y progreso de tus solicitudes de adopción</p>
              </div>

              <div className="space-y-4">
                {data.applications.map((application) => (
                  <Card key={application.id} className="border-orange-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={application.pet.image || "/placeholder.svg"}
                            alt={application.pet.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="text-lg font-semibold text-orange-800">{application.pet.name}</h4>
                            <p className="text-orange-600">
                              {application.pet.breed} • {getSizeLabel(application.pet.size)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Solicitud: {application.applicationDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {getApplicationStatusBadge(application.applicationStatus)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Refugio</span>
                          <p className="text-gray-800">{application.shelter.name}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Veterinario</span>
                          <p className="text-gray-800">{application.veterinarian.name}</p>
                        </div>
                        {application.homeVisitDate && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">Visita Domiciliaria</span>
                            <p className="text-gray-800">{application.homeVisitDate.toLocaleDateString()}</p>
                          </div>
                        )}
                        {application.applicationEnd && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">Finalizada</span>
                            <p className="text-gray-800">{application.applicationEnd.toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-2">Evaluación</h5>
                          <p className="text-blue-700 text-sm">{application.evaluationNotes}</p>
                        </div>

                        {application.homeVisitResult && (
                          <div
                            className={`p-3 rounded-lg ${
                              application.homeVisitResult === "APPROVED" ? "bg-green-50" : "bg-red-50"
                            }`}
                          >
                            <h5
                              className={`font-medium mb-2 ${
                                application.homeVisitResult === "APPROVED" ? "text-green-800" : "text-red-800"
                              }`}
                            >
                              Resultado Visita Domiciliaria
                            </h5>
                            <Badge
                              className={
                                application.homeVisitResult === "APPROVED"
                                  ? "bg-green-600 text-white"
                                  : "bg-red-600 text-white"
                              }
                            >
                              {application.homeVisitResult === "APPROVED" ? "Aprobada" : "Rechazada"}
                            </Badge>
                          </div>
                        )}

                        {application.nextStep && (
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <h5 className="font-medium text-yellow-800 mb-2">Próximo Paso</h5>
                            <p className="text-yellow-700 text-sm">{application.nextStep}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-4">
                        <Button variant="outline" className="flex-1 bg-transparent" asChild>
                          <Link to={`/shelter/${application.shelter.id}/pet/${application.pet.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Mascota
                          </Link>
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Phone className="mr-2 h-4 w-4" />
                          Contactar Refugio
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Adoptions Tab */}
            <TabsContent value="adoptions" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-orange-800 mb-2">Mis Adopciones</h3>
                <p className="text-orange-700">Mascotas que has adoptado y su seguimiento</p>
              </div>

              <div className="space-y-4">
                {data.adoptions.map((adoption) => (
                  <Card key={adoption.id} className="border-green-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={adoption.pet.image || "/placeholder.svg"}
                            alt={adoption.pet.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="text-lg font-semibold text-green-800">{adoption.pet.name}</h4>
                            <p className="text-green-600">
                              {adoption.pet.breed} • {getSizeLabel(adoption.pet.size)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Adoptado: {adoption.adoptionDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {getAdoptionStatusBadge(adoption.adoptionStatus)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Refugio</span>
                          <p className="text-gray-800">{adoption.shelter.name}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Veterinario</span>
                          <p className="text-gray-800">{adoption.veterinarian.name}</p>
                        </div>
                        {adoption.nextFollowUp && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">Próximo Seguimiento</span>
                            <p className="text-gray-800">{adoption.nextFollowUp.toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h5 className="font-medium text-green-800 mb-2">Observaciones</h5>
                          <p className="text-green-700 text-sm">{adoption.observations}</p>
                        </div>

                        {adoption.followUps && adoption.followUps.length > 0 && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h5 className="font-medium text-blue-800 mb-3">Seguimientos</h5>
                            <div className="space-y-2">
                              {adoption.followUps.slice(-2).map((followUp, index) => (
                                <div key={index} className="text-sm border-l-2 border-blue-300 pl-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-blue-700">
                                      {followUp.date.toLocaleDateString()}
                                    </span>
                                    <Badge
                                      className={
                                        followUp.status === "EXCELLENT"
                                          ? "bg-green-600 text-white"
                                          : followUp.status === "GOOD"
                                            ? "bg-yellow-600 text-white"
                                            : "bg-red-600 text-white"
                                      }
                                    >
                                      {followUp.status === "EXCELLENT"
                                        ? "Excelente"
                                        : followUp.status === "GOOD"
                                          ? "Bueno"
                                          : "Regular"}
                                    </Badge>
                                  </div>
                                  <p className="text-blue-600">{followUp.notes}</p>
                                  <p className="text-xs text-gray-500 mt-1">Dr. {followUp.veterinarian}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-4">
                        <Button variant="outline" className="flex-1 bg-transparent" asChild>
                          <Link to={`/shelter/${adoption.shelter.id}/pet/${adoption.pet.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Perfil
                          </Link>
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent" asChild>
                          <Link to={`/veterinarian/${adoption.veterinarian.id}`}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Contactar Veterinario
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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

export default AdoptionDashboard
