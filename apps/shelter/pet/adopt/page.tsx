'use client'

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Heart, PawPrint, CheckCircle, AlertCircle, Home, 
  User, FileText, Shield
} from 'lucide-react'
import { Button } from '../../../../src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../src/components/ui/card'
import { Badge } from '../../../../src/components/ui/badge'
import NotFoundPage from '../../../components/NotFoundPage'
import api from '../../../../src/services/api'
import type { PetDetailDTO } from '../../../../src/types'

export default function AdoptionApplicationPage() {
  const { shelterId, petId } = useParams<{ shelterId: string; petId: string }>()
  const navigate = useNavigate()
  const [pet, setPet] = useState<PetDetailDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    houseType: 'HOUSE' as 'HOUSE' | 'APARTMENT',
    hasExperience: false,
    motivation: '',
    currentPets: '',
    familyMembers: '',
    workSchedule: '',
    emergencyContact: '',
    veterinarianContact: '',
    additionalNotes: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
      } catch (error) {
        console.error('Error loading pet data:', error)
        setError('server-error')
      } finally {
        setLoading(false)
      }
    }

    loadPetData()
  }, [shelterId, petId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would submit to the real API
      console.log('Adoption application submitted:', {
        petId,
        shelterId,
        ...formData
      })
      
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
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

  if (error === 'not-found' || !pet) {
    return (
      <NotFoundPage
        title="Mascota no encontrada"
        description="La mascota que buscas no existe, ha sido adoptada o fue removida del sistema. No es posible proceder con la adopción."
        backLink="/shelter"
        backText="Ver todas las mascotas"
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8">
          <Card className="text-center shadow-2xl border-green-200">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-800 mb-4">¡Solicitud Enviada!</h2>
              <p className="text-green-700 mb-6 text-lg">
                Tu solicitud de adopción para <strong>{pet.name}</strong> ha sido enviada exitosamente.
              </p>
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-green-800 mb-3">¿Qué sigue?</h3>
                <ul className="text-sm text-green-700 space-y-2 text-left">
                  <li>• El refugio revisará tu solicitud en las próximas 24-48 horas</li>
                  <li>• Te contactarán para programar una entrevista</li>
                  <li>• Si todo está en orden, se programará una visita domiciliaria</li>
                  <li>• Una vez aprobada, podrás llevar a {pet.name} a casa</li>
                </ul>
              </div>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to={`/shelter/${shelterId}/pet/${petId}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a {pet.name}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/shelter/${shelterId}`}>
                    Ver Más Mascotas
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/shelter/${shelterId}/pet/${petId}`)}
                className="text-orange-700 hover:text-orange-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a {pet.name}
              </Button>
              <div className="h-6 w-px bg-orange-200"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <PawPrint className="h-6 w-6 text-orange-600" />
                </div>
                <h1 className="text-2xl font-bold text-orange-800">Adopción - {pet.name}</h1>
              </div>
            </div>
            <Badge className="bg-green-600 text-white">
              <Heart className="h-3 w-3 mr-1" />
              Adopción en Proceso
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Pet Summary */}
          <Card className="mb-8 border-orange-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <img
                  src={pet.multimedia?.[0]?.url || '/placeholder-pet.jpg'}
                  alt={pet.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-orange-800 mb-2">{pet.name}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Raza:</span>
                      <p>{pet.breed}</p>
                    </div>
                    <div>
                      <span className="font-medium">Tamaño:</span>
                      <p>{pet.size}</p>
                    </div>
                    <div>
                      <span className="font-medium">Género:</span>
                      <p>{pet.gender}</p>
                    </div>
                    <div>
                      <span className="font-medium">Refugio:</span>
                      <p>{pet.shelter.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card className="border-orange-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-800 flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Solicitud de Adopción
              </CardTitle>
              <p className="text-orange-600">
                Complete este formulario para iniciar el proceso de adopción de {pet.name}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Vivienda *
                      </label>
                      <select
                        name="houseType"
                        value={formData.houseType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="HOUSE">Casa</option>
                        <option value="APARTMENT">Apartamento</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección Completa *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Experience and Motivation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800 flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Experiencia y Motivación
                  </h3>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="hasExperience"
                        checked={formData.hasExperience}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Tengo experiencia previa con mascotas
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Por qué quieres adoptar a {pet.name}? *
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Comparte tu motivación para adoptar..."
                    />
                  </div>
                </div>

                {/* Living Situation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800 flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    Situación de Vivienda
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Tienes otras mascotas actualmente?
                      </label>
                      <textarea
                        name="currentPets"
                        value={formData.currentPets}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Describe tus mascotas actuales o escribe 'Ninguna'"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Miembros de la familia
                      </label>
                      <textarea
                        name="familyMembers"
                        value={formData.familyMembers}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Describe quién vive contigo (adultos, niños, edades...)"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horario de trabajo / Disponibilidad
                    </label>
                    <textarea
                      name="workSchedule"
                      value={formData.workSchedule}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Describe tu horario y disponibilidad para cuidar a la mascota..."
                    />
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Contactos de Referencia
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contacto de emergencia
                      </label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Nombre y teléfono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Veterinario de referencia
                      </label>
                      <input
                        type="text"
                        name="veterinarianContact"
                        value={formData.veterinarianContact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Nombre y contacto del veterinario (opcional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Información adicional
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Cualquier información adicional que consideres relevante..."
                  />
                </div>

                {/* Terms and Submit */}
                <div className="border-t pt-6">
                  <div className="bg-orange-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-orange-800 mb-2">Términos y Condiciones</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Acepto que el refugio realice una visita domiciliaria</li>
                      <li>• Me comprometo a brindar cuidado médico adecuado</li>
                      <li>• Entiendo que la adopción incluye seguimiento post-adopción</li>
                      <li>• Si no puedo cuidar más a la mascota, la devolveré al refugio</li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/shelter/${shelterId}/pet/${petId}`)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-2 bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-4 w-4" />
                          Enviar Solicitud de Adopción
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
