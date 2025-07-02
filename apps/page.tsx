import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pet, Shelter, SuccessStory } from '../src/types'
import { apiService } from '../src/services/api'
import { 
  PawPrint, 
  Heart, 
  MapPin, 
  Users, 
  Award, 
  Calendar, 
  Phone, 
  Mail,
  Filter,
  Search
} from 'lucide-react'

// Funciones de utilidad
function calculateAge(birthDate: Date): string {
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (age === 0 || (age === 1 && monthDiff < 0)) {
    const months = monthDiff < 0 ? 12 + monthDiff : monthDiff
    return `${months} meses`
  }

  return `${age} años`
}

function getSizeLabel(size: string): string {
  const sizeMap: { [key: string]: string } = {
    SMALL: "Pequeño",
    MEDIUM: "Mediano",
    LARGE: "Grande",
  }
  return sizeMap[size] || size
}

function getGenderLabel(gender: string): string {
  return gender === "MALE" ? "Macho" : "Hembra"
}

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [shelters, setShelters] = useState<Shelter[]>([])
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pets' | 'shelters'>('pets')
  const [filters, setFilters] = useState({
    size: '',
    gender: '',
    breed: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [petsData, sheltersData, storiesData] = await Promise.all([
        apiService.getPetsWithFallback(),
        apiService.getSheltersWithFallback(),
        apiService.getSuccessStoriesWithFallback()
      ])

      setPets(petsData)
      setShelters(sheltersData)
      setSuccessStories(storiesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPets = pets.filter(pet => {
    return (
      (!filters.size || pet.size === filters.size) &&
      (!filters.gender || pet.gender === filters.gender) &&
      (!filters.breed || pet.breed.toLowerCase().includes(filters.breed.toLowerCase()))
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-800">Cargando mascotas...</p>
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
            <div className="flex items-center space-x-3 group">
              <div className="bg-orange-100 p-2 rounded-full group-hover:bg-orange-200 transition-colors">
                <PawPrint className="h-6 w-6 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-orange-800">Aves de Hermes</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#mascotas"
                className="text-orange-700 hover:text-orange-900 font-medium flex items-center transition-colors"
              >
                <PawPrint className="h-4 w-4 mr-1" />
                Mascotas
              </a>
              <Link
                to="/shelter"
                className="text-orange-700 hover:text-orange-900 font-medium flex items-center transition-colors"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Refugios
              </Link>
              <a
                href="#historias"
                className="text-orange-700 hover:text-orange-900 font-medium flex items-center transition-colors"
              >
                <Award className="h-4 w-4 mr-1" />
                Historias
              </a>
              <Link
                to="/adoption/dashboard"
                className="text-orange-700 hover:text-orange-900 font-medium flex items-center transition-colors"
              >
                <Heart className="h-4 w-4 mr-1" />
                Mis Adopciones
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Adoptar Ahora
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 opacity-50"></div>
        <div className="absolute top-10 left-10 text-orange-200 opacity-30">
          <Heart className="h-16 w-16" />
        </div>
        <div className="absolute bottom-10 right-10 text-orange-200 opacity-30">
          <PawPrint className="h-20 w-20" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 p-4 rounded-full">
              <PawPrint className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-orange-800 mb-6">Encuentra tu compañero perfecto</h2>
          <p className="text-xl text-orange-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Miles de mascotas esperan encontrar un hogar lleno de amor. Únete a nuestra comunidad y cambia una vida para
            siempre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
              <Heart className="mr-2 h-5 w-5" />
              Comenzar Adopción
            </button>
            <button className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 border-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-transparent flex items-center justify-center">
              <MapPin className="mr-2 h-5 w-5" />
              <a href="/shelter">Conocer Refugios</a>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-orange-800 font-medium">Mascotas Adoptadas</div>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-orange-800 font-medium">Refugios Aliados</div>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-4xl font-bold text-amber-600 mb-2">1000+</div>
              <div className="text-orange-800 font-medium">Familias Felices</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section id="mascotas" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="w-full">
            <div className="grid w-full grid-cols-2 max-w-md mx-auto mb-12 bg-orange-100/80 backdrop-blur-sm shadow-lg rounded-lg">
              <button
                onClick={() => setActiveTab('pets')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  activeTab === 'pets'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-orange-800 hover:bg-orange-200'
                }`}
              >
                <PawPrint className="h-4 w-4 mr-2" />
                Mascotas Disponibles
              </button>
              <button
                onClick={() => setActiveTab('shelters')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  activeTab === 'shelters'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-orange-800 hover:bg-orange-200'
                }`}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Refugios
              </button>
            </div>

            {activeTab === 'pets' && (
              <div className="space-y-8">
                {/* Filtros */}
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filtrar Mascotas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-orange-700 mb-2">Tamaño</label>
                      <select
                        value={filters.size}
                        onChange={(e) => setFilters({...filters, size: e.target.value})}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Todos los tamaños</option>
                        <option value="SMALL">Pequeño</option>
                        <option value="MEDIUM">Mediano</option>
                        <option value="LARGE">Grande</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-700 mb-2">Género</label>
                      <select
                        value={filters.gender}
                        onChange={(e) => setFilters({...filters, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Cualquier género</option>
                        <option value="MALE">Macho</option>
                        <option value="FEMALE">Hembra</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-700 mb-2">Raza</label>
                      <input
                        type="text"
                        placeholder="Buscar por raza..."
                        value={filters.breed}
                        onChange={(e) => setFilters({...filters, breed: e.target.value})}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => setFilters({ size: '', gender: '', breed: '' })}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Limpiar Filtros
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid de Mascotas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPets.map((pet) => (
                    <div key={pet.id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
                      <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pet.size === 'SMALL' ? 'bg-blue-100 text-blue-800' :
                            pet.size === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getSizeLabel(pet.size)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-orange-800">{pet.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pet.gender === 'MALE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                          }`}>
                            {getGenderLabel(pet.gender)}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-orange-700">
                            <Calendar className="h-4 w-4 mr-2" />
                            {calculateAge(new Date(pet.birthDate))}
                          </div>
                          <div className="flex items-center text-sm text-orange-700">
                            <PawPrint className="h-4 w-4 mr-2" />
                            {pet.breed}
                          </div>
                          <div className="flex items-center text-sm text-orange-700">
                            <MapPin className="h-4 w-4 mr-2" />
                            {pet.shelter.name}
                          </div>
                        </div>
                        <p className="text-sm text-orange-600 mb-4 line-clamp-3">
                          {pet.behaviorProfile}
                        </p>
                        <Link 
                          to={`/shelter/${pet.shelter.id}/pet/${pet.id}`}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Conocer a {pet.name}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPets.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-orange-300 mb-4">
                      <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-orange-800 mb-2">No se encontraron mascotas</h3>
                    <p className="text-orange-600">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shelters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {shelters.map((shelter) => (
                  <div key={shelter.id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                    <div className="aspect-w-16 aspect-h-10 relative overflow-hidden">
                      <img
                        src={shelter.image || "/placeholder.svg?height=200&width=300"}
                        alt={shelter.name}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-orange-800 mb-3">{shelter.name}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-orange-700">
                          <MapPin className="h-4 w-4 mr-2" />
                          {shelter.address}
                        </div>
                        <div className="flex items-center text-sm text-orange-700">
                          <Phone className="h-4 w-4 mr-2" />
                          {shelter.phone}
                        </div>
                        <div className="flex items-center text-sm text-orange-700">
                          <Mail className="h-4 w-4 mr-2" />
                          {shelter.email}
                        </div>
                        {shelter.petsCount && (
                          <div className="flex items-center text-sm text-orange-700">
                            <PawPrint className="h-4 w-4 mr-2" />
                            {shelter.petsCount} mascotas disponibles
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-orange-600 mb-4">
                        {shelter.description}
                      </p>
                      <Link 
                        to={`/shelter/${shelter.id}`}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Visitar Refugio
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="historias" className="py-16 bg-gradient-to-br from-white/70 to-orange-50/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-amber-100 p-4 rounded-full">
                <Award className="h-12 w-12 text-amber-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-orange-800 mb-4">Historias de Éxito</h3>
            <p className="text-orange-700 max-w-2xl mx-auto">
              Estas son algunas de las hermosas historias de adopción que nos llenan de alegría y motivación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <img
                    src={story.image}
                    alt={story.petName}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-orange-800">{story.petName}</h4>
                    <p className="text-sm text-orange-600">Adoptado por {story.ownerName}</p>
                    <p className="text-xs text-orange-500">Hace {story.months} meses</p>
                  </div>
                </div>
                <p className="text-orange-700 italic text-sm leading-relaxed">
                  "{story.story}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 left-10 text-white/20">
          <PawPrint className="h-24 w-24" />
        </div>
        <div className="absolute bottom-10 right-10 text-white/20">
          <Heart className="h-20 w-20" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
          <h3 className="text-4xl font-bold mb-6">¿Listo para cambiar una vida?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Únete a nuestra comunidad de adoptantes y brinda amor a una mascota que lo necesita. El proceso es simple y
            te acompañamos en cada paso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
              <Heart className="mr-2 h-5 w-5" />
              Registrarse como Adoptante
            </button>
            <button className="border-white text-white hover:bg-white/10 px-8 py-3 border-2 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-transparent flex items-center justify-center">
              <Award className="mr-2 h-5 w-5" />
              Conocer el Proceso
            </button>
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
                <span className="font-bold text-lg">Aves de Hermes</span>
              </div>
              <p className="text-orange-200">
                Conectando mascotas con familias amorosas desde 2020.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-orange-200">
                <li><a href="#mascotas" className="hover:text-white transition-colors">Mascotas</a></li>
                <li><a href="#refugios" className="hover:text-white transition-colors">Refugios</a></li>
                <li><a href="#historias" className="hover:text-white transition-colors">Historias</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Pruebas de Error</h4>
              <ul className="space-y-2 text-orange-200 text-sm">
                <li>
                  <Link to="/shelter/0" className="hover:text-white transition-colors">
                    Refugio no existe (ID: 0)
                  </Link>
                </li>
                <li>
                  <Link to="/shelter/999" className="hover:text-white transition-colors">
                    Refugio inexistente (ID: 999)
                  </Link>
                </li>
                <li>
                  <Link to="/shelter/1/pet/0" className="hover:text-white transition-colors">
                    Mascota no existe (ID: 0)
                  </Link>
                </li>
                <li>
                  <Link to="/veterinarian/0" className="hover:text-white transition-colors">
                    Veterinario no existe (ID: 0)
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-orange-200">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +57 300 123 4567
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@avesdehermes.com
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <p className="text-orange-200">
                Mantente actualizado con nuestras últimas adopciones y eventos.
              </p>
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
