import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../src/components/ui/button'
import { Input } from '../../src/components/ui/input'
import { Label } from '../../src/components/ui/label'
import { Select } from '../../src/components/ui/select'
import { Textarea } from '../../src/components/ui/textarea'
import { Checkbox } from '../../src/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../src/components/ui/card'
import { ArrowLeft, UserPlus } from 'lucide-react'
import type { OwnerDTO, HouseTypeEnum } from '../../src/types'

interface RegisterFormData {
  name: string
  email: string
  phone: string
  address: string
  houseType: HouseTypeEnum
  documentType: string
  documentNumber: string
  birthDate: string
  hasExperience: boolean
  motivation: string
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    houseType: 'HOUSE',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    hasExperience: false,
    motivation: ''
  })

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real application, you would send the data to your API
      const newOwner: Omit<OwnerDTO, 'id'> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        houseType: formData.houseType,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        birthDate: formData.birthDate
      }

      console.log('New owner data:', newOwner)
      
      // Redirect to adoption dashboard after successful registration
      navigate('/adoption/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.name && 
           formData.email && 
           formData.phone && 
           formData.address && 
           formData.documentType &&
           formData.documentNumber &&
           formData.birthDate &&
           formData.motivation
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Button>
        </div>

        {/* Registration Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Registro de Adoptante</CardTitle>
            <CardDescription>
              Completa tus datos para comenzar el proceso de adopción
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información Personal</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ingresa tu nombre completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Número de teléfono"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentType">Tipo de documento</Label>
                  <Select
                    id="documentType"
                    value={formData.documentType}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="PASSPORT">Pasaporte</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentNumber">Número de documento</Label>
                  <Input
                    id="documentNumber"
                    type="text"
                    placeholder="Número de documento"
                    value={formData.documentNumber}
                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Housing Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información de Vivienda</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Dirección completa"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="houseType">Tipo de vivienda</Label>
                  <Select
                    id="houseType"
                    value={formData.houseType}
                    onChange={(e) => handleInputChange('houseType', e.target.value as HouseTypeEnum)}
                  >
                    <option value="HOUSE">Casa</option>
                    <option value="APARTMENT">Apartamento</option>
                    <option value="FARM">Finca</option>
                    <option value="TOWNHOUSE">Casa en Conjunto</option>
                  </Select>
                </div>
              </div>

              {/* Experience and Motivation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Experiencia y Motivación</h3>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasExperience"
                    checked={formData.hasExperience}
                    onChange={(e) => handleInputChange('hasExperience', e.target.checked)}
                  />
                  <Label htmlFor="hasExperience">
                    Tengo experiencia previa cuidando mascotas
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Motivación para adoptar</Label>
                  <Textarea
                    id="motivation"
                    placeholder="Cuéntanos por qué quieres adoptar una mascota y cómo planeas cuidarla..."
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Información importante:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Después del registro, podrás explorar las mascotas disponibles</li>
                  <li>• El proceso de adopción incluye una entrevista y visita domiciliaria</li>
                  <li>• Nos comprometemos a encontrar la mascota perfecta para tu hogar</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Completar Registro
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda? Contáctanos en{' '}
            <a href="mailto:adopciones@refugio.com" className="text-primary hover:underline">
              adopciones@refugio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
