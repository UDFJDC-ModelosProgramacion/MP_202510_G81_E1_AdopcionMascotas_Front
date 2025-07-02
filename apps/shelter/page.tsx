import { useState, useEffect } from 'react'
import { Button } from '../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../src/components/ui/card'
import { Badge } from '../../src/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../src/components/ui/dialog'
import { MapPin, Phone, Mail, Users, PawPrint, ArrowLeft, Calendar, Award, Heart } from 'lucide-react'
import { Shelter } from '../../src/types'
import { apiService } from '../../src/services/api'

export default function SheltersPage() {
  const [shelters, setShelters] = useState<Shelter[]>([])
  const [loading, setLoading] = useState(true)
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false)
  const [isShelterRegistrationOpen, setIsShelterRegistrationOpen] = useState(false)

  useEffect(() => {
    loadShelters()
  }, [])

  const loadShelters = async () => {
    try {
      setLoading(true)
      const sheltersData = await apiService.getSheltersWithFallback()
      setShelters(sheltersData)
    } catch (error) {
      console.error('Error loading shelters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToHome = () => {
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-800">Cargando refugios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-orange-700 hover:text-orange-900" onClick={handleBackToHome}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
              <div className="h-6 w-px bg-orange-200"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <PawPrint className="h-6 w-6 text-orange-600" />
                </div>
                <h1 className="text-2xl font-bold text-orange-800">Aves de Hermes</h1>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="/#mascotas"
                className="text-orange-700 hover:text-orange-900 font-medium flex items-center transition-colors"
                onClick={handleBackToHome}
              >
                <PawPrint className="h-4 w-4 mr-1" />
                Mascotas
              </a>
              <span className="text-orange-900 font-semibold flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Refugios
              </span>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Users className="mr-2 h-4 w-4" />
                Registrarse como Adoptante
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 opacity-50"></div>
        <div className="absolute top-10 left-10 text-orange-200 opacity-30">
          <MapPin className="h-16 w-16" />
        </div>
        <div className="absolute bottom-10 right-10 text-orange-200 opacity-30">
          <Heart className="h-20 w-20" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 p-4 rounded-full">
              <MapPin className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-orange-800 mb-6">Refugios Aliados</h2>
          <p className="text-xl text-orange-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Conoce los refugios que trabajan día a día para cuidar, rehabilitar y encontrar hogares amorosos para las
            mascotas que más lo necesitan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => setIsShelterRegistrationOpen(true)}
            >
              <Users className="mr-2 h-5 w-5" />
              Ser Refugio Aliado
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-transparent"
              onClick={() => setIsDonationDialogOpen(true)}
            >
              <Heart className="mr-2 h-5 w-5" />
              Hacer Donación
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">{shelters.length}</div>
              <div className="text-sm text-orange-800 font-medium">Refugios Activos</div>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <PawPrint className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {shelters.reduce((acc, shelter) => acc + (shelter.petsCount || 0), 0)}
              </div>
              <div className="text-sm text-orange-800 font-medium">Mascotas en Cuidado</div>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {shelters.reduce((acc, shelter) => acc + (shelter.veterinariansCount || 0), 0)}
              </div>
              <div className="text-sm text-orange-800 font-medium">Veterinarios</div>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {shelters.reduce((acc, shelter) => acc + (shelter.eventsCount || 0), 0)}
              </div>
              <div className="text-sm text-orange-800 font-medium">Eventos Activos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shelters Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shelters.map((shelter) => (
              <Card
                key={shelter.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-orange-200 group hover:border-orange-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={shelter.coverImage || shelter.image || "/placeholder.svg?height=200&width=600"}
                    alt={shelter.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Badge className="absolute top-4 right-4 bg-green-600 text-white shadow-lg">
                    <Award className="h-3 w-3 mr-1" />
                    {shelter.status === "ACTIVE" ? "Activo" : "Inactivo"}
                  </Badge>
                  {shelter.foundedYear && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-medium text-orange-800">Desde {shelter.foundedYear}</span>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-orange-800 flex items-center text-lg">
                        <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                        {shelter.name}
                      </CardTitle>
                      <CardDescription className="text-orange-600 mt-2 line-clamp-2">
                        {shelter.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-1">
                        <PawPrint className="h-4 w-4 text-orange-600 mr-1" />
                      </div>
                      <div className="text-lg font-bold text-orange-800">{shelter.petsCount || 0}</div>
                      <div className="text-xs text-orange-600">Mascotas</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-blue-600 mr-1" />
                      </div>
                      <div className="text-lg font-bold text-blue-800">{shelter.veterinariansCount || 0}</div>
                      <div className="text-xs text-blue-600">Veterinarios</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors">
                      <MapPin className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
                      <span className="truncate">{shelter.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors">
                      <Phone className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
                      <span>{shelter.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors">
                      <Mail className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
                      <span className="truncate">{shelter.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <span>Capacidad: {shelter.capacity || 'N/A'}</span>
                    <span>{shelter.eventsCount || 0} eventos activos</span>
                  </div>

                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white group hover:shadow-lg transition-all duration-300">
                    <MapPin className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Ver Detalles del Refugio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 left-10 text-white/20">
          <Heart className="h-24 w-24" />
        </div>
        <div className="absolute bottom-10 right-10 text-white/20">
          <PawPrint className="h-20 w-20" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-6">¿Quieres ser parte del cambio?</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Únete a nuestra red de refugios aliados o ayuda con donaciones para seguir salvando vidas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => setIsShelterRegistrationOpen(true)}
            >
              <Users className="mr-2 h-5 w-5" />
              Ser Refugio Aliado
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-transparent"
              onClick={() => setIsDonationDialogOpen(true)}
            >
              <Heart className="mr-2 h-5 w-5" />
              Hacer Donación
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
                  <button onClick={handleBackToHome} className="hover:text-white">
                    Mascotas Disponibles
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Proceso de Adopción
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Requisitos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Refugios</h5>
              <ul className="space-y-2 text-orange-200">
                <li>
                  <span className="hover:text-white">
                    Refugios Aliados
                  </span>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Ser Refugio Aliado
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Donaciones
                  </a>
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

      {/* Donation Dialog */}
      <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-800 flex items-center">
              <Heart className="mr-3 h-8 w-8 text-red-500" />
              Hacer una Donación
            </DialogTitle>
            <DialogDescription className="text-orange-600 text-lg">
              Tu donación ayuda a salvar vidas y brindar cuidado a las mascotas que más lo necesitan
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Donation Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-200 hover:border-green-400 transition-colors">
                <CardHeader className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-800">Donación Monetaria</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Ayuda directa para alimentación, medicamentos y cuidados veterinarios
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">$50.000 COP</Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">$100.000 COP</Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">$200.000 COP</Button>
                    <Button variant="outline" className="w-full border-green-600 text-green-600 bg-transparent">
                      Otra cantidad
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 hover:border-blue-400 transition-colors">
                <CardHeader className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PawPrint className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-800">Donación de Suministros</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Alimentos, juguetes, mantas y artículos de cuidado</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>• Alimento para perros/gatos</span>
                      <Badge variant="outline" className="text-blue-600">
                        Urgente
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• Mantas y camas</span>
                      <Badge variant="outline" className="text-green-600">
                        Necesario
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• Juguetes y correas</span>
                      <Badge variant="outline" className="text-yellow-600">
                        Útil
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• Medicamentos</span>
                      <Badge variant="outline" className="text-red-600">
                        Crítico
                      </Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">Ver Lista Completa</Button>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:border-purple-400 transition-colors">
                <CardHeader className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-purple-800">Donación de Tiempo</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Voluntariado para cuidado, paseos y actividades especiales
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>• Paseos y ejercicio</div>
                    <div>• Socialización</div>
                    <div>• Limpieza y mantenimiento</div>
                    <div>• Eventos de adopción</div>
                    <div>• Transporte veterinario</div>
                  </div>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">Ser Voluntario</Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">¿Necesitas Más Información?</h3>
                  <p className="mb-4 opacity-90">
                    Nuestro equipo está disponible para ayudarte con cualquier pregunta sobre donaciones
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>+57 300 123 4567</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>donaciones@avesdehermes.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDonationDialogOpen(false)}>
              Cerrar
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Heart className="mr-2 h-4 w-4" />
              Hacer Donación Ahora
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shelter Registration Dialog */}
      <Dialog open={isShelterRegistrationOpen} onOpenChange={setIsShelterRegistrationOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-800 flex items-center">
              <Users className="mr-3 h-8 w-8 text-orange-600" />
              Registro de Refugio Aliado
            </DialogTitle>
            <DialogDescription className="text-orange-600 text-lg">
              Únete a nuestra red de refugios aliados y ayuda a más mascotas a encontrar un hogar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Registration Form */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Información del Refugio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Refugio *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Ej: Refugio Esperanza"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de Contacto *</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección Completa *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Calle 45 #12-34, Ciudad, Departamento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contacto *</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="contacto@refugio.org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Refugio *</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Describe la misión, historia y servicios de tu refugio..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">¿Tienes Preguntas?</h3>
                  <p className="mb-4 opacity-90">
                    Nuestro equipo está disponible para ayudarte con el proceso de registro
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>+57 300 123 4567</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>refugios@avesdehermes.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsShelterRegistrationOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Users className="mr-2 h-4 w-4" />
              Enviar Solicitud
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
