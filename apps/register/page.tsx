import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../src/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../src/components/ui/card";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import { Select } from "../../src/components/ui/select";
import { Textarea } from "../../src/components/ui/textarea";
import { Checkbox } from "../../src/components/ui/checkbox";
import {
    ArrowLeft,
    User,
    Home,
    FileText,
    Heart,
    PawPrint,
    CheckCircle,
} from "lucide-react";

// Enum values based on the DTOs
const HOUSE_TYPES = [
    { value: "APARTMENT", label: "Apartamento" },
    { value: "HOUSE", label: "Casa" },
    { value: "FARM", label: "Finca" },
    { value: "TOWNHOUSE", label: "Casa en Conjunto" },
];

const DOCUMENT_TYPES = [
    { value: "CC", label: "Cédula de Ciudadanía" },
    { value: "CE", label: "Cédula de Extranjería" },
    { value: "TI", label: "Tarjeta de Identidad" },
    { value: "PASSPORT", label: "Pasaporte" },
];

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        // PersonDTO fields
        name: "",
        email: "",
        phone: "",
        documentType: "",
        documentNumber: "",
        birthDate: "",
        // OwnerDTO fields
        houseType: "",
        address: "",
        // Additional fields for adoption process
        hasExperience: false,
        hasPets: false,
        petExperience: "",
        motivation: "",
        agreeToTerms: false,
        agreeToVisit: false,
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Store user data in localStorage (in real app, this would be an API call)
        localStorage.setItem(
            "adoptionUser",
            JSON.stringify({
                id: Date.now(),
                ...formData,
                registrationDate: new Date().toISOString(),
                status: "ACTIVE",
            })
        );

        setIsSubmitting(false);
        setIsSuccess(true);

        // Redirect after success
        setTimeout(() => {
            navigate("/");
        }, 3000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center border-green-200">
                    <CardContent className="p-8">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-800 mb-2">
                            ¡Registro Exitoso!
                        </h2>
                        <p className="text-green-700 mb-4">
                            Te has registrado correctamente como adoptante.
                            Ahora puedes explorar y adoptar mascotas.
                        </p>
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-green-600">
                                Serás redirigido automáticamente en unos
                                segundos...
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate("/")}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Heart className="mr-2 h-4 w-4" />
                            Explorar Mascotas
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
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
                                asChild
                                className="text-orange-700 hover:text-orange-900"
                            >
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
                                <h1 className="text-2xl font-bold text-orange-800">
                                    Aves de Hermes
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Registration Form */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-2xl">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="bg-orange-100 p-4 rounded-full">
                                <User className="h-12 w-12 text-orange-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-orange-800 mb-4">
                            Registro de Adoptante
                        </h2>
                        <p className="text-orange-700 max-w-xl mx-auto">
                            Completa tu registro para comenzar el proceso de
                            adopción. Toda la información es confidencial y se
                            usa únicamente para garantizar el bienestar de
                            nuestras mascotas.
                        </p>
                    </div>

                    <Card className="border-orange-200 shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                            <CardTitle className="text-orange-800 flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Información Personal
                            </CardTitle>
                            <CardDescription className="text-orange-600">
                                Proporciona tus datos personales para el proceso
                                de adopción
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-orange-800 font-medium"
                                        >
                                            Nombre Completo *
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="border-orange-200 focus:border-orange-500"
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-orange-800 font-medium"
                                        >
                                            Correo Electrónico *
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            className="border-orange-200 focus:border-orange-500"
                                            placeholder="tu@email.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="phone"
                                            className="text-orange-800 font-medium"
                                        >
                                            Teléfono *
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "phone",
                                                    e.target.value
                                                )
                                            }
                                            className="border-orange-200 focus:border-orange-500"
                                            placeholder="+57 300 123 4567"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="birthDate"
                                            className="text-orange-800 font-medium"
                                        >
                                            Fecha de Nacimiento *
                                        </Label>
                                        <Input
                                            id="birthDate"
                                            type="date"
                                            required
                                            value={formData.birthDate}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "birthDate",
                                                    e.target.value
                                                )
                                            }
                                            className="border-orange-200 focus:border-orange-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="documentType"
                                            className="text-orange-800 font-medium"
                                        >
                                            Tipo de Documento *
                                        </Label>
                                        <Select
                                            value={formData.documentType}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "documentType",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="border-orange-200 focus:border-orange-500">
                                                <SelectValue placeholder="Selecciona el tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DOCUMENT_TYPES.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="documentNumber"
                                            className="text-orange-800 font-medium"
                                        >
                                            Número de Documento *
                                        </Label>
                                        <Input
                                            id="documentNumber"
                                            type="text"
                                            required
                                            value={formData.documentNumber}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "documentNumber",
                                                    e.target.value
                                                )
                                            }
                                            className="border-orange-200 focus:border-orange-500"
                                            placeholder="Número de documento"
                                        />
                                    </div>
                                </div>

                                {/* Housing Information */}
                                <div className="border-t border-orange-100 pt-6">
                                    <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                                        <Home className="h-5 w-5 mr-2" />
                                        Información de Vivienda
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="houseType"
                                                className="text-orange-800 font-medium"
                                            >
                                                Tipo de Vivienda *
                                            </Label>
                                            <Select
                                                value={formData.houseType}
                                                onValueChange={(value) =>
                                                    handleInputChange(
                                                        "houseType",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="border-orange-200 focus:border-orange-500">
                                                    <SelectValue placeholder="Selecciona el tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {HOUSE_TYPES.map((type) => (
                                                        <SelectItem
                                                            key={type.value}
                                                            value={type.value}
                                                        >
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2 md:col-span-1">
                                            <Label
                                                htmlFor="address"
                                                className="text-orange-800 font-medium"
                                            >
                                                Dirección Completa *
                                            </Label>
                                            <Input
                                                id="address"
                                                type="text"
                                                required
                                                value={formData.address}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "address",
                                                        e.target.value
                                                    )
                                                }
                                                className="border-orange-200 focus:border-orange-500"
                                                placeholder="Calle 123 #45-67, Ciudad"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Experience with Pets */}
                                <div className="border-t border-orange-100 pt-6">
                                    <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                                        <PawPrint className="h-5 w-5 mr-2" />
                                        Experiencia con Mascotas
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="hasExperience"
                                                checked={formData.hasExperience}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange(
                                                        "hasExperience",
                                                        checked as boolean
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="hasExperience"
                                                className="text-orange-800"
                                            >
                                                Tengo experiencia previa con
                                                mascotas
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="hasPets"
                                                checked={formData.hasPets}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange(
                                                        "hasPets",
                                                        checked as boolean
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="hasPets"
                                                className="text-orange-800"
                                            >
                                                Actualmente tengo otras mascotas
                                            </Label>
                                        </div>

                                        {(formData.hasExperience ||
                                            formData.hasPets) && (
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="petExperience"
                                                    className="text-orange-800 font-medium"
                                                >
                                                    Cuéntanos sobre tu
                                                    experiencia con mascotas
                                                </Label>
                                                <Textarea
                                                    id="petExperience"
                                                    value={
                                                        formData.petExperience
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "petExperience",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-orange-200 focus:border-orange-500"
                                                    placeholder="Describe tu experiencia con mascotas, qué tipos has tenido, cuidados que has brindado, etc."
                                                    rows={3}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="motivation"
                                                className="text-orange-800 font-medium"
                                            >
                                                ¿Por qué quieres adoptar una
                                                mascota? *
                                            </Label>
                                            <Textarea
                                                id="motivation"
                                                required
                                                value={formData.motivation}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "motivation",
                                                        e.target.value
                                                    )
                                                }
                                                className="border-orange-200 focus:border-orange-500"
                                                placeholder="Comparte tu motivación para adoptar y cómo planeas cuidar a tu nueva mascota..."
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="border-t border-orange-100 pt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id="agreeToTerms"
                                                checked={formData.agreeToTerms}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange(
                                                        "agreeToTerms",
                                                        checked as boolean
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <Label
                                                htmlFor="agreeToTerms"
                                                className="text-orange-800 text-sm leading-relaxed"
                                            >
                                                Acepto los términos y
                                                condiciones del proceso de
                                                adopción, incluyendo la
                                                responsabilidad de brindar
                                                cuidado adecuado, atención
                                                veterinaria y un hogar amoroso a
                                                la mascota adoptada.
                                            </Label>
                                        </div>

                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id="agreeToVisit"
                                                checked={formData.agreeToVisit}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange(
                                                        "agreeToVisit",
                                                        checked as boolean
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <Label
                                                htmlFor="agreeToVisit"
                                                className="text-orange-800 text-sm leading-relaxed"
                                            >
                                                Autorizo la visita domiciliaria
                                                como parte del proceso de
                                                adopción para verificar las
                                                condiciones del hogar donde
                                                vivirá la mascota.
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <Button
                                        type="submit"
                                        disabled={
                                            !formData.agreeToTerms ||
                                            !formData.agreeToVisit ||
                                            isSubmitting
                                        }
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Registrando...
                                            </>
                                        ) : (
                                            <>
                                                <Heart className="mr-2 h-5 w-5" />
                                                Completar Registro
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-orange-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <PawPrint className="h-6 w-6" />
                        <h4 className="text-xl font-bold">Aves de Hermes</h4>
                    </div>
                    <p className="text-orange-200">
                        Conectando corazones, creando familias.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default RegisterPage;
