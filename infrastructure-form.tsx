"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InfrastructureFormProps {
  handleSubmit: any;
  onSubmit: any;
  register: any;
  errors: any;
  touchedFields: any;
  typeInfrastructure: any;
  customersData: any;
  mutationCreateInfrastructure: any;
  onCancel?: () => void;
}

export default function InfrastructureForm({
  handleSubmit,
  onSubmit,
  register,
  errors,
  touchedFields,
  typeInfrastructure,
  customersData,
  mutationCreateInfrastructure,
  onCancel,
}: InfrastructureFormProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-card rounded-xl border border-border shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Ajouter une Infrastructure
        </h2>
        <p className="text-sm text-muted-foreground">
          Remplissez les informations ci-dessous pour créer une nouvelle
          infrastructure
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Nom */}
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-sm font-medium">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nom"
                type="text"
                placeholder="Entrez le nom"
                {...register("nom")}
                className={`transition-colors ${
                  errors.nom
                    ? "border-destructive focus-visible:ring-destructive"
                    : touchedFields.nom
                      ? "border-green-600 focus-visible:ring-green-600"
                      : ""
                }`}
              />
              {errors.nom && (
                <p className="text-xs text-destructive mt-1">
                  {errors.nom.message}
                </p>
              )}
            </div>

            {/* Type Infrastructure */}
            <div className="space-y-2">
              <Label
                htmlFor="type_infrastructure"
                className="text-sm font-medium"
              >
                Type d'infrastructure{" "}
                <span className="text-destructive">*</span>
              </Label>
              <select
                {...register("type_infrastructure")}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.type_infrastructure
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-input"
                }`}
              >
                <option value="">Sélectionnez un type</option>
                {typeInfrastructure?.results.map((type: any) => (
                  <option key={type.id} value={type.id}>
                    {type.nom}
                  </option>
                ))}
              </select>
              {errors.type_infrastructure && (
                <p className="text-xs text-destructive mt-1">
                  {errors.type_infrastructure.message}
                </p>
              )}
            </div>

            {/* Date Construction */}
            <div className="space-y-2">
              <Label
                htmlFor="date_construction"
                className="text-sm font-medium"
              >
                Date de construction
              </Label>
              <Input
                id="date_construction"
                type="date"
                {...register("date_construction")}
                className="transition-colors"
              />
              {errors.date_construction && (
                <p className="text-xs text-destructive mt-1">
                  {errors.date_construction.message}
                </p>
              )}
            </div>

            {/* Latitude */}
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-sm font-medium">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="text"
                placeholder="Ex: 48.8566"
                {...register("latitude")}
                className="transition-colors"
              />
              {errors.latitude && (
                <p className="text-xs text-destructive mt-1">
                  {errors.latitude.message}
                </p>
              )}
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-sm font-medium">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="text"
                placeholder="Ex: 2.3522"
                {...register("longitude")}
                className="transition-colors"
              />
              {errors.longitude && (
                <p className="text-xs text-destructive mt-1">
                  {errors.longitude.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Capacité */}
            <div className="space-y-2">
              <Label htmlFor="capacite" className="text-sm font-medium">
                Capacité
              </Label>
              <Input
                id="capacite"
                type="text"
                placeholder="Entrez la capacité"
                {...register("capacite")}
                className="transition-colors"
              />
              {errors.capacite && (
                <p className="text-xs text-destructive mt-1">
                  {errors.capacite.message}
                </p>
              )}
            </div>

            {/* Unité */}
            <div className="space-y-2">
              <Label htmlFor="unite" className="text-sm font-medium">
                Unité (L)
              </Label>
              <Input
                id="unite"
                type="text"
                placeholder="Ex: Litres"
                {...register("unite")}
                className="transition-colors"
              />
              {errors.unite && (
                <p className="text-xs text-destructive mt-1">
                  {errors.unite.message}
                </p>
              )}
            </div>

            {/* Zone */}
            <div className="space-y-2">
              <Label htmlFor="zone" className="text-sm font-medium">
                Zone
              </Label>
              <select
                {...register("zone")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Sélectionnez une zone</option>
                <option value="1">Zone 1</option>
              </select>
              {errors.zone && (
                <p className="text-xs text-destructive mt-1">
                  {errors.zone.message}
                </p>
              )}
            </div>

            {/* Client */}
            <div className="space-y-2">
              <Label htmlFor="client" className="text-sm font-medium">
                Client <span className="text-destructive">*</span>
              </Label>
              <select
                {...register("client")}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.client
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-input"
                }`}
              >
                <option value="">Sélectionnez un client</option>
                {customersData?.results.map((type: any) => (
                  <option key={type.id} value={type.id}>
                    {type.nom}
                  </option>
                ))}
              </select>
              {errors.client && (
                <p className="text-xs text-destructive mt-1">
                  {errors.client.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="min-w-[100px] bg-transparent"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={mutationCreateInfrastructure.isPending}
            className="min-w-[180px] bg-primary hover:bg-primary/90"
          >
            {mutationCreateInfrastructure.isPending
              ? "Chargement..."
              : "Ajouter Infrastructure"}
          </Button>
        </div>
      </form>
    </div>
  );
}
