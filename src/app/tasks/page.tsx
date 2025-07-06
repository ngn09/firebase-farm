import { TaskList } from "@/components/tasks/task-list";

export default function TasksPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-primary">Görev Yönetimi</h1>
        <p className="text-muted-foreground">Tüm çiftlik görevlerinizi buradan oluşturun, düzenleyin ve takip edin.</p>
      </header>
      <TaskList />
    </div>
  );
}
