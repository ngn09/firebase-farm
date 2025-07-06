import { AdvisorForm } from "@/components/crop-advisor/advisor-form";

export default function CropAdvisorPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-primary">Mahsul Danışmanı</h1>
        <p className="text-muted-foreground">Yapay zeka destekli bir ürün önerisi almak için aşağıdaki ayrıntıları doldurun.</p>
      </header>
      <AdvisorForm />
    </div>
  );
}
