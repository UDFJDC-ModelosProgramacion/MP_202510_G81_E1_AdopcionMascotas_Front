import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card'

interface NotFoundPageProps {
  title: string
  description: string
  backLink: string
  backText: string
  gradient?: string
}

export default function NotFoundPage({ 
  title, 
  description, 
  backLink, 
  backText,
  gradient = "from-gray-50 to-gray-100"
}: NotFoundPageProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} flex items-center justify-center p-4`}>
      <Card className="w-full max-w-md text-center shadow-xl border-gray-200">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">
              Posibles razones:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• El recurso fue eliminado</li>
              <li>• El ID no es válido</li>
              <li>• No tienes permisos para verlo</li>
            </ul>
          </div>
          
          <Link to={backLink}>
            <Button className="w-full" variant="default">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backText}
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" className="w-full">
              Ir al inicio
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
